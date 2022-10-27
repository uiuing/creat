

class PaintedHandle(object):
    """
    白板数据处理基类
    """

    def __init__(self, data):
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


# 白板工厂类
class PaintedFactory(object):
    """
    白板工厂类
    """
    def __init__(self, data):
        self.data = data

    def get_handle(self):
        """
        获取白板数据处理类
        """
        type = self.data.get('type')
        if type == 'update':
            return UpdateHandle(self.data)
        elif type == 'add':
            return AddHandle(self.data)
        elif type == 'delete':
            return DeleteHandle(self.data)
        else:
            return PaintedHandle(self.data)