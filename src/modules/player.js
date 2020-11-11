/**
 * description 用户
 */

class Player {
  constructor(id, name) {
    ;(this.uid = id), (this.name = name), (this.chat = ''), (this.sitID = ''), (this.pokers = []), (this.history = [])
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
    this.chat = msg
  }
  shutUp() {
    this.chat = ''
  }
  drawCards() {}
}
