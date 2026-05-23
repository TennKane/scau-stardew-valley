/**
 * 云函数：图像识别（云端兜底）
 * 接收帧数据，返回匹配的地标ID和置信度
 *
 * MVP 阶段：返回模拟数据
 * 后续接入：TensorFlow.js / 腾讯云 AI
 */
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

// 预定义的简单特征匹配（MVP 硬编码示例）
const LANDMARK_FEATURES = {
  gate: { keywords: ['门', '校门', '大门', '牌坊'] },
  library: { keywords: ['图书馆', '书', '楼'] },
  cafeteria: { keywords: ['食堂', '饭', '餐'] },
  stadium: { keywords: ['体育', '操场', '运动'] },
  lake: { keywords: ['湖', '水', '桥'] },
  museum: { keywords: ['校史', '展览', '历史'] },
  statue: { keywords: ['雕像', '像', '雕塑'] },
  dormitory: { keywords: ['宿舍', '住'] },
  teaching: { keywords: ['教学', '教室', '课'] },
  garden: { keywords: ['花', '园', '树'] }
}

exports.main = async (event, context) => {
  const { frame } = event

  // MVP 阶段：返回模拟识别结果
  // 实际实现需要集成 ML 模型推理

  // TODO: 接入 TFLite / 腾讯云 AI 地标识别
  // TODO: 特征向量相似度匹配

  // 模拟：随机返回一个地标（后续替换为真实推理）
  const landmarkIds = Object.keys(LANDMARK_FEATURES)
  const randomId = landmarkIds[Math.floor(Math.random() * landmarkIds.length)]

  return {
    code: 0,
    landmarkId: randomId,
    confidence: 0.92,
    landmarkName: randomId
  }
}
