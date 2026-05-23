/**
 * 云函数：微信登录
 * 获取用户 openid，返回自定义登录态
 */
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()

  // 查找或创建用户
  let user
  try {
    user = await db.collection('users').where({ openid: OPENID }).get()
  } catch (e) {
    // 集合不存在则创建
  }

  if (!user || user.data.length === 0) {
    await db.collection('users').add({
      data: {
        openid: OPENID,
        nickname: '新探险家',
        avatar: '',
        role: '',
        badges: [],
        checkinCount: 0,
        lastCheckin: null,
        createdAt: db.serverDate()
      }
    })
  }

  const userData = user?.data?.[0] || { role: '' }

  return {
    code: 0,
    openid: OPENID,
    role: userData.role || '',
    isNewUser: !user || user.data.length === 0
  }
}
