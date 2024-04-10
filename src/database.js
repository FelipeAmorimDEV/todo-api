import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)
export default class Database {
  #database = {}


  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

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

    this.#persist()

    return data
  }
}

