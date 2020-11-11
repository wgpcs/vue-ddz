export const pokerMix = {
  data() {
    return {
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
      }
    }
  },
  methods: {
    /**
     * 格式化牌
     * @param {array} target 新数组
     * @param {array} cards 原数组
     */
    transformPok(target, card) {
      // console.log('--------------格式化--------------')
      // console.log(target, card)
      let cardLabel = this.cardLabel
      target.push({
        label: cardLabel[card.value],
        type: this.types[card.type],
        v: card.value,
        k: card.type,
        checked: false
      })
    },

    eachPokAndFormat(target, cards) {
      cards.forEach((item, index) => {
        this.transformPok(target, item)
      })
    },

    // 排序
    sortPokers(pokers) {
      pokers.sort((a, b) => {
        return b.v - a.v
      })
    }
  }
}
