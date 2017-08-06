var data = require('../../../data/daily.js');

const context_age = wx.createCanvasContext('age-canvas');

// 画布宽度，与CSS中定义等值
var canvasWidth = 355;
// 画布高度，与CSS中定义等值
var canvasHeight = 200;

// x轴放大倍数
var ratioX = 30;

var royalBlue = '#4169E1';
var gray = '#cccccc';

Page({
  data: {},

  onLoad: function () {
    this.loadForUserAge();
  },

  loadForUserAge: function () {
    this.drawAge(data.userPortraitForAge);
  },

  drawAge: function (list) {
    // 计算x轴放大倍数
    ratioX = canvasWidth / list.length;

    // 计算全部年龄总和
    var totalAge = 0;
    list.forEach(function (data, i, array) {
      totalAge += data.value;
    });

    // 画总年龄百分比
    context_age.setFillStyle('white');
    context_age.setFontSize(12);
    list.forEach(function (data, i, array) {
      context_age.fillText((Math.floor(data.value * 10000 / totalAge) / 100 + '%'), i * ratioX + (i == 0 ? 25 : 15), (canvasHeight - 40 + (-data.value * 4)));
    });

    // 画柱状图和数量
    context_age.setFillStyle(royalBlue);
    context_age.setFontSize(12);
    list.forEach(function (data, i, array) {
      context_age.fillText(data.value, i * ratioX + (i == 0 ? 25 : 15), (canvasHeight - 25 + (-data.value * 4)));
      context_age.fillRect(i * ratioX + (i == 0 ? 15 : 7), canvasHeight - 20, 25, -data.value * 4)
    });

    // 画线
    context_age.beginPath();
    context_age.setStrokeStyle(gray);
    context_age.setLineWidth(1);
    context_age.moveTo(0, canvasHeight - 20);
    context_age.lineTo(canvasWidth, canvasHeight - 20);
    context_age.stroke();  // 这行必须要写，不然线就出不来

    // 画年龄文字
    context_age.setFillStyle('white');
    context_age.setFontSize(12);
    list.forEach(function (data, i, array) {
      context_age.fillText(data.name, i * ratioX + (i == 0 ? 15 : 0), canvasHeight - 5);
    });

    context_age.draw();
  }

})