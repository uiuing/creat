import uuid
from creat_transfer import PaintedFactory
from creat_room import RoomManager
from fastapi import WebSocket
from utils import response

class Transfer(object):
    def __init__(self, room_manager: RoomManager):
        self.room_manager = room_manager
    
    async def handle(self, ip, data, websocket: WebSocket):
        """
        数据处理:
        1. 创建房间: 需要先随机出一个uuid 房间号,然后再初始化房间,并且将房间信息返回给用户
        """
        ip = str(uuid.uuid1()) # TODO 因为单机测试,ip都一样
        print(data)
        # 创建房间
        if data['type'] == 'create_room':
            room_id = str(uuid.uuid1())
            room = self.room_manager.create_room(room_id, data['room_name'], data['room_type'],ip,
                                                 ip, data['room_owner_avatar'], websocket)
            print(room.room_member_socket)
            await websocket.send_json(response.success('创建房间成功', room.to_info()))

        # 加入房间
        elif data['type'] == 'join_room':
            res = {
                'type': 'join_room',
                'data':None
            }
            room = self.room_manager.join_room(data['room_id'], ip, websocket)
            if not room:
                await websocket.send_json(response.error('房间不存在 或者 权限不足'))
                return 
            
            # 给新加入的用户发送房间信息
            room_info = room.to_info()
            await websocket.send_json(response.success('加入房间成功', room_info))

            res['data'] = room.get_member_setting(ip)
            for number, socket in room.room_member_socket.items():
                if number != ip:
                    await socket.send_json(response.success('新成员加入', res))
        
        # 图像操作
        elif data['type'] == 'new_shape' or data['type'] == 'delete_shape' or data['type'] == 'update_shape':
            res = self.room_manager.room_operation(data['room_id'], ip, data['type'], data['content'])
            if res:
                for number, socket in room.room_member_socket.items():
                    if number != ip:
                        await socket.send_json(response.success('图形编辑操作', data))
    
