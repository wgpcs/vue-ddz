<template>
  <div id="Table">
    <div class="main">
      <div class="title">{{ tableIndex }} 号桌子，{{ seatIndex }} 号位置</div>
      <div class="prepare" v-if="!myPokers || myPokers.length == 0">准备中.....等待其他玩家准备!</div>
      <div class="table wui-flex wui-col">
        <div class="main-top wui-flex wui-flex-item wui-justify-between">
          <div class="table-left">
            <div class="cards other cards-margin-left wui-flex">
              <card
                class="card small"
                :open="open"
                size="small"
                :style="{ 'margin-top': item.checked ? '-20px' : '0px' }"
                v-for="(item, i) in aCards"
                :value="item.label"
                :key="i"
                :type="item.type"
                @click.native="changed(item)"
              ></card>
              <div class="clear"></div>
            </div>
          </div>
          <div class="table-right">
            <div class="cards other cards-margin-right wui-flex">
              <card
                class="card small"
                :open="open"
                size="small"
                :style="{ 'margin-top': item.checked ? '-20px' : '0px' }"
                v-for="(item, i) in bCards"
                :value="item.label"
                :key="i"
                :type="item.type"
                @click.native="changed(item)"
              ></card>
              <div class="clear"></div>
            </div>
          </div>
        </div>

        <div class="main-bottom wui-flex wui-col">
          <!-- 已出牌区域 -->
          <!-- <div class="cards history wui-flex wui-col wui-flex-item ">
            <div class="wui-flex other wui-justify-center">
              <card
                class="card small"
                size="small"
                v-for="(item, i) in historyCards"
                :value="item.label"
                :key="i"
                :type="item.type"
              ></card>
            </div>
          </div> -->
          
          <div class="cards cards-height wui-flex wui-justify-center">
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import card from 'components/card'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Table',
  data() {
    return {
      tableIndex: '',
      roomIndex: '',
      seatIndex: '',
      first: false,
      moveChange: false,
      startState: false,
      fullHeight: document.documentElement.clientHeight,
      open: false,
      cards: [],
      aCards: [],
      bCards: [],
      myPokers: null,
      historyCards: [],
      cardLabel: {
        '3': '3',
        '4': '4',
        '5': '5',
        '6': '6',
        '7': '7',
        '8': '8',
        '9': '9',
        '10': '10',
        '11': 'J',
        '12': 'Q',
        '13': 'K',
        '14': 'A',
        '15': '2',
        '10000': 'JOKER',
        '10001': 'JOKER'
      },
      types: {
        '0': 'fk',
        '1': 'mh',
        '2': 'hx',
        '3': 'ht',
        '10000': 'LittleJoker',
        '10001': 'BigJoker'
      },
      joker: false,
      timeId: null
    }
  },
  components: {
    card
  },
  created() {
    let uid = this.$route.params.id
    let tid = this.$route.params.tid
    this.seatIndex = uid
    this.tableIndex = tid
    // console.log(this.WS)
    // let ws = this.$store.state.socket
    console.log('准备')
    let sit = `{"type":2,"sub_type":0,"chat":"","player_current":${uid},"player_turn":0,"pokers":null,"table_index":${tid},"table_position_index":${uid}}`
    let ready = `{"type":2,"sub_type":1,"chat":"","player_current":${uid},"player_turn":0,"pokers":null,"table_index":${tid},"table_position_index":${uid}}`
    this.WS.send(sit)
    this.WS.send(ready)

    this.WS.onmessage = res => {
      let data = JSON.parse(res.data)
      console.log(data.pokers)
      // data.pokers && this.setPoker(data.pokers)
      if (data.pokers) {
        this.myPokers = data.pokers
        this.wSt()
      }
      console.log(this.myPokers)
    }
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
    mousedown(event) {
      console.log('mousedown', event)
      this.moveChange = true
      this.first = !event.checked
    },
    mousemove(event) {
      if (this.moveChange) {
        console.log('mousemove', event)
        this.cards.find(c => c.label === event.label && c.type === event.type).checked = this.first
      }
    },
    mouseup(event) {
      console.log('mouseup', event)
      this.moveChange = false
    },
    wSt() {
      clearInterval(this.timeId)
      this.cards = []
      this.startState = true
      let cards = this.myPokers
      this.aniAdd(cards)
    },
    aniAdd(cards) {
      let _this = this,
        index = 0
      this.timeId = setInterval(function() {
        _this.waddCard(index, cards)
        index++
      }, 50)
    },
    waddCard(index, cards) {
      // console.log('waddCard: ', cards, index, cards[index])
      if (cards[index] && cards[index].value) {
        let cardLabel = this.cardLabel
        this.cards.push({
          label: cardLabel[cards[index].value],
          type: this.types[cards[index].type],
          checked: false
        })
        this.historyCards = this.cards
      } else {
        clearInterval(this.timeId)
      }
    },
    // 发牌

    changed(item) {
      item.checked = !item.checked
    }
  }
}
</script>

<style lang="stylus">
@import '~@/styles/index.styl'

.main
  font-size 15px
  .title
    padding 20px
    color #fff
    font-size 25px
  .main-top
    min-height 500px
    height 100%
  .main-bottom
    height 200px
.cards .big:not(:first-child)
  margin-left -65px
.cards .small:not(:first-child)
  margin-left -28px
// .cards-height
// .other
//   transform:scale(1.6);
//   -webkit-transform:scale(1.6);  /*兼容-webkit-引擎浏览器*/
//   -moz-transform:scale(1.6);
</style>
