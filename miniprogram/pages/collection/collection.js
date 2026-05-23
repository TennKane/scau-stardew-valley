/**
 * 图鉴页 — 已解锁地标展示
 */
const landmarks = require('../../utils/landmarks')

Page({
  data: {
    discovered: [],
    undiscovered: [],
    badges: [],
    stats: {
      total: 0,
      discovered: 0,
      percentage: 0
    },
    viewMode: 'grid'
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    this.loadProgress()
  },

  loadData() {
    const all = landmarks.LANDMARKS
    this.setData({
      discovered: all,
      undiscovered: [],
      stats: {
        total: all.length,
        discovered: all.length,
        percentage: 100
      },
      badges: [
        { name: '初来乍到', icon: '🌱', desc: '解锁第1个地标', unlocked: true },
        { name: '校园探险家', icon: '🗺️', desc: '解锁5个地标', unlocked: true },
        { name: '星露谷大师', icon: '🌟', desc: '解锁全部地标', unlocked: false },
        { name: '四季行者', icon: '🌸', desc: '在四个季节都打过卡', unlocked: false }
      ]
    })
  },

  loadProgress() {
    // TODO: 从云数据库加载打卡进度
  },

  toggleView() {
    this.setData({
      viewMode: this.data.viewMode === 'grid' ? 'list' : 'grid'
    })
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/result/result?landmarkId=${id}`
    })
  }
})
