/**
 * 云函数调用封装
 */
const callFunction = (name, data = {}) => {
  return wx.cloud.callFunction({
    name,
    data
  }).then(res => res.result)
}

module.exports = {
  /** 登录获取 openid */
  login() {
    return callFunction('login')
  },

  /** 打卡识别 */
  recognize(frameData) {
    return callFunction('recognize', { frame: frameData })
  },

  /** 提交打卡 */
  checkin(landmarkId, photoUrl, confidence) {
    return callFunction('checkin', {
      landmarkId,
      photoUrl,
      confidence
    })
  },

  /** 获取全部地标 */
  getLandmarks() {
    return callFunction('landmarks')
  },

  /** 获取用户进度 */
  getProgress() {
    return callFunction('progress')
  },

  /** 获取排行榜 */
  getLeaderboard(type = 'personal') {
    return callFunction('leaderboard', { type })
  }
}
