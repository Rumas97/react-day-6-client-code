import React, { Component } from 'react'
import { Link } from 'react-router-dom'


export default class TodoList extends Component {
  /*
    this.props = {
      todos: Array
    }
  */
  render() {
    const {todos} = this.props
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
}
