const getters = {
  socket: state => state.app.websocket,
  pokers: state => state.ipoker.pokers
}
export default getters
