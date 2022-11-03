from enum import Enum

# 操作类型
class OPERATE(Enum):
    CREATE = 'create_room'
    JOIN = 'join_room'
    SHAPE_NEW = 'add'
    SHAPE_DELETE = 'delete'
    SHAPE_UPDATE = 'update'
    SHAPE_DELETEALL = 'delete-all'
    SHAPE_COVERALL = 'cover-all'

