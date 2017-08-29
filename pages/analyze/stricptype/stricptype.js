var dimen = require("../../../utils/dimen.js");
var data = require('../../../data/daily.js');

const context_striptype = wx.createCanvasContext('striptype-canvas');

// y轴放大倍数
var ratioY = 0;

// 紫色
var purple = '#7E8FDD';
// 浅紫
var lightPurple = '#D6DBF4';
// 灰色
var gray = '#cccccc';
// 浅灰
var lightGray = '#c7cce5';
// 橙色
var orange = '#ffaa00';
// 浅橙色
var lightOrange = '#DAD7DC';
// 板岩暗蓝灰色
var SlateBlue = '#6A5ACD';

var maxStringLenth = 0;

var Timing = {
  easeIn: function easeIn(pos) {
    return Math.pow(pos, 3);
  },

  easeOut: function easeOut(pos) {
    return Math.pow(pos - 1, 3) + 1;
  },

  easeInOut: function easeInOut(pos) {
    if ((pos /= 0.5) < 1) {
      return 0.5 * Math.pow(pos, 3);
    } else {
      return 0.5 * (Math.pow(pos - 2, 3) + 2);
    }
  },

  linear: function linear(pos) {
    return pos;
  }
};

Page({
  data: {
    canvasHeight_striptype: 200, // 条形图的画布高度
    visitDistrictForSourceList: [],
  },

  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        dimen.init(res.windowWidth);
        var height = dimen.rpx2px(400);          // 条形图的画布高度
        that.setData({
          canvasHeight_striptype: height
        });
      }
    });

    this.loadForVisitDistribution();
  },

  loadForVisitDistribution: function () {
    this.drawScricptype(data.visitDistribution);
  },

  drawScricptype: function (list) {
    var that = this;
    var canvasHeight = this.data.canvasHeight_striptype;
    if (list.length > 10) {
      canvasHeight = list.length * 20;
      this.setData({
        canvasHeight_striptype: canvasHeight
      });
      ratioY = (canvasHeight) / list.length;
    } else {
      ratioY = (canvasHeight) / list.length;
    }

    this.drawText(list);
    this.drawLine(canvasHeight);

    this.Animation({
      timing: 'easeIn',
      duration: 1000,
      onProcess: function onProcess(process) {
        that.drawStricptype(list, process);
        that.draw();
      },
      onAnimationFinish: function onAnimationFinish() {
        that.drawStricptypeNum(list);
        that.drawpercent(list);
        that.draw();
      }
    });
  },

  // 画左侧文字
  drawText: function (list){
    var source = '';
    context_striptype.setFillStyle('#5A8DA7');
    context_striptype.setFontSize(dimen.rpx2px(24));
    list.forEach(function (data, i, array) {
      switch (data.key) {
        case 1:
          source = '小程序历史列表';
          break;
        case 2:
          source = '搜索';
          break;
        case 3:
          source = '会话';
          break;
        case 4:
          source = '二维码';
          break;
        case 5:
          source = '公众号主页';
          break;
        case 6:
          source = '聊天顶部';
          break;
        case 7:
          source = '系统桌面';
          break;
        case 8:
          source = '小程序主页';
          break;
        case 9:
          source = '附近的小程序';
          break;
        case 10:
          source = '其他';
          break;
        case 11:
          source = '模板消息';
          break;
        case 12:
          source = '客服消息';
          break;
        case 13:
          source = '公众号菜单';
          break;
        case 14:
          source = 'APP分享';
          break;
        case 15:
          source = '支付完成页';
          break;
        case 16:
          source = '长按识别二维码';
        case 17:
          source = '相册选取二维码';
          break;
        case 18:
          source = '公众号文章';
          break;
        default:
          break;
      }
      context_striptype.fillText(source, 0, i * ratioY + dimen.rpx2px(30));
      if (source.toString().length > maxStringLenth) {
        maxStringLenth = source.toString().length;
      }
    });
  },

  // 画竖线
  drawLine: function (canvasHeight) {
    context_striptype.beginPath();
    context_striptype.setStrokeStyle(gray);
    context_striptype.setLineWidth(dimen.rpx2px(2));
    context_striptype.moveTo(maxStringLenth * dimen.rpx2px(26), canvasHeight);
    context_striptype.lineTo(maxStringLenth * dimen.rpx2px(26), dimen.rpx2px(10));
    context_striptype.stroke();
  },

  // 画条形图
  drawStricptype: function (list, process) {
    context_striptype.setFillStyle('#00EFFE');
    list.forEach(function (data, i, array) {
      var width = data.value < 200 ? data.value : dimen.rpx2px(400);
      width *= process;
      context_striptype.fillRect(
        maxStringLenth * dimen.rpx2px(26) + dimen.rpx2px(2),
        i * ratioY + dimen.rpx2px(12),
        width,
        dimen.rpx2px(20));
    });
  },

  // 画条形图数值
  drawStricptypeNum: function (list) {
    context_striptype.setFontSize(dimen.rpx2px(24));
    list.forEach(function (data, i, array) {
      context_striptype.fillText(data.value,
        maxStringLenth * dimen.rpx2px(26) + dimen.rpx2px(10) + (data.value < 200 ? data.value : dimen.rpx2px(400)),
        i * ratioY + dimen.rpx2px(30));
    });
  },

  // 画百分比
  drawpercent: function (list) {
    var totalSouce = 0;
    list.forEach(function (data, i, array) {
      totalSouce += data.value;
    });
    context_striptype.setFillStyle('white');
    list.forEach(function (data, i, array) {
      context_striptype.fillText(
        (Math.floor(data.value * 10000 / totalSouce) / 100).toFixed(1) + '%',
        maxStringLenth * dimen.rpx2px(26) + dimen.rpx2px(60) + (data.value < 200 ? data.value : dimen.rpx2px(400)),
        i * ratioY + dimen.rpx2px(30));
    });
  },

  // 画
  draw: function () {
    context_striptype.draw(true);
  },

  Animation: function (opts) {
    this.isStop = false;
    opts.duration = typeof opts.duration === 'undefined' ? 1000 : opts.duration;
    opts.timing = opts.timing || 'linear';

    var delay = 17;

    var createAnimationFrame = function createAnimationFrame() {
      if (typeof requestAnimationFrame !== 'undefined') {
        return requestAnimationFrame;
      } else if (typeof setTimeout !== 'undefined') {
        return function (step, delay) {
          setTimeout(function () {
            var timeStamp = +new Date();
            step(timeStamp);
          }, delay);
        };
      } else {
        return function (step) {
          step(null);
        };
      }
    };
    var animationFrame = createAnimationFrame();
    var startTimeStamp = null;
    var _step = function step(timestamp) {
      if (timestamp === null || this.isStop === true) {
        opts.onProcess && opts.onProcess(1);
        opts.onAnimationFinish && opts.onAnimationFinish();
        return;
      }
      if (startTimeStamp === null) {
        startTimeStamp = timestamp;
      }
      if (timestamp - startTimeStamp < opts.duration) {
        var process = (timestamp - startTimeStamp) / opts.duration;
        var timingFunction = Timing[opts.timing];
        process = timingFunction(process);
        opts.onProcess && opts.onProcess(process);
        animationFrame(_step, delay);
      } else {
        opts.onProcess && opts.onProcess(1);
        opts.onAnimationFinish && opts.onAnimationFinish();
      }
    };
    _step = _step.bind(this);

    animationFrame(_step, delay);
  }
})