// pages/mine/mine.js
var app = getApp();
var util = require('../../utils/util.js');
import tips from '../../utils/tips.js'
Page({
  data: {
    userInfo: wx.getStorageSync('userInfo'),
    friendsList: [
      'http://iph.href.lu/80x80',
      'http://iph.href.lu/80x80',
      'http://iph.href.lu/80x80',
      'http://iph.href.lu/80x80'
    ],
  },
  onLoad: function (options) {
  
  },
  onReady: function () {
  
  },
  onShow: function () {
    let that = this;
    that.setData({
      userInfo: wx.getStorageSync('userInfo'),
      allPoint: wx.getStorageSync('allPoint')
    })
    wx.request({
      url: app.data.apiurl + "guessipk/toll-gate?sign=" + wx.getStorageSync('sign') + '&operator_id=' + wx.getStorageSync("kid"),
      data: {
        guess_type: 'idiom'
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("排位关卡:", res);
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
// 解锁
  unlockTap(e){
    let that = this;
    let num = e.currentTarget.dataset.num;
    let unlock = e.currentTarget.dataset.unlock;
    let usepoint = e.currentTarget.dataset.usepoint;
    if (unlock==true){
          wx.navigateTo({
            url: '../battle/battle?usepoint=' + usepoint +'&rank_id='+num,
          })
    }else{
      wx.request({
        url: app.data.apiurl + "guessipk/unlock-gate?sign=" + wx.getStorageSync('sign') + '&operator_id=' + wx.getStorageSync("kid"),
        data: {
          guess_type: 'idiom',
          num: num
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("解锁:", res);
          var status = res.data.status;
          if (status == 1) {
            
          } else {
            tips.alert(res.data.msg);
          }
        }
      })
    }
  }
})