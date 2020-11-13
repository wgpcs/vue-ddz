/**
 * 音效策略
 */
// class kingboomSence{
//   constructor() {
//     this.sence = require('../../assets/music/wz.mp3')
//   }
//   play() {
//     let mp3 = new Audio(this.scene)
//     mp3.play()
//   }
// }
const soundScene = {
  kingboom: require('../assets/music/wz.mp3'), // 王炸
  boom: require('../assets/music/zd.mp3'), // 炸弹
  noout: [require('../assets/music/ybq.mp3'), require('../assets/music/ybq2.mp3')], // 要不起
  lose: require('../assets/music/lose.wav'),
  winner: require('../assets/music/winner.mp3'),
  push: require('../assets/music/cp.mp3'), // 出牌
  bigking: require('../assets/music/daw.mp3'), // 大王
  ready: require('../assets/music/fp.mp3')
}

class SoundEffect {
  constructor(scene) {
    this.scene = soundScene[scene] || null
  }
  setScene(scene) {
    console.log(soundScene[scene])
    this.scene = soundScene[scene]
    return this
  }
  play() {
    if (!this.scene) return
    let url = this.scene
    console.log(this.scene)
    if (Object.prototype.toString.call(this.scene) === '[object Array]' && this.scene.length > 0) {
      let maxNum = this.scene.length + 1
      let index = this.getRandomNumberByRange(0, maxNum)
      url = this.scene[index - 1]
    }
    let mp3 = new Audio(url)
    mp3.play()
  }
  getRandomNumberByRange(start, end) {
    return Math.floor(Math.random() * (end - start) + start)
  }
}

export default SoundEffect
