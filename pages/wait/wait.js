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
        guess_type:'idiom'
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log('登录密匙', res);
        that.setData({
          key: res.data.data
        })
        var keyword = res.data.data;
        
          wx.connectSocket({
            url: 'ws://139.199.67.245:9461'
          })
          console.log(11111);
          // that.caozuo(that.data.key);
          wx.onSocketOpen(function (ress) {
            console.log('ress:', ress);
            console.log('WebSocket连接已打开111！');
            console.log('已登录发起请求');
            that.sendSocketMessage(keyword);
          })
          wx.onSocketMessage(function (res) {
            console.log('收到服务器内容：' + res.data);
            let result = JSON.parse(res.data);
            console.log(result);
            console.log(result.status);
            if (result.status == 0) {
              // 登录失败
              if (result.msg == '未登陆服务器，请登陆后重试') {
                console.log('未登陆服务器，请登陆后重试');
              }
              tips.alert(result.msg);
              that.setData({
                inform: result.msg
              })
            } else {
              console.log(result);
              if (result.status == 1) {
                console.log('已登录发起请求');
                console.log(app.data.apiurl + "guessipk/create-pk?sign=" + wx.getStorageSync('sign') + '&operator_id=' + wx.getStorageSync("kid") + '&guess_type=idiom' + '&room_id=' + that.data.room_id)
                // 发起pk
                wx.request({
                  url: app.data.apiurl + "guessipk/create-pk?sign=" + wx.getStorageSync('sign') + '&operator_id=' + wx.getStorageSync("kid") + '&guess_type=idiom',
                  data: {
                    guess_type: 'idiom'
                  },
                  header: {
                    'content-type': 'application/json'
                  },
                  method: "GET",
                  success: function (res) {
                    console.log("发起pk链接websocket:", res);
                    var keyword = res.data.data;
                    that.setData({
                      keyword: res.data.data
                    })
                    wx.sendSocketMessage({
                      data: keyword
                    })
                    //that.sendSocketMessage(keyword);
                    wx.onSocketMessage(function (res) {
                      console.log('收到服务器内容：' + res.data)
                    })
                  }
                })
              }

            }
          })
          wx.onSocketError(function (res) {
            socketOpen = false
            console.log('WebSocket连接打开失败，请检查！')
            that.setData({
              socketOpen: false
            })
            wx.hideToast()
          })
          
       }
    })
   
    
  },
  caozuo: function (keyword){
    console.log("caozuo1111");
    let that = this;
    console.log('keyword:', keyword);
    var keyword = keyword;
    wx.onSocketOpen(function (res) {
      console.log('res:', res);
      console.log('WebSocket连接已打开！')
      that.sendSocketMessage(keyword);
      wx.hideToast()
      that.setData({
        socketOpen: true
      })
    })
    wx.onSocketError(function (res) {
      socketOpen = false
      console.log('WebSocket连接打开失败，请检查！')
      that.setData({
        socketOpen: false
      })
      wx.hideToast()
    })
   
    //wx.closeSocket()
    wx.onSocketMessage(function (res) {
      console.log('收到服务器内容：' + res.data);
      let result = JSON.parse(res.data);
      console.log(result);
      console.log(result.status);
      if (result.status == 0) {
        // 登录失败
        if (result.msg == '未登陆服务器，请登陆后重试') {
          console.log('未登陆服务器，请登陆后重试');
          that.sendSocketMessage(keyword);
          
        }
        tips.alert(result.msg);
        that.setData({
          inform: result.msg
        })
      } else {
        console.log(result);
        if (result.status==1){
          console.log('已登录发起请求');
          console.log(app.data.apiurl + "guessipk/create-pk?sign=" + wx.getStorageSync('sign') + '&operator_id=' + wx.getStorageSync("kid") + '&guess_type=idiom' + '&room_id=' + that.data.room_id)
          // 发起pk
          wx.request({
            url: app.data.apiurl + "guessipk/create-pk?sign=" + wx.getStorageSync('sign') + '&operator_id=' + wx.getStorageSync("kid") + '&guess_type=idiom',
            data: {
              guess_type:'idiom'
            },
            header: {
              'content-type': 'application/json'
            },
            method: "GET",
            success: function (res) {
              console.log("发起pk链接websocket:", res);
              var keyword = res.data.data
              that.setData({
                keyword: res.data.data
              })
              that.caozuo(keyword)
            }
          })
        }

      }
    })

    wx.onSocketClose(function (res) {
      tips.alert('好友正在对战或者离开房间');
      console.log('WebSocket 已关闭！')
      wx.hideToast()
      that.setData({
        socketOpen: false
      })
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