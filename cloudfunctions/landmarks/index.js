/**
 * 云函数：获取地标列表（公开）
 * 从 landmarks 集合读取
 */
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async () => {
  try {
    const result = await db.collection('landmarks').orderBy('difficulty', 'asc').get()
    return { code: 0, data: result.data }
  } catch (e) {
    return { code: 0, data: [] }
  }
}
