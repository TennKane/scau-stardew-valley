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

  loadStats() {
    // TODO: 从云数据库加载统计数据
    this.setData({
      stats: {
        totalCheckins: 3,
        totalBadges: 2,
        daysActive: 1,
        rank: '#42'
      },
      recentActivity: [
        { action: '解锁地标', target: '校门', time: '2024-01-15 14:30' },
        { action: '解锁地标', target: '图书馆', time: '2024-01-14 10:15' },
        { action: '获得徽章', target: '初来乍到', time: '2024-01-14 10:15' }
      ]
    })
  },

  login() {
    wx.showLoading({ title: '登录中' })
    const api = require('../../utils/api')

    api.login().then(res => {
      wx.hideLoading()
      if (res && res.openid) {
        getApp().globalData.openid = res.openid
        this.loadUserInfo()
      }
    }).catch(() => {
      wx.hideLoading()
      wx.showToast({ title: '登录失败', icon: 'none' })
    })
  }
})
