/**
 * 云函数调用封装
 */
const callFunction = (name, data = {}) => {
  return wx.cloud.callFunction({ name, data }).then(res => res.result)
}

/** 降级：云函数不可用时的模拟数据 */
const MOCK = {
  login: { code: 0, openid: 'demo_user', isNewUser: true },
  recognize: { code: 0, landmarkId: 'library', confidence: 0.92, landmarkName: '图书馆' },
  checkin: { code: 0, checkinId: 'mock_id', message: '打卡成功' },
  landmarks: { code: 0, data: [] },
  progress: { code: 0, data: { discovered: 0, total: 10, percentage: 0, checkinCount: 0, badges: [], recentCheckins: [] } },
  leaderboard: { code: 0, data: [] }
}

const idList = ['gate', 'library', 'cafeteria', 'stadium', 'lake', 'statue']

const withFallback = (fn, mock) => {
  return (...args) => fn(...args).catch(() => mock)
}

module.exports = {
  login: withFallback(
    () => callFunction('login'),
    MOCK.login
  ),

  recognize: withFallback(
    (frameData) => callFunction('recognize', { frame: frameData }),
    {
      ...MOCK.recognize,
      landmarkId: idList[Math.floor(Math.random() * idList.length)],
      landmarkName: '模拟识别'
    }
  ),

  checkin: withFallback(
    (landmarkId, photoUrl, confidence) => callFunction('checkin', { landmarkId, photoUrl, confidence }),
    MOCK.checkin
  ),

  getLandmarks: withFallback(
    () => callFunction('landmarks'),
    MOCK.landmarks
  ),

  getProgress: withFallback(
    () => callFunction('progress'),
    MOCK.progress
  ),

  getLeaderboard: withFallback(
    (type) => callFunction('leaderboard', { type }),
    MOCK.leaderboard
  ),

  updateUser: withFallback(
    (data) => callFunction('updateUser', data),
    { code: 0, message: '更新成功' }
  )
}
