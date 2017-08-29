/*
注意，使用前需要初始化（传入系统宽度值）
  示例：
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        dimen.init(res.windowWidth);
        canvasWidth = dimen.rpx2px(710); // 必须在初始化后在使用这些函数方法，不然用下列函数算出的值都是错的
        canvasHeight = dimen.rpx2px(400);
      }
    });
  }
*/

var width = 375;
var r = 0.5;  // 比率

function init(w) {
    width = w;
    r = width / 750.0;
}

function px2rpx(px) {
    var rpx = px / r;
    return rpx;
}

function rpx2px(rpx) {
    var px = rpx * r;
    return px;
}

module.exports = {
    init: init,
    px2rpx: px2rpx,
    rpx2px: rpx2px
}