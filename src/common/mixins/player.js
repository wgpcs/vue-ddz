import Player from '../../modules/player'
import Seat from '../../modules/seat'
export const seatMix = {
  data() {
    return {
      startNum: 0,
      playersNum: 4,
      historyCards: [],
      // 0-左，1-右，2-上
      seats: [new Player(), new Player(), new Player()]
    }
  },
  created() {
    this.initPlayer()
  },
  methods: {
    initPlayer() {},
    /**
     * 对号入座 （从 0 开始）
     * @param {*int} id 当前用户的座位号
     */
    identifySeat(id = 0) {
      let sid = parseInt(id)
      let maxNum = this.playersNum - 1
      let lsit = sid - 1 < this.startNum ? maxNum : sid - 1
      let rsit = sid + 1 > maxNum ? this.startNum : sid + 1
      let tsit = sid + 2 > maxNum ? sid - 2 : sid + 2
      this.seats[0].sitdown(lsit)
      this.seats[1].sitdown(rsit)
      this.seats[2].sitdown(tsit)
      console.log(this.seats)
    },
    /**
     * 对应出牌人
     * @param {int} pid // 出派人位置
     * @param {array} pokers // 打出牌
     */
    identifyPoker(pid, pokers = []) {
      // console.log(pokers, this.seats)
      let i = this.seats.findIndex(v => v.sitID == pid)
      // console.log(pid)
      // console.log(i, this.seats[i])
      if (i !== -1) {
        if (pokers.length > 0) {
          this.seats[i].pushCard(pokers)
        } else {
          this.seats[i].speak('不要')
          this.seats[i].clearHistory()
        }
      }
    },
    /**
     * 新一轮，清空出牌
     */
    clearHistory(me = -1) {
      if (me !== -1) {
        this.historyCards = []
        return
      }
      this.seats.forEach(item => {
        item.clearHistory()
        item.shutUp()
      })
    }
  }
}
