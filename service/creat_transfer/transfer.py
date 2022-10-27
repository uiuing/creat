
from creat_transfer import PaintedFactory


class Transfer(object):
    def __init__(self, room_manager):
        self.room_manager = room_manager
    
    def handle(self, data):
        """
        数据处理
        """
        painted_factory = PaintedFactory(data)
        painted_handle = painted_factory.get_handle()
        return painted_handle.run()

