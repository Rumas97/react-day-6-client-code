import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import MyNav from './components/MyNav';
import { Route, Switch, withRouter } from 'react-router-dom';
import TodoList from './components/TodoList'
import axios from 'axios';
import config from './config'
import TodoDetail from './components/TodoDetail';
import AddForm from './components/AddForm'
import EditForm from './components/EditForm';

function App(props) {

  const [todos, updateTodos] = useState([])

  useEffect(() => {
    axios.get(`${config.API_URL}/api/todos`)
    .then((response) => {
      updateTodos(response.data)
    })
    .catch(() => {
      console.log('Fecthing failed')
    })
  }, [])

  //---------THIS IS WHERE THE MAGIC HAPPENS---------
  // This function will run whenever your state `todos` gets updated
  // Notice the array as the second param, that's where we add the dependencies.
  // It will run always our `todos` gets updated
  useEffect(() => {
    props.history.push('/')
  }, [todos])

  // Another alternative would be to use await and async but it wouldnt be as easier as this one
  //----------------------------------------------------

  const handleSubmit = (event) => {
    event.preventDefault()
    let name = event.target.name.value
    let description = event.target.description.value

    axios.post(`${config.API_URL}/api/create`, {
      name: name,
      description: description,
      completed: false,
    })
      .then((response) => {
          updateTodos([response.data, ...todos])
      })
      .catch((err) => {
        console.log('Create failed', err)
      })
    }

  const handleDelete = (todoId) => {
    axios.delete(`${config.API_URL}/api/todos/${todoId}`)
      .then(() => {

          let filteredTodos = todos.filter((todo) => {
            return todo._id !== todoId
          })
          updateTodos(filteredTodos)
      })
      .catch((err) => {
        console.log('Delete failed', err)
      })
  }


  const handleEditTodo = (todo) => {
    axios.patch(`${config.API_URL}/api/todos/${todo._id}`, {
      name: todo.name,
      description: todo.description,
      completed: todo.completed,
    })
      .then(() => {
          let newTodos = todos.map((singleTodo) => {
              if (todo._id === singleTodo._id) {
                singleTodo.name  = todo.name
                singleTodo.description = todo.description
              }
              return singleTodo
          })
          updateTodos(newTodos)    
      })
      .catch((err) => {
        console.log('Edit failed', err)
      })
  }

  return (
    <div>
      <MyNav />
      <h1>Shopping List</h1>
      <Switch>
          <Route exact path="/" render={() => {
              return <TodoList todos={todos} />
          }} />
          <Route  path="/todos/:todoId" render={(routeProps) => {
  
              return <TodoDetail onDelete={handleDelete} {...routeProps} />
          }} />
           <Route path="/add-form" render={() => {
              return <AddForm onAdd={handleSubmit} />
          }} />
          <Route  path="/todo/:todoId/edit" render={(routeProps) => {
              return <EditForm onEdit={handleEditTodo} {...routeProps}/>
          }} />
      </Switch>
    </div>
  )
}


export default withRouter(App)







