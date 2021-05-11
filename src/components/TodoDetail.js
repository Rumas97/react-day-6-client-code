import axios from 'axios'
import React, { Component } from 'react'
import config from '../config'
import {Link,Redirect} from 'react-router-dom'

export default class TodoDetail extends Component {

  state = {
    todo: {}
  }

  componentDidMount(){
    console.log(this.props) 
 
   let todoId = this.props.match.params.todoId
    axios.get(`${config.API_URL}/api/todos/${todoId}`)
      .then((response) => {
        this.setState({ todo: response.data })
      })
      .catch(() => {
        console.log('Detail fecth failed')
      })
  }

  render() {
    const {todo} = this.state
    const {onDelete,user} = this.props
    console.log(this.props)

    if(!user){
      return <Redirect to = {'/signin'} />
    }

    return (
      <div>
        <h4>Details are:</h4>
        <div>Name: {todo.name}</div>
        <div>Description: {todo.description}</div>
        {
          todo.image && (
            <img src={todo.image} alt={todo.name} loading='lazy'/>
          )
        
        }
        <br></br>
        <Link to={`/todo/${todo._id}/edit`}>
          <button>Edit</button>
        </Link>
        <button onClick={() => { onDelete(todo._id)  } } >Delete</button>

      </div>
    )
  }
}
