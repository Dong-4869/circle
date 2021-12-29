var common = require('../../utils/common.js')
Page({
  data: {
    textareaTxt: undefined,//文本内容
    userInfo: undefined,//用户信息
    locationName:undefined,//地址
    images:[]//图片列表
  },

  // 初始化，获取用户信息
  onLoad() {
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
  },
  
  //选择地址
  chooseLoc: function () {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          locationName: res.name
        })
      }
    })
  },

  //删除图片 
  deleteImg(e) {
    var that = this
    //振动
    wx.vibrateShort({})
    wx.showModal({
      title: '确认删除',
      content: '',
      cancelText: '取消',
      confirmText: '确认',
      success(res) {
        if (res.confirm) {
          var data = that.data.images
          data.splice(e.currentTarget.dataset.index, 1)
          that.setData({
            images: data
          })
        } else if (res.cancel) {}
      }
    })
  },

  //获取文本框内容
  getInputValue(e) {
    this.setData({
      textareaTxt: e.detail.value
    })
  },

  //提交
  formSubmit: function(e) {
    var that = this
    //未授权，跳回主页面
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
    if (!that.data.textareaTxt && that.data.images <= 0) {
      wx.showToast({
        title: '内容为空',
        icon: 'none',
      })
    } else {
      wx.request({
        url : common.saveCircle,
        method: "POST",
        data: {
          nickName: this.data.userInfo.nickName,
          avatarUrl: this.data.userInfo.avatarUrl,
          content: this.data.textareaTxt,
          address: this.data.locationName,
          images: JSON.stringify(this.data.images)
        },
        header: {
          "Content-Type": "application/json"
        },
        success: function (res) {
          wx.navigateBack({
            delta: 1  //小程序关闭当前页面返回上一页面
          })
          wx.showToast({
            title: '发布成功！',
            icon: 'success',
            duration: 2000
          })
        },
      })
    }
  },

  //选择图片
  chooseImage: function(e) {
    var that = this;
    var imgData;
    wx.chooseImage({
      success: function(res) {
        if(that.data.images.length+res.tempFilePaths.length > 9){
          wx.showToast({
            title: '只能上传9张图片',
            icon: 'error',
            duration: 2000
          })
          return
        }
        for(var i = 0; i < res.tempFilePaths.length; i++){
          wx.getFileSystemManager().readFile({
            filePath: res.tempFilePaths[i], //选择图片返回的相对路径
            encoding: 'base64', //编码格式
            success: res => { //成功的回调
              imgData = 'data:image/png;base64,' + res.data
              that.setData({
                images:that.data.images.concat(imgData)
              })
            }
          })
        }
      }
    })
  },

  //单独显示图片
  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.images // 需要预览的图片http链接列表
    })
  }
})





