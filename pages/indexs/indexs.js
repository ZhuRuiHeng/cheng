// pages/indexs/indexs.js
var app = getApp();
var socketOpen = false;
var socketMsgQueue = [];
var util = require('../../utils/util.js');
import tips from '../../utils/tips.js'

Page({
  data: {
    userInfo: wx.getStorageSync('userInfo'),
    formNum: 1, //formid
    setting:false,
    bank:false,
    math: Math.random(),
    hour:'00',
    minute:'60',
    second:'00',
    width:60,
    socktBtnTitle: '连接socket'
  },
  onLoad: function (options) {
    app.getAuth(function () {
      let that = this;
    });
  },
  onReady: function () {
  
  },
  onShow: function () {
    let that = this;
    that.setData({
      userInfo: wx.getStorageSync('userInfo'),
    })
  },
  onHide: function () {
  
  },
  // 保存formid
  formSubmit(e){
    let that = this;
    let formNum = that.data.formNum + 1;
    if (formNum > 6) {
      return;
    }
    // util.formSubmit(e);
    that.setData({
      formNum: formNum
    })
  },
  // 音效
  switch1Change: function (e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
  },
  // 推送
  switch2Change: function (e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
  },
  // 商店
  shopTap(){
    wx.navigateTo({
      url: '../shop/shop',
    })
  },
  // 排行
  rankTap(){
    wx.navigateTo({
      url: '../ranking/ranking',
    })
  },
  // 银行
  bankTap(){
    let that = this;
    that.setData({
      bank: true
    })
  },
  // 设置
  setTap(){
    let that = this;
    that.setData({
      setting: true
    })
  },
  // 关闭
  close(){
    let that = this;
    that.setData({
      setting: false
    })
  },
  // 关闭银行
  closeBank(){
    let that = this;
    that.setData({
      bank: false
    })
  },
  // 
  onShareAppMessage: function (res) {
    let that = this;
    return {
      title: '不服来战',
      path: '/pages/wait/wait?room_id=' + wx.getStorageSync('mid'),
      success: function (res) {
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
            console.log("好友发起pkl链接websocket:", res);
            that.setData({
              keyword:res.data.data
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
        
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
 
})