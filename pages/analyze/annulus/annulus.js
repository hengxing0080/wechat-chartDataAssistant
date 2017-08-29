var data = require('../../../data/daily.js');
var dimen = require("../../../utils/dimen.js");

const context_gender = wx.createCanvasContext('gender-canvas');

var colorMale = '#7587DB';
var colorFemale = '#00C5DC';
var colorUnknown = '#FFAA00';

Page({
  data: {},

  onLoad: function () {
    wx.getSystemInfo({
      success: function (res) {
        dimen.init(res.windowWidth);
      }
    });

    this.loadForUserGender();
  },

  loadForUserGender: function () {
    this.drawAnnulus(data.userPortraitForGender);
  },

  drawAnnulus: function (list) {
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

    this.drawAnnulusMan(malePercent);
    this.drawAnnulusFemail(malePercent, femalePercent)
    this.drawAnnulusUnknown(malePercent, femalePercent, unknownPercent)
    this.drawRightText(malePercent, femalePercent, unknownPercent, maleGender, femaleGender, unknownGender);
    this.draw();

    context_gender.draw(true);
  },

  // 画性别男圆形
  drawAnnulusMan: function (malePercent) {
    context_gender.beginPath();
    context_gender.setStrokeStyle(colorMale);
    context_gender.setFillStyle(colorMale);
    context_gender.arc(
      dimen.rpx2px(150),
      dimen.rpx2px(150),
      50,
      0,
      2 * Math.PI * malePercent);
    context_gender.lineTo(
      dimen.rpx2px(150) + dimen.rpx2px(100) * Math.cos(2 * Math.PI * malePercent),
      dimen.rpx2px(150) + dimen.rpx2px(100) * Math.sin(2 * Math.PI * malePercent));
    context_gender.arc(
      dimen.rpx2px(150),
      dimen.rpx2px(150),
      25,
      2 * Math.PI * malePercent,
      0,
      true);
    context_gender.lineTo(
      dimen.rpx2px(300),
      dimen.rpx2px(150));
    context_gender.fill();
    context_gender.closePath();
  },

  // 画性别女圆形
  drawAnnulusFemail: function (malePercent, femalePercent) {
    context_gender.beginPath();
    context_gender.setStrokeStyle(colorFemale);
    context_gender.setFillStyle(colorFemale);
    context_gender.arc(
      dimen.rpx2px(150),
      dimen.rpx2px(150),
      50,
      2 * Math.PI * malePercent,
      2 * Math.PI * (femalePercent + malePercent));
    context_gender.lineTo(
      dimen.rpx2px(150) + dimen.rpx2px(100) * Math.cos(2 * Math.PI * (femalePercent + malePercent)),
      dimen.rpx2px(150) + dimen.rpx2px(100) * Math.sin(2 * Math.PI * (femalePercent + malePercent)));
    context_gender.arc(
      dimen.rpx2px(150),
      dimen.rpx2px(150),
      25,
      2 * Math.PI * (femalePercent + malePercent),
      2 * Math.PI * malePercent,
      true);
    context_gender.lineTo(
      dimen.rpx2px(150) + dimen.rpx2px(100) * Math.cos(2 * Math.PI * (malePercent)),
      dimen.rpx2px(150) + dimen.rpx2px(100) * Math.sin(2 * Math.PI * (malePercent)));
    context_gender.fill();
    context_gender.closePath();
  },

  // 画性别未知圆形
  drawAnnulusUnknown: function (malePercent, femalePercent, unknownPercent) {
    context_gender.beginPath();
    context_gender.setStrokeStyle(colorUnknown);
    context_gender.setFillStyle(colorUnknown);
    context_gender.arc(
      dimen.rpx2px(150),
      dimen.rpx2px(150),
      50,
      2 * Math.PI * (malePercent + femalePercent),
      2 * Math.PI * (femalePercent + malePercent + unknownPercent));
    context_gender.lineTo(
      dimen.rpx2px(150) + dimen.rpx2px(100) * Math.cos(2 * Math.PI * (femalePercent + malePercent + unknownPercent)),
      dimen.rpx2px(150) + dimen.rpx2px(100) * Math.sin(2 * Math.PI * (femalePercent + malePercent + unknownPercent)));
    context_gender.arc(
      dimen.rpx2px(150),
      dimen.rpx2px(150),
      25,
      2 * Math.PI * (femalePercent + malePercent + unknownPercent),
      2 * Math.PI * (malePercent + femalePercent),
      true);
    context_gender.lineTo(
      dimen.rpx2px(150) + dimen.rpx2px(100) * Math.cos(2 * Math.PI * (malePercent + femalePercent)),
      dimen.rpx2px(150) + dimen.rpx2px(100) * Math.sin(2 * Math.PI * (malePercent + femalePercent)));
    context_gender.fill();
    context_gender.closePath();
  },

  // 画右侧性别颜色参考文字统计区域
  drawRightText: function (malePercent, femalePercent, unknownPercent, maleGender, femaleGender, unknownGender) {
    context_gender.setFontSize(dimen.rpx2px(26));
    context_gender.setFillStyle(colorMale);
    context_gender.fillRect(
      dimen.rpx2px(300),
      dimen.rpx2px(96),
      dimen.rpx2px(24),
      dimen.rpx2px(24));
    context_gender.setFillStyle('white');
    context_gender.fillText(
      '男   ' + maleGender + '  ' + ((malePercent * 100).toFixed(1)) + '%',
      dimen.rpx2px(350),
      dimen.rpx2px(120));
    context_gender.setFillStyle(colorFemale);
    context_gender.fillRect(
      dimen.rpx2px(300),
      dimen.rpx2px(136),
      dimen.rpx2px(24),
      dimen.rpx2px(24));
    context_gender.setFillStyle('white');
    context_gender.fillText(
      '女   ' + femaleGender + (femaleGender.toString().length == 1 ? '   ' : '  ') + ((femalePercent * 100).toFixed(1)) + '%',
      dimen.rpx2px(350),
      dimen.rpx2px(160));
    context_gender.setFillStyle(colorUnknown);
    context_gender.fillRect(
      dimen.rpx2px(300),
      dimen.rpx2px(176),
      dimen.rpx2px(24),
      dimen.rpx2px(24));
    context_gender.setFillStyle('white');
    context_gender.fillText(
      '未知 ' + unknownGender + (unknownGender.toString().length == 1 ? '   ' : '  ') + ((unknownPercent * 100).toFixed(1)) + '%',
      dimen.rpx2px(350),
      dimen.rpx2px(200));
  },

  // 画
  draw: function () {
    context_gender.draw(true);
  }
})