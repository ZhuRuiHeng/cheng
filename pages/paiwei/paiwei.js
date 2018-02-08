// pages/paiwei/paiwei.js
Page({
  data: {
    comeIn:true
  },
  onLoad: function (options) {
    that.setData({
      room_id: options.room_id,
      otherName: options.otherName,
      otherImg: options.otherImg,
      houseImg: options.otherImg,
      houseName: options.otherName,
    })
  },
  onReady: function () {
  
  },
  onShow: function () {
  
  },
 
})