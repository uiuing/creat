

import json
import uvicorn
from fastapi import FastAPI, WebSocket
from starlette.endpoints import WebSocketEndpoint, HTTPEndpoint
from fastapi.responses import HTMLResponse
from creat_transfer import Transfer
from creat_room import RoomManager
from starlette.routing import Route, WebSocketRoute
from starlette.applications import Starlette


room_manager = RoomManager()
transfer = Transfer(room_manager)


class Echo(WebSocketEndpoint):
    encoding = "text"
    
    # 连接
    async def on_connect(self, websocket):
        print('on_connect')
        await websocket.accept()
        # 获取用户ip地址
        ip = websocket.client.host
        # 获取用户发送的消息
        data = await websocket.receive_json()
        await transfer.handle(ip, data, websocket)

        
    # 收发
    async def on_receive(self, websocket, data):
        print('on_receive')
        # 获取用户ip地址
        ip = websocket.client.host
        # 获取用户发送的消息
        data = await websocket.receive_json()
        await transfer.handle(ip, data, websocket)
        
    # 断开
    async def on_disconnect(self, websocket, close_code):
        print('on_disconnect')
        # 获取用户ip地址
        ip = websocket.client.host
        # 获取用户发送的消息
        data = await websocket.receive_json()
        
        await transfer.handle(ip, data)


routes = [
    WebSocketRoute("/ws", Echo)
]
app = Starlette(debug=True, routes=routes)

if __name__ == '__main__':
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
