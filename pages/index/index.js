// index.js
// 获取应用实例
const app = getApp()
let index = 0
Page({

  data:{
    contentex:[],
    content:[],
    images:[],
    change:{},
    flag:null,
    commentButton:false,
    userInfo:{},
    commentItem:{},
    comment:[],
    commentID:''
  },

  checkimages(e){
    console.log(e.currentTarget.dataset.index)
    wx.cloud.getTempFileURL({
      fileList:e.currentTarget.dataset.checkimages
    }).then( res => {
      let url = []
      res.fileList.forEach( item => {
        url.push(item.tempFileURL)
        console.log(url)
      }) 
      wx.previewImage({
        current:url[index],
        urls:url ,
      })
    })
  },

  checkimage(e){
    console.log(e.currentTarget.dataset.index)
    index = e.currentTarget.dataset.index
  },

  controller(e){
    
    this.data.commentID = e.currentTarget.dataset.id
    console.log(this.data.commentID)
    if(this.data.flag == null || this.data.flag != e.currentTarget.dataset.index){
      this.data.flag = e.currentTarget.dataset.index 
      this.data.commentButton = false
    }
    else{
      this.data.flag = null
      this.data.commentButton = false
    }

    console.log(this.data.flag)
    this.setData({
      flag:this.data.flag,
      commentButton:this.data.commentButton,
      commentID:this.data.commentID
    })
},

  commentButton(){
    if(this.data.userInfo){
      this.data.commentButton = !this.data.commentButton
      this.setData({
        commentButton:this.data.commentButton
      })
    }
    else{
      wx.showToast({
        title: '请先登录',
        icon:'error'
      })
    }

},

  input(e){
    console.log(e.detail.value)
    this.data.commentItem.text = e.detail.value
    
  },
  inputConfirm(e){
    console.log(e.currentTarget.dataset.getcomment)
    this.data.comment = e.currentTarget.dataset.getcomment
    this.data.commentItem.nickName = this.data.userInfo.nickName
    console.log(this.data.commentItem)
    this.data.comment.push(this.data.commentItem)
    console.log(this.data.comment)
    wx.cloud.callFunction({
      name:'updateComment',
      data:{
        coll:'sendList',
        id:this.data.commentID,
        comment:this.data.comment
      }
    }).then( res => {
      console.log(res)

      wx.cloud.callFunction({
        name:'getDataAll',
        data:{
              coll:'sendList'
        }
      }).then(res => {
        console.log(res.result.data)
        this.data.contentex =  res.result.data
        this.data.content = this.data.contentex.reverse()
        this.data.flag = null
        this.data.commentButton = false
        this.setData({
          content:this.data.content,
          userInfo:this.data.userInfo,
          flag:this.data.flag,
          commentButton:this.data.commentButton,
        })

      })




    })

  },

  //下拉刷新------------------------
  onPullDownRefresh: function () {
    this.data.userInfo = app.dataParams
    wx.cloud.callFunction({
      name:'getDataAll',
      data:{
            coll:'sendList'
      }
    }).then(res => {
      console.log(res.result.data)
      this.data.contentex =  res.result.data
      this.data.content = this.data.contentex.reverse()
  
      this.setData({
        content:this.data.content
      })
      wx.stopPullDownRefresh({
        success: (res) => {},
      })
    })
  },




  //页面加载--------------------------
 onLoad(options){
   console.log(app.dataParams)
   this.data.userInfo = app.dataParams
   
  wx.cloud.callFunction({
    name:'getDataAll',
    data:{
          coll:'sendList'
    }
  }).then(res => {
    console.log(res.result.data)
    this.data.contentex =  res.result.data
    this.data.content = this.data.contentex.reverse()

    this.setData({
      content:this.data.content,
      userInfo:this.data.userInfo
    })
  })


 }
 
})


