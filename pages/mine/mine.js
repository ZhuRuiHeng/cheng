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
    list: [
      {
        avatarurl: 'http://iph.href.lu/300x300',
        wx_name: '入门新手',
        guess_music_point: 10,
        num: 1
      }, {
        avatarurl: 'http://iph.href.lu/300x300',
        wx_name: '起步熟手',
        guess_music_point: 10,
        num: 1
      }, {
        avatarurl: 'http://iph.href.lu/300x300',
        wx_name: '远航',
        guess_music_point: 10,
        num: 1
      }, {
        avatarurl: 'http://iph.href.lu/300x300',
        wx_name: '远航',
        guess_music_point: 10,
        num: 1
      }, {
        avatarurl: 'http://iph.href.lu/300x300',
        wx_name: '远航',
        guess_music_point: 10,
        num: 1
      },
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
    })
  },



})