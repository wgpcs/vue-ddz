<template>
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
</template>

<script>
import card from './card'
export default {
  name: 'Cards',
  props: {
    pokers: {
      type: Array,
      default: () => []
    },
    density: {
      type: [String, Number],
      default: 1
    },
    open: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    pokers(val) {
      this._initCard(val)
    }
  },
  data() {
    return {
      cards: [],
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
      first: false,
      moveChange: false,
      timeId: null
    }
  },
  components: {
    card
  },
  methods: {
    mousedown(event) {
      console.log('mousedown', event)
      this.moveChange = true
      this.first = !event.checked
      this.$emit('mouseDown', event)
    },
    mousemove(event) {
      if (this.moveChange) {
        console.log('mousemove', event)
        this.cards.find(c => c.label === event.label && c.type === event.type).checked = this.first
      }
      // this.$emit('mouseDown', event)
    },
    mouseup(event) {
      console.log('mouseup', event)
      this.moveChange = false
    },
    // 发牌
    _initCard(cards) {
      clearInterval(this.timeId)
      let _this = this,
        index = 0
      this.timeId = setInterval(function() {
        _this._addCard(index, cards)
        index++
      }, 50)
    },
    _addCard(index, cards) {
      if (cards[index] && cards[index].value) {
        let cardLabel = this.cardLabel
        this.cards.push({
          label: cardLabel[cards[index].value],
          type: this.types[cards[index].type],
          v: cards[index].value,
          k: cards[index].type,
          checked: false
        })
      } else {
        clearInterval(this.timeId)
      }
    },
    // 出牌
    push() {
      if (this.cards.filter(c => c.checked).length < 1) {
        alert('请选择需要出的牌！')
        return
      }
      let checked = this.cards.filter(c => c.checked)
      let pokers = checked.map(item => {
        return {
          type: item.k,
          value: item.v
        }
      })
      console.log(pokers)
      this.$emit('push', { pokers: pokers, checked: checked })
      // this.pushCard(pokers, checked, history)
    },
    pushCard(pokers, checked, history) {
      history.push(...checked)
      history.forEach(h => {
        this.cards.splice(
          this.cards.findIndex(n => n.label === h.label && n.type === h.type),
          1
        )
      })
      this.$emit('pushCard', { pokers: pokers, history: history })
    },
    unpush() {
      this.cards.forEach(item => {
        item.checked = false
      })
    },
    changed(item) {
      item.checked = !item.checked
    }
  }
}
</script>

<style lang="stylus">
@import '~@/styles/index.styl'
</style>
