/**
 * 校园地标数据
 * 每个地标对应一个打卡点
 */
const LANDMARKS = [
  {
    id: 'gate',
    name: '校门',
    stardewName: '知识的入口',
    description: '宏伟的校门见证了无数学子的来来往往。',
    category: '建筑',
    difficulty: 1,
    seasonHint: ['春', '秋'],
    hints: [
      '找一找学校最显眼的门',
      '门口有大字的建筑'
    ]
  },
  {
    id: 'library',
    name: '图书馆',
    stardewName: '智慧的远古祭坛',
    description: '藏书万卷的殿堂，安静的角落里藏着无数故事。',
    category: '建筑',
    difficulty: 2,
    seasonHint: ['春', '夏', '秋', '冬'],
    hints: [
      '最大的那栋楼，里面很安静',
      '寻找书的海洋'
    ]
  },
  {
    id: 'cafeteria',
    name: '食堂',
    stardewName: '丰收的盛宴厅',
    description: '一日三餐，人间烟火，这里是最治愈的地方。',
    category: '生活',
    difficulty: 1,
    seasonHint: ['春', '夏', '秋', '冬'],
    hints: [
      '饭点最热闹的地方',
      '闻着香味就能找到'
    ]
  },
  {
    id: 'stadium',
    name: '体育场',
    stardewName: '竞技者的旷野',
    description: '汗水与呐喊交织的地方，青春在这里奔跑。',
    category: '运动',
    difficulty: 2,
    seasonHint: ['春', '秋'],
    hints: [
      '很大的圆形场地',
      '运动会的时候最热闹'
    ]
  },
  {
    id: 'lake',
    name: '湖泊',
    stardewName: '宁静的月光湖',
    description: '波光粼粼的水面，倒映着岸边的垂柳与星空。',
    category: '景观',
    difficulty: 2,
    seasonHint: ['春', '夏', '秋'],
    hints: [
      '有水的地方',
      '傍晚去最美'
    ]
  },
  {
    id: 'museum',
    name: '校史馆',
    stardewName: '时光的回廊',
    description: '陈列着学校的历史与荣耀，每一件展品都是一段故事。',
    category: '文化',
    difficulty: 3,
    seasonHint: ['春', '秋'],
    hints: [
      '记载着学校故事的地方',
      '比较安静的一角'
    ]
  },
  {
    id: 'statue',
    name: '名人雕像',
    stardewName: '先贤的守望',
    description: '矗立在校园中央，默默注视着来来往往的学子。',
    category: '雕塑',
    difficulty: 2,
    seasonHint: ['春', '夏', '秋', '冬'],
    hints: [
      '广场上最显眼的雕塑',
      '很多人在这里合影'
    ]
  },
  {
    id: 'dormitory',
    name: '宿舍区',
    stardewName: '温馨的休憩所',
    description: '多少个夜晚的卧谈会，多少段友谊从这里开始。',
    category: '生活',
    difficulty: 1,
    seasonHint: ['春', '夏', '秋', '冬'],
    hints: [
      '晚上亮灯最多的地方',
      '你住的地方'
    ]
  },
  {
    id: 'teaching',
    name: '教学楼',
    stardewName: '知识的工坊',
    description: '每天穿梭的走廊，承载着求知与成长的足迹。',
    category: '建筑',
    difficulty: 1,
    seasonHint: ['春', '夏', '秋', '冬'],
    hints: [
      '上课最多的地方',
      '有好多教室的大楼'
    ]
  },
  {
    id: 'garden',
    name: '花园',
    stardewName: '精灵的低语花园',
    description: '四季花开的小角落，是校园里最浪漫的秘密基地。',
    category: '景观',
    difficulty: 3,
    seasonHint: ['春', '夏'],
    hints: [
      '花开得很美的地方',
      '蝴蝶喜欢来这里'
    ]
  }
]

module.exports = {
  LANDMARKS,
  getLandmark(id) {
    return LANDMARKS.find(l => l.id === id)
  },
  getLandmarksByCategory(category) {
    return category ? LANDMARKS.filter(l => l.category === category) : LANDMARKS
  }
}
