/**
 * 首页 — 校园地图
 */
Page({
  data: {
    landmarks: [],
    allLandmarks: [],
    progress: { total: 0, discovered: 0, percentage: 0 },
    selectedCategory: '',
    categories: ['全部', '建筑', '景观', '雕塑', '生活', '运动', '文化'],
    currentDate: '',
    seasonEmoji: '',
    loading: true
  },

  onLoad() {
    if (!require('../../utils/auth').check()) return
    this.loadData()
    this.setDateInfo()
  },

  onShow() {
    if (!require('../../utils/auth').check()) return
    this.loadProgress()
  },

  setDateInfo() {
    const now = new Date()
    const month = now.getMonth()
    let seasonEmoji = '🌸'
    if (month >= 3 && month <= 5) seasonEmoji = '🌿'
    else if (month >= 6 && month <= 8) seasonEmoji = '☀️'
    else if (month >= 9 && month <= 11) seasonEmoji = '🍂'
    else seasonEmoji = '❄️'
    this.setData({
      currentDate: `${now.getFullYear()}年${now.getMonth() + 1}月`,
      seasonEmoji
    })
  },

  async loadData() {
    this.setData({ loading: true })
    try {
      const api = require('../../utils/api')
      const res = await api.getLandmarks()
      const list = (res?.data || []).map(l => ({
        ...l,
        difficultyDisplay: '🌾'.repeat(l.difficulty),
        firstHint: l.hints?.[0] || ''
      }))
      getApp().globalData.landmarkCache = res?.data || []
      this.setData({
        landmarks: list,
        allLandmarks: list,
        progress: { total: list.length, discovered: 0, percentage: 0 },
        loading: false
      })
    } catch (e) {
      this.setData({ loading: false })
    }
  },

  loadProgress() {
    // TODO: 从云数据库加载打卡进度
  },

  filterByCategory(e) {
    const category = e.currentTarget.dataset.category
    const cat = category === '全部' ? '' : category
    const filtered = cat
      ? this.data.allLandmarks.filter(l => l.category === cat)
      : this.data.allLandmarks
    this.setData({
      selectedCategory: category,
      landmarks: filtered
    })
  },

  goToCamera() {
    wx.switchTab({ url: '/pages/camera/camera' })
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/result/result?landmarkId=${id}` })
  }
})
