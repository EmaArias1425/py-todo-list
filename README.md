# TODO List API

Backend REST API para gestión de tareas (TODO list) construido con FastAPI y SQLAlchemy.

Los datos se almacenan en una base de datos SQLite en memoria, por lo que se reinician al detener el servidor.

## Requisitos

- Python 3.12+
- Node.js 20+ (para frontend)

## Instalación

```bash
pip install -r requirements.txt
```

## Ejecución backend

```bash
python -m uvicorn app.main:app --reload
```

El servidor se levanta en `http://localhost:8000`.

## Frontend React (Todo List)

El frontend está en `/tmp/workspace/EmaArias1425/py-todo-list/frontend` y permite:

- agregar tareas
- marcar completadas
- eliminar tareas
- filtrar por pendientes/completadas

### Ejecutar frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend corre en `http://localhost:5173` y consume por defecto `http://localhost:8000`.

Si necesitas cambiar la URL del backend, crea un archivo `frontend/.env` con:

```bash
VITE_API_URL=http://tu-backend
```

## Endpoints

| Método   | Ruta            | Descripción                                        |
|----------|-----------------|----------------------------------------------------|
| `POST`   | `/todos/`       | Crear un nuevo todo                                |
| `GET`    | `/todos/`       | Listar todos (filtro opcional `?completed=true`)  |
| `GET`    | `/todos/{id}`   | Obtener un todo por ID                             |
| `PUT`    | `/todos/{id}`   | Actualizar un todo                                 |
| `DELETE` | `/todos/{id}`   | Eliminar un todo                                   |

## Ejemplos

Crear un todo:

```bash
curl -X POST http://localhost:8000/todos/ \
  -H "Content-Type: application/json" \
  -d '{"title": "Comprar leche", "description": "En el supermercado"}'
```

Listar todos:

```bash
curl http://localhost:8000/todos/
```

Actualizar un todo:

```bash
curl -X PUT http://localhost:8000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

Eliminar un todo:

```bash
curl -X DELETE http://localhost:8000/todos/1
```
