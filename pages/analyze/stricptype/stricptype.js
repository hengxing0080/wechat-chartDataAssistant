var data = require('../../../data/daily.js');

const context_striptype = wx.createCanvasContext('striptype-canvas');

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

Page({
  data: {
    canvasHeight_striptype: 200, // 条形图的画布高度
    visitDistrictForSourceList: [],
  },

  onLoad: function () {
    this.loadForVisitDistribution();
  },

  loadForVisitDistribution: function () {
    this.drawScriptType(data.visitDistribution);
  },

  drawScriptType: function (list) {
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

    // 画左侧文字
    var source = '';
    var maxStringLenth = 0;
    context_striptype.setFillStyle('#5A8DA7');
    context_striptype.setFontSize(12);
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
      context_striptype.fillText(source, 0, i * ratioY + 20);
      if (source.toString().length > maxStringLenth) {
        maxStringLenth = source.toString().length;
      }
    });

    // 画竖线
    context_striptype.beginPath();
    context_striptype.setStrokeStyle(gray);
    context_striptype.setLineWidth(1);
    context_striptype.moveTo(maxStringLenth * 13, canvasHeight);
    context_striptype.lineTo(maxStringLenth * 13, 10);
    context_striptype.stroke();

    // 画条形图和数量
    context_striptype.setFillStyle('#00EFFE');
    context_striptype.setFontSize(12);
    list.forEach(function (data, i, array) {
      context_striptype.fillRect(maxStringLenth * 13 + 1, i * ratioY + 11, data.value < 200 ? data.value : 200, 10)
      context_striptype.fillText(data.value, maxStringLenth * 13 + 5 + (data.value < 200 ? data.value : 200), i * ratioY + 20);
    });

    // 画百分比
    var totalSouce = 0;
    list.forEach(function (data, i, array) {
      totalSouce += data.value;
    });
    context_striptype.setFillStyle('white');
    list.forEach(function (data, i, array) {
      context_striptype.fillText(((Math.floor(data.value * 10000 / totalSouce) / 100).toFixed(1) + '%'),
        maxStringLenth * 13 + 30 + (data.value < 200 ? data.value : 200),
        i * ratioY + 20);
    });

    // 画出来
    context_striptype.draw();
  }
})
