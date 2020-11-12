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
  sitdown(player) {
    this.player = player
  }
  leav() {
    this.player = null
  }
}

export default Seat
