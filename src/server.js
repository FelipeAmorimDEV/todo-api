import http from 'node:http'
import { randomUUID } from 'node:crypto'

const todos = []

const server = http.createServer((req, res) => {
  const { method, url } = req

  if (method === 'GET' && url === '/todos') {
    res.setHeader('Content-Type', 'application/json')
    return res.writeHead(200).end(JSON.stringify(todos))
  }

  if (method === 'POST' && url === '/todos') {
    todos.push({
      id: randomUUID(),
      title: 'Ignite Node',
      description: 'Terminar o modulo 1',
      completed_at: null,
      created_at: new Date(),
      updated_at: null
    })

    return res.writeHead(201).end('')
  }

  return res.writeHead(404).end('Not Found')
})

server.listen(3334)
