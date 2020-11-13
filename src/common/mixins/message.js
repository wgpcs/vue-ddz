import SinglePoker from '../../modules/card'
import SoundEffect from '../../modules/soundEffect'
let singlePoker = new SinglePoker()
let soundEff = new SoundEffect()
export const msgMix = {
  data() {
    return {
      startStatus: false
    }
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
          this.initCountdownTime() // 初始化计时器时间
          this.timingBegin()
          this.submitCards(data)
        }
      }
    },
    /**
     * 出牌历史
     */
    clearhis(data) {
      if (this.seatIndex == data.player_current) this.clearHistory(this.seatIndex)
      // 新一轮出牌
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
      this.startStatus = false
      this.msg = `${data.player_current}号玩家获胜`
      console.log(data.player_current, this.seatIndex)
      if (data.player_current == this.seatIndex) {
        this.submitCards(data)
        // this.soundEff(10)
        soundEff.setSence('winner').play()
        this.smsg = '恭喜！！你赢了'
      } else {
        // this.soundEff(9)
        soundEff.setSence('lose').play()
        this.smsg = '失败'
      }
      this.ready = false
    },
    /**
     * 就位
     */
    sitdown(data) {
      this.msg = data.player_current + '牌友上桌了'
      this.identifySeat(data.player_current)
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
      this.startStatus = true
      this.myPokers = data.pokers
      this.wSt()
    },
    /**
     * 出牌
     */
    submitCards(data) {
      let pushplayer = data.player_current
      let pushPoker = data.pokers
      singlePoker.init(pushPoker)

      // console.log(pushplayer, pushPoker, this.seatIndex)
      this.msg = ''
      // let pokers = []
      // this.eachPokAndFormat(pokers, pushPoker)
      this.chooseSence(singlePoker.cards)
      // 自己出牌成功
      if (singlePoker.cards && pushplayer == this.seatIndex) {
        if (singlePoker.cards.length > 0) {
          this.compPush()
        } else{
          
        }
        
      } else {
        if (singlePoker.cards.length > 0) {
          // console.log(pokers)
          this.msg = `${pushplayer}号位置 出牌${singlePoker.cards[0].label}`
          this.identifyPoker(pushplayer, singlePoker.cards)
        } else {
          this.msg = `${pushplayer}号位置 要不起`
          // this.soundEff(4)
          soundEff.setScene('noout').play()
          this.identifyPoker(pushplayer)
          // setTimeout(() => {
          //   this.seseatsat[pushplayer].speak()
          // }, 2000)
        }
      }
    },
    /**
     * 判断音效
     * @param {array} pokers 玩家打出得牌
     */
    chooseSence(pokers) {
      console.log(pokers)
      if (pokers.length < 0) return
      if (pokers.length >= 4 && pokers.every(el => el.label === pokers[0].label)) {
        // this.soundEff(2)
        soundEff.setScene('boom').play()
      }
      if (pokers.length == 2 && pokers[0].label == 'JOKER') {
        // this.soundEff(1)
        soundEff.setScene('kingboom').play()
      }
      if (pokers.length == 1 && pokers[0].v == '10001') {
        // this.soundEff(12)
        soundEff.setScene('bigking').play()
      }
    },
    reset() {
      this.smsg = ''
      this.msg = ''
    }
  }
}
