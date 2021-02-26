import axios from 'axios'
import React, { useState, useEffect } from 'react'
import config from '../config'

function EditForm({match, onEdit}) {

  const [todo, updateTodo] = useState({})

  useEffect(() => {
    let todoId = match.params.todoId
    axios.get(`${config.API_URL}/api/todos/${todoId}`)
      .then((response) => {
        updateTodo(response.data)
      })
      .catch(() => {
        console.log('Detail fecth failed')
      })
  }, [])

  const handleNameChange = (event) => {
    let text = event.target.value
    let cloneTodo = JSON.parse(JSON.stringify(todo))
    cloneTodo.name = text

    updateTodo(cloneTodo)
  }

  const handleDescChange = (event) => {
    let text = event.target.value
    let cloneTodo = JSON.parse(JSON.stringify(todo))
    cloneTodo.description = text
    updateTodo(cloneTodo)
  }

  return (
    <div>
        <input type="text" onChange={handleNameChange} value={todo.name}/>
        <input type="text" onChange={handleDescChange} value={todo.description}/>
        <button onClick={ () => { onEdit(todo) } }  >Submit</button>
    </div>
  )
}


export default EditForm



