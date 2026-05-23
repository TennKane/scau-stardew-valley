/**
 * 相机打卡页 — 核心页面
 * 全屏摄像头取景 + 地标识别 + 打卡动画
 */
const app = getApp()
const api = require('../../utils/api')

Page({
  data: {
    // 相机状态
    cameraReady: false,
    flashMode: 'off',
    frameCount: 0,

    // 识别状态
    scanning: false,
    scanResult: null,
    confidence: 0,
    landmarkName: '',

    // 打卡动画
    showSuccess: false,
    successLandmark: null,
    showFail: false,
    failMessage: '',

    // 提示文字
    hintText: '对准校园地标，探索星露谷',
    hintVisible: true,

    // 最近打卡
    recentCheckins: []
  },

  onLoad() {
    this.startScanLoop()
    this.loadRecentCheckins()
  },

  onUnload() {
    this.stopScanLoop()
  },

  /** 加载最近打卡记录 */
  loadRecentCheckins() {
    // TODO: 从云数据库拉取
    this.setData({
      recentCheckins: [
        { name: '校门', time: '今日 14:30', badge: '🏛️' },
        { name: '图书馆', time: '昨日 10:15', badge: '📚' }
      ]
    })
  },

  /** 摄像头就绪 */
  onCameraReady() {
    this.setData({ cameraReady: true })
  },

  /** 摄像头错误 */
  onError(e) {
    console.error('Camera error:', e)
    this.setData({
      hintText: '摄像头启动失败，请检查权限',
      hintVisible: true
    })
  },

  /** 开始循环扫描 */
  startScanLoop() {
    this.scanning = true
    this.scanLoop()
  },

  /** 停止扫描 */
  stopScanLoop() {
    this.scanning = false
  },

  /** 扫描循环（每 1.5s 取帧识别） */
  async scanLoop() {
    while (this.scanning) {
      if (this.data.cameraReady && !this.data.showSuccess) {
        await this.captureAndRecognize()
      }
      await this.sleep(1500)
    }
  },

  /** 取帧并识别 */
  async captureAndRecognize() {
    try {
      const ctx = wx.createCameraContext()
      const frame = await this.captureFrame(ctx)

      // 调用云函数识别
      const result = await api.recognize(frame)

      if (result && result.landmarkId && result.confidence > 0.5) {
        this.handleRecognition(result)
      }
    } catch (e) {
      // 静默失败，继续下一帧
    }
  },

  /** 捕获一帧 */
  captureFrame(ctx) {
    return new Promise((resolve) => {
      const listener = ctx.onCameraFrame((frame) => {
        listener.stop()
        resolve(frame.data)
      })
    })
  },

  /** 处理识别结果 */
  handleRecognition(result) {
    const { landmarkId, confidence, landmarkName } = result

    if (confidence > 0.85) {
      // 高置信度 → 打卡成功
      this.triggerCheckin(landmarkId, confidence)
    } else if (confidence > 0.5) {
      // 中等置信度 → 提示用户
      this.setData({
        hintText: `好像看到了${landmarkName}？靠近一点试试`,
        hintVisible: true
      })
    }
  },

  /** 触发打卡 */
  async triggerCheckin(landmarkId, confidence) {
    this.stopScanLoop()

    const landmark = require('../../utils/landmarks').getLandmark(landmarkId)

    this.setData({
      showSuccess: true,
      successLandmark: landmark,
      confidence: confidence
    })

    // 震动反馈
    wx.vibrateShort({ type: 'medium' })

    // 3秒后关闭动画
    setTimeout(() => {
      this.setData({ showSuccess: false })
      this.startScanLoop()
    }, 3000)
  },

  /** 拍照（手动） */
  takePhoto() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        wx.showToast({ title: '照片已保存', icon: 'none' })
      }
    })
  },

  /** 切换闪光灯 */
  toggleFlash() {
    this.setData({
      flashMode: this.data.flashMode === 'off' ? 'on' : 'off'
    })
  },

  sleep(ms) {
    return new Promise(r => setTimeout(r, ms))
  }
})
