import http from 'node:http'

const server = http.createServer((req, res) => {
  const todos = [
    {
      id: 1,
      title: 'Ignite Node',
      description: 'Terminar o modulo 1',
      completed_at: null,
      created_at: new Date(),
      updated_at: null
    }
  ]
  const { method, url } = req

  if (method === 'GET' && url === '/todos') {
    res.setHeader('Content-Type', 'application/json')
    return res.writeHead(200).end(JSON.stringify(todos))
  }

  return res.end('Resposta da req')
})

server.listen(3334)