import http from 'node:http'
import { randomUUID } from 'node:crypto'
import Database from './database.js'
import { json } from './middleware/json.js'
import buildRouterPath from './utils/build-router-path.js'
const database = new Database()

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req,res)

  if (method === 'GET' && url === '/todos') {
    const todos = database.select('todos')
    
    return res.writeHead(200).end(JSON.stringify(todos))
  }

  if (method === 'POST' && url === '/todos') {
    const { title, description } = req.body


    if (title === undefined  || description === undefined) {
      return res.writeHead(400).end(JSON.stringify({ status: "request body is invalid" }))
    }
    
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
    const routeParams = url.match(buildRouterPath('/todos/:id'))
    const { id } = routeParams.groups
    database.delete('todos', id)

    return res.writeHead(204).end()
  }

  if (method === 'PUT' && buildRouterPath('/todos/:id').test(url)) {
    const routeParams = url.match(buildRouterPath('/todos/:id'))
    const { id } = routeParams.groups
    const { title, description } = req.body
    database.update('todos', id, { title, description, updated_at: new Date() })

    return res.writeHead(204).end()
  }

  if (method === 'PATCH' && buildRouterPath('/todos/:id/complete').test(url)) {
    const routeParams = url.match(buildRouterPath('/todos/:id'))
    const { id } = routeParams.groups
    const { completed_at } = req.body
    database.update('todos', id, { completed_at, updated_at: new Date() })

    return res.writeHead(204).end()
  }

  return res.writeHead(404).end('Not Found')
})

server.listen(3334)
