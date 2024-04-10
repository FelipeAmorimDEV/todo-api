import { randomUUID } from 'node:crypto';
import buildRouterPath from './utils/build-router-path.js';
import Database from './database.js';

const databaseInstance = new Database();

export const todoRoutes = [
  {
    method: 'GET',
    path: buildRouterPath('/todos'),
    handle: (request, response) => {
      const { searchQuery } = request.query;
      const todos = databaseInstance.select('todos', searchQuery ? {
        title: searchQuery,
        description: searchQuery
      } : null);

      return response.writeHead(200).end(JSON.stringify(todos));
    }
  },
  {
    method: 'POST',
    path: buildRouterPath('/todos'),
    handle: (request, response) => {
      if (request.body === null) {
        return response.writeHead(400).end('');
      }
      
      const { title, description } = request.body

      if (title === undefined) {
        return response.writeHead(400).end(JSON.stringify({ error: 'title is required.' }));
      }

      if (description === undefined) {
        return response.writeHead(400).end(JSON.stringify({ error: 'description is required.' }));
      }


      const todoData = {
        id: randomUUID(),
        completed_at: null,
        created_at: new Date(),
        updated_at: null,
        title,
        description
      };
      databaseInstance.insert('todos', todoData);

      return response.writeHead(201).end('');
    }
  },
  {
    method: 'DELETE',
    path: buildRouterPath('/todos/:id'),
    handle: (request, response) => {
      const { id } = request.params;

      const isResourceExist = databaseInstance.select('todos').some(resource => resource.id === id);
      if (!isResourceExist) {
        return response.writeHead(404).end(JSON.stringify({ status: 'The resource does not exist in the database' }));
      }

      databaseInstance.delete('todos', id);

      return response.writeHead(204).end('');
    }
  },
  {
    method: 'PUT',
    path: buildRouterPath('/todos/:id'),
    handle: (request, response) => {
      const { title, description } = request.body
      const { id } = request.params;

      if (title === undefined) {
        return response.writeHead(400).end(JSON.stringify({ error: 'title is required.' }));
      }

      if (description === undefined) {
        return response.writeHead(400).end(JSON.stringify({ error: 'description is required.' }));
      }

      const isResourceExist = databaseInstance.select('todos').some(resource => resource.id === id);
      if (!isResourceExist) {
        return response.writeHead(404).end(JSON.stringify({ status: 'The resource does not exist in the database' }));
      }

      databaseInstance.update('todos', id, { title, description, updated_at: new Date() });

      return response.writeHead(204).end('');
    }
  },
  {
    method: 'PATCH',
    path: buildRouterPath('/todos/:id/complete'),
    handle: (request, response) => {
      const { id } = request.params;

      const isResourceExist = databaseInstance.select('todos').some(resource => resource.id === id);
      if (!isResourceExist) {
        return response.writeHead(404).end(JSON.stringify({ status: 'The resource does not exist in the database' }));
      }

      databaseInstance.update('todos', id, { completed_at: new Date(), updated_at: new Date() });

      return response.writeHead(204).end('');
    }
  },
];