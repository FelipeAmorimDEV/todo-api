import http from 'node:http'

const server = http.createServer((req, res) => {
  res.end('Servidor criado')
})

server.listen(3334)