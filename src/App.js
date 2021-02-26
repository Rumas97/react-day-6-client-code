import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import MyNav from './components/MyNav';
import { Route, Switch, withRouter } from 'react-router-dom';
import TodoList from './components/TodoList'
import axios from 'axios';
import config from './config'
import TodoDetail from './components/TodoDetail';
import AddForm from './components/AddForm'
import EditForm from './components/EditForm';

class App extends Component {

  state = {
    todos: []
  }

  // Make sure all the initial data that you show to the user is fetched here
  componentDidMount(){
    axios.get(`${config.API_URL}/api/todos`)
      .then((response) => {
        console.log(response.data)
        this.setState({ todos: response.data})
      })
      .catch(() => {
        console.log('Fecthing failed')
      })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    let name = event.target.name.value
    let description = event.target.description.value

    //1. Make an API call to the server side Route to create a new todo
    axios.post(`${config.API_URL}/api/create`, {
      name: name,
      description: description,
      completed: false,
    })
      .then((response) => {
          // 2. Once the server has successfully created a new todo, update your state that is visible to the user
          this.setState({
            todos: [response.data, ...this.state.todos]
          }, () => {
            //3. Once the state is update, redirect the user to the home page
            this.props.history.push('/')
          })

      })
      .catch((err) => {
        console.log('Create failed', err)
      })
 }

 handleDelete = (todoId) => {

  //1. Make an API call to the server side Route to delete that specific todo
    axios.delete(`${config.API_URL}/api/todos/${todoId}`)
      .then(() => {
         // 2. Once the server has successfully created a new todo, update your state that is visible to the user
          let filteredTodos = this.state.todos.filter((todo) => {
            return todo._id !== todoId
          })

          this.setState({
            todos: filteredTodos
          }, () => {
            this.props.history.push('/')
          })
      })
      .catch((err) => {
        console.log('Delete failed', err)
      })

 }


 handleEditTodo = (todo) => {
    axios.patch(`${config.API_URL}/api/todos/${todo._id}`, {
      name: todo.name,
      description: todo.description,
      completed: todo.completed,
    })
      .then(() => {
          let newTodos = this.state.todos.map((singleTodo) => {
              if (todo._id === singleTodo._id) {
                singleTodo.name  = todo.name
                singleTodo.description = todo.description
              }
              return singleTodo
          })
          this.setState({
            todos: newTodos
          }, () => {
            this.props.history.push('/')
          })

          
      })
      .catch((err) => {
        console.log('Edit failed', err)
      })

 }

  render() {
    const {todos} = this.state

    return (
      <div>
        <MyNav />
        <h1>Shopping List</h1>
        <Switch>
            <Route exact path="/" render={() => {
                return <TodoList todos={todos} />
            }} />
            <Route  path="/todos/:todoId" render={(routeProps) => {
    
                return <TodoDetail onDelete={this.handleDelete} {...routeProps} />
            }} />
             <Route path="/add-form" render={() => {
                return <AddForm onAdd={this.handleSubmit} />
            }} />
            <Route  path="/todo/:todoId/edit" render={(routeProps) => {
                return <EditForm onEdit={this.handleEditTodo} {...routeProps}/>
            }} />
        </Switch>
      </div>
    )
  }
}

export default withRouter(App)







