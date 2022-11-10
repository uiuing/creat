from enum import Enum

# 操作类型
class OPERATE(Enum):
    # 创建房间
    CREATE = 'create_meeting'
    # 加入房间
    JOIN = 'join_meeting'
    # 检查会议
    CHECK = 'check_meeting'
    # 退出房间
    EXIT = 'quit_meeting'
    # 修改房间信息
    UPDATE = 'change_meeting'
    
    # 更新Node
    SHAPE_NEW = 'add'
    SHAPE_DELETE = 'delete'
    SHAPE_UPDATE = 'nodes-update'
    SHAPE_DELETEALL = 'nodes-delete-all'
    SHAPE_COVERALL = 'cover-all'

    # 鼠标同步
    MOUSE_SYNC = 'sync_mouse'

    # 状态更新
    STATUS_UPDATE = 'update-state'

