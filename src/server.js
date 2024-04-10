import http from 'node:http'
import { json } from './middleware/json.js'
import { todoRoutes } from './routes.js'
import extractSearchParams from './utils/extract-search-params.js'

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  const route = todoRoutes.find(route => route.method === method && route.path.test(url))
  if (route) {
    const routeParams = req.url.match(route.path)
    const { query, ...params } = routeParams.groups

    req.query = query ? extractSearchParams(query) : {}
    req.params = params

    return route.handle(req, res)
  }

  return res.writeHead(404).end('Not Found')
})

server.listen(3334)
