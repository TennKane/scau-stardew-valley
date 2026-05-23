/**
 * 登录鉴权
 * 未登录时跳转到个人页
 */
module.exports = {
  check() {
    const app = getApp()
    if (app.globalData.openid) return true

    const saved = wx.getStorageSync('userProfile')
    if (saved && saved.openid) {
      app.globalData.openid = saved.openid
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
