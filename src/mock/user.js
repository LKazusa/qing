export default {
    'GET /api/login':{
        result:{
            id:'12345',
            username:'admin',
            nickname:'管理员001',
            avatar:'',
            friends: ['345234','546436'],
            chatList:[
                {
                    chat_id:'435235',
                    nickname:'卡西利亚斯',
                    avatar:'',
                    newChat:'这饭真香' //此处的newChat不论是是谁说的话，只要是最后一条
                },{
                    chat_id:'23454235',
                    nickname:'露西亚',
                    avatar:'',
                    newChat:'奥利给！' 
                },{
                    chat_id:'5436463456',
                    nickname:'这是一个好群',
                    avatar:'',
                    newChat:'宁撒娇撒错了对象！！' 
                }
            ],
            sign:'我是一个好管理员哦，会踢人的那种',
            manageGroup:['4353245'],//是哪几个群的群主
            inGroup:['4353245','123214214'],//在哪几个群里边,
            isAdmin:true,
        },
        status:'success'
    },
    'GET /api/getDynamicListId':{
        result: {
            dynamicList:['5656567'],
        },
        status: 'success'
    },
    'GET /api/getDynamic': {
        result:{
            dynamic_id:'5656567',
            picture:'',
            like:['435235'],
            content:'今天真是晴朗的一天',
            time:214,
            replies:[
                {
                    user_id:'435235',
                    nickname:'卡斯利亚斯',
                    avatar:'',
                    content:'这图配的好啊!!!'
                }
            ]
        },
        status:'success'
    }
}