var data = require('../../../data/daily.js');

const context_line = wx.createCanvasContext('line-canvas');

// 画布宽度，与CSS中定义等值
var canvasWidth = 355;
// 画布高度，与CSS中定义等值
var canvasHeight = 200;

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

Page({
  data: {
    visitTrendList: [],
  },

  onLoad: function () {
    this.loadForVisitTrend();
  },

  loadForVisitTrend: function () {
    this.data.visitTrendList = data.visitTrend;
    this.drawVisitUvLine(this.data.visitTrendList);
    this.drawVisitUvDot(this.data.visitTrendList);
    this.drawVisitUvnLine(this.data.visitTrendList);
    this.drawVisitUvnDot(this.data.visitTrendList);
    this.drawVisitBackground();
    this.drawDate(this.data.visitTrendList);
    context_line.draw();
  },
  
  /* 画访问人数的折线 */
  drawVisitUvLine: function (list) {
    list.forEach(function (data, i, array) {
      if (data.visit_uv > maxUV) {
        maxUV = data.visit_uv;
      }
    });

    ratioX = (canvasWidth - 15) / list.length;
    ratioY = (canvasHeight - 40) / maxUV;

    list.forEach(function (data, i, array) {
      if (i < array.length - 1) {
        // 当前点坐标
        var currentPoint = {
          x: i * ratioX + 20,
          y: (canvasHeight - data.visit_uv * ratioY) - 20
        };
        // 下一个点坐标
        var nextPoint = {
          x: (i + 1) * ratioX + 20,
          y: (canvasHeight - array[i + 1].visit_uv * ratioY) - 20
        }
        // 开始
        context_line.beginPath();
        // 移动到当前点
        context_line.moveTo(currentPoint.x, currentPoint.y);
        // 画线到下个点
        context_line.lineTo(nextPoint.x, nextPoint.y);
        // 设置属性
        context_line.setLineWidth(1);
        // 设置颜色
        context_line.setStrokeStyle('white');
        // 描线
        context_line.stroke();
        // 竖直往下，至x轴
        context_line.lineTo(nextPoint.x, canvasHeight - 20);
        // 水平往左，至上一个点的在x轴的垂点
        context_line.lineTo(currentPoint.x, canvasHeight - 20);
        // 设置淡紫色
        context_line.setFillStyle('#27A5C2');
        // 实现闭合与x轴之前的区域
        context_line.fill();
      }
    });
  },
  /* 画访问人数的圆圈 */
  drawVisitUvDot: function (list) {
    list.forEach(function (data, i, array) {
      // 当前点坐标
      var currentPoint = {
        x: i * ratioX + 20,
        y: (canvasHeight - data.visit_uv * ratioY) - 20
      };
      context_line.beginPath();
      context_line.arc(currentPoint.x, currentPoint.y, 2, 0, 2 * Math.PI);
      context_line.setStrokeStyle('#05DBCE');
      context_line.setFillStyle('white');
      context_line.stroke();
      context_line.fill();
    });
  },
  /* 画新用户数的折线 */
  drawVisitUvnLine: function (list) {
    list.forEach(function (data, i, array) {
      if (data.visit_uv > maxUV) {
        maxUV = data.visit_uv_new;
      }
    });
    ratioX = (canvasWidth - 15) / list.length;
    ratioY = (canvasHeight - 40) / maxUV;
    list.forEach(function (data, i, array) {
      if (i < array.length - 1) {
        // 当前点坐标
        var currentPoint = {
          x: i * ratioX + 20,
          y: (canvasHeight - data.visit_uv_new * ratioY) - 20
        };
        // 下一个点坐标
        var nextPoint = {
          x: (i + 1) * ratioX + 20,
          y: (canvasHeight - array[i + 1].visit_uv_new * ratioY) - 20
        }
        // 开始
        context_line.beginPath();
        // 移动到当前点
        context_line.moveTo(currentPoint.x, currentPoint.y);
        // 画线到下个点
        context_line.lineTo(nextPoint.x, nextPoint.y);
        // 设置属性
        context_line.setLineWidth(1);
        // 设置颜色
        context_line.setStrokeStyle('#1E3A50');
        // 描线
        context_line.stroke();
        // 竖直往下，至x轴
        context_line.lineTo(nextPoint.x, canvasHeight - 20);
        // 水平往左，至上一个点的在x轴的垂点
        context_line.lineTo(currentPoint.x, canvasHeight - 20);
        // 设置淡紫色
        context_line.setFillStyle('#1E3A50');
        // 实现闭合与x轴之前的区域
        context_line.fill();
      }
    });
  },
  /* 画新用户数的圆点 */
  drawVisitUvnDot: function (list) {
    list.forEach(function (data, i, array) {
      // 当前点坐标
      var currentPoint = {
        x: i * ratioX + 20,
        y: (canvasHeight - data.visit_uv_new * ratioY) - 20
      };
      context_line.beginPath();
      context_line.arc(currentPoint.x, currentPoint.y, 2, 0, 2 * Math.PI);
      context_line.setStrokeStyle('#191970');
      context_line.setFillStyle('white');
      context_line.stroke();
      context_line.fill();
    });
  },
  /* 画横向参照线 */
  drawVisitBackground: function () {
    var lineCount = 5;
    var estimateRatio = 2;
    var ratio = (canvasHeight + 15) / lineCount;
    var maxPeople = ((Math.floor(Math.floor(148 / 10) / 4) + 1) * 4) * 10;
    for (var i = 0; i < lineCount; i++) {
      context_line.beginPath();
      var currentPoint = {
        x: 20,
        y: (canvasHeight - i * ratio) - 20
      };
      // 移动到原点
      context_line.moveTo(currentPoint.x, currentPoint.y);
      // 向Y正轴方向画线
      context_line.lineTo(canvasWidth - 5, (canvasHeight - i * ratio) - 20);
      // 设置属性
      context_line.setLineWidth(1);
      // 设置颜色
      context_line.setStrokeStyle(lightGray);
      context_line.stroke();
      // 标注数值
      context_line.setFillStyle(gray);
      // 底部时间文字
      context_line.fillText(i * maxPeople / (lineCount - 1), currentPoint.x - 20, currentPoint.y);
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
          context_line.fillText(ref_date, i * ratioX + 5, canvasHeight);
        }
      }
    });
  }
})
