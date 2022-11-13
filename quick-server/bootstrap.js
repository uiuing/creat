import express, { json } from 'express'
import http from 'http'
import { patch } from 'jsondiffpatch'
import { createClient } from 'redis'
import { Server } from 'socket.io'
import cors from 'cors'
import { User, Rooms } from 'socket.io-rooms'
import RedisConfig from './RedisConfig.js'

const port = 4911

const redisClient = createClient(RedisConfig)

const app = express()

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: ['http://127.0.0.1:5173', 'https://creat.uiuing.com']
  }
})

app.use(cors())
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Access-Control-Allow-Credentials', true)
  next()
})

/**
 * Check if the whiteboardId is shared
 * Return data structure type：
 * {
 *     "status": 404
 * }
 *   ||
 * {
 * "status": 200
 * {
 * 	 ....
 * }}
 */
app.get('/check', (req, res) => {
  if ('whiteboardId' in req.query) {
    redisClient.get(`creat-${req.query.whiteboardId}`, (err, reply) => {
      if (reply) {
        const r = JSON.parse(reply)
        res.send({
          status: 200,
          data: {
            info: r.info,
            nodes: r.nodes
          }
        })
      } else {
        res.send({ status: 404 })
      }
    })
  } else {
    res.send({ status: 400, msg: '缺少whiteboardId参数' })
  }
})

/**
 * pick Room sharing data
 */
app.get('/pick', (req, res) => {
  if ('whiteboardId' in req.query) {
    redisClient.get(`creat-${req.query.whiteboardId}`, (err, reply) => {
      if (reply) {
        const r = JSON.parse(reply)
        res.send({
          status: 200,
          info: r.info,
          nodes: r.nodes
        })
      } else {
        res.send({ status: 500, msg: '服务器错误' })
      }
    })
  } else {
    res.send({ status: 400, msg: '缺少whiteboardId参数' })
  }
})

/**
 * cover Overlay room sharing data
 */
app.post('/cover', json(), (req, res) => {
  if (
    'id' in req.body &&
    'whiteboard' in req.body.id &&
    'nodes' in req.body &&
    'info' in req.body
  ) {
    redisClient.get(`creat-${req.body.id.whiteboard}`, (err, reply) => {
      if (reply) {
        const r = JSON.parse(reply)
        redisClient.set(
          `creat-${req.body.id.whiteboard}`,
          JSON.stringify({
            ...r,
            nodes: req.body.nodes,
            info: req.body.info
          })
        )
        res.send({ status: 200 })
      } else {
        res.send({ status: 500, msg: '服务器错误' })
      }
    })
  } else {
    res.send({ status: 400, msg: '输入参数有误' })
  }
})

/**
 * Whiteboard to create shared rooms
 * Receiving data structure type：
 * {
 * 	"nodes": [],
 * 	"info": {
 * 		"name": "白板1",
 * 		"readonly": false
 * 	},
 * 	"id": {
 * 		"user": "xxx",
 * 		"whiteboard": "xxx"
 * 	}
 * }
 * Return data structure type：
 * {
 *    "status": 200
 * }
 *  ||
 * {
 *  "status": 500
 * }
 * ||
 * {
 * "status": 400
 * }
 * ||
 * {
 * "status": 401
 * "msg": "白板ID冲突"
 * }
 */
app.post('/create', json(), (req, res) => {
  if (
    'nodes' in req.body &&
    'info' in req.body &&
    'id' in req.body &&
    'user' in req.body.id &&
    'whiteboard' in req.body.id
  ) {
    redisClient.get(`creat-${req.body.id.whiteboard}`, (err, reply) => {
      if (reply) {
        res.send({ status: 401, msg: '白板ID冲突' })
      } else {
        redisClient.set(
          `creat-${req.body.id.whiteboard}`,
          JSON.stringify(req.body),
          (e, r) => {
            if (r) {
              res.send({ status: 200, msg: '创建成功' })
            } else {
              res.send({ status: 500, msg: '服务器错误' })
            }
          }
        )
      }
    })
  } else {
    res.send({ status: 400, msg: '输入参数有误' })
  }
})

app.post('/close', json(), (req, res) => {
  if ('whiteboardId' in req.body && 'userId' in req.body) {
    redisClient.get(`creat-${req.body.whiteboardId}`, (err, reply) => {
      if (reply) {
        const r = JSON.parse(reply)
        if (r.id.user === req.body.userId) {
          redisClient.del(`creat-${req.body.whiteboardId}`)
          res.send({ status: 200, msg: '关闭成功' })
        } else {
          res.send({ status: 401, msg: '用户ID不匹配' })
        }
      } else {
        res.send({ status: 404, msg: '白板ID不存在' })
      }
    })
  }
})

// Modify read-only and whiteboard names
app.post('/update', json(), (req, res) => {
  if (
    'whiteboardId' in req.body &&
    'userId' in req.body &&
    'info' in req.body
  ) {
    redisClient.get(`creat-${req.body.whiteboardId}`, (err, reply) => {
      if (reply) {
        const r = JSON.parse(reply)
        if (r.id.user === req.body.userId) {
          redisClient.set(
            `creat-${req.body.whiteboardId}`,
            JSON.stringify({
              ...r,
              info: req.body.info
            })
          )
          res.send({ status: 200, msg: '修改成功' })
        } else {
          res.send({ status: 401, msg: '用户ID不匹配' })
        }
      } else {
        res.send({ status: 404, msg: '白板ID不存在' })
      }
    })
  }
})

io.on('connection', (client) => {
  const user = new User()

  client.emit('user', user)

  client.on('join', (whiteboardId) => {
    Rooms.join(whiteboardId, user, io, client)
    user.roomId = whiteboardId
  })

  client.on('diff-nodes', (diffResNodes) => {
    if (user.roomId) {
      redisClient.get(`creat-${user.roomId}`, (err, reply) => {
        if (reply) {
          const r = JSON.parse(reply)
          const { type, nodes } = diffResNodes
          if (type === 'add') {
            r.nodes = [...r.nodes, ...nodes]
          }
          if (type === 'update') {
            r.nodes = r.nodes.map((item) => {
              const node = nodes.find((n) => n.id === item.id)
              return node ? { ...item, ...node } : item
            })
          }
          if (type === 'delete') {
            r.nodes = r.nodes.filter(
              (item) => !nodes.find((n) => n.id === item.id)
            )
          }
          client.broadcast.to(user.roomId).emit('diff-nodes', diffResNodes)
          redisClient.set(`creat-${user.roomId}`, JSON.stringify(r))
        }
      })
    }
  })

  client.on('diff-state', (stateDelta) => {
    if (user.roomId) {
      redisClient.get(`creat-${user.roomId}`, (err, reply) => {
        if (reply) {
          const r = JSON.parse(reply)
          r.nodes = patch(r.nodes, stateDelta)
        }
      })
      client.broadcast.to(user.roomId).emit('diff-state', stateDelta)
    }
  })

  client.on('update-info', (info) => {
    if (user.roomId) {
      client.broadcast.to(user.roomId).emit('update-info', info)
      redisClient.get(`creat-${user.roomId}`, (err, reply) => {
        if (reply) {
          const r = JSON.parse(reply)
          r.info = info
          redisClient.set(`creat-${user.roomId}`, JSON.stringify(r))
        }
      })
    }
  })

  client.on('disconnect', () => {
    /* … */
    console.log('close')
  })
})

server.listen(port)
