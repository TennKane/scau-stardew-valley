/**
 * 首页 — 校园地图
 * 像素风地图 + 地标概览 + 探索进度
 */
const landmarks = require('../../utils/landmarks')

Page({
  data: {
    landmarks: [],
    progress: {
      total: 0,
      discovered: 0,
      percentage: 0
    },
    selectedCategory: '',
    categories: ['全部', '建筑', '景观', '雕塑', '生活', '运动', '文化'],
    currentDate: '',
    seasonEmoji: ''
  },

  onLoad() {
    this.loadData()
    this.setDateInfo()
  },

  onShow() {
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

  loadData() {
    const all = landmarks.LANDMARKS.map(l => ({
      ...l,
      difficultyDisplay: '🌾'.repeat(l.difficulty),
      firstHint: l.hints[0]
    }))
    this.setData({
      landmarks: all,
      progress: {
        total: all.length,
        discovered: 0,
        percentage: 0
      }
    })
  },

  loadProgress() {
    // TODO: 从云数据库加载打卡进度
  },

  filterByCategory(e) {
    const category = e.currentTarget.dataset.category
    const cat = category === '全部' ? '' : category
    const raw = cat ? landmarks.getLandmarksByCategory(cat) : landmarks.LANDMARKS
    const filtered = raw.map(l => ({
      ...l,
      difficultyDisplay: '🌾'.repeat(l.difficulty),
      firstHint: l.hints[0]
    }))

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
    wx.navigateTo({
      url: `/pages/result/result?landmarkId=${id}`
    })
  }
})
