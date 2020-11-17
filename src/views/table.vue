<template>
  <div id="Table">
    <div class="audio">
      <!-- 炸弹 -->
      <audio ref="audio" src="../assets/music/zt_ljmb.mp3" autoplay="autoplay" loop="loop" style="display:none"></audio>
    </div>
    <div class="start-msg">
      <div class="container wui-flex wui-col wui-justify-center wui-align-center">
        <div class="seatinfo">{{ tableIndex }} 号桌子，第 {{ seatIndex }} 号位置</div>
        <div class="" v-if="!ready">准备中...</div>
        <div class="prepare" v-if="ready && !myPokers">等待其他玩家准备!</div>
        <div class="msg">{{ smsg }}</div>
        <div class="msg prepare">{{ msg }}</div>
        <div class="msg prepare">{{ countdown }}</div>
        <div class="msgCont">
          <div class="content" ref="MsgCont">
            <h3>{{ tableIndex }} 号桌子 欢迎 您来！</h3>
            <div class="chat">
              <p v-for="(item, i) in chatArr" :key="i">{{ item.msg }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="animation" v-show="showAni">
      <div class="middle-msg wui-flex wui-col wui-justify-center"></div>
      <div class="ani-main">
        <!-- 倒计时 -->
      </div>
    </div>
    <div class="main">
      <div class="table wui-flex wui-col">
        <!-- top -->
        <div class="table-top wui-flex-item" v-if="playersNum == 4">
          <div class="cards other wui-flex wui-col seat-place wui-align-center">
            <div class="seat">
              <!-- <label class="uname" style="text-align: center; margin: 50px">t-{{ seats[2].sitid }}</label> -->
              <div class="seat-style" v-if="seats[2].player">
                <img class="img" src="../assets/pm.png" />
              </div>
            </div>

            <div class="cards history wui-flex wui-col wui-flex-item ">
              <div class="wui-flex other-small wui-justify-center" v-if="seats[2].player">
                <card
                  class="card small"
                  v-for="(item, i) in seats[2].player.history"
                  :value="item.label"
                  :key="i"
                  :type="item.type"
                ></card>
              </div>
            </div>
            {{ seats[2].sitID }}
            <div class="say wui-flex wui-align-center" v-if="seats[2].player">{{ seats[2].player.say }}</div>
          </div>
        </div>
        <div class="main-top wui-flex wui-justify-between wui-align-center wui-flex-item">
          <div class="table-left">
            <div class="cards other cards-margin-left wui-flex">
              <!-- <label class="uname">l-{{ seats[0].sitid }}</label> -->
              <div class="seat">
                <div class="seat-style">
                  <img class="img" src="../assets/pm.png" v-if="seats[0].player" />
                </div>
              </div>
              <div class="cards history wui-flex wui-col wui-flex-item ">
                <div class="wui-flex other-small wui-justify-center" v-if="seats[0].player">
                  <card
                    class="card small"
                    v-for="(item, i) in seats[0].player.history"
                    :value="item.label"
                    :key="i"
                    :type="item.type"
                  ></card>
                </div>
              </div>
              {{ seats[0].sitID }}
              <div class="say wui-flex wui-align-center" v-if="seats[0].player">{{ seats[0].player.say }}</div>
              <div class="clear"></div>
            </div>
          </div>
          <div class="table-right">
            <div class="cards other cards-margin-right wui-flex">
              <div class="say wui-flex wui-align-center" v-if="seats[1].player">{{ seats[1].player.say }}</div>
              {{ seats[1].sitID }}
              <!-- 已出牌区域 -->
              <div class="cards history wui-flex wui-col wui-flex-item ">
                <div class="wui-flex other-small wui-justify-center" v-if="seats[1].player">
                  <card
                    class="card small"
                    v-for="(item, i) in seats[1].player.history"
                    :value="item.label"
                    :key="i"
                    :type="item.type"
                  ></card>
                </div>
              </div>

              <!-- <label class="uname">{{ seats[1].sitid }}</label> -->
              <div class="seat">
                <!-- <label class="uname" style="text-align: center; margin: 50px">t-{{ seats[2].sitid }}</label> -->
                <div class="seat-style">
                  <img class="img" src="../assets/pm.png" v-if="seats[1].player" />
                </div>
              </div>
              <div class="clear"></div>
            </div>
          </div>
        </div>

        <div class="main-bottom wui-flex-item wui-flex wui-col">
          <div class="say wui-flex wui-align-center" v-if="!historyCards || historyCards.length == 0">
            {{ Mine.say }}
          </div>
          <!-- 已出牌区域 -->
          <div class="cards history wui-flex wui-col wui-flex-item ">
            <div class="wui-flex other-small wui-justify-center">
              <card
                class="card small"
                v-for="(item, i) in historyCards"
                :value="item.label"
                :key="i"
                :type="item.type"
              ></card>
            </div>
          </div>
          <div class="main-bottom-btns wui-flex wui-col wui-justify-center wui-justify-between">
            <div class="btn-container wui-flex wui-justify-center">
              <div v-if="!ready" class="btn ready-btn" @click="readyToPlay"></div>
              <div class="pushcard wui-flex" v-show="seatIndex == currentPlayer">
                <div class="t-btn push" v-if="ready" @click="pushCheck"></div>
                <div class="t-btn unpush" v-if="ready && !newcircle" @click="unpush"></div>
              </div>
            </div>
          </div>
          <Cards class="cards-height" ref="c_cards" @push="push" @pushCard="pushCard"></Cards>
          <!-- <div class="cards cards-height wui-flex wui-justify-center">
            <card
              class="card big"
              @mousemove.native="mousemove(item)"
              @mouseup.native="mouseup(item)"
              @mousedown.native="mousedown(item)"
              :style="{ 'margin-top': item.checked ? '-40px' : '0px' }"
              v-for="(item, i) in cards"
              :value="item.label"
              :key="i"
              :type="item.type"
              @click.native="changed(item)"
            ></card>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import card from 'components/card'
import Cards from 'components/cards'
import User from '../modules/user'
import SinglePoker from '../modules/card'
import { seatMix } from '../common/mixins/player'
import { msgMix } from '../common/mixins/message'
import { commonMix } from '../common/mixins/common'
import { mapActions, mapGetters } from 'vuex'
import SoundEffect from '../modules/soundEffect'
let soundEff = new SoundEffect()
var singlePoker = new SinglePoker()
export default {
  name: 'Table',
  mixins: [seatMix, msgMix, commonMix],
  data() {
    return {
      showAni: false,
      token: '',
      tableIndex: '',
      roomIndex: '',
      seatIndex: '',
      first: false,
      myPokers: null,
      ready: false,
      currentPlayer: -1,
      playerTurn: 0,
      pushObj: null,
      msg: '',
      smsg: '',
      user: {},
      newcircle: true,
      chatArr: []
    }
  },
  components: {
    card,
    Cards
  },
  created() {
    // document.getElementById("audio").volume = 0.5
    let uid = this.$route.params.id
    let tid = this.$route.params.tid
    this.seatIndex = uid
    this.tableIndex = tid
    // 确认位置
    this.signNumber(uid)
    this.user = new User(uid)
    this.setUser(this.user)

    console.log('准备')
    this.seatDown()

    // websocket监听
    this.onWSMsg()
  },
  computed: {
    ...mapGetters({
      WS: 'socket',
      Mine: 'user'
    })
  },
  // watch: {
  //   countdown(val) {
  //     console.log(val)
  //     if (val > 0) {
  //       this.timingBegin()
  //     }
  //   }
  // },
  mounted() {
    window.addEventListener('beforeunload', e => {
      this.WS.over()
    })
    // this.$refs.audio.volume = 0.2
  },
  methods: {
    ...mapActions({
      // setPoker: 'ipoker/togglePokers',
      setUser: 'user/toggleUser'
    }),
    /**
     * 就坐
     */
    seatDown() {
      let sit = `{"type":2,"sub_type":0,"chat":"","player_current":${this.seatIndex},"player_turn":0,"pokers":null,"table_index":${this.tableIndex},"table_position_index":${this.seatIndex}}`
      this.WS.send(sit)
    },
    // 出牌
    pushCheck(ai = null) {
      if (this.currentPlayer !== this.seatIndex) {
        this.msg = '还不是你出牌'
        return
      }
      this.$refs.c_cards.push(ai)
    },
    compPush() {
      console.log('compPush---------')
      console.log(this.pushObj)
      if (this.pushObj && this.pushObj.pokers) {
        this.Mine.speak('')
        // this.soundEff()
        soundEff.setScene('push').play()
        this.$refs.c_cards.pushCard(this.pushObj.pokers, this.pushObj.checked, this.historyCards)
      }
    },
    push(obj) {
      // console.log(JSON.stringify(obj.pokers))
      let str = `{"type":2,"sub_type":4,"pokers":${JSON.stringify(obj.pokers)}}`
      // console.log(str)
      this.pushObj = obj
      this.WS.send(str)
    },
    pushCard(obj) {
      // console.log(obj)
      // let say = `{"type":1,"sub_type":0,"chat":"我就剩 "${obj.left} "张了！"}`
      // this.WS.send(say)
      this.historyCards = obj.history
    },
    /**
     * 不出，要不起
     */
    unpush() {
      this.Mine.speak('不要')
      this.$refs.c_cards.unpush()
      this.pushObj = null
      this.WS.send('{"type":2,"sub_type":4,"pokers":[]}')
    },
    /**
     * 准备就绪
     */
    readyToPlay() {
      console.log('准备')
      let ready = `{"type":2,"sub_type":1,"chat":"","player_current":${this.seatIndex},"player_turn":0,"pokers":null,"table_index":${this.tableIndex},"table_position_index":${this.seatIndex}}`
      this.WS && this.WS.send(ready)
      this.ready = true
    },
    wSt() {
      singlePoker.init(this.myPokers)
      singlePoker.sortPokers()
      this.user.drawCards(singlePoker)
      // this.cards = this.myPokers
      // singlePoker.shuffle(this.myPokers)
    }
  }
}
</script>

<style lang="stylus">
@import '~@/styles/index.styl'
$seatWidth = 200px
$tableHeight = 1400px
$tableWidth = 800px
$mainPadd = 200px
$msgMaxHeight = 200px
#Table
  height 100%
  min-height $tableHeight
  position relative
.animation
  position fixed
  height 100%
  width 100%
  z-index 999

.start-msg
  position fixed
  top 0
  width 100%
  padding 20px
  color #fff
  font-size 25px
  z-index 9999
  .seatinfo
    padding 10px
  .prepare
    color $color-sub
.say
  color #fff
  font-size 45px
  text-shadow:4px 4px 0px #000
.msgCont
  position absolute
  padding 20px
  top 0
  right 0
  .content
    padding 20px
    font-size 18px
    line-height 34px
    max-height $msgMaxHeight
    overflow auto
    background rgba(0, 0, 0, 0.5)
.ready-btn
  width 156px
  height 80px
  cursor pointer
  background-image url('../assets/ready-btn.png')
  // background-image url('../assets/btn.png')
  // background-position -5px -5px
  background-size 474px 70px
  background-position 0px 0px
  background-repeat no-repeat
  &:hover
    background-position -160px 0px
  &:active
    background-position -320px 0px

.t-btn
  width 156px
  height 80px
  cursor pointer
  background-image url('../assets/btn.png')
  // background-image url('../assets/btn.png')
  // background-position -5px -5px
  background-size 474px 70px
  background-position -320px 0px
  background-repeat no-repeat
  &.unpush
    background-position -160px 0px
.main
  font-size 15px
  height 100%
  padding-top $mainPadd
  .main-top
    min-height 500px
  .main-bottom
    padding-bottom 100px
    height 200px
    .btn-container
      margin 0 auto
      text-align center
    .main-bottom-btns
      margin-bottom 40px
      width 100%
  .cards-height
    height 120px
.table
  position relative
  height 100%
  .table-top
    height: 30%
  .table-left
    .img
      transform:rotate(-90deg)
  .table-right
    .img
      transform:rotate(90deg)
.other
  .uname
    font-size 50px
    color #fff
.seat
  width $seatWidth
  height $seatWidth
  background-image url('../assets/zd.png')
  background-repeat no-repeat
  background-size $seatWidth
  .img
    width $seatWidth

.cards .big:not(:first-child)
  margin-left -65px
.cards .small:not(:first-child)
  margin-left -75px
.other-small
  transform:scale(0.6);
  -webkit-transform:scale(0.6);  /*兼容-webkit-引擎浏览器*/
  -moz-transform:scale(0.6);
</style>
