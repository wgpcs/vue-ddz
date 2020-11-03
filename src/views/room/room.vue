<template>
  <div class="room-wrapper">
    <div class="tables wui-flex wui-col">
      <div class="table wui-flex wui-col" v-for="(table, key) in tables" :key="key">
        <div class="title">{{ key }} 号桌子</div>
        <div class="table-seat wui-flex ">
          <div class="seat" @click="goTable($event, index, key)" v-for="(seat, index) in table" :key="seat">
            {{ index }}号
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Room',
  data() {
    return {
      tables: null
    }
  },
  created() {
    let ws = this.$store.getters.socket
    console.log('--> ' + ws)
    if (!!ws) {
      this.sendMsg(ws)
      ws.onmessage = res => {
        let data = JSON.parse(res.data)
        console.log(data.data)
        // data.data && this.setPoker(data.pokers)
      }
    }
  },
  watch: {
    WS: function(ws) {
      if (!!ws) {
        ws.onmessage = res => {
          let data = JSON.parse(res.data)
          console.log(data.data)
          data.data && (this.tables = data.data)
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      WS: 'socket'
    })
  },
  methods: {
    // 进入房间
    goTable(e, uid, tid) {
      this.$router.push({
        path: '/table',
        name: 'Table',
        params: {
          id: uid,
          tid: tid
        }
      })
    },
    sendMsg(ws) {
      let tables = `{"type":2,"sub_type":1,"chat":"","player_current":0,"player_turn":0,"pokers":null}`
      console.log('准备')
      ws.send(tables)
    }
  }
}
</script>

<style lang="stylus">
@import '~@/styles/index.styl'
.tables
  .table
    padding 10px
    .title
      font-size 20px
      padding 10px
      color #fff
      background $menuBgColor
    .seat
      position relative
      cursor pointer
      margin-right 1px
      width 100px
      height 100px
      line-height 100px
      text-align center
      &:not(:first-child)::before
        content ' '
        position absolute
        width 1px
        top 25%
        left -1px
        height 50%
        background $menuTextColor
      &:hover
        background $menuBgColor
        color #fff
        transition background 0.6s
</style>
