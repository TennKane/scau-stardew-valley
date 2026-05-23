/**
 * 云函数：打卡提交
 * 保存打卡记录，更新用户统计
 */
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const { landmarkId, photoUrl, confidence } = event

  if (!landmarkId) {
    return { code: -1, message: '缺少地标ID' }
  }

  // 检查是否已打卡
  const existing = await db.collection('checkins').where({
    openid: OPENID,
    landmarkId
  }).get()

  if (existing.data.length > 0) {
    return {
      code: 1,
      message: '已打卡过此地标',
      isRepeat: true
    }
  }

  // 写入打卡记录
  const result = await db.collection('checkins').add({
    data: {
      openid: OPENID,
      landmarkId,
      photoUrl: photoUrl || '',
      confidence: confidence || 0,
      createdAt: db.serverDate()
    }
  })

  // 更新用户计数
  await db.collection('users').where({ openid: OPENID }).update({
    data: {
      checkinCount: db.command.inc(1),
      lastCheckin: db.serverDate()
    }
  })

  return {
    code: 0,
    checkinId: result._id,
    message: '打卡成功'
  }
}
