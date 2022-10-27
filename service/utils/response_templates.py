



def success(msg: str, data: dict = None) -> dict:
    return {
        'status': 200,
        'msg': msg,
        'data': data
    }

def error(msg: str, data: dict = None) -> dict:
    return {
        'status': 400,
        'msg': msg,
        'data': data
    }
