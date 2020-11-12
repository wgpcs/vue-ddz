export const commonMix = {
  data() {
    return {}
  },
  methods: {
    /**
     * 音效
     * @param {int} type
     */
    soundEff(type = 0) {
      let mp3u = ''
      switch (type) {
        case 1:
          mp3u = require('../../assets/music/wz.mp3')
          break
        case 2:
          mp3u = require('../../assets/music/zd.mp3')
          break
        case 3:
          mp3u = require('../../assets/music/sz.mp3')
          break
        case 4:
          let u1 = require('../../assets/music/ybq.mp3')
          let u2 = require('../../assets/music/ybq2.mp3')
          // let urls = ['../../assets/music/ybq.mp3', '../../assets/music/ybq2.mp3']
          let index = this.getRandomNumberByRange(0, 3)
          // console.log(index, urls[index - 1])
          mp3u = index == 1 ? u2 : u1
          break
        case 9:
          mp3u = require('../../assets/music/lose.wav')
          break
        case 10:
          mp3u = require('../../assets/music/winner.mp3')
          break
        case 11:
          mp3u = require('../../assets/music/fp.mp3')
          break
        case 12:
          mp3u = require('../../assets/music/daw.mp3')
          break
        default:
          mp3u = require('../../assets/music/cp.mp3')
          break
      }
      var mp3 = new Audio(mp3u)
      console.log(mp3)
      mp3.play()
    },
    getRandomNumberByRange(start, end) {
      return Math.floor(Math.random() * (end - start) + start)
    }
  }
}
