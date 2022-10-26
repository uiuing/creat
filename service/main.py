

import json
import uvicorn
from fastapi import FastAPI, WebSocket
from starlette.endpoints import WebSocketEndpoint, HTTPEndpoint
from utils.response_templates import *
from fastapi.responses import HTMLResponse
from creat_room.room_manager import room_manager
app = FastAPI()


html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Chat</title>
    </head>
    <body>
        <h1>WebSocket Chat</h1>
        <form action="" onsubmit="sendMessage(event)">
            <input type="text" id="messageText" autocomplete="off"/>
            <button>Send</button>
        </form>
        <ul id='messages'>
        </ul>
        <script>
            var ws = new WebSocket("ws://localhost:8000/ws");
            ws.onmessage = function(event) {
                var messages = document.getElementById('messages')
                var message = document.createElement('li')
                var content = document.createTextNode(event.data)
                message.appendChild(content)
                messages.appendChild(message)
            };
            function sendMessage(event) {
                var input = document.getElementById("messageText")
                ws.send(input.value)
                input.value = ''
                event.preventDefault()
            }
        </script>
    </body>
</html>
"""


@app.get("/")
async def get():
    return HTMLResponse(html)



@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text was: {data}")







class Echo(WebSocketEndpoint):
    encoding = "text"
    
    # 修改socket
    async def alter_socket(self, websocket):
        socket_str = str(websocket)[1:-1]
        socket_list = socket_str.split(' ')
        socket_only = socket_list[3]
        return socket_only
    
    # 连接 存储
    async def on_connect(self, websocket):
        await websocket.accept()
        
        # 用户输入名称
        name = await websocket.receive_text()
        
        socket_only = await self.alter_socket(websocket)
        # 添加连接池 保存用户名
        info[socket_only] = [f'{name}', websocket]

        # 先循环 告诉之前的用户有新用户加入了
        for wbs in info:
            await info[wbs][1].send_text(f"{info[socket_only][0]}-加入了聊天室")
        
        print(info)
        
    # 收发
    async def on_receive(self, websocket, data):
        socket_only = await self.alter_socket(websocket)
        
        for wbs in info:
            await info[wbs][1].send_text(f"{info[socket_only][0]}: {data}")
        

    # 断开 删除
    async def on_disconnect(self, websocket, close_code):
        socket_only = await self.alter_socket(websocket)
        # 删除连接池
        info.pop(socket_only)
        print(info)
        pass



if __name__ == '__main__':
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
