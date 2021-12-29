var common = require('../../utils/common.js')
Page({  
  data: {   
    imageTop:null,//背景封面
    wallData: [],//朋友圈数据
    showZan: -1, //显示点赞按钮
    showPinLun: false,//显示评论框
    nmAvator: '/image/pyq/10.jpg',//用户头像
    commentValue: '',//评论内容
    placeholderPL: '评论',//评论框提示文本
    userInfo: undefined,//用户信息
    pText:"好好学习，天天向上！"//个性签名
  },
 
  // 初始化，获取用户信息
  onLoad() {
    this.getLoad();
  },

  //选择封面
  chooseImage: function(e) {
    var that = this;
    var imgData;
    wx.chooseImage({
      success: function(res) {
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            imgData = 'data:image/png;base64,' + res.data
            that.setData({
              imageTop:imgData
            })
            wx.setStorageSync('imageTop', this.data.imageTop)
          }
        })
      }
    })
  },
  //获取用户信息
  getUserProfile(e) {
    var that = this
    wx.getUserProfile({
      desc: '用于完善用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: res.userInfo
        })
        wx.setStorageSync('userInfo', this.data.userInfo)
        that.getLoad()
      }
    })
  },

  //初始化-查缓存
  getLoad(){
    var that = this
    if (wx.getStorageSync("userInfo")) {
      this.setData({
        userInfo: wx.getStorageSync("userInfo")
      })
    }
    if (wx.getStorageSync("imageTop")) {
      this.setData({
        imageTop: wx.getStorageSync("imageTop")
      })
    }
    this.getWallData()
  },

  //上拉刷新
  onPullDownRefresh(){
    this.getLoad()
  },

  //其他页面返回时刷新
  onShow(){
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
      showZan: e.currentTarget.dataset.indexn,
      showPinLun: true,
    })
  },

  //提交评论
  submitComment(e) {
    var that = this
    //是否授权
    if (!this.data.userInfo) {
      wx.pageScrollTo({
        scrollTop: 200,
      })
      wx.showToast({
        title: '需要授权才能点赞评论,见第一条墙消息.',
        icon: 'none',
        duration: 5000
      })
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

    var id = this.data.wallData[this.data.showZan].id
    var formName = this.data.userInfo.nickName
    var toName = ""
    if (this.data.placeholderPL.includes("回复")) {
      toName = this.data.placeholderPL.replace("回复:", "")
    }

    wx.request({
      url : common.saveCircle,
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
    var main = this.data.wallData[this.data.showZan].nickName
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
      wx.pageScrollTo({
        scrollTop: 200,
      })
      wx.showToast({
        title: '需要授权才能点赞评论,见第一条墙消息.',
        icon: 'none'
      })
      return
    }
    var wallData = this.data.wallData
    var zans = wallData[e.currentTarget.dataset.indexn].zans
    var id = wallData[e.currentTarget.dataset.indexn].id
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
    wallData[e.currentTarget.dataset.indexn].zans = zans
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

  //跳转发布页
  toEdit() {
    wx.navigateTo({
      url: '../edit/index',
    })
  },

  //跳转详情页
  toDetail(e){
    wx.navigateTo({
      url: '../detail/detail?id='+e.currentTarget.dataset.id
    })
  },

  //获取朋友圈信息
  getWallData() {
    var that = this
    wx.showNavigationBarLoading()
    wx.request({
      url : common.getCircleList,
      method: "GET",
      data: {
      },
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        that.setData({
          wallData:res.data.data.circles
        })
      },
    })
  },

  //显示点赞、留言图标
  toShowZan(e) {
    if (e.currentTarget.dataset.index === this.data.showZan) {
      this.setData({
        showZan: -1,
        placeholderPL: "留言"
      })
    } else {
      this.setData({
        showZan: e.currentTarget.dataset.index
      })
    }
  }
})