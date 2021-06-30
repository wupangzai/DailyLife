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

  },

  //背景图片操作
  bgcAction(e){

    console.log(e.currentTarget.dataset.src)
    wx.showActionSheet({
      itemList: ['预览图片'],
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
    })
  },
   
  


  onLoad: function (options) {
    this.data._openid = options._openid



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
      this.data.userInfo = this.data.content[0].userInfo
      this.setData({
        userInfo:this.data.userInfo
      })
      console.log(this.data.content[0].userInfo)

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