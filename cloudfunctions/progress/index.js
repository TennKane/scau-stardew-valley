/**
 * 云函数：获取用户探索进度
 */
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async () => {
  const { OPENID } = cloud.getWXContext()

  // 获取用户打卡记录
  const checkins = await db.collection('checkins')
    .where({ openid: OPENID })
    .orderBy('createdAt', 'desc')
    .get()

  // 获取用户信息
  const users = await db.collection('users')
    .where({ openid: OPENID })
    .get()

  const user = users.data[0] || {}
  const totalLandmarks = 10

  return {
    code: 0,
    data: {
      discovered: checkins.data.length,
      total: totalLandmarks,
      percentage: Math.round((checkins.data.length / totalLandmarks) * 100),
      checkinCount: user.checkinCount || 0,
      badges: user.badges || [],
      recentCheckins: checkins.data.slice(0, 10).map(c => ({
        landmarkId: c.landmarkId,
        time: c.createdAt
      }))
    }
  }
}
