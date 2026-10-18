export function createUserRepository(db) {
  const table = () => db.get('users')

  return {
    findByEmail(email) {
      return table().find({ email }).value() ?? null
    },
    findById(userId) {
      return table().getById(userId).value() ?? null
    },
    findAll() {
      return table().value() ?? []
    },
    create(user) {
      return table().insert(user).write()
    },
    update(userId, changes) {
      return table().updateById(userId, changes).write()
    },
  }
}
