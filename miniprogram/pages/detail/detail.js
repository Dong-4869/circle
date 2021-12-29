var common = require('../../utils/common.js')
Page({  
  data: {   
    id:'',//朋友圈ID
    wallData: null,//朋友圈信息
    showZan: -1, //显示点赞按钮
    showPinLun: false,//是否显示评论框
    nmAvator: '/image/pyq/10.jpg',//默认用户头像
    commentValue: '',//评论框文本
    placeholderPL: '评论',//评论框提示信息
    userInfo: undefined,//用户信息
    zansLength:0//点赞人数
  },
 
  // 初始化
  onLoad(options) {
    var that = this;
    that.setData({
      id: options.id
    })
    that.getLoad();
  },

  //初始化-查询是否授权
  getLoad(){
    var that = this
    if (wx.getStorageSync("userInfo")) {
      this.setData({
        userInfo: wx.getStorageSync("userInfo")
      })
    } else {
      wx.showToast({
        title: '未授权,2秒后跳转授权页面',
        icon: 'none',
      })
      setTimeout(() => {
        wx.reLaunch({
          url: '../circle/index',
        })
      }, 2000)
      return
    }
    this.getWallData()
  },

  //得到评论
  getcomment(e) {
    this.setData({
      commentValue: e.detail.value
    })
  },

  //评论
  bindComment(e) {
    this.setData({
      placeholderPL: "回复: " + e.currentTarget.dataset.name,
      showZan: 1,
      showPinLun: true,
    })
  },

  //提交评论
  submitComment(e) {
    var that = this
    //是否授权
    if (!this.data.userInfo) {
      wx.showToast({
        title: '未授权,2秒后跳转授权页面',
        icon: 'none',
      })
      setTimeout(() => {
        wx.reLaunch({
          url: '../circle/index',
        })
      }, 2000)
      return
    }
    //内容不为空
    if (this.data.commentValue.length <= 0) {
      wx.showToast({
        title: '内容为空',
        icon: 'none'
      })
      return
    }

    var id = this.data.wallData.id
    var formName = this.data.userInfo.nickName
    var toName = ""
    if (this.data.placeholderPL.includes("回复")) {
      toName = this.data.placeholderPL.replace("回复:", "")
    }

    wx.request({
      url : common.saveComment,
      method: "POST",
      data: {
        circleId:id,
        avatarUrl:this.data.userInfo.avatarUrl,
        userName:formName,
        toName:toName,
        content:this.data.commentValue
      },
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        that.getWallData()
        that.setData({
          showZan: -1, 
          showPinLun: false,
          commentValue: '',
          placeholderPL: '评论'
        })
      },
    })
  },

  //显示评论框
  showPinLun() {
    var main = this.data.wallData.nickName
    this.setData({
      placeholderPL: "留言: " + main,
      showPinLun: !this.data.showPinLun,
    })
  },

  //单独显示图片
  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: e.currentTarget.dataset.images // 需要预览的图片http链接列表
    })
  },

  //点赞
  dianzan(e) {
    var that = this
    if (!this.data.userInfo) {
      wx.showToast({
        title: '未授权,2秒后跳转授权页面',
        icon: 'none',
      })
      setTimeout(() => {
        wx.reLaunch({
          url: '../circle/index',
        })
      }, 2000)
      return
    }
    var wallData = this.data.wallData
    var zans = wallData.zans
    var id = wallData.id
    if(zans == null || zans == ""){
      zans = this.data.userInfo.nickName
    }else if(zans.indexOf(this.data.userInfo.nickName) == -1){
      zans = zans.concat(",",this.data.userInfo.nickName)
    }else{
      if(zans.indexOf(this.data.userInfo.nickName) == 0){
        zans = zans.replace(this.data.userInfo.nickName,"")
      }else{
        zans = zans.replace(","+this.data.userInfo.nickName,"")
      }
    }
    wallData.zans = zans
    this.setData({
      wallData:wallData
    })
    wx.request({
      url : common.saveCircle,
      method: "POST",
      data: {
        id:id,
        zans:zans
      },
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        that.setData({
          showZan: -1
        })
      },
    })

  },

  //获取朋友圈信息
  getWallData() {
    var that = this

    wx.request({
      url : common.getCircleById+that.data.id,
      method: "GET",
      data: {},
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        that.setData({
          wallData:res.data.data.circle
        })
      },
    })
  },

  //显示点赞、留言图标
  toShowZan(e) {
    if (1 === this.data.showZan) {
      this.setData({
        showZan: -1,
        placeholderPL: "留言"
      })
    } else {
      this.setData({
        showZan: 1
      })
    }
  }
})