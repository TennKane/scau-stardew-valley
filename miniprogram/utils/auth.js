/**
 * 登录鉴权
 */
module.exports = {
  check() {
    const app = getApp()
    if (app.globalData.openid) return true

    const auth = wx.getStorageSync('userAuth')
    if (auth && auth.openid) {
      app.globalData.openid = auth.openid
      app.globalData.role = auth.role || ''
      return true
    }

    wx.showModal({
      title: '需要登录',
      content: '请先登录后使用星露谷校园探索',
      success() {
        wx.switchTab({ url: '/pages/profile/profile' })
      }
    })
    return false
  }
}
