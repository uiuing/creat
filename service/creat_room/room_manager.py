import copy
from creat_data import Data
from common import OPERATE
from utils import response

class Room(Data):
    
    def __init__(self, room_id, room_name,  is_only_read, room_owner_id,room_owner_name, room_owner_color, websocket):
        
        self.whiteboard = {
            'id': room_id,
            'name': room_name,
            'nodes': [],
            'readonly': is_only_read,
        }
        self.cooperation_users = [
            {
                'id': room_owner_id,
                'name': room_owner_name,
                'rights': 'author',
                'color': room_owner_color,
            }
        ]
        self.socket2user = {}
        self.user2socket = {}

        self.socket2user[websocket] = room_owner_id
        self.user2socket[room_owner_id] = websocket

        self.room_owner_id = room_owner_id
        self.room_owner_name = room_owner_name
        self.room_owner_color = room_owner_color



    async def join_room(self, data, websocket):
        """
        加入房间

        两种情况:
            - 只读
            Input:
                {
                    "type": "join_meeting",
                    "whiteboard":{
                        "id":"xxxxxxxxxxx",      // 白板唯一识别
                    },
                }
            Output:
                {
                    "whiteboard":{
                        "name": "未命名文件1",     // 白板名称 
                        "nodes":[],              // 初始白板数据
                        "readonly":true        // 这里是全局的是否只读状态
                    },
                    "user_rights":"author"  // 用户类型
                }
            - 非只读
                当前socket用户:
                Input:
                {
                    "type": "join_meeting",
                    "whiteboard":{
                        "id":"xxxxxxxxxxx"  
                    },
                    "user":{      
                        "id":"b",  
                        "name":"aaa",      
                        "color":"xxx"
                    }
                }
                Output:
                {
                    "whiteboard":{
                        "name": "未命名文件1",         // 白板名称 
                        "nodes":[],                 // 初始白板数据
                        "readonly":false           // 这里是全局的是否只读状态
                    },
                    "user_rights":"author",    // 用户类型
                    "cooperation_users": [    // 已在线协作用户数据
                        {  
                        "name": "aaa",
                        "color": "xxx",
                        "rights": "contributor"
                        }
                        .....
                    ],
                }

                其他用户:
                {
                    "type": "join_meeting",
                    "join_user":{      
                        "name":"aaa",       // 用户昵称 （加入的时候会判断，是否已经存在该用户昵称，存在则反馈）   
                        "color":"xxx",     // 用户默认颜色
                    }
                }
        """
        res = {}
        res['whiteboard'] =  copy.deepcopy(self.whiteboard)
        del res['whiteboard']['id']
        
        identity = None
        # 身份验证
        if 'user' in data:
            if data['user']['id'] == self.room_owner_id:
                identity = 'author'
            else:
                identity = 'contributor'

        # 只读判断
        if self.whiteboard['readonly'] == True:
            
            if identity is not None:
                res['user_rights'] = identity

                # 仅给当前用户发消息
                await websocket.send_json(res)
                
                # 将该用户的socket和id对应起来
                self.socket2user[websocket] = data['user']['id']
                self.user2socket[data['user']['id']] = websocket
                
            else:
                # 无须任何操作
                pass 
        else:
            # 非只读

            # 用户id
            user_id = data['user']['id']

            # 判断用户name是否已经存在
            if 'user' in data:
                for user in self.cooperation_users:
                    # 用户名已存在
                    if user['name'] == data['user']['name']:

                        # 如果相同的是user_id，则不需要任何操作
                        if user['id'] == user_id:
                            pass
                        else:
                            # 用户名已存在
                            res['user_name_exist'] = True
                            await websocket.send_json(response.error('用户名已存在'))
                            return

            # 仅给当前用户发消息
            res['user_rights'] = identity
            self.cooperation_users.append(data['user'])
            res['cooperation_users'] = copy.deepcopy(self.cooperation_users)
            await websocket.send_json(res)

            # 将该用户的socket和id对应起来
            self.socket2user[websocket] = data['user']['id']
            self.user2socket[data['user']['id']] = websocket


            # 给其他用户发送加入消息
            for user_id, socket in self.user2socket.items():
                if socket != websocket:
                    res = {}
                    res['type'] = 'join_meeting'
                    res['join_user'] = data['user']
                    await socket.send_json(res)
                    
    async def exit_room(self, data, websocket):
        """
        退出房间

        Input: 
        {
            "type": "quit_meeting",
            "user":{
                "name":"xxxxx"   // 用户昵称 
            }
        }
        """
        user_id = self.socket2user.get(websocket)
        if user_id is None:
            # TODO 已经退出了, 之后还需要处理
            print(f'{user_id} 已经退出了')
            return

        

        if len(data['user']) == 0:
            # 意外退出的用户 TODO
            _name = '未知用户'

            for i in self.cooperation_users:
                if i['id'] == user_id:
                    _name = i['name']
                    break

            data['user']['name'] = _name

        del self.socket2user[websocket]
        del self.user2socket[user_id]
        

        # 当前用户发送退出消息
        # await websocket.send_json(response.success('退出房间成功'))

        # 给其他用户发送退出消息

        # 防止线程冲突
        _user2socket = copy.copy(self.user2socket)
        _socket2user = copy.copy(self.socket2user)
        for user_id, socket in _user2socket.items():
            data['user']['id'] = user_id
            try:
                await socket.send_json(data)
            except:
                print('发送退出消息失败, 用户', user_id, '已经退出')
                user_id = _socket2user[socket]
                # del self.socket2user[socket]
                # del self.user2socket[user_id]

    async def whiteboard_data(self, data, websocket):
        """
        白板数据

        Input: 
        {
            "type": "change_meeting",    // 传输数据类型
            "whiteboard":{
                "name": "修改文件1",      //  白板名称                 // 这个可以修改
                "readonly":true         // 这里是全局的是否只读状态   // 这个可以修改
            }
        }
        """
        # 检测是否有权限修改
        user_id = self.socket2user[websocket]
        if user_id != self.room_owner_id:
            # 无权限修改
            await websocket.send_json(response.error('无权限修改'))
            return

        # 有权限修改
        whiteboard = data['whiteboard']
        if 'name' in whiteboard:
            self.whiteboard['name'] = whiteboard['name']
        if 'readonly' in whiteboard:
            self.whiteboard['readonly'] = whiteboard['readonly']

        await websocket.send_json(response.success('成功'))
        
        
        # 给其他用户发送白板数据
        for user_id, socket in self.user2socket.items():
            if websocket != socket:
                await socket.send_json(data)

    def permission_judgment(self, websocket):
        """
        权限判断
        """
        user_id = self.socket2user[websocket]

        if self.whiteboard['readonly'] == True:
            # 只读
            if user_id != self.room_owner_id:
                # 无权限
                return False
            else:
                # 有权限
                return True
        else:
            # 非只读
            return True

    async def add_nodes(self, data, websocket):
        """
        添加节点

        Input: 
        {
            "type": "add",    // 传输数据类型
            "nodes":{               // 节点数据
                "id": "xxxxx",    // 节点id
                "type": "xxxxx",  // 节点类型
                "data":{          // 节点数据
                    "x": 100,     // 节点x坐标
                    "y": 100,     // 节点y坐标
                    "width": 100, // 节点宽度
                    "height": 100 // 节点高度
                }
            }
        }
        """
        # 权限判断
        if self.permission_judgment(websocket) == False:
            # 无权限
            await websocket.send_json(response.error('无权限添加节点'))
            return

        # 有权限
        nodes = data['nodes']
        self.whiteboard['nodes'] += nodes
        
        # 给其他用户发送添加节点消息
        for user_id, socket in self.user2socket.items():
            if websocket != socket:
                await socket.send_json(data)
    
    async def update_nodes(self, data, websocket):
        """
        更新节点

        Input: 
        {
            "type": "nodes-update",
            "nodes":[
                {
                "id":"aaaaaa"
                "更新的key":"更新的数据"
                    .......
                },
                {
                "id":"bbbb"
                "更新的key":"更新的数据"
                    .......
                }
            ]
        }
        """
        # 权限判断
        if self.permission_judgment(websocket) == False:
            # 无权限
            await websocket.send_json(response.error('无权限更新节点'))
            return

        # 有权限
        nodes = data['nodes']
        for node in nodes:
            for i in self.whiteboard['nodes']:
                if i['id'] == node['id']:
                    for key in node:
                        i[key] = node[key]

        
        # 给其他用户发送更新节点消息
        for user_id, socket in self.user2socket.items():
            if websocket != socket:
                await socket.send_json(data)
        
    async def delete_nodes(self, data, websocket):
        """
        删除节点

        Input: 
        {
            "type": "delete",    // 传输数据类型
            "node":{               // 节点数据
                "id": "xxxxx",    // 节点id
                "type": "xxxxx",  // 节点类型
                "data":{          // 节点数据
                    "x": 100,     // 节点x坐标
                    "y": 100,     // 节点y坐标
                    "width": 100, // 节点宽度
                    "height": 100 // 节点高度
                }
            }
        }
        """
        # 权限判断
        if self.permission_judgment(websocket) == False:
            # 无权限
            await websocket.send_json(response.error('无权限删除节点'))
            return

        # 有权限
        node = data['node']
        for i in range(len(self.whiteboard['nodes'])):
            if self.whiteboard['nodes'][i]['id'] == node['id']:
                self.whiteboard['nodes'].pop(i)
                break
        
        # 给其他用户发送删除节点消息
        for user_id, socket in self.user2socket.items():
            if websocket != socket:
                await socket.send_json(data)

    async def delete_all_nodes(self, data, websocket):
        """
        删除所有节点

        Input: 
        {
            "type": "delete-all",    // 传输数据类型
        }
        """
        # 权限判断
        if self.permission_judgment(websocket) == False:
            # 无权限
            await websocket.send_json(response.error('无权限删除所有节点'))
            return

        # 有权限
        self.whiteboard['nodes'] = []
        
        # 给其他用户发送删除所有节点消息
        for user_id, socket in self.user2socket.items():
            if websocket != socket:
                await socket.send_json(data)
    
    async def cover_all_nodes(self, data, websocket):
        """
        覆盖所有节点

        Input: 
        {
            "type": "cover-all",    // 传输数据类型
            "nodes": [              // 节点列表
                {
                    "id": "xxxxx",    // 节点id
                    "type": "xxxxx",  // 节点类型
                    "data":{          // 节点数据
                        "x": 100,     // 节点x坐标
                        "y": 100,     // 节点y坐标
                        "width": 100, // 节点宽度
                        "height": 100 // 节点高度
                    }
                }
            ]
        }
        """
        # 权限判断
        if self.permission_judgment(websocket) == False:
            # 无权限
            await websocket.send_json(response.error('无权限覆盖所有节点'))
            return

        # 有权限
        self.whiteboard['nodes'] = data['nodes']
        
        # 给其他用户发送覆盖所有节点消息
        for user_id, socket in self.user2socket.items():
            if websocket != socket:
                await socket.send_json(data)
    
    async def sync_mouse(self, data, websocket):
        """
        同步鼠标

        Input: 
        {
            "type":"sync_mouse",
            "coordinate":{
                "x":"100",
                "y":"200"
            },
            "user":{
                "name":"xxx",
                "color":"xxx"
            }
        }
        """
        # 权限判断
        if self.permission_judgment(websocket) == False:
            # 无权限
            await websocket.send_json(response.error('无权限同步鼠标'))
            return

        # 有权限
        # 给其他用户发送同步鼠标消息
        for user_id, socket in self.user2socket.items():
            if websocket != socket:
                await socket.send_json(data)

    async def status_update(self, data, websocket):
        """
        状态更新

        Input: 
        {
            "type":"update-state",
            "state":{
                "更新的key":"更新的数据",
            },
        }
        """
        # 权限判断
        if self.permission_judgment(websocket) == False:
            # 无权限
            await websocket.send_json(response.error('无权限同步鼠标'))
            return

        # 有权限
        # 给其他用户发送同步鼠标消息
        for user_id, socket in self.user2socket.items():
            if websocket != socket:
                await socket.send_json(data)

    async def check_room(self, data, websocket):
        """
        Input:
        {
            "type": "check_meeting",
            "whiteboard":{
                "id":"xxxxxxxxxxx",      // 白板唯一识别
            },
        }
        Output:
        {
            "status":200
            "whiteboard":{
                "name": "未命名文件1",     // 白板名称 
                "readonly":true         // 这里是全局的是否只读状态
            },
        }
        """

        # 有权限
        res = {
            "status":200,
            'whiteboard': copy.deepcopy(self.whiteboard)
        }

        del res['whiteboard']['nodes']
        del res['whiteboard']['id']
        
        await websocket.send_json(res)

class RoomManager(object):

    def __init__(self):
        self.room_dict = {}
        # 建立用户与房间之间的联系
        self.user2room = {}


    async def create_room(self, room_id, room_name,  is_only_read, room_owner_id,room_owner_name, room_owner_color, websocket):
        # 创建房间,并且转发给房主
        if room_id not in self.room_dict:
            self.room_dict[room_id] = Room(room_id, room_name,  is_only_read, room_owner_id,room_owner_name, room_owner_color, websocket)
            await websocket.send_json(response.success('创建房间成功'))
            self.user2room[websocket] = self.room_dict[room_id]
        else:
            await websocket.send_json(response.error('创建房间失败,房间已存在'))