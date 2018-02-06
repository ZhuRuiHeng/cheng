// pages/wait/wait.js
var app = getApp();
var util = require('../../utils/util.js');
import tips from '../../utils/tips.js';
var socketOpen = false;
var socketMsgQueue = [];
Page({
  data: {
    userInfo: wx.getStorageSync('userInfo'),
    socktBtnTitle: '连接socket'
  },
  onLoad: function (options) {
    app.getAuth(function () { })
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
    if (!wx.getStorageSync('sign')){
      app.getAuth(function () {
          wx.request({
            url: app.data.apiurl + "guessipk/enter-friend-room?sign=" + wx.getStorageSync('sign') + '&operator_id=' + wx.getStorageSync("kid"),
            data: {
              guess_type: '	idiom',
              room_id: that.data.room_id
            },
            header: {
              'content-type': 'application/json'
            },
            method: "GET",
            success: function (res) {
              console.log("好友发起pkl链接websocket:", res);
              that.setData({
                keyword: res.data.data
              })
              //发送websocket
              //util.socketBtnTap();
              var remindTitle = socketOpen ? '正在关闭' : '正在连接'
              wx.showToast({
                title: remindTitle,
                icon: 'loading',
                duration: 10000
              })
              if (!socketOpen) {
                wx.connectSocket({
                  url: 'ws://139.199.67.245:9461'
                })
                wx.onSocketError(function (res) {
                  socketOpen = false
                  console.log('WebSocket连接打开失败，请检查！')
                  that.setData({
                    socktBtnTitle: '连接socket'
                  })
                  wx.hideToast()
                })
                wx.onSocketOpen(function (res) {
                  console.log('WebSocket连接已打开！')
                  wx.hideToast()
                  that.setData({
                    socktBtnTitle: '断开socket'
                  })
                  socketOpen = true
                  for (var i = 0; i < socketMsgQueue.length; i++) {
                    that.sendSocketMessage(socketMsgQueue[i])
                  }
                  socketMsgQueue = []
                })
                wx.onSocketMessage(function (res) {
                  console.log('收到服务器内容：' + res.data)
                })
                wx.onSocketClose(function (res) {
                  socketOpen = false
                  console.log('WebSocket 已关闭！')
                  wx.hideToast()
                  that.setData({
                    socktBtnTitle: '连接socket'
                  })
                })
              } else {
                wx.closeSocket()
              }

            }
          })
      })
    }else{
      wx.request({
        url: app.data.apiurl + "guessipk/enter-friend-room?sign=" + wx.getStorageSync('sign') + '&operator_id=' + wx.getStorageSync("kid"),
        data: {
          guess_type: '	idiom',
          room_id: that.data.room_id
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("好友发起pkl链接websocket:", res);
          that.setData({
            keyword: res.data.data
          })
          //发送websocket
          //util.socketBtnTap();
          var remindTitle = socketOpen ? '正在关闭' : '正在连接'
          wx.showToast({
            title: remindTitle,
            icon: 'loading',
            duration: 10000
          })
          if (!socketOpen) {
            wx.connectSocket({
              url: 'ws://139.199.67.245:9461',
              data: {
                x: '',
                y: ''
              },
              header: {
                'content-type': 'application/json'
              },
              protocols: ['protocol1'],
              method: "GET",
              success: function(res) {
                  console.log(res);
              }
            })
            wx.onSocketError(function (res) {
              socketOpen = false
              console.log('WebSocket连接打开失败，请检查！')
              that.setData({
                socktBtnTitle: '连接socket'
              })
              wx.hideToast()
            })
            wx.onSocketOpen(function (res) {
              console.log('WebSocket连接已打开！')
              wx.hideToast()
              that.setData({
                socktBtnTitle: '断开socket'
              })
              socketOpen = true
              for (var i = 0; i < socketMsgQueue.length; i++) {
                that.sendSocketMessage(socketMsgQueue[i])
              }
              socketMsgQueue = []
            })
            wx.onSocketMessage(function (res) {
              console.log('收到服务器内容：' + res.data)
            })
            wx.onSocketClose(function (res) {
              socketOpen = false
              console.log('WebSocket 已关闭！')
              wx.hideToast()
              that.setData({
                socktBtnTitle: '连接socket'
              })
            })
          } else {
            wx.closeSocket()
          }

        }
      })
    }
  },
  // 保存formid
  formSubmit(e) {
    let that = this;
    // util.formSubmit(e);
  },


})