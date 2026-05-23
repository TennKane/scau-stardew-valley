App({
  globalData: {
    userInfo: null,
    openid: null
  },

  onLaunch() {
    wx.cloud.init({ env: 'cloud1-d3g8z6savb4e6d68e' })
  }
})
