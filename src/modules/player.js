/**
 * description 用户
 */
// import SinglePoker from './card'
// var singlePoker = new SinglePoker()
class Player {
  constructor(id, name, singlePoker) {
    // if (!Player.instance) {
    this.uid = id
    this.name = name
    this.say = ''
    this.sitID = ''
    this.poker = singlePoker
    this.cardsNum = ''
    this.history = []
    //   Player.instance = this
    // }
    // return Player.instance
  }
  sitdown(id) {
    this.sitID = id
  }
  leav() {
    this.sitID = ''
  }
  /**
   * 出牌
   * @param {array} pokers 打出得牌
   */
  pushCard(pokers) {
    this.history = pokers
  }
  clearHistory() {
    this.history = []
  }
  speak(msg) {
    this.say = msg
  }
  shutUp() {
    this.say = ''
  }
  drawCards(singlePoker) {
    this.poker = singlePoker
  }
}

export default Player
