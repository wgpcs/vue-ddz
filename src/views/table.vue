<template>
  <div id="Table">
    <div class="start-msg">
      <div class="container wui-flex wui-col wui-justify-center wui-align-center">
        <div class="seatinfo">{{ tableIndex }} 号桌子，第 {{ seatIndex }} 号位置</div>
        <div class="" v-if="!ready">准备中...</div>
        <div class="prepare" v-if="ready && !myPokers">等待其他玩家准备!</div>
        <div class="msg">{{ smsg }}</div>
        <div class="msg prepare">{{ msg }}</div>
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
              <div class="seat-style">
                <img class="img" src="../assets/pm.png" />
              </div>
            </div>

            <div class="cards history wui-flex wui-col wui-flex-item ">
              <div class="wui-flex other-small wui-justify-center">
                <card
                  class="card small"
                  v-for="(item, i) in seats[2].pokerHistory"
                  :value="item.label"
                  :key="i"
                  :type="item.type"
                ></card>
              </div>
            </div>
          </div>
        </div>
        <div class="main-top wui-flex wui-justify-between wui-align-center wui-flex-item">
          <div class="table-left">
            <div class="cards other cards-margin-left wui-flex">
              <!-- <label class="uname">l-{{ seats[0].sitid }}</label> -->
              <div class="seat">
                <div class="seat-style">
                  <img class="img" src="../assets/pm.png" />
                </div>
              </div>
              <div class="cards history wui-flex wui-col wui-flex-item ">
                <div class="wui-flex other-small wui-justify-center">
                  <card
                    class="card small"
                    v-for="(item, i) in seats[0].pokerHistory"
                    :value="item.label"
                    :key="i"
                    :type="item.type"
                  ></card>
                </div>
              </div>
              <div class="clear"></div>
            </div>
          </div>
          <div class="table-right">
            <div class="cards other cards-margin-right wui-flex">
              <!-- 已出牌区域 -->
              <div class="cards history wui-flex wui-col wui-flex-item ">
                <div class="wui-flex other-small wui-justify-center">
                  <card
                    class="card small"
                    v-for="(item, i) in seats[1].pokerHistory"
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
                  <img class="img" src="../assets/pm.png" />
                </div>
              </div>
              <div class="clear"></div>
            </div>
          </div>
        </div>

        <div class="main-bottom wui-flex-item wui-flex wui-col">
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
              <div class="pushcard wui-flex" v-show="cards.length > 0 && seatIndex == currentPlayer">
                <div class="t-btn push" v-if="ready" @click="pushCheck"></div>
                <div class="t-btn unpush" v-if="ready" @click="unpush"></div>
              </div>
            </div>
          </div>
          <Cards :pokers="cards" ref="c_cards" @push="push" @pushCard="pushCard"></Cards>
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
import { seatMix } from '../common/mixins/player'
import { pokerMix } from '../common/mixins/poker'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Table',
  mixins: [seatMix, pokerMix],
  data() {
    return {
      showAni: false,
      token: '',
      tableIndex: '',
      roomIndex: '',
      seatIndex: '',
      first: false,
      cards: [],
      myPokers: null,
      ready: false,
      currentPlayer: -1,
      playerTurn: 0,
      pushObj: null,
      msg: '',
      smsg: ''
    }
  },
  components: {
    card,
    Cards
  },
  created() {
    let uid = this.$route.params.id
    let tid = this.$route.params.tid
    this.seatIndex = uid
    this.tableIndex = tid
    // 确认位置
    this.identifySeat(uid)

    console.log('准备')
    this.seatDown()

    this.onWSMsg()
    // ws0.onmessage = res => {
    //   let data = JSON.parse(res.data)
    //   data.pokers && this.setPoker(data.pokers)
    // }
    // this.$router.afterEach(function() {
    //   socket1.over()
    // })
  },
  computed: {
    ...mapGetters({
      gPokers: 'pokers',
      WS: 'socket'
    })
  },
  mounted() {},
  methods: {
    ...mapActions({
      setPoker: 'ipoker/togglePokers'
    }),
    // 就做
    seatDown() {
      let sit = `{"type":2,"sub_type":0,"chat":"","player_current":${this.seatIndex},"player_turn":0,"pokers":null,"table_index":${this.tableIndex},"table_position_index":${this.seatIndex}}`
      // let ready = `{"type":2,"sub_type":1,"chat":"","player_current":${uid},"player_turn":0,"pokers":null,"table_index":${tid},"table_position_index":${uid}}`
      this.WS.send(sit)
      // this.WS.send(ready)
    },
    onWSMsg() {
      this.WS.onmessage = res => {
        // this.msg = ''
        let data = JSON.parse(res.data)
        if (this.seatIndex == data.player_current) this.clearHistory(this.seatIndex)
        console.log('onmessage', res)
        console.log('onmessage-pok', data.pokers)
        if (data.new_circle) {
          this.clearHistory()
        }
        if (data.chat) {
          this.smsg = data.chat
        } else {
          this.smsg = ''
        }
         // 胜利
        if (data.sub_type == '7') {
          this.msg = `${data.player_current}号玩家获胜`
        }
        // 就位
        if (data.sub_type == '0') {
          this.msg = data.player_current + '牌友上桌了'
        }
        // 准备
        if (data.sub_type == '6') {
          this.currentPlayer = data.player_current
        }
        // 发牌
        if (data.pokers && data.sub_type == '3') {
          this.myPokers = data.pokers
          this.wSt()
        }

        // 出牌
        if (data.pokers && data.sub_type == '4') {
          let pushplayer = data.player_current
          let pushPoker = data.pokers
          // console.log(pushplayer, pushPoker, this.seatIndex)
          this.msg = ''
          // 自己出牌成功
          if (pushPoker && pushplayer == this.seatIndex) {
            this.compPush()
          } else {
            if (pushPoker.length > 0) {
              let pokers = []
              this.eachPokAndFormat(pokers, pushPoker)
              console.log(pokers)
              this.msg = `${pushplayer}号位置 出牌${pokers[0].label}`
              this.identifyPoker(pushplayer, pokers)
            } else {
              this.msg = `${pushplayer}号位置 要不起`
            }
          }
          // console.log(this.msg)
        }
      }
    },
    // 出牌
    pushCheck() {
      if (this.currentPlayer !== this.seatIndex) {
        this.msg = '还不是你出牌'
        return
      }
      this.$refs.c_cards.push()
    },
    compPush() {
      console.log('compPush---------')
      console.log(this.pushObj)
      this.$refs.c_cards.pushCard(this.pushObj.pokers, this.pushObj.checked, this.historyCards)
    },
    push(obj) {
      // console.log(JSON.stringify(obj.pokers))
      let str = `{"type":2,"sub_type":4,"pokers":${JSON.stringify(obj.pokers)}}`
      // console.log(str)
      this.pushObj = obj
      this.WS.send(str)
      // this.$refs.c_cards.push(obj.pokers, obj.checked, this.historyCards)
    },
    pushCard(obj) {
      // console.log(obj)
      this.historyCards = obj.history
    },
    unpush() {
      this.$refs.c_cards.unpush()
      this.pushObj = null
      this.WS.send('{"type":2,"sub_type":4,"pokers":[]}')
    },
    readyToPlay() {
      console.log('准备')
      let ready = `{"type":2,"sub_type":1,"chat":"","player_current":${this.seatIndex},"player_turn":0,"pokers":null,"table_index":${this.tableIndex},"table_position_index":${this.seatIndex}}`
      this.WS.send(ready)
      this.ready = true
    },
    wSt() {
      this.cards = this.myPokers
    }
  }
}
</script>

<style lang="stylus">
@import '~@/styles/index.styl'
$seatWidth = 200px
$tableHeight = 1200px
$mainPadd = 200px
#Table
  height $tableHeight
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
    height 200px
    .btn-container
      margin 0 auto
      text-align center
    .main-bottom-btns
      width 100%
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
