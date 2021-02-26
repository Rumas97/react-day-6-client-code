import React, { Component } from 'react'
import { Link } from 'react-router-dom'

function TodoList({todos}) {
  return (
    <div>
        <h4>My Todos</h4>
        {
          todos.map((todo) => {
            return <Link key={todo._id} to={`/todos/${todo._id}`}>
              <div >{todo.name}</div>
              </Link>
          })
        }
      
    </div>
  )
}


export default TodoList 