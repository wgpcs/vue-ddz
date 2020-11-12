export const msgMix = {
  data() {
    return {}
  },
  methods: {
    onWSMsg() {
      this.WS.onmessage = res => {
        // this.msg = ''
        console.log('onmessage', res)
        // console.log('onmessage-pok', data.pokers)
        let data = JSON.parse(res.data)
        this.clearhis(data)
        if (data.chat) {
          this.smsg = data.chat
        } else {
          this.smsg = ''
        }
        // 胜利
        if (data.sub_type == '7') {
          this.winner(data)
        }
        // 就位
        if (data.sub_type == '0') {
          this.sitdown(data)
        }
        // 准备
        if (data.sub_type == '6') {
          this.readyPlay(data)
        }
        // 发牌
        if (data.pokers && data.sub_type == '3') {
          this.shuffleCards(data)
        }

        // 出牌
        if (data.pokers && data.sub_type == '4') {
          this.submitCards(data)
        }
      }
    },
    /**
     * 出牌历史
     */
    clearhis(data) {
      if (this.seatIndex == data.player_current) this.clearHistory(this.seatIndex)
      if (data.new_circle) {
        this.clearHistory()
        this.newcircle = true
        this.reset()
      } else {
        this.newcircle = false
      }
    },
    /**
     * 胜利
     */
    winner(data) {
      this.msg = `${data.player_current}号玩家获胜`
      console.log(data.player_current, this.seatIndex)
      if (data.player_current == this.seatIndex) {
        this.submitCards(data)
        this.soundEff(10)
        this.smsg = '恭喜！！你赢了'
      } else {
        this.soundEff(9)
        this.smsg = '失败'
      }
      this.ready = false
    },
    /**
     * 就位
     */
    sitdown(data) {
      this.msg = data.player_current + '牌友上桌了'
      let i = this.seats.findIndex(v => v.sitID == data.player_current)
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
     * 准备
     */
    readyPlay(data) {
      this.$refs.audio && (this.$refs.audio.volume = 0.1)
      this.currentPlayer = data.player_current
    },
    /**
     * 发牌
     */
    shuffleCards(data) {
      this.myPokers = data.pokers
      this.wSt()
    },
    /**
     * 出牌
     */
    submitCards(data) {
      let pushplayer = data.player_current
      let pushPoker = data.pokers
      // console.log(pushplayer, pushPoker, this.seatIndex)
      this.msg = ''
      if (pokers.length >= 4 && pokers.every(el => el.label === pokers[0].label)) {
        this.soundEff(2)
      }
      if (pokers.kength == 2 && pokers[0].label == 'JOKER') {
        this.soundEff(1)
      }
      if (pokers.kength == 1 && pokers[0].v == '10001') {
        this.soundEff(12)
      }
      // 自己出牌成功
      if (pushPoker && pushplayer == this.seatIndex) {
        this.compPush()
      } else {
        if (pushPoker.length > 0) {
          let pokers = []
          this.eachPokAndFormat(pokers, pushPoker)
          // console.log(pokers)
          this.msg = `${pushplayer}号位置 出牌${pokers[0].label}`

          this.identifyPoker(pushplayer, pokers)
        } else {
          this.msg = `${pushplayer}号位置 要不起`
          this.soundEff(4)
          this.identifyPoker(pushplayer)
          // setTimeout(() => {
          //   this.seseatsat[pushplayer].speak()
          // }, 2000)
        }
      }
    },
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
        case 9:
          mp3u = require('../../assets/music/lose.wav')
          break
        case 11:
          mp3u = require('../../assets/music/fp.mp3')
          break
        default:
          mp3u = require('../../assets/music/cp.mp3')
          break
      }
      var mp3 = new Audio(mp3u)
      // console.log(mp3)
      mp3.play()
    },
    reset() {
      this.smsg = ''
      this.msg = ''
    }
  }
}
