

import json
import uvicorn
from fastapi import FastAPI, WebSocket
from starlette.endpoints import WebSocketEndpoint, HTTPEndpoint
from utils.response_templates import *
from fastapi.responses import HTMLResponse
from creat_transfer import Transfer
from creat_room import RoomManager

app = FastAPI()

room_manager = RoomManager()
transfer = Transfer(room_manager)


class Echo(WebSocketEndpoint):
    encoding = "text"
    
    # 连接
    async def on_connect(self, websocket):
        await websocket.accept()
        # 获取用户ip地址
        ip = websocket.client.host
        # 获取用户发送的消息
        data = await websocket.receive_json()

        transfer.handle(data)

        
    # 收发
    async def on_receive(self, websocket, data):

        # 获取用户ip地址
        ip = websocket.client.host
        # 获取用户发送的消息
        data = await websocket.receive_json()
        
        transfer.handle(data)
        
        # for wbs in info:
        #     await wbs.send_text(f"Message text was: {data}")
        
    # 断开
    async def on_disconnect(self, websocket, close_code):
        # 获取用户ip地址
        ip = websocket.client.host
        # 获取用户发送的消息
        data = await websocket.receive_json()
        
        transfer.handle(data)
        
        # # 删除websocket对象
        # info.remove(websocket)
        # # 再打印看看
        # print(info)
        # pass


if __name__ == '__main__':
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
