App({
  globalData: {
    userInfo: null,
    openid: null,
    cloudReady: false
  },

  onLaunch() {
    try {
      wx.cloud.init()
      this.globalData.cloudReady = true
    } catch (e) {
      console.warn('云开发未配置，使用演示模式', e)
      this.globalData.cloudReady = false
    }
  }
})
