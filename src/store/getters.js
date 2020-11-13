const getters = {
  socket: state => state.app.websocket,
  user: state => state.user.user,
  pokers: state => state.ipoker.pokers
}
export default getters
