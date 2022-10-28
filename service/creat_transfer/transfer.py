import uuid
from creat_transfer import PaintedFactory
from creat_room import RoomManager
from fastapi import WebSocket
import asyncio


class Transfer(object):
    def __init__(self, room_manager: RoomManager):
        self.room_manager = room_manager
    
    async def handle(self, ip, data, websocket: WebSocket):
        """
        数据处理:
        1. 创建房间: 需要先随机出一个uuid 房间号,然后再初始化房间,并且将房间信息返回给用户
        """
        # painted_factory = PaintedFactory(ip, data, websocket)
        # painted_handle = painted_factory.get_handle()
        # return painted_handle.run()

        # 创建房间
        if data['type'] == 'create_room':
            room_id = str(uuid.uuid1())
            room_info = self.room_manager.create_room(room_id, data['room_name'], data['room_type'],ip,
                                                 ip, data['room_owner_avatar'], websocket)
            print(room_info)
            await websocket.send_json(room_info)
