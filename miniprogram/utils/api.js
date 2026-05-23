/**
 * 云函数调用封装
 * 云不可用时返回模拟数据
 */
const app = getApp()

const callFunction = (name, data = {}) => {
  if (!app.globalData.cloudReady) {
    return Promise.reject({ errMsg: 'cloud not ready', code: -1 })
  }
  return wx.cloud.callFunction({ name, data }).then(res => res.result)
}

/** 模拟数据 */
const MOCK = {
  login: { code: 0, openid: 'mock_openid', isNewUser: true },
  recognize: { code: 0, landmarkId: 'library', confidence: 0.92, landmarkName: '图书馆' },
  checkin: { code: 0, checkinId: 'mock_id', message: '打卡成功' },
  landmarks: { code: 0, data: [] },
  progress: { code: 0, data: { discovered: 0, total: 10, percentage: 0, checkinCount: 0, badges: [], recentCheckins: [] } },
  leaderboard: { code: 0, data: [] }
}

module.exports = {
  login() {
    return callFunction('login').catch(() => MOCK.login)
  },

  recognize(frameData) {
    return callFunction('recognize', { frame: frameData }).catch(() => ({
      ...MOCK.recognize,
      landmarkId: ['gate', 'library', 'cafeteria', 'stadium', 'lake', 'statue'][Math.floor(Math.random() * 6)],
      landmarkName: '模拟地标'
    }))
  },

  checkin(landmarkId, photoUrl, confidence) {
    return callFunction('checkin', { landmarkId, photoUrl, confidence }).catch(() => MOCK.checkin)
  },

  getLandmarks() {
    return callFunction('landmarks').catch(() => MOCK.landmarks)
  },

  getProgress() {
    return callFunction('progress').catch(() => MOCK.progress)
  },

  getLeaderboard(type) {
    return callFunction('leaderboard', { type }).catch(() => MOCK.leaderboard)
  }
}
