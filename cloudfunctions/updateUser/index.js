/**
 * 云函数：更新用户资料（昵称/头像）
 */
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const { nickName, avatarUrl } = event

  if (!nickName && !avatarUrl) {
    return { code: -1, message: '没有要更新的字段' }
  }

  const updateData = {}
  if (nickName) updateData.nickname = nickName
  if (avatarUrl) updateData.avatar = avatarUrl

  await db.collection('users').where({ openid: OPENID }).update({
    data: updateData
  })

  return { code: 0, message: '更新成功' }
}
