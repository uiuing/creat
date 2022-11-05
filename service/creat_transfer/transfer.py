import uuid
from creat_transfer import PaintedFactory
from creat_room import RoomManager
from fastapi import WebSocket
from utils import response
from common import OPERATE


class Transfer(object):
    def __init__(self, room_manager: RoomManager):
        self.room_manager = room_manager
    
    async def handle(self, ip, data, websocket: WebSocket):

        operate = [i.value for i in OPERATE]
        if data['type'] not in operate:
            await websocket.send_json(response.error('操作类型(type)错误'))
            return

        # 创建房间
        if data['type'] == OPERATE.CREATE.value:
            """
            {
                "type": "create_meeting",    // 传输数据类型
                "whiteboard":{
                    "id":"xxxxxxxxxxx",       // 白板唯一识别
                    "name": "未命名文件1",     // 白板名称 
                    "nodes":[],              // 初始白板数据
                    "readonly":false         // 这里是全局的是否只读状态
                },
                "user":{
                    "id":"xxxxxxxxxxx",  // 用户唯一识别  
                    "name":"xxxx",      // 用户昵称
                    "color":"xxx",     // 用户默认颜色
                }
            }
            """
            await self.room_manager.create_room(data['whiteboard']['id'], data['whiteboard']['name'], data['whiteboard']['readonly'], 
                                                data['user']['id'],data['user']['name'], data['user']['color'], websocket)

        # 加入房间
        elif data['type'] == OPERATE.JOIN.value:
            room = self.room_manager.room_dict[data['whiteboard']['id']]
            if not room:
                await websocket.send_json(response.error('房间不存在'))
            else:
                await room.join_room(data, websocket)
                self.room_manager.user2room[websocket] = room
        # 检查房间
        elif data['type'] == OPERATE.CHECK.value:
            room = self.room_manager.room_dict[data['whiteboard']['id']]
            if not room:
                await websocket.send_json(response.error('房间不存在'))
            else:
                await room.check_room(data, websocket)
        # 退出房间
        elif data['type'] == OPERATE.EXIT.value:
            room = self.room_manager.user2room.get(websocket)
            if not room:
                await websocket.send_json(response.error('房间不存在'))
            else:
                await room.exit_room(data, websocket)
        # 修改房间信息
        elif data['type'] == OPERATE.UPDATE.value:
            room = self.room_manager.user2room.get(websocket)
            if not room:
                await websocket.send_json(response.error('房间不存在'))
            else:
                await room.whiteboard_data(data, websocket)
        # 新增 Node
        elif data['type'] == OPERATE.SHAPE_NEW.value:
            room = self.room_manager.user2room.get(websocket)
            if not room:
                await websocket.send_json(response.error('房间不存在'))
            else:
                await room.add_nodes(data, websocket)
        # 更新Node
        elif data['type'] == OPERATE.SHAPE_UPDATE.value:
            room = self.room_manager.user2room.get(websocket)
            if not room:
                await websocket.send_json(response.error('房间不存在'))
            else:
                await room.update_nodes(data, websocket)
        # 删除Node
        elif data['type'] == OPERATE.SHAPE_DELETE.value:
            room = self.room_manager.user2room.get(websocket)
            if not room:
                await websocket.send_json(response.error('房间不存在'))
            else:
                await room.delete_nodes(data, websocket)
        # 清空白板
        elif data['type'] == OPERATE.SHAPE_DELETEALL.value:
            room = self.room_manager.user2room.get(websocket)
            if not room:
                await websocket.send_json(response.error('房间不存在'))
            else:
                await room.delete_all_nodes(data, websocket)
        # 覆盖白板
        elif data['type'] == OPERATE.SHAPE_COVERALL.value:
            room = self.room_manager.user2room.get(websocket)
            if not room:
                await websocket.send_json(response.error('房间不存在'))
            else:
                await room.cover_all_nodes(data, websocket)
        # 鼠标同步
        elif data['type'] == OPERATE.MOUSE_SYNC.value:
            room = self.room_manager.user2room.get(websocket)
            if not room:
                await websocket.send_json(response.error('房间不存在'))
            else:
                await room.sync_mouse(data, websocket)            


    # 退出房间
    async def exit_room(self, ip, websocket: WebSocket):
        """
        退出房间
        """
        room_id = self.room_manager.user_location(ip)
        room = self.room_manager.room_dict.get(room_id)
        if room == None:
            # await websocket.send_json(response.error('退出房间失败, 并没有加入房间'))
            return 

        res = {
            'type': 'exit_room',
            'data': {
                'user_id': ip
            }
        }
        for number, socket in room.room_member_socket.items():
            await socket.send_json(response.success('成员退出', res))

