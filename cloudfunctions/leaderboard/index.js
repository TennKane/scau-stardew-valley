/**
 * 云函数：排行榜
 */
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const { type = 'personal' } = event

  // 按打卡数降序排列
  const users = await db.collection('users')
    .orderBy('checkinCount', 'desc')
    .limit(50)
    .get()

  const rank = users.data.map((u, i) => ({
    rank: i + 1,
    nickname: u.nickname || '匿名探险家',
    avatar: u.avatar || '',
    checkinCount: u.checkinCount || 0
  }))

  return { code: 0, data: rank }
}
