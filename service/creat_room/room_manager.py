

class Room(object):
    
    def __init__(self, room_id, room_name, room_type, room_status, room_owner, room_owner_id, room_owner_avatar):
        self.room_id = room_id
        self.room_name = room_name
        self.room_type = room_type  
        self.room_status = room_status  # 0 为公开, 1 为私人
        self.room_owner = room_owner
        self.room_owner_id = room_owner_id
        self.room_owner_avatar = room_owner_avatar
        self.room_members = []
        self.room_content = []
        self.room_prohibits = []
        self.room_member_setting = {}
    
    def update_member_setting(self, member, setting):
        if member in self.room_members:
            self.room_member_setting

    def add_member(self, member):
        self.room_members.append(member)
        # Default user setting
        self.room_member_setting[member] = {
            "default_color": "#000000",             
		    "name": str(len(self.room_members)),    
		    "type": ""
            }

    def remove_member(self, member):
        if member in self.room_members:
            self.room_members.remove(member)
    
    def add_content(self, content):
        self.room_content.append(content)
    
    def remove_content(self, content):
        self.room_content.remove(content)
    
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
    

class RoomManager(object):

    def __init__(self):
        self.room_dict = {}

    def create_room(self, room_id):
        if room_id not in self.room_dict:
            self.room_dict[room_id] = Room(room_id)
            return self.room_dict[room_id]
        else:
            return None

    def get_room(self, room_id) -> Room:
        if room_id in self.room_dict:
            return self.room_dict[room_id]
        else:
            return None

    def delete_room(self, room_id):
        if room_id in self.room_dict:
            del self.room_dict[room_id]
            return True
        else:
            return False

    def get_room_list(self):
        return self.room_dict.keys()

    def get_room_count(self):
        return len(self.room_dict)

    def get_room_member_count(self, room_id):
        if room_id in self.room_dict:
            return len(self.room_dict[room_id].room_members)
        else:
            return 0

    def get_room_content_count(self, room_id):
        if room_id in self.room_dict:
            return len(self.room_dict[room_id].room_content)
        else:
            return 0
        
    def get_room_member_list(self, room_id):
        if room_id in self.room_dict:
            return self.room_dict[room_id].room_members
        else:
            return None

    def get_room_content_list(self, room_id):
        if room_id in self.room_dict:
            return self.room_dict[room_id].room_content
        else:
            return None


room_manager = RoomManager()