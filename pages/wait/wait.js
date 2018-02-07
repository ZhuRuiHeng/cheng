// pages/wait/wait.js
var app = getApp();
var util = require('../../utils/util.js');
import tips from '../../utils/tips.js';
var socketOpen = false;
var socketMsgQueue = [];
Page({
  data: {
    userInfo: wx.getStorageSync('userInfo'),
    socketOpen:false
  },
  onLoad: function (options) {
    console.log('options', options);
    let that = this;
    that.setData({
      room_id: options.room_id,
    })
  },
  onReady: function () {

  },
  onShow: function () {
    let that = this;
    that.setData({
      userInfo: wx.getStorageSync('userInfo'),
    });
    // 转发成功 好友发起pk
    wx.request({
      url: app.data.apiurl + "guessipk/create-pk?sign=" + wx.getStorageSync('sign') + '&operator_id=' + wx.getStorageSync("kid"),
      data: {
        guess_type: '	idiom'
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("发起pk链接websocket:", res);
        that.setData({
          keyword: res.data.data
        })
        //发送websocket
        //util.socketBtnTap();
        if (!socketOpen) {
          wx.connectSocket({
            url: 'ws://139.199.67.245:9461?mid=' + wx.getStorageSync('mid')
          })
          wx.onSocketError(function (res) {
            socketOpen = false
            console.log('WebSocket连接打开失败，请检查！')
            that.setData({
              socketOpen: false
            })
            wx.hideToast()
          })
          wx.onSocketOpen(function (res) {
            console.log('WebSocket连接已打开！')
            wx.hideToast()
            that.setData({
              socketOpen : true
            })
            
            // for (var i = 0; i < socketMsgQueue.length; i++) {
            //   that.sendSocketMessage(socketMsgQueue[i])
            // }
            // socketMsgQueue = []
          })
          wx.onSocketMessage(function (res) {
            console.log('收到服务器内容：' + res.data)
          })
          wx.onSocketClose(function (res) {
            console.log('WebSocket 已关闭！')
            wx.hideToast()
            that.setData({
              socketOpen : false
            })
          })
        } else {
          //wx.closeSocket()
          wx.onSocketMessage(function (res) {
            console.log('收到服务器内容：' + res.data)
          })
          wx.onSocketOpen(function (res) {
            console.log('WebSocket连接已打开！')
            wx.hideToast()
            that.setData({
              socketOpen : true
            })
          })
        }

      }
    })
  },
  // 保存formid
  formSubmit(e) {
    let that = this;
    util.formSubmit(e);
  },


})