// pages/run/run.js
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
    num:1 //题目
  },
  onLoad: function (options) {
    console.log('options:', options);
      this.setData({
        houseImg: options.houseImg,
        houseName: options.houseName,
        otherImg: options.otherImg,
        otherName: options.otherName,
        room_id: options.room_id
      })
  },
  onReady: function () {

  },
  onShow: function () {
    let that = this;
    let num = that.data.num;
    let second = that.data.second;
    that.setData({
      userInfo: wx.getStorageSync('userInfo'),
      question_list: wx.getStorageSync('question_list')
    })
    let question_list = wx.getStorageSync('question_list');
    console.log("question_list:", question_list[num-1]);
    var option = question_list[num - 1].option.split(',');
    that.setData({
      question_list: question_list[num - 1],
      option: question_list[num - 1].option.split(',')
    })
    // 
    // var inter = setInterval(function () {
    //   if (second <= 1) {
    //     clearInterval(inter);
    //   }
    //   second--;
    //   console.log(second);
    //   that.setData({
    //     second,
    //     inter
    //   })
    // }, 1000)
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
    if (click == 4) {
      let huida = [];
      for (let i = 0; i < answer.length; i++) {
        huida.push(answer[i].text)
      }
      console.log(huida, 'huida:');
      console.log(typeof (huida.toString()));
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
          var status = res.data.status;
          
        }
      })
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
      console.log(huida, 'huida:');
      console.log(typeof (huida.toString()));
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
          var status = res.data.status;
          if (status == 1) {
            let keyword = res.data.data;
            that.sendSocketMessage(keyword);
            wx.onSocketMessage(function (res) {
              console.log('收到服务器内容：' + res.data);
              let result = JSON.parse(res.data);
              console.log(result);
              console.log(result.status);
              if (result.status == 2) {
                that.setData({  //双方进去房间
                  comeIn: true
                })
              } 
              if (result.status == 0) {
                tips.alert(result.msg)
              }
              if (result.status == 1){
                let num = that.data.num;
                tips.alert(result.msg);
                that.setData({
                  num: num + 1,
                  click:0
                })
                let question_list = wx.getStorageSync('question_list');
                console.log("question_list:", question_list[num - 1]);
                var option = question_list[num - 1].option.split(',');
                that.setData({
                  question_list: question_list[num - 1],
                  option: question_list[num - 1].option.split(',')
                })
                
              }
            })
          } else {
            console.log(res.data.msg);
            tips.alert(res.data.msg);
          }
        }
      })
    }

    // 如果点击6次就提交
  },
  // websocket发送消息
  sendSocketMessage: function (msg) {
    wx.sendSocketMessage({
      data: msg
    })
  },

})