import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'lib-flexible/flexible'
import WebSock from '@/utils/socket.js'

Vue.config.productionTip = false

let socket = new WebSock('ws://localhost:1234/connect', store)
socket.createWSConnect()

// socket1.createWSConnect().then(() => {
//   let ws0 = socket1.ws
//   ws0.send(
//     '{"type":2,"sub_type":0,"chat":"","player_current":' +
//       uid +
//       ',"player_turn":0,"pokers":null,"table_index":0,"table_position_index":' +
//       uid +
//       ',"data":{"0":[null,null,null,null],"1":[null,null,null,null],"2":[null,null,null,null]}}'
//   )
//   ws0.send(
//     '{"type":2,"sub_type":1,"chat":"","player_current":' +
//       uid +
//       ',"player_turn":0,"pokers":null,"table_index":0,"table_position_index":' +
//       uid +
//       '}'
//   )
//   ws0.onmessage = res => {
//     let data = JSON.parse(res.data)
//     // console.log(data)
//     // console.log(data.pokers)
//     // _store.dispatch('togglePokers', { pokers: data.pokers })
//     data.pokers && this.setPoker(data.pokers)
//   }
// })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
