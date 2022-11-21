# service 核心设计 💻

## 文件树
```
.
├── common.py
├── creat_data
│   ├── __init__.py
├── creat_room
│   ├── __init__.py
│   ├── room_manager.py
│   └── user.py
├── creat_transfer
│   ├── __init__.py
│   ├── msg.py
│   ├── painted_handle.py
│   └── transfer.py
├── main.py
├── README.md
├── requirement
├── system_framework.drawio.png
├── tests
│   ├── __init__.py
│   ├── send_data.py
│   └── test_room.py
└── utils
    ├── __init__.py
    └── response.py
```

<br />

---

> (图片较大，可能需要加载一会)


## 功能架构

![image](https://user-images.githubusercontent.com/73827386/201654440-4f8e9f65-1560-475c-851b-6f918a4740ce.png)

<br />

## 设计思路

![Top-level-design](https://user-images.githubusercontent.com/73827386/201654969-6ef1bd71-04b8-4153-84c7-124f7b27fdf8.png)

<br />

## 内部功能实现

![Internal-links](https://user-images.githubusercontent.com/73827386/201654799-9a592811-e4de-430d-8fb0-03edb263f8b7.png)


- creat_room: 房间管理,主要涉及对房间内的操作控制
- creat_data: 数据管理,主要涉及对数据保存以及压缩的控制
- creat_transfer: 是接受WebSocket信息的第一阶段,主要负责数据分配与房间控制

<br />

## API

::: tip
如果你需要使用 `service` 模块的话，以下内容您可能会需要
:::

### 一、创建会议

**每个白板一个id，可以在此白板基础上创建会议，所有数据前端提供。**

#### 1.1  输入

```json
{
  "type": "create_meeting",    // 传输数据类型
  "whiteboard":{
    "id":"xxxxxxxxxxx",       // 白板唯一识别
    "name": "未命名文件1",     // 白板名称 
    "nodes":[],              // 初始白板数据
    "readonly":false         // 这里是全局的是否只读状态
  },
  "user":{
    "id":"xxxxxxxxxxx",  // 用户唯一识别  
    "name":"xxxx",      // 用户昵称
    "color":"xxx",     // 用户默认颜色
  }
}
```

```json
{
  "type": "create_meeting",   
  "whiteboard":{
    "id":"xxxxxxxxxxx",      
    "name": "未命名文件1",    
    "nodes":[],             
    "readonly":false        
  },
  "user":{
    "id":"a", 
    "name":"xxxx",     
    "color":"xxx"
  }
}
```

#### 1.2  响应

```json
{
  "status": 200,
  "msg": "创建房间成功",
}
```

#### 1.3  数据缓存

类似这样

```json
key: creat-xxxxxxxx (creat-白板id)
value: {
  "author_id": "xxxxx",
  "whiteboard":{
    "name": "未命名文件1",     // 白板名称 
    "nodes":[],              // 初始白板数据
    "readonly":false         // 这里是全局的是否只读状态
  },
}
```

### 二、 检查会议

先要有接口判断会议是否存在，即判断缓存是否有id，并且获取权限

#### 2.1  输入

```json
{
  "type": "check_meeting",
  "whiteboard":{
    "id":"xxxxxxxxxxx",      // 白板唯一识别
  },
}
```

#### 2.2  响应

##### 2.2.1 缓存中已存在该白板（已创建）

```json
{
  "status":200
  "whiteboard":{
    "name": "未命名文件1",     // 白板名称 
    "readonly":true         // 这里是全局的是否只读状态
  },
}
```

##### 2.2.2 缓存中不存在该白板 （未创建）

```json
{
  "status":404
}
```

### 三、进入会议

白板是否只读由 章节：“二、检查会议” 获取，前端判断。

#### 3.1  输入

##### 3.1.1 白板只读情况下输入

```json
{
  "type": "join_meeting",
  "whiteboard":{
    "id":"xxxxxxxxxxx",      // 白板唯一识别
  },
}
```

##### 3.1.1 白板非只读情况下输入

```json
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
```

##### 3.2  响应

这里和创建会议时缓存里的的作者id对比

##### 3.2.1 白板只读情况下

**a.  加入的是作者，则响应**

如果加入的是作者，则为：

```json
{
  "whiteboard":{
    "name": "未命名文件1",     // 白板名称 
    "nodes":[],              // 初始白板数据
    "readonly":true        // 这里是全局的是否只读状态
  },
  "user_rights":"author"  // 用户类型
}
```

**b.   加入的是贡献者，则响应**

加入的不是作者，则是：

```json
{
  "whiteboard":{
    "name": "未命名文件1",       // 白板名称 
    "nodes":[],               // 初始白板数据
    "readonly":true         // 这里是全局的是否只读状态
  },
  "user_rights":"contributor"   // 用户类型
}
```

**c.  转发给其他成员**

无

##### 3.2.2 白板非只读情况下

**a.  加入的是作者，则响应**

如果加入的是作者，则为：

```json
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
```

**b.  加入的是贡献者，则响应**

加入的不是作者，则是：

```json
{
  "whiteboard":{
    "name": "未命名文件1",            // 白板名称 
    "nodes":[],                    // 初始白板数据
    "readonly":false              // 这里是全局的是否只读状态
  },
  "user_rights":"contributor",  // 用户类型
  "cooperation_users": [       // 已在线协作用户数据
    {  
      "name": "aaa",
      "color": "xxx",
      "rights": "contributor"
    }
    .....
  ],
}
```

**c.  转发给其他成员**

```json
{
  "type": "join_meeting",
  "join_user":{      
    "name":"aaa",       // 用户昵称 （加入的时候会判断，是否已经存在该用户昵称，存在则反馈）   
    "color":"xxx",     // 用户默认颜色
  }
}
```

### 四、退出会议

#### 4.1  输入

```json
{
  "type": "quit_meeting",
  "user":{
    "name":"xxxxx"   // 用户昵称 
  }
}

```

#### 4.2  其他成员响应

```json
{
  "type": "quit_meeting",
  "user":{
    "name":"xxxxx"   // 用户昵称 
  }
}
```

### 五、关闭会议

只有作者可以关闭，同样判断id是否和缓存里的id是否相同，**关闭之后则删除缓存**

#### 5.1 输入

```json
{
  "type": "close_meeting",
  "user":{
    "id":"xxxxxxxxxxx",  // 用户唯一识别
  }
}
```

### 六、更改会议状态

只有作者有权限，修改之后，redis中的缓存数据也会修改

#### 6.1  输入

```json
{
  "type": "change_meeting",    // 传输数据类型
  "whiteboard":{
    "name": "修改文件1",      //  白板名称                 // 这个可以修改
    "readonly":true         // 这里是全局的是否只读状态   // 这个可以修改
  }
}
```

#### 6.2 给作者的响应

```json
{
  "status": 200,
  "msg": "成功",
}
```

#### 6.3  其他成员响应

```json
{
  "type": "change_meeting",    // 传输数据类型
  "whiteboard":{
    "name": "修改文件1",      //  白板名称
    "readonly":true         // 这里是全局的是否只读状态
  },
}
```

### 七、更改会议白板数据（同步）

readonly 为 true 的时候，只有作者可以修改，当然前端也不会发送数据。

后端对redis中的缓存同样进行更新，之后再转发给其它人

```json
"whiteboard":{
    "name": "未命名文件1",
    "nodes":[],              // 👈这里
    "readonly":false
  },
```

#### 7.1  `update` 更新 nodes

> 找到id后，通过 `node[key] = newNode[key]` 覆盖

**输入**

```json
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
```

输出

```json
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
```

#### 7.2  `add` 新增 node

> 可以新增多个，所以nodes对象是个数组，追加到末尾，尽量保留原顺序

**输入**

```json
{
  "type": "add",
  "nodes": [
    {
      "id": "aaaaaa1",
      "更新的key": "更新的数据"
    },
    {
      "id": "aaaaaa2",
      "更新的key": "更新的数据"
    }
  ]
}
```

输出

```json
{
  "type": "add",
  "nodes":[
    {
      .......
    },
    {
      .......
    }  
  ]
}
```

#### 7.3  `delete` 删除 node

> 可以删除多个，所以nodes对象是个数组，根据id删除，尽量保留原顺序

**输入**

```json
{
  "type": "delete",
  "nodes":[
    {
      "id":"aaa"
      },
    {
      "id":"bbb"
    }  
  ]
}
```

输出

```json
{
  "type": "delete",
  "nodes":[
    {
      "id":"aaa"
      },
    {
      "id":"bbb"
    }  
  ]
}
```

#### 7.4  `delete-all` 删除全部 nodes

**输入**

```json
{
  "type": "nodes-delete-all",
}
```

#### 7.5  `cover-all` 覆盖全部 nodes

> 直接覆盖在代码的执行逻辑上....... 貌似这种情况不会发生，保留是为了避免错误

**输入**

```json
{
  "type": "cover-all",
  "nodes":[ ..... ]
}
```

#### 7.6 `sync-mouse` 鼠标位置同步

鼠标按下去的时候传输位置并显示

**输入**

```json
{
    "type":"sync-mouse",
    "coordinate":{
        "x":"100",
        "y":"200",
        "isMousedown": false
    },
    "user":{
        "name":"xxx",
        "color":"xxx"
    }
}
```

输出

```json
{
    "type":"sync-mouse",
    "coordinate":{
        "x":"100",
        "y":"200",
        "isMousedown": false
    },
    "user":{
        "name":"xxx",
        "color":"xxx"
    }
}
```

#### 7.7  `update-state` 同步操作状态&#x20;

**输入**

```json
{
    "type":"update-state",
    "state":{
        "更新的key":"更新的数据",
    },
}
```

**输**出

```json
{
    "type":"update-state",
    "state":{
        "更新的key":"更新的数据",
    },
}
```
