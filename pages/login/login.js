// pages/login/login.js
const app = getApp()
let imagesitem = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:'',
    hasUserInfo: false,
    openid:'',
    userInfo:[],
    images : [],
    userinfo:[]
  },

  //获取用户登录信息
  getUserInfo(e){
    wx.getUserProfile({
      desc:'获取信息'
    }).then(res => {
      console.log(res.userInfo)
      app.dataParams = res.userInfo
      wx.cloud.callFunction({
        name:'login'
      }).then(res => {
        console.log('111',res)
        
        this.setData({
          openid:res.result.openid
        })
      })
      this.setData({
        hasUserInfo:true,
        url:res.userInfo.avatarUrl,
        userInfo:res.userInfo,
        userinfo:JSON.stringify(res.userInfo)
      })
    })
    //获取用户appid



  },


  sendcontrol(){
    wx.showToast({
      title: '请先登录',
      icon:'error'
    })
  },

  //上传图片
  upload(){
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success : res => {
        // tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths
        for(let i=0;i<tempFilePaths.length;i++){
          wx.cloud.uploadFile({
            cloudPath: "images/"+(new Date()).getTime()+Math.floor(9*Math.random())+".jpg", // 上传至云端的路径
            filePath: tempFilePaths[i], // 小程序临时文件路径
            success: res => {
              // 返回文件 ID
              imagesitem.fileID = res.fileID
              this.data.images.push(imagesitem)
              wx.cloud.callFunction({
                name:'upDate',
                data:{
                  ID:this.data.images,
                  coll:'UI',
                  openid:this.data.openid
                }
              }).then( res => {
                console.log(res)
              })
            },
            fail: console.error
          })
        }


      }
    })
  },

  onLoad: function (options) {
    wx.cloud.callFunction({
      name:'getDataAll',
      data:{
        coll:'UI'
      }
    }).then(res => {
      console.log('110')
      console.log(res.result.data[0])
      this.data.images = res.result.data[0].fileID
      this.setData({
        images:res.result.data[0].fileID
      })
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