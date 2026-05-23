/**
 * 个人页
 */
const app = getApp()

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
        openid: saved.openid
      })
      this.loadStats()
    } else if (app.globalData.userInfo) {
      this.setData({
        hasLogin: true,
        userInfo: app.globalData.userInfo,
        openid: app.globalData.openid
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
    // 本地存储
    wx.setStorageSync('userProfile', data)
    // 更新全局
    app.globalData.userInfo = { nickName: data.nickName, avatarUrl: data.avatarUrl }
    // 更新页面
    this.setData({ userInfo: app.globalData.userInfo })
    // 同步到云端
    const api = require('../../utils/api')
    api.updateUser({ nickName: data.nickName, avatarUrl: data.avatarUrl })
  },

  /** 选择头像 */
  onChooseAvatar(e) {
    const avatarUrl = e.detail.avatarUrl
    if (avatarUrl) this.saveProfile({ avatarUrl })
  },

  /** 输入昵称 */
  onNicknameInput(e) {
    const nickName = e.detail.value
    if (nickName) this.saveProfile({ nickName })
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
        // 先试试恢复本地资料，如果没有就走默认
        const saved = wx.getStorageSync('userProfile')
        const nickName = saved?.nickName || '星露谷探险家'
        const avatarUrl = saved?.avatarUrl || ''
        app.globalData.userInfo = { nickName, avatarUrl }
        this.setData({
          hasLogin: true,
          userInfo: app.globalData.userInfo,
          openid: res.openid
        })
        this.saveProfile({ nickName, avatarUrl })
        this.loadStats()
      }
    }).catch(() => {
      wx.hideLoading()
      wx.showToast({ title: '登录失败', icon: 'none' })
    })
  },

  /** 退出登录 */
  logout() {
    wx.showModal({
      title: '退出确认',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('userProfile')
          app.globalData.userInfo = null
          app.globalData.openid = null
          this.setData({
            hasLogin: false,
            userInfo: null,
            openid: null,
            stats: { totalCheckins: 0, totalBadges: 0, daysActive: 0, rank: '--' },
            recentActivity: []
          })
        }
      }
    })
  }
})
