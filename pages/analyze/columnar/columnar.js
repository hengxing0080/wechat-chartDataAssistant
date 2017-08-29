var data = require('../../../data/daily.js');
var dimen = require("../../../utils/dimen.js");

const context_age = wx.createCanvasContext('age-canvas');

var canvasWidth = 0;
var canvasHeight = 0;

var ratioX = 0; // x轴放大倍数
var ratioY = 0; // y轴放大倍数

var royalBlue = '#4169E1';
var gray = '#cccccc';

var count = 0;

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
  data: {},

  onLoad: function () {
    wx.getSystemInfo({
      success: function (res) {
        dimen.init(res.windowWidth);
        canvasWidth = dimen.rpx2px(710);
        canvasHeight = dimen.rpx2px(400);
      }
    });

    this.loadForUserAge();
  },

  loadForUserAge: function () {
    this.drawAge(data.userPortraitForAge);
  },

  drawAge: function (list) {
    var that = this;
    ratioX = canvasWidth / list.length; // 计算x轴放大倍数

    this.drawLine(list);
    this.drawText(list);

    this.Animation({
      timing: 'easeIn',
      duration: 1000,
      onProcess: function onProcess(process) {
        console.log(process + ', 次数：'+count);
        count++;
        that.drawColumn(list, process);
        that.draw();
      },
      onAnimationFinish: function onAnimationFinish() {
        that.drawColumnNumber(list);
        that.drawPercent(list);
        that.draw();
      }
    });
  },

  // 画总年龄百分比
  drawPercent: function (list) {
    // 计算全部年龄总和
    var totalAge = 0;
    list.forEach(function (data, i, array) {
      totalAge += data.value;
    });

    context_age.setFillStyle('white');
    context_age.setFontSize(dimen.rpx2px(24));
    list.forEach(function (data, i, array) {
      context_age.fillText(
        Math.floor(data.value * 10000 / totalAge) / 100 + '%',
        i * ratioX + (i == 0 ? dimen.rpx2px(50) : dimen.rpx2px(30)),
        canvasHeight - dimen.rpx2px(80) + (-data.value * dimen.rpx2px(8)));
    });
  },

  // 画柱状图 
  drawColumn: function (list, process) {
    context_age.setFillStyle(royalBlue);
    list.forEach(function (data, i, array) {
      var height = - data.value * dimen.rpx2px(8);
      height *= process;
      context_age.fillRect(
        i * ratioX + (i == 0 ? dimen.rpx2px(30) : dimen.rpx2px(14)),
        canvasHeight - dimen.rpx2px(40),
        dimen.rpx2px(50), height)
    });
  },

  // 画柱状图上面的年龄
  drawColumnNumber: function (list) {
    context_age.setFillStyle(royalBlue);
    context_age.setFontSize(dimen.rpx2px(24));
    list.forEach(function (data, i, array) {
      context_age.fillText(
        data.value, 
        i * ratioX + (i == 0 ? dimen.rpx2px(50) : dimen.rpx2px(30)), 
        canvasHeight - dimen.rpx2px(50) + (-data.value * dimen.rpx2px(8)));
    });
  },

  // 画线
  drawLine: function (list) {
    context_age.beginPath();
    context_age.setStrokeStyle(gray);
    context_age.setLineWidth(dimen.rpx2px(2));
    context_age.moveTo(0, canvasHeight - dimen.rpx2px(40));
    context_age.lineTo(canvasWidth, canvasHeight - dimen.rpx2px(40));
    context_age.stroke();  // 这行必须要写，不然线就出不来
  },

  // 画年龄文字
  drawText: function (list) {
    context_age.setFillStyle(gray);
    context_age.setFontSize(dimen.rpx2px(24));
    list.forEach(function (data, i, array) {
      context_age.fillText(
        data.name, 
        i * ratioX + (i == 0 ? dimen.rpx2px(30) : 0), 
        canvasHeight - dimen.rpx2px(10));
    });
  },

  // 画
  draw: function () {
    context_age.draw(true);
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