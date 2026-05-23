/**
 * 个人页
 */
const app = getApp()

Page({
  data: {
    userInfo: null,
    hasLogin: false,
    isAdmin: false,
    stats: {
      totalCheckins: 0,
      totalBadges: 0,
      daysActive: 0,
      rank: '--'
    },
    recentActivity: []
  },

  onLoad() {
    this.loadLocalUser()
  },

  onShow() {
    if (this.data.hasLogin) this.loadStats()
  },

  /** 从本地存储恢复用户信息 */
  loadLocalUser() {
    const saved = wx.getStorageSync('userProfile')
    if (saved) {
      app.globalData.openid = saved.openid
      app.globalData.userInfo = { nickName: saved.nickName, avatarUrl: saved.avatarUrl }
      this.setData({
        hasLogin: true,
        userInfo: app.globalData.userInfo,
        openid: saved.openid,
        isAdmin: saved.role === 'admin'
      })
      this.loadStats()
    } else if (app.globalData.userInfo) {
      this.setData({
        hasLogin: true,
        userInfo: app.globalData.userInfo,
        openid: app.globalData.openid,
        isAdmin: app.globalData.role === 'admin'
      })
    }
  },

  /** 保存用户信息到本地和云端 */
  saveProfile({ nickName, avatarUrl }) {
    const current = app.globalData.userInfo || {}
    const data = {
      openid: app.globalData.openid,
      nickName: nickName || current.nickName || '星露谷探险家',
      avatarUrl: avatarUrl !== undefined ? avatarUrl : (current.avatarUrl || '')
    }
    wx.setStorageSync('userProfile', data)
    app.globalData.userInfo = { nickName: data.nickName, avatarUrl: data.avatarUrl }
    this.setData({ userInfo: app.globalData.userInfo })
    const api = require('../../utils/api')
    api.updateUser({ nickName: data.nickName, avatarUrl: data.avatarUrl })
  },

  onChooseAvatar(e) {
    if (e.detail.avatarUrl) this.saveProfile({ avatarUrl: e.detail.avatarUrl })
  },

  onNicknameInput(e) {
    if (e.detail.value) this.saveProfile({ nickName: e.detail.value })
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
        app.globalData.openid = res.openid
        app.globalData.role = res.role || ''
        const saved = wx.getStorageSync('userProfile')
        const nickName = saved?.nickName || '星露谷探险家'
        const avatarUrl = saved?.avatarUrl || ''
        app.globalData.userInfo = { nickName, avatarUrl }
        this.setData({
          hasLogin: true,
          userInfo: app.globalData.userInfo,
          openid: res.openid,
          isAdmin: res.role === 'admin'
        })
        this.saveProfile({ nickName, avatarUrl })
        this.loadStats()
      }
    }).catch(() => {
      wx.hideLoading()
      wx.showToast({ title: '登录失败', icon: 'none' })
    })
  },

  goToAdmin() {
    wx.navigateTo({ url: '/pages/admin/admin' })
  },

  logout() {
    wx.showModal({
      title: '退出确认',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('userProfile')
          app.globalData.userInfo = null
          app.globalData.openid = null
          app.globalData.role = null
          this.setData({
            hasLogin: false,
            userInfo: null,
            openid: null,
            isAdmin: false,
            stats: { totalCheckins: 0, totalBadges: 0, daysActive: 0, rank: '--' },
            recentActivity: []
          })
        }
      }
    })
  }
})
