/**
 * API 封装
 * 云环境开通前返回模拟数据
 */
const MOCK = {
  login: { code: 0, openid: 'demo_user', isNewUser: true },
  recognize: { code: 0, landmarkId: 'library', confidence: 0.92, landmarkName: '图书馆' },
  checkin: { code: 0, checkinId: 'mock_id', message: '打卡成功' },
  landmarks: { code: 0, data: [] },
  progress: { code: 0, data: { discovered: 0, total: 10, percentage: 0, checkinCount: 0, badges: [], recentCheckins: [] } },
  leaderboard: { code: 0, data: [] }
}

const idList = ['gate', 'library', 'cafeteria', 'stadium', 'lake', 'statue']

module.exports = {
  login() { return Promise.resolve(MOCK.login) },

  recognize(frameData) {
    return Promise.resolve({
      ...MOCK.recognize,
      landmarkId: idList[Math.floor(Math.random() * idList.length)],
      landmarkName: '模拟识别'
    })
  },

  checkin(landmarkId, photoUrl, confidence) {
    return Promise.resolve(MOCK.checkin)
  },

  getLandmarks() { return Promise.resolve(MOCK.landmarks) },

  getProgress() { return Promise.resolve(MOCK.progress) },

  getLeaderboard(type) { return Promise.resolve(MOCK.leaderboard) }
}
