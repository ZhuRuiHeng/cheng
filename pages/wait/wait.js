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
  },
  onReady: function () {

  },
  onShow: function () {
    let that = this;
    that.setData({
      userInfo: wx.getStorageSync('userInfo'),
    });
    // 请求登录密匙连接到socket
    wx.request({
      url: app.data.apiurl + "guessipk/go-socket?sign=" + wx.getStorageSync('sign') + '&operator_id=' + wx.getStorageSync("kid"),
      data: {
        guess_type: '	idiom'
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log('登录密匙', res)
        that.setData({
          key: res.data.data
        })
      }
    })
    // 发起pk
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
          var remindTitle = socketOpen ? '正在关闭' : '正在连接'
          wx.showToast({
            title: remindTitle,
            icon: 'loading',
            duration: 10000
          })
          console.log('ws://139.199.67.245:9461' );
          wx.connectSocket({
            url: 'ws://139.199.67.245:9461'
          })
          wx.onSocketError(function (res) {
            socketOpen = false
            console.log('WebSocket连接打开失败，请检查！')
            that.setData({
              socketOpen: false
            })
            wx.hideToast()
          })
          // 连接到socket

          wx.onSocketOpen(function (res) {
            console.log('WebSocket连接已打开！')
            wx.hideToast()
            that.setData({
              socketOpen : true
            })
            console.log(that.data.key,"key:");
            that.sendSocketMessage(that.data.key);

           // that.sendSocketMessage(that.data.keyword)
            // for (var i = 0; i < socketMsgQueue.length; i++) {
            //  
            // }
            // socketMsgQueue = []
          })
          wx.onSocketMessage(function (res) {
            console.log('收到服务器内容：' + res.data);
            let result = JSON.parse(res.data);
            console.log(result);
            console.log(result.status);
            if (result.status==0){
              // 登录失败
              tips.alert(result.msg);
            }else{
              console.log(result.data)
            }
            // let object = res;
            // var arr = []
            // for(var i in object) {
            //   arr.push(i);
            //   //属性
            //   arr.push(object[i]); //值
            // }
            // console.log(arr);
          })
          wx.onSocketClose(function (res) {
            tips.alert('好友正在对战或者离开房间');
            console.log('WebSocket 已关闭！')
            wx.hideToast()
            that.setData({
              socketOpen : false
            })
          })
        } else {
          //wx.closeSocket()
          wx.onSocketMessage(function (res) {
            console.log('收到服务器内容：' + res.data);
            let object = res;
            var arr = []
            for (var i in object) {
              arr.push(i);
              //属性
              arr.push(object[i]); //值
            }
            console.log(arr);
          })
          wx.onSocketOpen(function (res) {
            console.log('WebSocket连接已打开！')
            wx.hideToast()
            that.setData({
              socketOpen : true
            })
          })
          wx.onSocketClose(function (res) {
            tips.alert('好友正在对战或者离开房间');
            console.log('WebSocket 已关闭！')
            wx.hideToast()
            that.setData({
              socketOpen: false
            })
          })
        }

      }
    })
  },
  sendSocketMessage: function (msg) {
    wx.sendSocketMessage({
      data: msg
    })
  },
  // 保存formid
  formSubmit(e) {
    let that = this;
    util.formSubmit(e);
  },


})