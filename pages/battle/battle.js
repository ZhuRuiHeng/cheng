// pages/battle/battle.js
var app = getApp();
var util = require('../../utils/util.js');
import tips from '../../utils/tips.js'
Page({
  data: {
    userInfo: wx.getStorageSync('userInfo'),
  },
  onLoad: function (options) {
    console.log('options:', options);
      this.setData({
        usepoint: options.usepoint
      })
  },
  onReady: function () {
  
  },
  onShow: function () {
      let that = this;
      that.setData({
        userInfo: wx.getStorageSync('userInfo'),
      })
      setTimeout(function(){
            
      },1000)
  },


})