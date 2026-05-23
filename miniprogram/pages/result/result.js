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
      const landmark = landmarks.getLandmark(landmarkId)
      this.setData({
        landmark,
        discovered: true,
        isCollectionView: true
      })
    }
  }
})
