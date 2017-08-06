Page({
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.drawTransitionLine();
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

  },

  // 跳转至折线图
  startBrokenline: function (event) {
    wx.navigateTo({
      url: '/pages/analyze/brokenline/brokenline'
    })
  },

  // 跳转至圆环图
  startAnnulus: function (event) {
    wx.navigateTo({
      url: '/pages/analyze/annulus/annulus'
    })
  },

  // 跳转至柱状图
  startColumnar: function (event) {
    wx.navigateTo({
      url: '/pages/analyze/columnar/columnar'
    })
  },

  // 跳转至柱条形图
  startStriptype: function (event) {
    wx.navigateTo({
      url: '/pages/analyze/stricptype/stricptype'
    })
  },

  // 画渐变色的线
  drawTransitionLine: function () {
    const ctx_top = wx.createCanvasContext('canvas-gradient-top');
    const grd_top = ctx_top.createLinearGradient(0, 0, 0, 160);
    grd_top.addColorStop(0, '#302F39')
    grd_top.addColorStop(1, '#000913')
    ctx_top.setFillStyle(grd_top)
    ctx_top.fillRect(0, 0, 5, 167.5)
    ctx_top.draw()

    const ctx_bottom = wx.createCanvasContext('canvas-gradient-bottom');
    const grd_bottom = ctx_bottom.createLinearGradient(0, 0, 0, 100);
    grd_bottom.addColorStop(1, '#302F39')
    grd_bottom.addColorStop(0, '#000913')
    ctx_bottom.setFillStyle(grd_bottom)
    ctx_bottom.fillRect(0, 10, 5, 167.5)
    ctx_bottom.draw()

    const ctx_left = wx.createCanvasContext('canvas-gradient-left');
    const grd_left = ctx_left.createLinearGradient(0, 0, 200, 0);
    grd_left.addColorStop(0, '#302F39')
    grd_left.addColorStop(1, '#000913')
    ctx_left.setFillStyle(grd_left)
    ctx_left.fillRect(0, 0, 167.5, 5)
    ctx_left.draw()

    const ctx_right = wx.createCanvasContext('canvas-gradient-right');
    const grd_right = ctx_right.createLinearGradient(0, 0, 200, 0);
    grd_right.addColorStop(1, '#302F39')
    grd_right.addColorStop(0, '#000913')
    ctx_right.setFillStyle(grd_right)
    ctx_right.fillRect(0, 0, 167.5, 5)
    ctx_right.draw()
  }

})