<!-- 卡 -->
<template lang="html">
  <div :class="['card wui-flex wui-col', size + '-card']">
    <div class="nocheck"></div>
    <div class="back" v-if="!open">
      <img src="../assets/back.png" />
    </div>
    <div class=" wui-flex wui-col wui-flex-item" v-if="value === 'JOKER'">
      <div v-show="open" :class="['joker card-num-left', size + '-joker']" :style="{ color: cardColor }">
        {{ value }}
      </div>
      <div v-show="open" class="type wui-flex wui-col wui-flex-item wui-justify-center">
        <div><img :src="cardType" class="card-type" /></div>
      </div>
      <div v-show="open" :class="['joker card-num-right', size + '-joker']" :style="{ color: cardColor }">
        {{ value }}
      </div>
    </div>
    <div v-else>
      <div :class="['left-num wui-flex wui-col wui-justify-center', size + '-left-num']">
        <div v-show="open" :class="['card-num-left', size + '-num']" :style="{ color: cardColor }">{{ value }}</div>
        <div v-show="open" class="type"><img :src="cardType" class="card-type" /></div>
      </div>
      <div v-show="open" :class="['card-num-right', size + '-num']" :style="{ color: cardColor }">{{ value }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: String,
    type: String,
    size: {
      type: String,
      default: 'big'
    },
    open: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  computed: {
    cardType() {
      return require(`@/assets/${this.type}.png`)
    },
    cardColor() {
      let color = {
        hx: '#f00',
        fk: '#f00',
        BigJoker: '#f00',
        LittleJoker: '#000',
        ht: '#000',
        mh: '#000'
      }
      return color[this.type]
    }
  }
}
</script>

<style lang="css">
.joker {
  position: absolute;
  width: 24px;
  padding: 2px 5px;
  line-height: 25px;
  font-size: 24px;
  word-wrap: break-word;
}

.card {
  user-select: none;
  position: relative;
  border-width: 1px;
  border-style: solid;
  border-image: initial;
  border-color: #ccc;
  background: #f1f1f1;
  border-radius: 4px;
  font-family: monospace;
  /* text-align: center; */
}
.card-num-left {
  text-align: center;
  /* padding-left: 2px; */
}
/* 大牌 */
.big-card {
  width: 120px;
  height: 150px;
  font-weight: 600;
  font-size: 34px;
}
.left-num {
  width: 40px;
}
.big-num {
  height: 42px;
  line-height: 42px;
}

/* .small-card {
  transform:scale(0.6);
  -webkit-transform:scale(0.6);  
  -moz-transform:scale(0.6);
} */
.small-left-num {
  width: 20px;
}
.small-num,
.small-joker {
  height: 16px;
  line-height: 12px;
  padding: 5px;
}
.small-joker.joker {
  font-size: 10px;
}
.card-num-right {
  position: absolute;
  bottom: 0px;
  right: 5px;
  transform: rotate(180deg);
}
.type {
  text-align: center;
  padding: 0 4px;
}
.card-type {
  height: 100%;
  width: 100%;
}
.back {
  height: 90%;
  width: 85%;
  margin: 5%;
  border: 1px dashed #e88;
  background-color: #c1c1ff;
}
.back img {
  width: 100%;
  height: 100%;
}
.nocheck {
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 999;
}
</style>
