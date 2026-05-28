import { useEffect, useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [filter, setFilter] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadTodos = async (selectedFilter) => {
    try {
      const query =
        selectedFilter === 'all'
          ? ''
          : `?completed=${selectedFilter === 'completed'}`

      const response = await fetch(`${API_URL}/todos/${query}`)
      if (!response.ok) {
        throw new Error('No se pudieron cargar las tareas')
      }

      const data = await response.json()
      setTodos(data)
      setError('')
    } catch {
      setError('Error al cargar tareas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    Promise.resolve().then(() => {
      loadTodos(filter)
    })
  }, [filter])

  const handleAddTodo = async (event) => {
    event.preventDefault()
    const trimmedTitle = title.trim()
    const trimmedDescription = description.trim()

    if (!trimmedTitle) {
      return
    }

    try {
      const response = await fetch(`${API_URL}/todos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: trimmedTitle,
          description: trimmedDescription || null,
        }),
      })

      if (!response.ok) {
        throw new Error('No se pudo crear la tarea')
      }

      setTitle('')
      setDescription('')
      setLoading(true)
      loadTodos(filter)
    } catch {
      setError('Error al crear la tarea')
    }
  }

  const handleToggleTodo = async (todo) => {
    try {
      const response = await fetch(`${API_URL}/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed }),
      })

      if (!response.ok) {
        throw new Error('No se pudo actualizar la tarea')
      }

      setLoading(true)
      loadTodos(filter)
    } catch {
      setError('Error al actualizar la tarea')
    }
  }

  const handleDeleteTodo = async (todoId) => {
    try {
      const response = await fetch(`${API_URL}/todos/${todoId}`, {
        method: 'DELETE',
      })

      if (!response.ok && response.status !== 204) {
        throw new Error('No se pudo eliminar la tarea')
      }

      setLoading(true)
      loadTodos(filter)
    } catch {
      setError('Error al eliminar la tarea')
    }
  }

  return (
    <main className="app">
      <h1>Todo List</h1>

      <form className="todo-form" onSubmit={handleAddTodo}>
        <input
          type="text"
          placeholder="Nueva tarea"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Descripción (opcional)"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <button type="submit">Agregar</button>
      </form>

      <div className="filters" role="group" aria-label="Filtrar tareas">
        <button
          type="button"
          className={filter === 'pending' ? 'active' : ''}
          onClick={() => {
            setLoading(true)
            setFilter('pending')
          }}
        >
          Pendientes
        </button>
        <button
          type="button"
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => {
            setLoading(true)
            setFilter('completed')
          }}
        >
          Completadas
        </button>
        <button
          type="button"
          className={filter === 'all' ? 'active' : ''}
          onClick={() => {
            setLoading(true)
            setFilter('all')
          }}
        >
          Todas
        </button>
      </div>

      {error && <p className="status error">{error}</p>}
      {loading ? (
        <p className="status">Cargando tareas...</p>
      ) : todos.length === 0 ? (
        <p className="status">No hay tareas en este filtro.</p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className={todo.completed ? 'done' : ''}>
              <div>
                <h2>{todo.title}</h2>
                {todo.description && <p>{todo.description}</p>}
              </div>
              <div className="actions">
                <button type="button" onClick={() => handleToggleTodo(todo)}>
                  {todo.completed ? 'Desmarcar' : 'Completar'}
                </button>
                <button
                  type="button"
                  className="danger"
                  onClick={() => handleDeleteTodo(todo.id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default App
