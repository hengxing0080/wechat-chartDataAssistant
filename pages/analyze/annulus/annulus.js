var data = require('../../../data/daily.js');

const context_gender = wx.createCanvasContext('gender-canvas');

var colorMale = '#7587DB';
var colorFemale = '#00C5DC';
var colorUnknown = '#FFAA00';

Page({
  data: {},

  onLoad: function () {
    this.loadForUserGender();
  },

  loadForUserGender: function () {
    this.drawGender(data.userPortraitForGender);
  },

  drawGender: function (list) {
    // 先算所有性别总数
    var totalGender = 0;
    list.forEach(function (data, i, array) {
      totalGender += data.value;
    });

    var maleGender = 0;       // 性别男总数
    var femaleGender = 0;     // 性别女总数
    var unknownGender = 0;    // 性别未知总数
    var malePercent = 0.0;    // 性别男百分比
    var femalePercent = 0.0;  // 性别女百分比
    var unknownPercent = 0.0; // 性别未知百分比
    list.forEach(function (data, i, array) {
      switch (data.name) {
        case '男':
          maleGender += list[i].value;
          malePercent = list[i].value / totalGender;
          break;
        case '女':
          femaleGender += list[i].value;
          femalePercent = list[i].value / totalGender;
          break;
        case '未知':
          unknownGender += list[i].value;
          unknownPercent = list[i].value / totalGender;
          break;
        default:
          break;
      }
    });

    // 画性别男圆形
    context_gender.beginPath();
    context_gender.setStrokeStyle(colorMale);
    context_gender.setFillStyle(colorMale);
    context_gender.arc(75, 75, 50, 0, (2 * Math.PI * malePercent));
    context_gender.lineTo(75 + 50 * Math.cos(2 * Math.PI * malePercent), 75 + 50 * Math.sin(2 * Math.PI * malePercent));
    context_gender.arc(75, 75, 25, (2 * Math.PI * malePercent), 0, true);
    context_gender.lineTo(150, 75);
    context_gender.fill();
    context_gender.closePath();

    // 画性别女圆形
    context_gender.beginPath();
    context_gender.setStrokeStyle(colorFemale);
    context_gender.setFillStyle(colorFemale);
    context_gender.arc(75, 75, 50, (2 * Math.PI * malePercent), (2 * Math.PI * (femalePercent + malePercent)));
    context_gender.lineTo(75 + 50 * Math.cos(2 * Math.PI * (femalePercent + malePercent)), 75 + 50 * Math.sin(2 * Math.PI * (femalePercent + malePercent)));
    context_gender.arc(75, 75, 25, (2 * Math.PI * (femalePercent + malePercent)), (2 * Math.PI * malePercent), true);
    context_gender.lineTo(75 + 50 * Math.cos(2 * Math.PI * (malePercent)), 75 + 50 * Math.sin(2 * Math.PI * (malePercent)));
    context_gender.fill();
    context_gender.closePath();

    // 画性别未知圆形
    context_gender.beginPath();
    context_gender.setStrokeStyle(colorUnknown);
    context_gender.setFillStyle(colorUnknown);
    context_gender.arc(75, 75, 50, (2 * Math.PI * (malePercent + femalePercent)), (2 * Math.PI * (femalePercent + malePercent + unknownPercent)));
    context_gender.lineTo(75 + 50 * Math.cos(2 * Math.PI * (femalePercent + malePercent + unknownPercent)), 75 + 50 * Math.sin(2 * Math.PI * (femalePercent + malePercent + unknownPercent)));
    context_gender.arc(75, 75, 25, (2 * Math.PI * (femalePercent + malePercent + unknownPercent)), (2 * Math.PI * (malePercent + femalePercent)), true);
    context_gender.lineTo(75 + 50 * Math.cos(2 * Math.PI * (malePercent + femalePercent)), 75 + 50 * Math.sin(2 * Math.PI * (malePercent + femalePercent)));
    context_gender.fill();
    context_gender.closePath();

    // 画右侧性别颜色参考文字统计区域
    context_gender.setFontSize(13)
    context_gender.setFillStyle(colorMale);
    context_gender.fillRect(140, 48, 12, 12)
    context_gender.setFillStyle('white');
    context_gender.fillText('男   ' + maleGender + '  ' + ((malePercent * 100).toFixed(1)) + '%', 160, 60)
    context_gender.setFillStyle(colorFemale);
    context_gender.fillRect(140, 68, 12, 12)
    context_gender.setFillStyle('white');
    context_gender.fillText('女   ' + femaleGender + (femaleGender.toString().length == 1 ? '   ' : '  ') + ((femalePercent * 100).toFixed(1)) + '%', 160, 80)
    context_gender.setFillStyle(colorUnknown);
    context_gender.fillRect(140, 88, 12, 12)
    context_gender.setFillStyle('white');
    context_gender.fillText('未知 ' + unknownGender + (unknownGender.toString().length == 1 ? '   ' : '  ') + ((unknownPercent * 100).toFixed(1)) + '%', 160, 100)

    context_gender.draw();
  }

})