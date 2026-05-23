/**
 * 云函数：获取用户探索进度
 */
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async () => {
  const { OPENID } = cloud.getWXContext()

  const [checkins, users, landmarksCount] = await Promise.all([
    db.collection('checkins').where({ openid: OPENID }).orderBy('createdAt', 'desc').get(),
    db.collection('users').where({ openid: OPENID }).get(),
    db.collection('landmarks').count().catch(() => ({ total: 0 }))
  ])

  const user = users.data[0] || {}
  const totalLandmarks = landmarksCount.total || 0
  const checkinCount = checkins.data.length

  return {
    code: 0,
    data: {
      discovered: checkinCount,
      total: totalLandmarks,
      percentage: totalLandmarks ? Math.round((checkinCount / totalLandmarks) * 100) : 0,
      checkinCount: user.checkinCount || 0,
      badges: user.badges || [],
      discoveredIds: [...new Set(checkins.data.map(c => c.landmarkId))],
      recentCheckins: checkins.data.slice(0, 10).map(c => ({
        landmarkId: c.landmarkId,
        time: c.createdAt
      }))
    }
  }
}
