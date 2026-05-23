/**
 * 云函数：管理后台操作（仅 role=admin 可用）
 */
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

/** 默认地标数据（首次导入用） */
const DEFAULT_LANDMARKS = [
  { id: 'gate', name: '校门', stardewName: '知识的入口', description: '宏伟的校门见证了无数学子的来来往往。', category: '建筑', difficulty: 1, seasonHint: ['春', '秋'], hints: ['找一找学校最显眼的门', '门口有大字的建筑'] },
  { id: 'library', name: '图书馆', stardewName: '智慧的远古祭坛', description: '藏书万卷的殿堂，安静的角落里藏着无数故事。', category: '建筑', difficulty: 2, seasonHint: ['春', '夏', '秋', '冬'], hints: ['最大的那栋楼，里面很安静', '寻找书的海洋'] },
  { id: 'cafeteria', name: '食堂', stardewName: '丰收的盛宴厅', description: '一日三餐，人间烟火，这里是最治愈的地方。', category: '生活', difficulty: 1, seasonHint: ['春', '夏', '秋', '冬'], hints: ['饭点最热闹的地方', '闻着香味就能找到'] },
  { id: 'stadium', name: '体育场', stardewName: '竞技者的旷野', description: '汗水与呐喊交织的地方，青春在这里奔跑。', category: '运动', difficulty: 2, seasonHint: ['春', '秋'], hints: ['很大的圆形场地', '运动会的时候最热闹'] },
  { id: 'lake', name: '湖泊', stardewName: '宁静的月光湖', description: '波光粼粼的水面，倒映着岸边的垂柳与星空。', category: '景观', difficulty: 2, seasonHint: ['春', '夏', '秋'], hints: ['有水的地方', '傍晚去最美'] },
  { id: 'museum', name: '校史馆', stardewName: '时光的回廊', description: '陈列着学校的历史与荣耀，每一件展品都是一段故事。', category: '文化', difficulty: 3, seasonHint: ['春', '秋'], hints: ['记载着学校故事的地方', '比较安静的一角'] },
  { id: 'statue', name: '名人雕像', stardewName: '先贤的守望', description: '矗立在校园中央，默默注视着来来往往的学子。', category: '雕塑', difficulty: 2, seasonHint: ['春', '夏', '秋', '冬'], hints: ['广场上最显眼的雕塑', '很多人在这里合影'] },
  { id: 'dormitory', name: '宿舍区', stardewName: '温馨的休憩所', description: '多少个夜晚的卧谈会，多少段友谊从这里开始。', category: '生活', difficulty: 1, seasonHint: ['春', '夏', '秋', '冬'], hints: ['晚上亮灯最多的地方', '你住的地方'] },
  { id: 'teaching', name: '教学楼', stardewName: '知识的工坊', description: '每天穿梭的走廊，承载着求知与成长的足迹。', category: '建筑', difficulty: 1, seasonHint: ['春', '夏', '秋', '冬'], hints: ['上课最多的地方', '有好多教室的大楼'] },
  { id: 'garden', name: '花园', stardewName: '精灵的低语花园', description: '四季花开的小角落，是校园里最浪漫的秘密基地。', category: '景观', difficulty: 3, seasonHint: ['春', '夏'], hints: ['花开得很美的地方', '蝴蝶喜欢来这里'] }
]

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const { action, id, data } = event

  // 验证管理员身份
  const user = await db.collection('users').where({ openid: OPENID }).get()
  const userData = user.data[0]
  if (!userData || userData.role !== 'admin') {
    return { code: -1, message: '无权限' }
  }

  switch (action) {

    case 'getLandmarks': {
      const result = await db.collection('landmarks').orderBy('difficulty', 'asc').get()
      return { code: 0, data: result.data }
    }

    case 'addLandmark': {
      if (!data || !data.name) return { code: -1, message: '缺少地标名称' }
      const result = await db.collection('landmarks').add({
        data: { ...data, createdAt: db.serverDate() }
      })
      return { code: 0, id: result._id }
    }

    case 'updateLandmark': {
      if (!id || !data) return { code: -1, message: '缺少参数' }
      await db.collection('landmarks').doc(id).update({ data })
      return { code: 0, message: '更新成功' }
    }

    case 'deleteLandmark': {
      if (!id) return { code: -1, message: '缺少 ID' }
      await db.collection('landmarks').doc(id).remove()
      return { code: 0, message: '已删除' }
    }

    case 'seedLandmarks': {
      // 检查是否已有数据
      const existing = await db.collection('landmarks').count()
      if (existing.total > 0) {
        return { code: -1, message: `已有 ${existing.total} 个地标，无需导入` }
      }
      const batch = db.collection('landmarks')
      const tasks = DEFAULT_LANDMARKS.map(l => batch.add({ data: { ...l, createdAt: db.serverDate() } }))
      await Promise.all(tasks)
      return { code: 0, count: DEFAULT_LANDMARKS.length }
    }

    case 'getStats': {
      const [checkinCount, userCount, landmarkCount] = await Promise.all([
        db.collection('checkins').count(),
        db.collection('users').count(),
        db.collection('landmarks').count()
      ])
      return {
        code: 0,
        data: {
          totalCheckins: checkinCount.total,
          totalUsers: userCount.total,
          totalLandmarks: landmarkCount.total
        }
      }
    }

    default:
      return { code: -1, message: `未知操作: ${action}` }
  }
}
