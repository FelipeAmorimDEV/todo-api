import http from 'node:http'
import { randomUUID } from 'node:crypto'
import Database from './database.js'
import { json } from './middleware/json.js'
import buildRouterPath from './utils/build-router-path.js'
const database = new Database()

const server = http.createServer(async (req, res) => {
  const { method, url, params } = req

  await json(req,res)

  if (method === 'GET' && url === '/todos') {
    const todos = database.select('todos')
    
    return res.writeHead(200).end(JSON.stringify(todos))
  }

  if (method === 'POST' && url === '/todos') {
    const { title, description } = req.body
    
    const data = {
      id: randomUUID(),
      completed_at: null,
      created_at: new Date(),
      updated_at: null,
      title,
      description
    }

    database.insert('todos', data)
    return res.writeHead(201).end('')
  }

  if (method === 'DELETE' && buildRouterPath('/todos/:id').test(url)) {
    
  }

  return res.writeHead(404).end('Not Found')
})

server.listen(3334)
