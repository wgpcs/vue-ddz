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
        <div class="table-top">
          <div class="cards other wui-flex wui-col">
            <label class="uname" style="text-align: center; margin: 50px">t-{{ players.ptop.sitid }}</label>
          </div>
        </div>
        <div class="main-top wui-flex wui-flex-item wui-justify-between">
          <div class="table-left">
            <!-- 已出牌区域 -->
            <!-- <div class="cards history wui-flex wui-col wui-flex-item ">
            <div class="wui-flex other-small wui-justify-center">
              <card
                class="card small"
                v-for="(item, i) in historyCards"
                :value="item.label"
                :key="i"
                :type="item.type"
              ></card>
            </div>
          </div> -->

            <div class="cards other cards-margin-left wui-flex">
              <label class="uname">l-{{ players.pleft.sitid }}</label>

              <div class="clear"></div>
            </div>
          </div>
          <div class="table-right">
            <!-- 已出牌区域 -->
            <!-- <div class="cards history wui-flex wui-col wui-flex-item ">
            <div class="wui-flex other-small wui-justify-center">
              <card
                class="card small"
                v-for="(item, i) in historyCards"
                :value="item.label"
                :key="i"
                :type="item.type"
              ></card>
            </div>
          </div> -->
            <div class="cards other cards-margin-right wui-flex">
              <label class="uname">{{ players.pright.sitid }}</label>
              <div class="clear"></div>
            </div>
          </div>
        </div>

        <div class="main-bottom wui-flex wui-col">
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
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Table',
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
      historyCards: [],
      ready: false,
      currentPlayer: -1,
      playerTurn: 0,
      pushObj: null,
      msg: '',
      smsg: '',
      players: {
        pleft: {},
        pright: {},
        ptop: {}
      }
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
    let lsit = parseInt(uid) - 1 < 0 ? 3 : parseInt(uid) - 1
    let rsit = parseInt(uid) + 1 > 3 ? 0 : parseInt(uid) + 1
    let tsit = parseInt(uid) + 2 > 3 ? parseInt(uid) - 2 : parseInt(uid) + 2
    console.log(parseInt(uid) - 1)
    console.log(parseInt(uid) + 1)
    this.players.pleft = {
      sitid: lsit
    }
    this.players.pright = {
      sitid: rsit
    }
    this.players.ptop = {
      sitid: tsit
    }

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
        console.log('onmessage', res)
        console.log('onmessage-pok', data.pokers)
        if (data.chat) {
          this.smsg = data.chat
        } else {
          this.smsg = ''
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
          console.log(pushplayer, pushPoker, this.seatIndex)
          this.msg = ''
          // 自己出牌成功
          if (pushPoker && pushplayer == this.seatIndex) {
            this.compPush()
          } else {
            this.msg = `${pushplayer}号位置 出牌${pushPoker[0].value}`
          }
          console.log(this.msg)
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
      console.log(this.pushObj)
      this.$refs.c_cards.pushCard(this.pushObj.pokers, this.pushObj.checked, this.historyCards)
    },
    push(obj) {
      console.log('push---------')
      console.log(obj)
      this.pushObj = obj
      this.WS.send(`{"type":2,"sub_type":4,"pokers":${JSON.stringify(obj.pokers)}}`)
      // this.$refs.c_cards.push(obj.pokers, obj.checked, this.historyCards)
    },
    pushCard(obj) {
      console.log(obj)
      this.historyCards = obj.history
    },
    unpush() {
      this.$refs.c_cards.unpush()
      this.pushObj = null
      this.WS.send('{"type":2,"sub_type":4,"pokers":[]')
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
#Table
  height 1200px
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
  padding-top 100px
  .main-top
    min-height 500px
    height 100%
  .main-bottom
    height 200px
    .btn-container
      margin 0 auto
      text-align center
    .main-bottom-btns
      width 100%
.other
  .uname
    font-size 50px
    color #fff
.cards .big:not(:first-child)
  margin-left -65px
.cards .small:not(:first-child)
  margin-left -75px
.other-small
  transform:scale(0.6);
  -webkit-transform:scale(0.6);  /*兼容-webkit-引擎浏览器*/
  -moz-transform:scale(0.6);
</style>
