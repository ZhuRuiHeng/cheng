// pages/run/run.js
// 好友结束pk friend-end-pk
var app = getApp();
var util = require('../../utils/util.js');
import tips from '../../utils/tips.js'
Page({
  data: {
    userInfo: wx.getStorageSync('userInfo'),
    second:20,
    click:0, //点击多少下
    answer: [
      {
        text:0,
        askindex:-1,
        notice:false
      },
      {
        text: 0,
        askindex: -1,
        notice: false
      },
      {
        text: 0,
        askindex: -1,
        notice: false
      },
      {
        text: 0,
        askindex: -1,
        notice: false
      }
    ],
    title:1 //题目
  },
  onLoad: function (options) {
    console.log('options:', options);
      this.setData({
        houseImg: options.houseImg,
        houseName: options.houseName,
        housemid: options.housemid,
        otherImg: options.otherImg,
        otherName: options.otherName,
        room_id: options.room_id,
        othermid: options.othermid
      })
      
  },
  onReady: function () {

  },
  onShow: function () {
    
    let that = this;
    setTimeout(function () {
      that.setData({
        line: true
      })
    }, 1000)
    let title = that.data.title;
    let second = that.data.second;
    that.setData({
      userInfo: wx.getStorageSync('userInfo'),
      question_list: wx.getStorageSync('question_list')
    })
    let question_list = wx.getStorageSync('question_list');
    console.log("question_list:", question_list[title-1]);
    console.log("num:", question_list[title - 1].num);
    var option = question_list[title - 1].option;
    that.setData({
      question_list: question_list[title - 1],
      option: question_list[title - 1].option,
      num: question_list[title - 1].num
    })
    // 
    var inter = setInterval(function () {
      if (second <= 1) {
        console.log(111);
        wx.request({
          url: app.data.apiurl + "guessipk/friend-answer?sign=" + wx.getStorageSync('sign') + '&operator_id=' + wx.getStorageSync("kid"),
          data: {
            num: that.data.num,
            answer: that.data.huida.toString(),
            guess_type: 'idiom',
            room_id: that.data.room_id
          },
          header: {
            'content-type': 'application/json'
          },
          method: "GET",
          success: function (res) {
            clearInterval(inter);
            console.log("回答:", res);
            var status = res.data.status;
          }
        })
      }
      second--;
      console.log(second);
      that.setData({
        second,
        inter
      })
    }, 1000)
  },
  // 
  backText(e) {
    let that = this;
    let askindex = e.currentTarget.dataset.askindex; //选项索引
    let index = e.currentTarget.dataset.index; //答案索引
    let text = e.currentTarget.dataset.text; //文字
    let option = that.data.option;
    let answer = that.data.answer;
    let click = that.data.click;
    let notice = e.currentTarget.dataset.notice;
    console.log('text', text);
    if (text == 'undefined' || text == undefined) {
      return;
    }
    if (notice == true && text != 'undefined' && text != undefined) {
      console.log(text);
      tips.alert('提示的不能移除')
      return;
    }
    for (let i = 0; i < option.length; i++) {
      if (i == askindex) {
        option[i] = text
      }
    }
    for (let j = 0; j < answer.length; j++) {
      if (j == index) {
        let obj = {
          text: 0,
          obj: -1
        }
        answer[j] = obj;
      }

    }
    that.setData({
      option,
      answer,
      click: click - 1
    })
  },
  // 选择
  checked(e) {
    let that = this;
    let text = e.currentTarget.dataset.text;
    let index = e.currentTarget.dataset.index;
    let answer = that.data.answer;
    let option = that.data.option;
    let click = that.data.click;
    console.log('text:', text)
    if (text == "") {
      return;
    }
    let both = {};
    click = click + 1;
    console.log("click:", click);
    that.setData({
      click
    })
    // 答案
    for (let i = 0; i < answer.length; i++) {
      if (answer[i].text == 0 || !answer[i].text) {
        let obj = {
          text: text,
          askindex: index,
          notice: false
        };
        answer[i] = obj;
        break;
      }
    }
    for (let j = 0; j < option.length; j++) {
      if (j == index) {
        option[j] = 0;
      }
    }
    that.setData({
      answer,
      option
    })
    if (click == 4) {
      let huida = [];
      for (let i = 0; i < answer.length; i++) {
        huida.push(answer[i].text)
      }
      that.setData({
        huida
      })
      console.log(huida, 'huida:');
      console.log(typeof (huida.toString()));
      //retrun;
      // 答题
      wx.request({
        url: app.data.apiurl + "guessipk/friend-answer?sign=" + wx.getStorageSync('sign') + '&operator_id=' + wx.getStorageSync("kid"),
        data: {
          num: that.data.num,
          answer: huida.toString(),
          guess_type: 'idiom',
          room_id: that.data.room_id
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("回答:", res);
          wx.onSocketOpen(function (ress) {
            that.setData({
              socketOpen: true
            })
            console.log('ress:', ress);
            console.log('WebSocket连接已打开111！');
            console.log('已登录发起请求');
          })
          wx.onSocketError(function (res) {
            socketOpen = false
            console.log('WebSocket连接打开失败，请检查！')
            that.setData({
              socketOpen: false
            })
            wx.hideToast()
          })

          var status = res.data.status;
          if (status == 1) {
            let keyword = res.data.data;
            that.sendSocketMessage(keyword);
            console.log('是否发送keyword:', keyword);
            wx.onSocketMessage(function (res) {
              console.log('收到服务器内容：' + res.data);
              let result = JSON.parse(res.data);
              console.log(result);
              console.log(result.num);
              if (result.status == 0) {
                that.setData({
                  notice:true
                })
                tips.alert(result.msg);
                wx.redirectTo({
                  url: '../result/result',
                })
              }
              if (result.num){
                if (result.mid == that.data.room_id){ //房主
                  let houseInform = result;
                  that.setData({  //回答反馈
                    houseInform: result
                  })

                }else{  //other
                  let otherInform = result;
                  that.setData({  //回答反馈
                    otherInform: result
                  })
                }
                if (that.data.houseInform && that.data.otherInform){
                  clearInterval(inter);
                    let title = that.data.title + 1;
                    tips.alert(result.msg);
                    that.setData({
                      title: title,
                      click: 0
                    })
                    let question_list = wx.getStorageSync('question_list');
                    console.log("question_list:", question_list[title - 1]);
                    var option = question_list[title - 1].option;
                    that.setData({
                      question_list: question_list[title - 1],
                      option: question_list[title - 1].option,
                      num: question_list[title - 1].num,
                      title,
                      second:20,
                      answer: [
                        {
                          text: 0,
                          askindex: -1,
                          notice: false
                        },
                        {
                          text: 0,
                          askindex: -1,
                          notice: false
                        },
                        {
                          text: 0,
                          askindex: -1,
                          notice: false
                        },
                        {
                          text: 0,
                          askindex: -1,
                          notice: false
                        }
                      ],
                    })
                }
                
                
              }
            })
          } else {
            console.log(res.data.msg);
            tips.alert(res.data.msg);
          }
        }
      })
    }
  },
  // websocket发送消息
  sendSocketMessage: function (msg) {
    wx.sendSocketMessage({
      data: msg
    })
  },

})