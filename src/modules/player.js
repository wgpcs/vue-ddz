/**
 * description 用户
 */
class Player {
  constructor(id, name, singlePoker) {
    // if (!Player.instance) {
    this.uid = id
    this.name = name
    this.say = ''
    this.sitID = ''
    this.poker = singlePoker
    this.cardsNum = 0
    this.history = []
    //   Player.instance = this
    // }
    // return Player.instance
  }
  /**
   * 就坐
   * @param {int} sid
   */
  sitdown(sid) {
    this.sitID = sid
  }
  /**
   * 离开座位
   */
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
  /**
   * 清除桌面
   */
  clearHistory() {
    this.history = []
  }
  /**
   * 发言
   * @param {string} msg
   */
  speak(msg) {
    this.say = msg
  }
  /**
   * 清空发言
   */
  shutUp() {
    this.say = ''
  }
  /**
   * 抓牌
   * @param {object} singlePoker
   */
  drawCards(singlePoker) {
    this.poker = singlePoker
  }
}

export default Player
