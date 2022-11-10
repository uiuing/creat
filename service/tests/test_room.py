import websockets
import asyncio
import json
import send_data


def pprint(obj):
    return json.dumps(obj, indent=2, sort_keys=True, ensure_ascii=False)

uri = "ws://localhost:8000/ws"

async def test_1():
    """
    测试1:
    用户A 创建房间
    用户B 加入房间
    用户C 加入房间
    用户A 加入房间
    用户A 新建Node
    用户B 新建Node

    用户A 更新Nodes
    用户B 删除Nodes
    用户C 删除全部Nodes
    用户D 覆盖全部Nodes
    """
    

    user_a = await websockets.connect(uri)
    user_b = await websockets.connect(uri)

    # 用户A 创建房间
    print("用户A 创建房间")
    print(f"用户A 发送信息> {pprint(send_data.create_meeting)}")
    await user_a.send(json.dumps(send_data.create_meeting))
    res = await user_a.recv()
    res = json.loads(res)
    print(f"用户A 接收信息> {pprint(res)}")
    print('用户A 创建房间成功')
    print('----------------------------------------')
    print('----------------------------------------')

    # 用户B 加入房间
    print("用户B 加入房间")
    print(f"用户B 发送信息> {pprint(send_data.join_meeting_1)}")
    await user_b.send(json.dumps(send_data.join_meeting_1))
    res = await user_b.recv()
    res = json.loads(res)
    print(f"用户B 接收信息> {pprint(res)}")

    res = await user_a.recv()
    res = json.loads(res)
    print(f"用户A 接收信息> {pprint(res)}")

    print('----------------------------------------')
    print('----------------------------------------')

    # 用户C 加入房间
    print("用户C 加入房间")
    user_c = await websockets.connect(uri)
    print(f"用户C 发送信息> {pprint(send_data.join_meeting_3)}")
    await user_c.send(json.dumps(send_data.join_meeting_3))
    res = await user_c.recv()
    res = json.loads(res)
    print(f"用户C 接收信息> {pprint(res)}")

    # 用户A 与 用户B 接受到用户C加入房间的消息
    res = await user_a.recv()
    res = json.loads(res)
    print(f"用户A 接收信息> {pprint(res)}")

    res = await user_b.recv()
    res = json.loads(res)
    print(f"用户B 接收信息> {pprint(res)}")

    print('----------------------------------------')
    print('----------------------------------------')

    # 用户A 新建Node
    print("用户A 新建Node")
    print(f"用户A 发送信息> {pprint(send_data.add_node_1)}")
    await user_a.send(json.dumps(send_data.add_node_1))
    
    # 用户A 不需要收到消息
    # res = await user_a.recv()
    # res = json.loads(res)
    # print(f"用户A 接收信息> {pprint(res)}")

    # 用户B 用户C 接受到用户A新建Node的消息
    res = await user_b.recv()
    res = json.loads(res)
    print(f"用户B 接收信息> {pprint(res)}")

    res = await user_c.recv()
    res = json.loads(res)
    print(f"用户C 接收信息> {pprint(res)}")

    print('----------------------------------------')
    print('----------------------------------------')

    # 用户B 新建Node
    print("用户B 新建Node")
    print(f"用户B 发送信息> {pprint(send_data.add_node_2)}")
    await user_b.send(json.dumps(send_data.add_node_2))

    # 用户B 不需要收到消息
    # res = await user_b.recv()
    # res = json.loads(res)
    # print(f"用户B 接收信息> {pprint(res)}")

    # 用户A 用户C 接受到用户B新建Node的消息
    res = await user_a.recv()
    res = json.loads(res)
    print(f"用户A 接收信息> {pprint(res)}")

    res = await user_c.recv()
    res = json.loads(res)
    print(f"用户C 接收信息> {pprint(res)}")

    print('----------------------------------------')
    print('----------------------------------------')

    # 用户A 更新Nodes
    print("用户A 更新Nodes")
    print(f"用户A 发送信息> {pprint(send_data.nodes_update)}")
    await user_a.send(json.dumps(send_data.nodes_update))

    # 用户A 不需要收到消息
    # res = await user_a.recv()
    # res = json.loads(res)
    # print(f"用户A 接收信息> {pprint(res)}")

    # 用户B 用户C 接受到用户A更新Nodes的消息
    res = await user_b.recv()
    res = json.loads(res)
    print(f"用户B 接收信息> {pprint(res)}")

    res = await user_c.recv()
    res = json.loads(res)
    print(f"用户C 接收信息> {pprint(res)}")

    print('----------------------------------------')
    print('----------------------------------------')

    user_a.close()
    user_b.close()
    user_c.close()



async def test_2():
    """
    用户A 创建房间
    用户B 进入房间
    用户B 退出房间
    """
    # 用户A 创建房间
    print("用户A 创建房间")
    user_a = await websockets.connect(uri)
    print(f"用户A 发送信息> {pprint(send_data.create_meeting)}")
    await user_a.send(json.dumps(send_data.create_meeting))
    res = await user_a.recv()
    res = json.loads(res)
    print(f"用户A 接收信息> {pprint(res)}")

    # 用户B 进入房间
    print("用户B 进入房间")
    user_b = await websockets.connect(uri)
    print(f"用户B 发送信息> {pprint(send_data.join_meeting_1)}")
    await user_b.send(json.dumps(send_data.join_meeting_1))
    res = await user_b.recv()
    res = json.loads(res)
    print(f"用户B 接收信息> {pprint(res)}")

    # 用户A 接受到用户B进入房间的消息
    res = await user_a.recv()
    res = json.loads(res)
    print(f"用户A 接收信息> {pprint(res)}")


    print('----------------------------------------')
    print('----------------------------------------')

    # 用户B 退出房间
    print("用户B 退出房间")
    print(f"用户B 发送信息> {pprint(send_data.quit_meeting)}")
    await user_b.send(json.dumps(send_data.quit_meeting))
    # res = await user_b.recv()
    # res = json.loads(res)
    # print(f"用户B 接收信息> {pprint(res)}")

    # 用户A 接受到用户B退出房间的消息
    res = await user_a.recv()
    res = json.loads(res)
    print(f"用户A 接收信息> {pprint(res)}")

    print('----------------------------------------')
    print('----------------------------------------')

async def test_3():
    """
    用户A 创建房间
    用户B 加入房间
    用户C 加入房间

    会报用户名重复!
    """

    user_a = await websockets.connect(uri)
    user_b = await websockets.connect(uri)

    # 用户A 创建房间
    print("用户A 创建房间")
    print(f"用户A 发送信息> {pprint(send_data.create_meeting)}")
    await user_a.send(json.dumps(send_data.create_meeting))
    res = await user_a.recv()
    res = json.loads(res)
    print(f"用户A 接收信息> {pprint(res)}")
    print('用户A 创建房间成功')
    print('----------------------------------------')
    print('----------------------------------------')

    # 用户B 加入房间
    print("用户B 加入房间")
    print(f"用户B 发送信息> {pprint(send_data.join_meeting_1)}")
    await user_b.send(json.dumps(send_data.join_meeting_1))
    res = await user_b.recv()
    res = json.loads(res)
    print(f"用户B 接收信息> {pprint(res)}")

    res = await user_a.recv()
    res = json.loads(res)
    print(f"用户A 接收信息> {pprint(res)}")

    print('----------------------------------------')
    print('----------------------------------------')

    # 用户C 加入房间
    print("用户C 加入房间")
    user_c = await websockets.connect(uri)
    print(f"用户C 发送信息> {pprint(send_data.join_meeting_2)}")
    await user_c.send(json.dumps(send_data.join_meeting_2))
    res = await user_c.recv()
    res = json.loads(res)
    print(f"用户C 接收信息> {pprint(res)}")


async def test_4():
    """
    用户A 创建房间
    用户B 加入房间
    用户A 修改房间信息
    """

    user_a = await websockets.connect(uri)
    user_b = await websockets.connect(uri)

    # 用户A 创建房间
    print("用户A 创建房间")
    print(f"用户A 发送信息> {pprint(send_data.create_meeting)}")
    await user_a.send(json.dumps(send_data.create_meeting))
    res = await user_a.recv()
    res = json.loads(res)
    print(f"用户A 接收信息> {pprint(res)}")
    print('用户A 创建房间成功')
    print('----------------------------------------')
    print('----------------------------------------')

    # 用户B 加入房间
    print("用户B 加入房间")
    print(f"用户B 发送信息> {pprint(send_data.join_meeting_1)}")
    await user_b.send(json.dumps(send_data.join_meeting_1))
    res = await user_b.recv()
    res = json.loads(res)
    print(f"用户B 接收信息> {pprint(res)}")

    res = await user_a.recv()
    res = json.loads(res)
    print(f"用户A 接收信息> {pprint(res)}")

    print('----------------------------------------')
    print('----------------------------------------')

    # 用户A 修改房间信息
    print("用户A 修改房间信息")
    print(f"用户A 发送信息> {pprint(send_data.update_meeting)}")
    await user_a.send(json.dumps(send_data.update_meeting))
    res = await user_a.recv()
    res = json.loads(res)
    print(f"用户A 接收信息> {pprint(res)}")

    res = await user_b.recv()
    res = json.loads(res)
    print(f"用户B 接收信息> {pprint(res)}")

    print('----------------------------------------')
    print('----------------------------------------')

# asyncio.get_event_loop().run_until_complete(test_1())
# asyncio.get_event_loop().run_until_complete(test_2())
# asyncio.get_event_loop().run_until_complete(test_3())
asyncio.get_event_loop().run_until_complete(test_4())


# def room_1():
#     asyncio.get_event_loop().run_until_complete(test_1())

# if __name__ == "__main__":
#     test_1()