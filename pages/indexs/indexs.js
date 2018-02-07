// pages/indexs/indexs.js
var app = getApp();
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
    // 钱庄取钱剩余时间
    if (!wx.getStorageSync('sign')){
        app.getAuth(function () {
          wx.request({
            url: app.data.apiurl + "guessipk/get-bank-time?sign=" + wx.getStorageSync('sign') + '&operator_id=' + wx.getStorageSync("kid"),
            data: {
              guess_type: 'idiom'
            },
            header: {
              'content-type': 'application/json'
            },
            method: "GET",
            success: function (res) {
              console.log("钱庄取钱剩余时间:", res);
              var status = res.data.status;
              if (status == 1) {
                that.setData({
                  time: res.data.data
                })
              } else {
                console.log(res.data.msg)
              }
            }
          })
        });
    }else{
      wx.request({
        url: app.data.apiurl + "guessipk/get-bank-time?sign=" + wx.getStorageSync('sign') + '&operator_id=' + wx.getStorageSync("kid"),
        data: {
          guess_type: 'idiom'
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("钱庄取钱剩余时间:", res);
          var status = res.data.status;
          if (status == 1) {
            that.setData({
              time: res.data.data
            })
            // 倒计时
            let minutes = '';
            let seconds = '';
            var maxtime = that.data.time; //一个小时，按秒计算，自己调整! 
            console.log(typeof (maxtime));
            var inter = setInterval(function () {

              if (maxtime <= 1) {
                clearInterval(inter);
              }
              if (maxtime >= 0) {
                minutes = Math.floor(maxtime / 60);
                seconds = Math.floor(maxtime % 60);
                let msg = minutes + "分" + seconds + "秒";
                that.setData({
                  time: msg
                })
                if (maxtime == 5 * 60) console.log('注意，还有5分钟!');
                --maxtime;
              }
              else {
                that.setData({
                  time: '有金币可领取'
                })
                clearInterval(inter);
                console.log("时间到，结束!");
              }
              maxtime--;
              //console.log(maxtime);
              that.setData({
                maxtime,
                inter
              })
            }, 1000)
          } else {
            console.log(res.data.msg)
          }
        }
      })
    }
    
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
    console.log('switch1 发生 change 事件，携带值为', e.detail.value);
    if (e.detail.value==true){
      console.log('play');
      app.AppMusic.play();
      app.AppMusic.onPlay(() => {
        console.log('开始播放');
        that.setData({
          status: true
        })
      }) 
    }else{
      console.log('stop');
      app.AppMusic.stop();
      app.AppMusic.onPause(() => {
        console.log('暂停播放');
        that.setData({
          status: false
        })
      })
    }
  },
  // 推送
  switch2Change: function (e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value);
    if (e.detail.value == true) {
      console.log('true');
    } else {
      console.log('stop');
    }
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
    if(that.data.time==0){
      that.setData({
        bank: true
      })
      //领取钱庄金币
      wx.request({
        url: app.data.apiurl + "guessipk/receive-bank-point?sign=" + wx.getStorageSync('sign') + '&operator_id=' + wx.getStorageSync("kid"),
        data: {
          guess_type: 'idiom'
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("钱庄取钱剩余时间:", res);
          var status = res.data.status;
          if (status == 1) {
            tips.alert('金币+60')
            that.setData({
              point: res.data.data.point+60
            })
          } else {
            console.log(res.data.msg)
          }
        }
      })
      wx.request({
        url: app.data.apiurl + "guessipk/get-bank-time?sign=" + wx.getStorageSync('sign') + '&operator_id=' + wx.getStorageSync("kid"),
        data: {
          guess_type: 'idiom'
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("钱庄取钱剩余时间:", res);
          var status = res.data.status;
          if (status == 1) {
            that.setData({
              time: res.data.data
            })
            // 倒计时
            let minutes = '';
            let seconds = '';
            var maxtime = that.data.time; //一个小时，按秒计算，自己调整! 
            var inter = setInterval(function () {

              if (maxtime <= 1) {
                clearInterval(inter);
              }
              if (maxtime >= 0) {
                minutes = Math.floor(maxtime / 60);
                seconds = Math.floor(maxtime % 60);
                let msg = minutes + "分" + seconds + "秒";
                that.setData({
                  time: msg
                })
                if (maxtime == 5 * 60) console.log('注意，还有5分钟!');
                --maxtime;
              }
              else {
                that.setData({
                  time: '有金币可领取'
                })
                clearInterval(inter);
                console.log("时间到，结束!");
              }
              maxtime--;
              console.log(maxtime);
              that.setData({
                maxtime,
                inter
              })
            }, 1000)
          } else {
            console.log(res.data.msg)
          }
        }
      })
    }else{
      tips.alert('还不能收取');
    }
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
  // 排位赛
  gameTap(){
      wx.navigateTo({
        url: '../mine/mine',
      })
  },
  // 分享
  onShareAppMessage: function (res) {
    let that = this;
    return {
      title: '不服来战',
      path: '/pages/waita/waita?room_id=' + wx.getStorageSync('mid'),
      success: function (res) {
        wx.navigateTo({
          url: '../wait/wait',
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
 
})