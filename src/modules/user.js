/**
 *
 */
import Player from './player'

class User extends Player {
  constructor(id, name, singlePoker) {
    super(id, name, singlePoker)
    if (!User.instance) {
      User.instance = this
    }
    return User.instance
  }
}

export default User
