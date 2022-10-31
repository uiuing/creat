

class PaintedHandle(object):
    """
    白板数据处理基类
    """

    def __init__(self, ip, data):
        self.ip = ip
        self.data = data

    def run(self):
        return self.data


class UpdateHandle(PaintedHandle):
    """
    白板数据更新处理类
    """
    def run(self):
        return self.data

class AddHandle(PaintedHandle):
    """
    白板数据添加处理类
    """
    def run(self):
        return self.data
    

class DeleteHandle(PaintedHandle):
    """
    白板数据删除处理类
    """

    def run(self):
        return self.data

class CreateHandle(PaintedHandle):
    """
    白板数据创建处理类
    """

    def run(self):
        return self.data


# 白板工厂类
class PaintedFactory(object):
    """
    白板工厂类
    """
    def __init__(self, ip, data,websocket):
        self.data = data
        self.ip = ip
        self.websocket = websocket

    def get_handle(self):
        """
        获取白板数据处理类
        """
        type = self.data.get('type')
        if type == 'update':
            return UpdateHandle(self.ip, self.data, self.websocket)
        elif type == 'add':
            return AddHandle(self.ip,self.data, self.websocket)
        elif type == 'delete':
            return DeleteHandle(self.ip,self.data, self.websocket)
        elif type == 'create':
            return CreateHandle(self.ip,self.data, self.websocket)
        else:
            return PaintedHandle(self.ip,self.data, self.websocket)