import axios from 'axios'
import React, { useState, useEffect } from 'react'
import config from '../config'
import {Link} from 'react-router-dom'


function TodoDetail(props) {

  const [todo, updateTodo] = useState({})

  useEffect(() => {
    let todoId = props.match.params.todoId
    axios.get(`${config.API_URL}/api/todos/${todoId}`)
      .then((response) => {
        updateTodo(response.data)
      })
      .catch(() => {
        console.log('Detail fecth failed')
      })
  }, [])

  const {onDelete} = props
  return (
      <div>
        <h4>Details are:</h4>
        <div>Name: {todo.name}</div>
        <div>Description: {todo.description}</div>
        <Link to={`/todo/${todo._id}/edit`}>
          <button>Edit</button>
        </Link>
        <button onClick={() => { onDelete(todo._id)  } } >Delete</button>

      </div>
    )
}

export default TodoDetail
