// pages/wait/wait.js
var app = getApp();
var util = require('../../utils/util.js');
import tips from '../../utils/tips.js'
Page({
  data: {
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
    let that = this;
    // util.formSubmit(e);
  },
  // 转发群加金币 个人不加
  onShareAppMessage() {
    let that = this;
    let sign = wx.getStorageSync("sign");
    return {
      title: '不服来战',
      path: '/pages/share/share',
      success(res) {
        console.log("shareTickets:", res);
        console.log("shareTickets:", res.shareTickets[0]) // 奇怪为什么 shareTickets 是个数组？这个数组永远只有一个值。
        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          complete(res) {
            console.log(res, '请求加金币接口')
            // wx.request({
            //   url: apiurl + "birth/save-group-relation?sign=" + sign + '&operator_id=' + app.data.kid,
            //   data: {
            //     encryptedData: res.encryptedData, //encodeURIComponent(res.encryptedData),
            //     iv: res.iv
            //   },
            //   header: {
            //     'content-type': 'application/json'
            //   },
            //   method: "GET",
            //   success: function (res) {
            //     console.log("所在群信息2:", res);
            //     var status = res.data.status;
            //     if (status == 1) {
            //       tips.success('转发成功');
            //     } else {
            //       console.log(res.data.msg)
            //       tips.error(res.data.msg)
            //     }
            //   }
            // })
          }

        })
      }
    }
  },

})