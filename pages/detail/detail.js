// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    _id:'',
    content:{},
    control:false
  },

  //控制显示
  controller(){
      this.setData({
        control: !this.data.control
      })
  },

  //删除动态
  delete(){
    wx.cloud.callFunction({
      name:'docDelete',
      data:{
          coll:'sendList',
          _id:this.data._id
      }
    }).then( res => {
      console.log(res)
      wx.showToast({
        icon:'success',
        title: '删除成功',
      }).then( res => {
        wx.navigateBack({
          delta: 1,
        })
      })
    })
  },


  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户信息
    this.data.userInfo = JSON.parse(options.userInfo)
    wx.cloud.callFunction({
      name:'docGet',
      data:{
        coll:'sendList',
        _id:options._id
      }
    }).then( res => {
      console.log(res.result.data)
      this.data.content = res.result.data
      this.data._id = res.result.data._id
      this.setData({
        content:this.data.content,
        _id:this.data._id
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