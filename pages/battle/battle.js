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
        usepoint: options.usepoint,
        rank_id: options.rank_id
      })
  },
  onReady: function () {
  
  },
  onShow: function () {
      let that = this;
      that.setData({
        userInfo: wx.getStorageSync('userInfo'),
      })
      wx.request({
        url: app.data.apiurl + "guessipk/match?sign=" + wx.getStorageSync('sign') + '&operator_id=' + wx.getStorageSync("kid"),
        data: {
          guess_type: 'idiom',
          rank_id: that.data.rank_id
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("提示信息:", res);
          var status = res.data.status;
          if (status == 1) {
            that.setData({
              list: res.data.data
            })
          } else {
            console.log(res.data.msg)
          }
        }
      })
  },


})