// pages/send/send.js
let imagesID=[]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageShow:true,
    textInput:'',
    images:[],
    userInfo:{},
    comment:[]
  },

  //添加文字
  addText(e){
    console.log(e.detail.value)
    this.data.textInput = e.detail.value
  },



  //添加图片
  addImages(){
    let that = this
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
    }).then( res => {
              // tempFilePath可以作为img标签的src属性显示图片
              const tempFilePaths = res.tempFilePaths
              tempFilePaths.forEach(item => {
                wx.cloud.uploadFile({
                  cloudPath: "11images/"+(new Date()).getTime()+Math.floor(9*Math.random())+".jpg", // 上传至云端的路径
                  filePath: item, // 小程序临时文件路径

                }).then( res => {
                  this.data.images.push(res.fileID)
                  this.setData({
                    images:this.data.images
                  })
                  console.log(this.data.images)

                })
              })
    })
    
  },

  //发表按钮
  sendButton(){
    let date = new Date()
    console.log(date.toLocaleString())
    let Dates = date.toLocaleString()
    wx.cloud.database().collection('sendList').add({
      data:{
        textInput: this.data.textInput,
        fileID:this.data.images,
        userInfo:this.data.userInfo,
        date:Dates,
        comment:this.data.comment
      }

    }).then( res => {
      wx.showToast({
        title: '发表成功',
      }).then( res => {
        wx.switchTab({
          url: '/pages/index/index',
        })
      })
      console.log(res)
    })
  },


  onLoad: function (options) {

    let userinfo = JSON.parse(options.userinfo)
    this.data.userInfo = userinfo
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