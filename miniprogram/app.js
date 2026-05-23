App({
  globalData: {
    userInfo: null,
    openid: null,
    envId: 'scau-stardew-0g6k3kf90e25b2a0'
  },

  onLaunch() {
    wx.cloud.init({
      env: this.globalData.envId
    })
  }
})
