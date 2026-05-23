/**
 * 地标详情页
 */
Page({
  data: {
    landmark: null,
    discovered: false,
    loading: true
  },

  async onLoad(options) {
    const { landmarkId } = options
    if (!landmarkId) { this.setData({ loading: false }); return }

    try {
      const api = require('../../utils/api')
      const res = await api.getLandmarks()
      const all = res?.data || []
      if (all.length) getApp().globalData.landmarkCache = all

      const raw = all.find(l => l.id === landmarkId || l._id === landmarkId)
      if (raw) {
        this.setData({
          landmark: {
            ...raw,
            difficultyDisplay: '🌾 '.repeat(raw.difficulty),
            seasonDisplay: (raw.seasonHint || []).join(' / ')
          },
          discovered: true,
          loading: false
        })
        return
      }
    } catch (e) {}

    // 从缓存兜底
    const cached = getApp().globalData.landmarkCache || []
    const raw = cached.find(l => l.id === landmarkId || l._id === landmarkId)
    if (raw) {
      this.setData({
        landmark: {
          ...raw,
          difficultyDisplay: '🌾 '.repeat(raw.difficulty),
          seasonDisplay: (raw.seasonHint || []).join(' / ')
        },
        discovered: true,
        loading: false
      })
      return
    }

    this.setData({ loading: false })
  }
})
