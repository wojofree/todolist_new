<template>
  <div style="width: 2rem;height: 2rem;background-color: #fff3cd" @click="test">test</div>
</template>

<script>

export default {
  name: "test",
  data() {
    return {
      isHover: false,
      gogogo:{}
    }
  },
  created() {
    this.gogogo = [
    {
        "id": 2,
        "created_by": {
            "username": "wojofree",
            "id": 1
        },
        "name": "无人直播1",
        "color": "#EDADEB",
        "icon": "Graph",
        "context": "tesdfadfa啊aa",
        "archive": true,
        "star": false,
        "favorite": true,
        "completed_time": "2023-05-17T23:59:59+08:00",
        "start_time": "2023-05-09T00:00:00+08:00",
        "edited_by": 1,
        "users": [
            1
        ]
    },
    {
        "id": 3,
        "created_by": {
            "username": "wojofree",
            "id": 1
        },
        "name": "测试一下测试一下测试一下测试一下",
        "color": "#A96ECE",
        "icon": "Bord",
        "context": null,
        "archive": true,
        "star": false,
        "favorite": true,
        "completed_time": "2023-05-24T23:59:59+08:00",
        "start_time": "2023-05-24T00:00:00+08:00",
        "edited_by": 1,
        "users": [
            1
        ]
    },
    {
        "id": 4,
        "created_by": {
            "username": "wojofree",
            "id": 1
        },
        "name": "test",
        "color": "#A96ECE",
        "icon": "TimeLine",
        "context": "etets11",
        "archive": true,
        "star": false,
        "favorite": true,
        "completed_time": "2023-05-19T23:59:59+08:00",
        "start_time": "2023-05-04T00:00:00+08:00",
        "edited_by": 1,
        "users": [
            1
        ]
    },
    {
        "id": 5,
        "created_by": {
            "username": "wojofree",
            "id": 1
        },
        "name": "bbbbbbb",
        "color": "#E9BF78",
        "icon": "List",
        "context": null,
        "archive": false,
        "star": false,
        "favorite": false,
        "completed_time": "2023-05-19T23:59:59+08:00",
        "start_time": "2023-05-19T23:59:59+08:00",
        "edited_by": 1,
        "users": [
            1
        ]
    },
    {
        "id": 6,
        "created_by": {
            "username": "wojofree",
            "id": 1
        },
        "name": "112bbbbbbb1112",
        "color": "#A96ECE",
        "icon": "List",
        "context": null,
        "archive": false,
        "star": false,
        "favorite": false,
        "completed_time": "2023-05-24T23:59:59+08:00",
        "start_time": null,
        "edited_by": 1,
        "users": [
            1
        ]
    },
    {
        "id": 7,
        "created_by": {
            "username": "wojofree",
            "id": 1
        },
        "name": "bbbbbbb",
        "color": "#EDADEB",
        "icon": "Gear",
        "context": null,
        "archive": false,
        "star": false,
        "favorite": false,
        "completed_time": "2023-05-19T23:59:59+08:00",
        "start_time": null,
        "edited_by": 1,
        "users": [
            1
        ]
    },
    {
        "id": 8,
        "created_by": {
            "username": "wojofree",
            "id": 1
        },
        "name": "bbbb111bbb",
        "color": "#B4CE67",
        "icon": "People",
        "context": null,
        "archive": false,
        "star": false,
        "favorite": false,
        "completed_time": null,
        "start_time": null,
        "edited_by": 1,
        "users": [
            1
        ]
    },
    {
        "id": 9,
        "created_by": {
            "username": "wojofree",
            "id": 1
        },
        "name": "我是",
        "color": "#5072CB",
        "icon": "Bord",
        "context": null,
        "archive": false,
        "star": false,
        "favorite": false,
        "completed_time": null,
        "start_time": null,
        "edited_by": 1,
        "users": [
            1
        ]
    },
    {
        "id": 14,
        "created_by": {
            "username": "wojofree",
            "id": 1
        },
        "name": "测试一下",
        "color": "#A96ECE",
        "icon": "List",
        "context": null,
        "archive": false,
        "star": false,
        "favorite": false,
        "completed_time": null,
        "start_time": null,
        "edited_by": 1,
        "users": [
            1
        ]
    },
    {
        "id": 15,
        "created_by": {
            "username": "wojofree",
            "id": 1
        },
        "name": "meiyou",
        "color": "#ffc107",
        "icon": "List",
        "context": null,
        "archive": false,
        "star": false,
        "favorite": false,
        "completed_time": null,
        "start_time": null,
        "edited_by": 1,
        "users": [
            1
        ]
    },
    {
        "id": 16,
        "created_by": {
            "username": "wojofree",
            "id": 1
        },
        "name": "asdfasdf",
        "color": "#F8DF72",
        "icon": "List",
        "context": null,
        "archive": false,
        "star": false,
        "favorite": false,
        "completed_time": null,
        "start_time": null,
        "edited_by": 1,
        "users": [
            1
        ]
    },
    {
        "id": 17,
        "created_by": {
            "username": "wojofree",
            "id": 1
        },
        "name": "title",
        "color": "#ffc107",
        "icon": "List",
        "context": null,
        "archive": false,
        "star": false,
        "favorite": false,
        "completed_time": null,
        "start_time": null,
        "edited_by": 1,
        "users": [
            1
        ]
    },
    {
        "id": 18,
        "created_by": {
            "username": "wojofree",
            "id": 1
        },
        "name": "asdfasdfasdf",
        "color": "#8B84E1",
        "icon": "List",
        "context": null,
        "archive": false,
        "star": false,
        "favorite": false,
        "completed_time": null,
        "start_time": null,
        "edited_by": 1,
        "users": [
            1
        ]
    },
    {
        "id": 19,
        "created_by": {
            "username": "wojofree",
            "id": 1
        },
        "name": "sdfasdfasa",
        "color": "#EC8E71",
        "icon": "List",
        "context": null,
        "archive": false,
        "star": false,
        "favorite": false,
        "completed_time": null,
        "start_time": null,
        "edited_by": 1,
        "users": [
            1
        ]
    },
    {
        "id": 20,
        "created_by": {
            "username": "wojofree",
            "id": 1
        },
        "name": "mailea",
        "color": "#EC8E71",
        "icon": "List",
        "context": null,
        "archive": false,
        "star": false,
        "favorite": false,
        "completed_time": null,
        "start_time": null,
        "edited_by": 1,
        "users": [
            1
        ]
    },
    {
        "id": 21,
        "created_by": {
            "username": "wojofree",
            "id": 1
        },
        "name": "项目",
        "color": "#ffc107",
        "icon": "List",
        "context": null,
        "archive": false,
        "star": false,
        "favorite": false,
        "completed_time": null,
        "start_time": null,
        "edited_by": 1,
        "users": [
            1
        ]
    },
    {
        "id": 22,
        "created_by": {
            "username": "wojofree",
            "id": 1
        },
        "name": "我的",
        "color": "#6D9F84",
        "icon": "List",
        "context": null,
        "archive": false,
        "star": false,
        "favorite": false,
        "completed_time": null,
        "start_time": null,
        "edited_by": 1,
        "users": [
            1
        ]
    },
    {
        "id": 23,
        "created_by": {
            "username": "wojofree",
            "id": 1
        },
        "name": "我的啊",
        "color": "#ffc107",
        "icon": "List",
        "context": null,
        "archive": false,
        "star": false,
        "favorite": false,
        "completed_time": null,
        "start_time": null,
        "edited_by": 1,
        "users": [
            1
        ]
    }
]
  },
  methods:{
    test(){
      const te = this.gogogo[0]
      const two = this.gogogo
      this.gogogo[0].id = '22'
      console.log(te)
      console.log(this.gogogo)

    }
  }
}
</script>

<style scoped>

</style>