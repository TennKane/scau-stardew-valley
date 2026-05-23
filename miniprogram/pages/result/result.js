/**
 * 地标详情页
 */
const landmarks = require('../../utils/landmarks')

Page({
  data: {
    landmark: null,
    discovered: false,
    discoverTime: null,
    myPhoto: null,
    isCollectionView: false
  },

  onLoad(options) {
    const { landmarkId } = options
    if (landmarkId) {
      const raw = landmarks.getLandmark(landmarkId)
      const landmark = {
        ...raw,
        difficultyDisplay: '🌾 '.repeat(raw.difficulty),
        seasonDisplay: raw.seasonHint.join(' / ')
      }
      this.setData({
        landmark,
        discovered: true,
        isCollectionView: true
      })
    }
  }
})
