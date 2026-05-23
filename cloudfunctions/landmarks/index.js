/**
 * 云函数：获取地标列表（公开）
 * 从 landmarks 集合读取，为空则返回默认数据
 */
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

const DEFAULTS = [
  { id: 'gate', name: '校门', stardewName: '知识的入口', category: '建筑', difficulty: 1, seasonHint: ['春', '秋'], hints: ['找一找学校最显眼的门'] },
  { id: 'library', name: '图书馆', stardewName: '智慧的远古祭坛', category: '建筑', difficulty: 2, seasonHint: ['春', '夏', '秋', '冬'], hints: ['最大的那栋楼，里面很安静'] },
  { id: 'cafeteria', name: '食堂', stardewName: '丰收的盛宴厅', category: '生活', difficulty: 1, seasonHint: ['春', '夏', '秋', '冬'], hints: ['饭点最热闹的地方'] },
  { id: 'stadium', name: '体育场', stardewName: '竞技者的旷野', category: '运动', difficulty: 2, seasonHint: ['春', '秋'], hints: ['很大的圆形场地'] },
  { id: 'lake', name: '湖泊', stardewName: '宁静的月光湖', category: '景观', difficulty: 2, seasonHint: ['春', '夏', '秋'], hints: ['有水的地方，傍晚去最美'] },
  { id: 'museum', name: '校史馆', stardewName: '时光的回廊', category: '文化', difficulty: 3, seasonHint: ['春', '秋'], hints: ['记载着学校故事的地方'] },
  { id: 'statue', name: '名人雕像', stardewName: '先贤的守望', category: '雕塑', difficulty: 2, seasonHint: ['春', '夏', '秋', '冬'], hints: ['广场上最显眼的雕塑'] },
  { id: 'dormitory', name: '宿舍区', stardewName: '温馨的休憩所', category: '生活', difficulty: 1, seasonHint: ['春', '夏', '秋', '冬'], hints: ['晚上亮灯最多的地方'] },
  { id: 'teaching', name: '教学楼', stardewName: '知识的工坊', category: '建筑', difficulty: 1, seasonHint: ['春', '夏', '秋', '冬'], hints: ['上课最多的地方'] },
  { id: 'garden', name: '花园', stardewName: '精灵的低语花园', category: '景观', difficulty: 3, seasonHint: ['春', '夏'], hints: ['花开得很美的地方'] }
]

exports.main = async () => {
  try {
    const result = await db.collection('landmarks').orderBy('difficulty', 'asc').get()
    if (result.data.length > 0) {
      return { code: 0, data: result.data }
    }
  } catch (e) {}
  return { code: 0, data: DEFAULTS }
}
