/**
 * description 扑克
 */
const CardLabel = {
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
}
const Types = {
  '0': 'fk',
  '1': 'mh',
  '2': 'hx',
  '3': 'ht',
  '10000': 'LittleJoker',
  '10001': 'BigJoker'
}
class SinglePoker {
  constructor() {
    this.cards = []
  }
  /**
   * 格式化牌数组
   * @param {array} cards 原始牌数据
   */
  init(cards = null) {
    this.cards = []
    if (!cards || cards.length == 0) return
    cards.forEach((item, index) => {
      this.cards.push({
        label: CardLabel[item.value],
        type: Types[item.type],
        v: item.value,
        k: item.type,
        checked: false
      })
    })
  }
  /**
   * 排序
   */
  sortPokers() {
    this.cards.sort((a, b) => {
      return b.v - a.v
    })
  }
}

export default SinglePoker
