import { randomUUID } from 'node:crypto'
import buildRouterPath from './utils/build-router-path'

export const routes = [
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
      const oRecursoExisteNoBancoDeDados = database.select('todos').some(recurso => recurso.id === id)

      if (!oRecursoExisteNoBancoDeDados) {
        const status = { status: 'O recurso não existe no banco de dados'}
        return res.writeHead(404).end(JSON.stringify(status))
      }

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

      const oRecursoExisteNoBancoDeDados = database.select('todos').some(recurso => recurso.id === id)

      if (!oRecursoExisteNoBancoDeDados) {
        const status = { status: 'O recurso não existe no banco de dados'}
        return res.writeHead(404).end(JSON.stringify(status))
      }

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
      const oRecursoExisteNoBancoDeDados = database.select('todos').some(recurso => recurso.id === id)

      if (!oRecursoExisteNoBancoDeDados) {
        const status = { status: 'O recurso não existe no banco de dados'}
        return res.writeHead(404).end(JSON.stringify(status))
      }
      
      database.update('todos', id, { completed_at: new Date(), updated_at: new Date() })

      return res.writeHead(204).end('')
    }
  },
]