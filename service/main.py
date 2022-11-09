

import json
import uvicorn
from fastapi import FastAPI, WebSocket
from starlette.endpoints import WebSocketEndpoint, HTTPEndpoint
from fastapi.responses import HTMLResponse
from creat_transfer import Transfer
from creat_room import RoomManager
from starlette.routing import Route, WebSocketRoute
from starlette.applications import Starlette
from multiprocessing import Lock


lock = Lock()
room_manager = RoomManager()
transfer = Transfer(room_manager)


class Echo(WebSocketEndpoint):
    encoding = "text"
    
    # 连接
    async def on_connect(self, websocket):
        print('on_connect')
        
        await websocket.accept()
        # print('-->连接成功1')
        # # data = json.loads(data)
        # # 获取用户ip地址
        # ip = websocket.client.host
        # post = websocket.client.port
        # print('-->连接成功2')
        # # 获取用户发送的消息
        # data = await websocket.receive_json()
        # print('-->连接成功3')
        # await transfer.handle(ip+str(post), data, websocket)
        
    # 收发
    async def on_receive(self, websocket, data):
        print('on_receive')
        data = json.loads(data)
        # 获取用户ip地址
        ip = websocket.client.host
        post = websocket.client.port
        # 获取用户发送的消息
        # data = websocket.receive_json()
        await transfer.handle(ip+str(post), data, websocket)
        
    # 断开
    async def on_disconnect(self, websocket, close_code):
        print(close_code)
        print('on_disconnect')
        lock.acquire()
        # 获取用户ip地址
        ip = websocket.client.host
        post = websocket.client.port
        # 获取用户发送的消息
        try:
            data = await websocket.receive_json()
        except:
            # 用户意外中断
            data = {
                "type": "quit_meeting",
                "user":{
                }
            }
        await transfer.exit_room(data, websocket, True)
        lock.release()


routes = [
    WebSocketRoute("/ws", Echo)
]
app = Starlette(debug=True, routes=routes)

if __name__ == '__main__':
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
