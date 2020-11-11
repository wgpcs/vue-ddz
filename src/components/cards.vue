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
import { pokerMix } from '../common/mixins/poker'
export default {
  name: 'Cards',
  mixins: [pokerMix],
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
        this.transformPok(this.cards, cards[index])
      } else {
        clearInterval(this.timeId)
        this.sortPokers(this.cards)
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
    /**
     * 加入历史出牌
     * 移除已出的牌
     */
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
