var dimen = require("../../../utils/dimen.js");
var data = require('../../../data/daily.js');

const context_line = wx.createCanvasContext('line-canvas');

var canvasWidth_line = 0;
var canvasHeight_line = 0;

// x轴放大倍数
var ratioX = 12.4;
// y轴放大倍数
var ratioY = 4;

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

// 最大访问人数
var maxUV = 0;

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
  data: {
    visitTrendList: [],
  },

  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        dimen.init(res.windowWidth);
        canvasWidth_line = dimen.rpx2px(710);    // 折线图的画布宽度
        canvasHeight_line = dimen.rpx2px(400);   // 折线图的画布高度
      }
    });

    this.loadForVisitTrend();
  },

  loadForVisitTrend: function () {
    var that = this;
    this.data.visitTrendList = data.visitTrend;
    var list = this.data.visitTrendList;

    this.drawVisitBackground();
    this.drawDate(this.data.visitTrendList);
    this.draw();

    this.Animation({
      timing: 'easeIn',
      duration: 1000,
      onProcess: function onProcess(process) {
        that.drawVisitUvLine(list, count);
        that.drawVisitUvDot(list, count);
        that.drawVisitUvnLine(list, count);
        that.drawVisitUvnDot(list, count);
        that.draw();
        count++;
      },
      onAnimationFinish: function onAnimationFinish() {
        count = 0;
      }
    });
  },

  /* 画访问人数的折线 */
  drawVisitUvLine: function (list, count) {
    list.forEach(function (data, i, array) {
      if (data.visit_uv > maxUV) {
        maxUV = data.visit_uv;
      }
    });

    ratioX = (canvasWidth_line - dimen.rpx2px(30)) / list.length;
    ratioY = (canvasHeight_line - dimen.rpx2px(80)) / maxUV;

    if (count < list.length - 1) {
      // 当前点坐标
      var currentPoint = {
        x: count * ratioX + dimen.rpx2px(40),
        y: (canvasHeight_line - list[count].visit_uv * ratioY) - dimen.rpx2px(40)
      };
      // 下一个点坐标
      var nextPoint = {
        x: (count + dimen.rpx2px(2)) * ratioX + dimen.rpx2px(40),
        y: (canvasHeight_line - list[count + 1].visit_uv * ratioY) - dimen.rpx2px(40)
      }

      // 开始路径
      context_line.beginPath();

      // 画线：移动到当前点
      context_line.moveTo(currentPoint.x, currentPoint.y);
      // 画线：画线到下个点
      context_line.lineTo(nextPoint.x, nextPoint.y);
      // 设置线宽度
      context_line.setLineWidth(dimen.rpx2px(2));
      // 设置线颜色
      context_line.setStrokeStyle('white');
      // 描线
      context_line.stroke();

      // 填充内容：竖直往下，至x轴
      context_line.lineTo(nextPoint.x, canvasHeight_line - dimen.rpx2px(40));
      // 填充内容：水平往左，至上一个点的在x轴的垂点
      context_line.lineTo(currentPoint.x, canvasHeight_line - dimen.rpx2px(40));
      // 设置填充颜色
      context_line.setFillStyle('#27A5C2');

      // 实现闭合与x轴之前的区域
      context_line.fill();
    }
  },
  /* 画访问人数的圆圈 */
  drawVisitUvDot: function (list, count) {
    if (count < list.length) {
      // 当前点坐标
      var currentPoint = {
        x: count * ratioX + dimen.rpx2px(40),
        y: (canvasHeight_line - list[count].visit_uv * ratioY) - dimen.rpx2px(40)
      };

      context_line.beginPath();
      context_line.arc(currentPoint.x, currentPoint.y, 2, 0, 2 * Math.PI);
      context_line.setStrokeStyle('#05DBCE');
      context_line.setFillStyle('white');
      context_line.stroke();
      context_line.fill();
    }
  },
  /* 画新用户数的折线 */
  drawVisitUvnLine: function (list, count) {
    list.forEach(function (data, i, array) {
      if (data.visit_uv > maxUV) {
        maxUV = data.visit_uv_new;
      }
    });

    ratioX = (canvasWidth_line - dimen.rpx2px(30)) / list.length;
    ratioY = (canvasHeight_line - dimen.rpx2px(80)) / maxUV;

    if (count < list.length - 1) {
      var currentPoint = {
        x: count * ratioX + dimen.rpx2px(40),
        y: (canvasHeight_line - list[count].visit_uv_new * ratioY) - dimen.rpx2px(40)
      };
      var nextPoint = {
        x: (count + dimen.rpx2px(2)) * ratioX + dimen.rpx2px(40),
        y: (canvasHeight_line - list[count + 1].visit_uv_new * ratioY) - dimen.rpx2px(40)
      }
      context_line.beginPath();
      context_line.moveTo(currentPoint.x, currentPoint.y);
      context_line.lineTo(nextPoint.x, nextPoint.y);
      context_line.setLineWidth(dimen.rpx2px(2));
      context_line.setStrokeStyle('#1E3A50');
      context_line.stroke();
      context_line.lineTo(nextPoint.x, canvasHeight_line - dimen.rpx2px(40));
      context_line.lineTo(currentPoint.x, canvasHeight_line - dimen.rpx2px(40));
      context_line.setFillStyle('#1E3A50');
      context_line.fill();
    }
  },
  /* 画新用户数的圆点 */
  drawVisitUvnDot: function (list, count) {
    if (count < list.length) {
      var currentPoint = {
        x: count * ratioX + dimen.rpx2px(40),
        y: (canvasHeight_line - list[count].visit_uv_new * ratioY) - dimen.rpx2px(40)
      };
      context_line.beginPath();
      context_line.arc(currentPoint.x, currentPoint.y, 2, 0, 2 * Math.PI);
      context_line.setStrokeStyle('#191970');
      context_line.setFillStyle('white');
      context_line.stroke();
      context_line.fill();
    }
  },
  /* 画横向参照线 */
  drawVisitBackground: function () {
    var lineCount = 5;
    var estimateRatio = 2;
    var ratio = (canvasHeight_line + dimen.rpx2px(30)) / lineCount;
    var maxPeople = ((Math.floor(Math.floor(148 / 10) / 4) + 1) * 4) * 10;
    for (var i = 0; i < lineCount; i++) {
      context_line.beginPath();
      var currentPoint = {
        x: dimen.rpx2px(40),
        y: (canvasHeight_line - i * ratio) - dimen.rpx2px(40)
      };
      // 移动到原点
      context_line.moveTo(currentPoint.x, currentPoint.y);
      // 向Y正轴方向画线
      context_line.lineTo(canvasWidth_line - dimen.rpx2px(10), (canvasHeight_line - i * ratio) - dimen.rpx2px(40));
      // 设置属性
      context_line.setLineWidth(dimen.rpx2px(2));
      // 设置颜色
      context_line.setStrokeStyle(lightGray);
      context_line.stroke();
      // 标注数值
      context_line.setFillStyle(gray);
      // 底部时间文字
      context_line.fillText(i * maxPeople / (lineCount - 1), currentPoint.x - dimen.rpx2px(40), currentPoint.y);
    }
  },
  /* 画底部日期 */
  drawDate: function (list) {
    var ref_date = "";
    var temp_ref_date1 = "";
    var temp_ref_date2 = "";

    list.forEach(function (data, i, array) {
      if (i < array.length - 1) {
        context_line.setFillStyle(gray);

        ref_date = data.ref_date.toString();
        temp_ref_date1 = ref_date.substring(4, 6) + ".";
        temp_ref_date2 = ref_date.substring(6, ref_date.length);
        ref_date = temp_ref_date1 + temp_ref_date2;

        if (i % 4 == 0) {
          context_line.fillText(ref_date, i * ratioX + dimen.rpx2px(10), canvasHeight_line - dimen.rpx2px(10));
        }
      }
    });
  },

  // 画
  draw: function () {
    context_line.draw(true);
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
