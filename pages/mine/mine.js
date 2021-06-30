// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    _openid:'',
    content:[],
    contentex:[],
    bgcImage:'',
    bgcimage:[],
    userInfoex:{}
  },

  //背景图片操作
  bgcAction(e){

    // console.log(e.currentTarget.dataset.src)
    wx.showActionSheet({
      itemList: ['预览图片','更换背景'],
    }).then( res => {
      if(res.tapIndex == 0){
        let List = []
        List.push(e.currentTarget.dataset.src)
        wx.cloud.getTempFileURL({
          fileList:List
        }).then( res => {
          wx.previewImage({
            current:List[0],
            urls: List,
          })
        })
      }
      if(res.tapIndex == 1){
        wx.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
        }).then( res => {
             // tempFilePath可以作为img标签的src属性显示图片
             const tempFilePaths = res.tempFilePaths
             wx.cloud.uploadFile({
              cloudPath: "images/"+(new Date()).getTime()+Math.floor(9*Math.random())+".jpg", // 上传至云端的路径
              filePath: tempFilePaths[0], // 小程序临时文件路径
             }).then( res => {
               console.log(res.fileID)
               this.data.bgcimage.bgcImage = res.fileID
              wx.cloud.callFunction({
                name:'upDateImage',
                data:{
                  openid:this.data._openid,
                  coll:'bgcImage',
                  bgcImage:res.fileID,
                
                }
              }).then( res => {
                console.log( res )
                this.setData({
                  bgcimage:this.data.bgcimage
                })
              })
             })
        })




      }
    })
  },
   
  
   //上传背景图片
   uploadImage(){
     wx.chooseImage({
       count: 1,
       sizeType: ['original', 'compressed'],
       sourceType: ['album', 'camera'],
     }).then( res => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        wx.cloud.uploadFile({
          cloudPath: "images/"+(new Date()).getTime()+Math.floor(9*Math.random())+".jpg", // 上传至云端的路径
          filePath: tempFilePaths[0], // 小程序临时文件路径
        }).then(res => {
          this.data.bgcImage = res.fileID
          wx.cloud.database().collection('bgcImage').add({
            data:{
            bgcImage:this.data.bgcImage
            }
          })
          this.setData({
            bgcImage:this.data.bgcImage
          })
          console.log(this.data.bgcImage)
        })
     })
   },


   //查看动态详情
   checkDetail(){
     console.log('------------------------------')
     this.data.userInfoex = JSON.stringify(this.data.userInfo)

 
     
   },




  onLoad: function (options) {
    this.data._openid = options._openid
    console.log(this.data._openid)
    this.data.userInfo = JSON.parse(options.userinfo)
    this.setData({
      userInfo:this.data.userInfo
    })
    wx.cloud.callFunction({
      name:'selectGetData',
      data:{
        coll:'sendList',
        _openid:this.data._openid
      }
    }).then( res => {
      this.data.content = res.result.data.reverse()
      this.setData({
        content:this.data.content
      })
      console.log(this.data.content)

    })

    //加载背景图
    wx.cloud.callFunction({
      name:'selectGetData',
      data:{
        coll:'bgcImage',
        _openid:this.data._openid
      }
    }).then( res => {
      console.log(res.result.data[0])
      this.setData({
        bgcimage:res.result.data[0]
      })
    })


    //详情页的用户信息
    this.data.userInfoex = options.userinfo
    console.log('------------------------------')
    this.setData({
      userInfoex:this.data.userInfoex
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      bgcImage
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})