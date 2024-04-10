import http from 'node:http'
import { randomUUID } from 'node:crypto'
import Database from './database.js'
import { json } from './middleware/json.js'
import buildRouterPath from './utils/build-router-path.js'
import extractSearchParams from './utils/extract-search-params.js'
const database = new Database()

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  const routes = [
    {
      method: 'GET',
      path: buildRouterPath('/todos'),
      handle: (req, res) => {
        const { search } = req.query
        const todos = database.select('todos', search ? {
          title: search,
          description: search
        } : null)

        return res.writeHead(200).end(JSON.stringify(todos))
      }
    },
    {
      method: 'POST',
      path: buildRouterPath('/todos'),
      handle: (req, res) => {
        const { title, description } = req.body

        if (title === undefined) {
          const status = { status: 'title is required' }
          return res.writeHead(400).end(JSON.stringify(status))
        }

        if (description === undefined) {
          const status = { status: 'description is required' }
          return res.writeHead(400).end(JSON.stringify(status))
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
    },
    {
      method: 'DELETE',
      path: buildRouterPath('/todos/:id'),
      handle: (req, res) => {
        const { id } = req.params
        database.delete('todos', id)

        return res.writeHead(204).end('')
      }
    },
    {
      method: 'PUT',
      path: buildRouterPath('/todos/:id'),
      handle: (req, res) => {
        const { title, description } = req.body
        const { id } = req.params

        if (title === undefined) {
          const status = { status: 'title is required' }
          return res.writeHead(400).end(JSON.stringify(status))
        }

        if (description === undefined) {
          const status = { status: 'description is required' }
          return res.writeHead(400).end(JSON.stringify(status))
        }

        database.update('todos', id, { title, description, updated_at: new Date() })

        return res.writeHead(204).end('')
      }
    },
    {
      method: 'PATCH',
      path: buildRouterPath('/todos/:id/complete'),
      handle: (req, res) => {
        const { id } = req.params
        database.update('todos', id, { completed_at: new Date(), updated_at: new Date() })

        return res.writeHead(204).end('')
      }
    },
  ]

  const route = routes.find(route => route.method === method && route.path.test(url))

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
