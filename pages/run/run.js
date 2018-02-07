// pages/run/run.js
var app = getApp();
var util = require('../../utils/util.js');
import tips from '../../utils/tips.js'
Page({
  data: {
    userInfo: wx.getStorageSync('userInfo'),
    second:20,
    answer: ['', '', '', ''],
    index:1 //题目
  },
  onLoad: function (options) {
    console.log('options:', options);
      this.setData({
        houseImg: options.houseImg,
        houseName: options.houseName,
        otherImg: options.otherImg,
        otherName: options.otherName
      })
  },
  onReady: function () {

  },
  onShow: function () {
    let that = this;
    let second = that.data.second;
    that.setData({
      userInfo: wx.getStorageSync('userInfo'),
      question_list: wx.getStorageSync('question_list')
    })
    let question_list = wx.getStorageSync('question_list');
    console.log("question_list:", question_list[37]);
    //console.log("question_list:", question_list[37].option.split(','));
    var option = question_list[37].option.split(',');
    //console.log("question_list:", a[0]);
    that.setData({
      question_list: question_list[37],
      option: question_list[37].option.split(',')
    })
    for (let i = 0; i < question_list.length;i++){
      
    }
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
  pushAnswer(e) {
    let that = this;
    let idx = e.currentTarget.dataset.index;
    let answer = that.data.answerArr;
    let clickText = answerArr[idx];
    let textArr = that.data.textArr;
    textArr[clickText.idx] = clickText.text;
    answerArr[idx] = '';
    let clickTextCount = that.data.clickTextCount - 1;
    that.setData({
      answerArr,
      textArr,
      clickTextCount
    })
  },


})