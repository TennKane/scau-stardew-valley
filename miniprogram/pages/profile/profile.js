/**
 * 个人页
 */
Page({
  data: {
    userInfo: null,
    hasLogin: false,
    stats: {
      totalCheckins: 0,
      totalBadges: 0,
      daysActive: 0,
      rank: '--'
    },
    recentActivity: []
  },

  onLoad() {
    this.loadUserInfo()
  },

  onShow() {
    this.loadStats()
  },

  loadUserInfo() {
    const app = getApp()
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasLogin: true
      })
    }
  },

  async loadStats() {
    try {
      const api = require('../../utils/api')
      const res = await api.getProgress()
      if (res && res.code === 0 && res.data) {
        this.setData({
          stats: {
            totalCheckins: res.data.checkinCount || 0,
            totalBadges: (res.data.badges || []).length,
            daysActive: res.data.checkinCount || 0,
            rank: '--'
          }
        })
        return
      }
    } catch (e) {}
    this.setData({
      stats: { totalCheckins: 0, totalBadges: 0, daysActive: 0, rank: '--' },
      recentActivity: []
    })
  },

  login() {
    wx.showLoading({ title: '登录中' })
    const api = require('../../utils/api')

    api.login().then(res => {
      wx.hideLoading()
      if (res && res.openid) {
        const app = getApp()
        app.globalData.openid = res.openid
        app.globalData.userInfo = { nickName: '星露谷探险家' }
        this.setData({
          hasLogin: true,
          userInfo: app.globalData.userInfo
        })
        this.loadStats()
      }
    }).catch(() => {
      wx.hideLoading()
      wx.showToast({ title: '登录失败', icon: 'none' })
    })
  }
})
