import axios from 'axios'
import React, { Component } from 'react'
import config from '../config'

export default class EditForm extends Component {

  state = {
    todo: {}
  }

  componentDidMount(){
    let todoId = this.props.match.params.todoId
    axios.get(`${config.API_URL}/api/todos/${todoId}`)
      .then((response) => {
        this.setState({
          todo: response.data
        })
      })
      .catch(() => {
        console.log('Detail fecth failed')
      })
  }

  handleNameChange = (event) => {
    let text = event.target.value
    console.log(text)
    let cloneTodo = JSON.parse(JSON.stringify(this.state.todo))
    cloneTodo.name = text

    this.setState({
      todo: cloneTodo
    })
  }

  handleDescChange = (event) => {
    let text = event.target.value
    let cloneTodo = JSON.parse(JSON.stringify(this.state.todo))
    cloneTodo.description = text

    this.setState({
      todo: cloneTodo
    })
  }

  render() {
    const {todo} = this.state
    const {onEdit} = this.props
    return (
      <div>
          <input type="text" onChange={this.handleNameChange} value={todo.name}/>
          <input type="text" onChange={this.handleDescChange} value={todo.description}/>
          <button onClick={ () => { onEdit(todo) } }  >Submit</button>
      </div>
    )
  }
}
