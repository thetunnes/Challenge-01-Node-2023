import fs from "node:fs/promises"

const databasePath = new URL('db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf8').then(data => {
      this.#database = JSON.parse(data)
    }).catch(() => {
      this.#persist()
    })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, search) {
    let data = this.#database[table] ?? []
    if (search) {
      data = data.map(task => task.title.includes(search) || task.description.includes(search))
    }
    
    return data
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    return data;
  }

  update(table, id, title, description) {

    const database = this.#database[table] ?? []

    const taskIndex = database.findIndex(task => task.id === id)

    if (taskIndex < 0) {
      return 'ERROR'
    }

    database[taskIndex] = {
      ...database[taskIndex],
      title: title ?? database[taskIndex].title,
      description: description ?? database[taskIndex].description,
    }

    return database
  }

  completed(table, id) {

    const database = this.#database[table] ?? []

    const taskIndex = database.findIndex(task => task.id === id)

    if (taskIndex < 0) {
      return 'ERROR'
    }
    console.log(database[taskIndex].completed)
    database[taskIndex] = {
      ...database[taskIndex],
      completed_at: database[taskIndex].completed_at ? null : true
    }

    return database
  }

  delete(table, id) {

    const database = this.#database[table] ?? []

    const taskIndex = database.findIndex(task => task.id === id)

    if (taskIndex < 0) {
      return 'ERROR'
    }

    database.splice(taskIndex, 1)

    console.log(database)
    return database

  }

}