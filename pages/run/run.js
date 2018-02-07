// pages/run/run.js
var app = getApp();
var util = require('../../utils/util.js');
import tips from '../../utils/tips.js'
Page({
  data: {
    userInfo: wx.getStorageSync('userInfo'),
    answer:['四','字','成','语'],
    option:['选','择','私','自','成','语','选','项','很','多','随','便','选','了'],
    second:20
  },
  onLoad: function (options) {
    console.log('options:', options);
      this.setData({
        houseImg: options.houseImg,
        houseName: options.houseName,
        otherImg: options.otherImg,
        otherName: options.otherName
      })
  },
  onReady: function () {

  },
  onShow: function () {
    let that = this;
    let second = that.data.second;
    that.setData({
      userInfo: wx.getStorageSync('userInfo'),
      question_list: wx.getStorageSync('userInfo')
    })
    // 
    // var inter = setInterval(function () {
    //   if (second <= 1) {
    //     clearInterval(inter);
    //   }
    //   second--;
    //   console.log(second);
    //   that.setData({
    //     second,
    //     inter
    //   })
    // }, 1000)
  },



})