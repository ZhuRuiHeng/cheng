// pages/show/show.js
var app = getApp();
var util = require('../../utils/util.js');
import tips from '../../utils/tips.js'
Page({
  data: {
    segment:'铂金贡士',
    userInfo: wx.getStorageSync('userInfo'),
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
  // 保存formid
  formSubmit(e) {
    console.log(e);
    let that = this;
    // util.formSubmit(e);
  },
  // 保存想册
  saveImg(){
    var that = this;
    console.log(that.data.imgUrl);
    wx.downloadFile({
        url: '' + that.data.imgUrl + '', //仅为示例，并非真实的资源
        success: function (res) {
          console.log(res);
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              //console.log(res);
              wx.showToast({
                title: '海报下载成功，请去相册查看',
                icon: 'success',
                duration: 800
              })
            }
          })
        },
        fail: function (err) {
          console.log(err)
        }
    })
  },
})