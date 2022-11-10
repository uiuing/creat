
create_meeting = {
	"type": "create_meeting",
	"whiteboard": {
		"id": "1",
		"name": "未命名文件1",
		"nodes": [],
		"readonly": False
	},
	"user": {
		"id": "a",
		"name": "xxxx",
		"color": "xxx"
	}
}

update_meeting = {
  "type": "change_meeting",   
  "whiteboard":{
    "name": "修改文件1",     
    "readonly":False         
  }
}

join_meeting_1 = {
  "type": "join_meeting",
  "whiteboard":{
    "id":"1"  
  },
  "user":{      
    "id":"b",  
    "name":"aaa",      
    "color":"xxx"
  }
}

join_meeting_2 = {
  "type": "join_meeting",
  "whiteboard":{
    "id":"1"  
  },
  "user":{      
    "id":"c",  
    "name":"aaa",      
    "color":"xxx"
  }
}

join_meeting_3 = {
  "type": "join_meeting",
  "whiteboard":{
    "id":"1"  
  },
  "user":{      
    "id":"d",  
    "name":"d",      
    "color":"d"
  }
}

change_meeting = {
  "type": "change_meeting",    
  "whiteboard":{
    "name": "修改文件1",     
    "readonly": True         
  }
}

add_node_1 = {
  "type": "add",
  "nodes": [
    {
      "id": "1",
      "更新的key": "更新的数据"
    },
    {
      "id": "2",
      "更新的key": "更新的数据"
    }
  ]
}

add_node_2 = {
  "type": "add",
  "nodes": [
    {
      "id": "3",
      "更新的key": "更新的数据"
    },
    {
      "id": "4",
      "更新的key": "更新的数据"
    }
  ]
}

nodes_update = {
  "type": "nodes-update",
  "nodes":[
    {
      "id":"1",
      "更新的key":"123"
    },
    {
      "id":"2",
      "更新的key":"123"
    }
  ]
}

nodes_delete = {
  "type": "delete",
  "nodes":[
    {
      "id":"1"
    },
    {
      "id":"2"
    }
  ]
}

nodes_delete_all = {
  "type": "nodes-delete-all",
}

cover_all = {
  "type": "cover-all",
  "nodes":[
    {
      "id":"1",
      "更新的key":"cover"
    }
  ]
}

quit_meeting = {
  "type": "quit_meeting",
  "user":{
    "name":"b"   
  }
}