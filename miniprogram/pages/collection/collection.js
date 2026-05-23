/**
 * 图鉴页 — 已解锁地标展示
 */
Page({
  data: {
    discovered: [],
    undiscovered: [],
    allLandmarks: [],
    badges: [],
    stats: { total: 0, discovered: 0, percentage: 0 },
    viewMode: 'grid',
    loading: true
  },

  onLoad() {},

  onShow() {
    if (!require('../../utils/auth').check()) return
    if (this.data.stats.total === 0) this.loadData()
    else this.loadProgress()
  },

  async loadData() {
    this.setData({ loading: true })
    try {
      const api = require('../../utils/api')
      const [landRes, progRes] = await Promise.all([
        api.getLandmarks(),
        api.getProgress()
      ])
      const all = landRes?.data || []
      getApp().globalData.landmarkCache = all

      // 从进度获取已打卡 ID
      const discoveredIds = progRes?.data?.discoveredIds || []
      const discovered = all.filter(l => discoveredIds.includes(l._id) || discoveredIds.includes(l.id))
      const undiscovered = all.filter(l => !discoveredIds.includes(l._id) && !discoveredIds.includes(l.id))

      this.setData({
        allLandmarks: all,
        discovered,
        undiscovered,
        stats: {
          total: all.length,
          discovered: discovered.length,
          percentage: all.length ? Math.round((discovered.length / all.length) * 100) : 0
        },
        loading: false
      })
    } catch (e) {
      this.setData({ loading: false })
    }

    this.setData({
      badges: [
        { name: '初来乍到', icon: '🌱', desc: '解锁第1个地标', unlocked: this.data.stats.discovered >= 1 },
        { name: '校园探险家', icon: '🗺️', desc: '解锁5个地标', unlocked: this.data.stats.discovered >= 5 },
        { name: '星露谷大师', icon: '🌟', desc: '解锁全部地标', unlocked: this.data.stats.discovered === this.data.stats.total && this.data.stats.total > 0 },
        { name: '四季行者', icon: '🌸', desc: '在四个季节都打过卡', unlocked: false }
      ]
    })
  },

  async loadProgress() {
    try {
      const api = require('../../utils/api')
      const res = await api.getProgress()
      if (res?.data) {
        const discoveredIds = res.data.discoveredIds || []
        const discovered = this.data.allLandmarks.filter(l => discoveredIds.includes(l._id) || discoveredIds.includes(l.id))
        const undiscovered = this.data.allLandmarks.filter(l => !discoveredIds.includes(l._id) && !discoveredIds.includes(l.id))
        this.setData({
          discovered,
          undiscovered,
          stats: {
            total: this.data.stats.total,
            discovered: discovered.length,
            percentage: this.data.stats.total ? Math.round((discovered.length / this.data.stats.total) * 100) : 0
          }
        })
      }
    } catch (e) {}
  },

  toggleView() {
    this.setData({ viewMode: this.data.viewMode === 'grid' ? 'list' : 'grid' })
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/result/result?landmarkId=${id}` })
  }
})
