/**
 * 管理后台
 * 地标 CRUD + 打卡统计（仅 role=admin 可见）
 */
const app = getApp()
const api = require('../../utils/api')

Page({
  data: {
    tab: 'landmarks',       // landmarks | stats
    landmarks: [],
    stats: null,
    showForm: false,
    editing: null,           // 编辑中的地标
    form: {                  // 新增/编辑表单
      name: '', stardewName: '', description: '', category: '建筑',
      difficulty: 1, seasonHint: '', hints: ''
    },
    categories: ['建筑', '景观', '雕塑', '生活', '运动', '文化']
  },

  onLoad() {
    // 非管理员跳回
    if (app.globalData.role !== 'admin') {
      wx.showToast({ title: '无权限', icon: 'none' })
      wx.navigateBack()
      return
    }
    this.loadLandmarks()
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ tab })
    if (tab === 'stats') this.loadStats()
  },

  /** 加载地标列表（从云函数） */
  async loadLandmarks() {
    wx.showLoading({ title: '加载中' })
    try {
      const res = await api.admin({ action: 'getLandmarks' })
      if (res && res.code === 0) {
        this.setData({ landmarks: res.data || [] })
      }
    } catch (e) {}
    wx.hideLoading()
  },

  /** 加载统计 */
  async loadStats() {
    try {
      const res = await api.admin({ action: 'getStats' })
      if (res && res.code === 0) {
        this.setData({ stats: res.data })
      }
    } catch (e) {}
  },

  /** 打开新增表单 */
  addLandmark() {
    this.setData({
      showForm: true,
      editing: null,
      form: { name: '', stardewName: '', description: '', category: '建筑', difficulty: 1, seasonHint: '', hints: '' }
    })
  },

  /** 打开编辑表单 */
  editLandmark(e) {
    const id = e.currentTarget.dataset.id
    const item = this.data.landmarks.find(l => l._id === id || l.id === id)
    if (!item) return
    this.setData({
      showForm: true,
      editing: item,
      form: {
        name: item.name,
        stardewName: item.stardewName || '',
        description: item.description || '',
        category: item.category || '建筑',
        difficulty: item.difficulty || 1,
        seasonHint: (item.seasonHint || []).join('、'),
        hints: (item.hints || []).join('\n')
      }
    })
  },

  /** 关闭表单 */
  closeForm() {
    this.setData({ showForm: false, editing: null })
  },

  /** 表单输入 */
  onFormInput(e) {
    const field = e.currentTarget?.dataset?.field || e.target?.dataset?.field
    if (!field) return
    this.setData({ [`form.${field}`]: e.detail.value })
  },

  /** 分类选择器 */
  onCategoryChange(e) {
    this.setData({ 'form.category': this.data.categories[e.detail.value] })
  },

  /** 难度滑块 */
  onDifficultyChange(e) {
    this.setData({ 'form.difficulty': e.detail.value })
  },

  /** 保存地标（新增或更新） */
  async saveLandmark() {
    const { form, editing } = this.data
    if (!form.name) {
      wx.showToast({ title: '请填写地标名称', icon: 'none' })
      return
    }

    const payload = {
      name: form.name,
      stardewName: form.stardewName,
      description: form.description,
      category: form.category,
      difficulty: parseInt(form.difficulty) || 1,
      seasonHint: form.seasonHint ? form.seasonHint.split(/[、,，\s]+/).filter(Boolean) : [],
      hints: form.hints ? form.hints.split('\n').filter(Boolean) : []
    }

    wx.showLoading({ title: '保存中' })
    try {
      if (editing && editing._id) {
        await api.admin({ action: 'updateLandmark', id: editing._id, data: payload })
      } else {
        await api.admin({ action: 'addLandmark', data: payload })
      }
      wx.hideLoading()
      wx.showToast({ title: '保存成功' })
      this.closeForm()
      this.loadLandmarks()
    } catch (e) {
      wx.hideLoading()
      wx.showToast({ title: '保存失败', icon: 'none' })
    }
  },

  /** 删除地标 */
  deleteLandmark(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个地标吗？',
      success: async (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '删除中' })
          try {
            await api.admin({ action: 'deleteLandmark', id })
            wx.hideLoading()
            wx.showToast({ title: '已删除' })
            this.loadLandmarks()
          } catch (e) {
            wx.hideLoading()
            wx.showToast({ title: '删除失败', icon: 'none' })
          }
        }
      }
    })
  },

  /** 导入初始地标（首次使用） */
  async seedLandmarks() {
    wx.showLoading({ title: '导入中' })
    try {
      const res = await api.admin({ action: 'seedLandmarks' })
      wx.hideLoading()
      if (res && res.code === 0) {
        wx.showToast({ title: `导入了 ${res.count} 个地标` })
        this.loadLandmarks()
      }
    } catch (e) {
      wx.hideLoading()
      wx.showToast({ title: '导入失败', icon: 'none' })
    }
  }
})
