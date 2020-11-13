/**
 * description 用户
 */
// import SinglePoker from './card'
// var singlePoker = new SinglePoker()
class Seat {
  constructor(id, player) {
    // if (!Player.instance) {
    this.sitID = id
    this.player = player
    //   Player.instance = this
    // }
    // return Player.instance
  }
  /**
   * 座位编号
   * @param {int} id
   */
  sign(id) {
    this.sitID = id
  }
  fillSit(player) {
    this.player = player
  }
  leav() {
    this.player = null
  }
}

export default Seat
