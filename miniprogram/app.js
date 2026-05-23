App({
  globalData: {
    userInfo: null,
    openid: null,
    landmarkCache: []       // 地标列表缓存，首页加载后其他页面共享
  },

  onLaunch() {
    wx.cloud.init({ env: 'cloud1-d3g8z6savb4e6d68e' })
  }
})
