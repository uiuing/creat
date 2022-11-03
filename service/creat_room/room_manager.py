from creat_data import Data
from common import OPERATE

class Room(Data):
    
    def __init__(self, room_id, room_name, room_type, room_status, room_owner, room_owner_id, room_owner_avatar):
        self.room_id = room_id
        self.room_name = room_name
        self.room_type = room_type  
        self.room_status = room_status  # 0 为公开, 1 为私人
        self.room_owner = room_owner
        self.room_owner_id = room_owner_id
        self.room_owner_avatar = room_owner_avatar
        self.only_read = False
        self.room_members = []
        self.room_online_members = [] # 在线人员,之后还需要用这个进行转发整个房间的信息
        self.nodes = []
        self.room_prohibits = []
        self.room_member_setting = {}
        self.room_member_socket = {}

    def reomve_room_online_member(self, member):
        self.room_members.remove(member)

    def update_member_setting(self, member, setting):
        """
        更新用户设置
        """
        if member in self.room_members:
            self.room_member_setting[member].update(setting)
    
    def get_member_setting(self, member):
        """
        获取用户设置
        """
        return self.room_member_setting[member]

    def join_room(self, member, socket):
        """
        进入房间to_info
        """
        if self.is_access(member):
            self.room_member_socket[member] = socket
            if member not in self.room_members:
                self.add_member(member)
            return self.to_info()
        else:
            return None
    
    # 离开房间
    def leave_room(self, member):
        self.room_member_socket.pop(member)
        return True
    
    def new_node(self, content):
        """
        生成新的形状
        """
        # TODO 这里最好用一个dict存储,这样可以加速处理
        self.nodes.append(content)
        return True
    
    def delete_node(self, id):
        """
        删除形状
        """
        for node in self.nodes:
            if node["id"] == id:
                self.nodes.remove(node)
                return True
        return False
        
    
    def update_node(self, id, content):
        """
        更新形状
        """
        for node in self.nodes:
            if node["id"] == id:
                node.update(content)
                return True
        return False

    def add_member(self, member):
        self.room_members.append(member)
        # Default user setting
        self.room_member_setting[member] = {
            # 默认颜色, 名称, 头像
            "default_color": "#000000",             
		    "name": str(len(self.room_members)),    
		    "type": "",
            "room_owner_avatar":0
            }

    def cover_all_node(self, node):
        """
        覆盖所有的node
        """
        self.nodes = node
        return True

    # 删除所有的node
    def delete_all_node(self):
        self.nodes = []
        return True

    def remove_member(self, member):
        if member in self.room_members:
            self.room_members.remove(member)
    
    def add_content(self, content):
        self.nodes.append(content)
    
    def remove_content(self, content):
        self.nodes.remove(content)
    
    def get_room_id(self):
        return self.room_id

    def is_access(self, u_id):
        """
        权限验证
            在公开房间中, 任何人都可以进入,除了黑名单的人员
            在私人房间中, 只有房主和房间成员可以进入
        """
        if self.room_status == 0 and self.permission_verification(u_id) != 0:
            return True
        else:
            if self.permission_verification(u_id) == 3 or self.permission_verification(u_id) == 2:
                return True
            else:
                return False

    def add_prohibit(self, u_id):
        """
        添加黑名单
        """
        self.room_prohibits.append(u_id)
        self.remove_member(u_id)
    
    def permission_verification(self, u_id):
        """
        查看身份, 0 为黑名单, 2 为房间成员, 3 为房主
        """
        if u_id == self.room_owner_id:
            return 3
        
        if u_id in self.room_members:
            return 2

        if u_id in self.room_prohibits:
            return 0

    def to_info(self):
        """
        将信息转换成为dict
        """
        return {
            "room_id": self.room_id,
            "room_name": self.room_name,
            "room_type": self.room_type,
            "room_status": self.room_status,
            "room_members": self.room_members,
            "room_member_setting": self.room_member_setting,
            "nodes": self.nodes,
            "only_read": self.only_read
        }
    

class RoomManager(object):

    def __init__(self):
        self.room_dict = {}
        # 建立用户与房间之间的联系
        self.user2room = {}


    def create_room(self, room_id, room_name, room_type, room_owner, room_owner_id, room_owner_avatar, room_owner_socket):
        # 创建房间,并且转发给房主
        if room_id not in self.room_dict:
            self.room_dict[room_id] = Room(room_id, room_name, room_type, 0, room_owner, room_owner_id, room_owner_avatar)
            self.room_dict[room_id].join_room(room_owner_id, room_owner_socket)
            self.user2room[room_owner_id] = room_id
            return self.room_dict[room_id]
        else:
            return None
    
    def user_location(self, u_id):
        """
        查看用户所在房间
        """
        if u_id in self.user2room:
            return self.user2room[u_id]
        else:
            return None
    
    def level_room(self, u_id):
        """
        离开房间
        """
        if u_id in self.user2room:
            room_id = self.user2room[u_id]
            self.room_dict[room_id].leave_room(u_id)
            self.user2room.pop(u_id)
            return True
        else:
            return False

    def join_room(self, room_id, member, socket):
        """
        进入房间
        """
        if room_id in self.room_dict:
            self.room_dict[room_id].join_room(member, socket)
            self.user2room[member] = room_id
            return self.room_dict[room_id]
        else:
            return None

    def get_room(self, room_id) -> Room:
        """
        获取房间
        """
        if room_id in self.room_dict:
            return self.room_dict[room_id]
        else:
            return None

    def delete_room(self, room_id):
        """
        删除房间
        """
        if room_id in self.room_dict:
            del self.room_dict[room_id]
            return True
        else:
            return False
    
    
    def cover_all_content(self, room_id, content):
        """
        覆盖房间中的所有内容
        """
        if room_id in self.room_dict:
            self.room_dict[room_id].nodes = content
            return True
        else:
            return False
    
    
    def room_operation(self, room_id, user, operation, content) -> bool:
        """
        房间操作
        Args:
            room_id: 房间id
            user: 用户id
            operation: 操作类型
                - new_node: 生成新的形状
                - delete_node: 删除形状
                - update_node: 更新形状
            content: 操作内容
        
        Returns:
            bool: 操作是否成功
        """
        res = False

        if room_id in self.room_dict:
            room = self.room_dict[room_id]

            # 验证用户是否可以进入房间
            if room.is_access(user):
                if operation == OPERATE.SHAPE_NEW.value:
                    # 生成新的形状
                    res = room.new_node(content)
                elif operation == OPERATE.SHAPE_DELETE.value:
                    # 删除形状
                    res = room.delete_node(content)
                elif operation == OPERATE.SHAPE_UPDATE.value:
                    # 更新形状
                    res = room.update_node(content)
                elif operation == OPERATE.SHAPE_DELETEALL.value:
                    # 删除所有形状
                    res = room.delete_all_node()
                elif operation == OPERATE.SHAPE_COVERALL.value:
                    # 覆盖所有形状
                    res = room.cover_all_node(content)
                else:
                    res = False
                # 测试的时候输出房间的info
                print(room.to_info())
            else:
                res = False
        else:
            res = False
        return res

    def get_room_list(self):
        return self.room_dict.keys()

    def get_room_count(self):
        return len(self.room_dict)

    def get_room_member_count(self, room_id):
        if room_id in self.room_dict:
            return len(self.room_dict[room_id].room_members)
        else:
            return 0

    def get_nodes_count(self, room_id):
        if room_id in self.room_dict:
            return len(self.room_dict[room_id].nodes)
        else:
            return 0
        
    def get_room_member_list(self, room_id):
        if room_id in self.room_dict:
            return self.room_dict[room_id].room_members
        else:
            return None

    def get_nodes_list(self, room_id):
        if room_id in self.room_dict:
            return self.room_dict[room_id].nodes
        else:
            return None
    
    def check_user_permission(self, room_id, u_id):
        if room_id in self.room_dict:
            return self.room_dict[room_id].is_access(u_id)
        else:
            return None

    def get_room_info(self, room_id):
        if room_id in self.room_dict:
            return self.room_dict[room_id].to_info()
        else:
            return None


