export default class Database {
  #database = []

  select(table) {
    const data = this.#database[table] || []
    return data
  }

  insert(table, data) {
    const eUmaTabelaExistente = this.#database[table]
    if(eUmaTabelaExistente) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }
  }
}

