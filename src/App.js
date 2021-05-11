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
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
// import NotFound from './components/NotFound';
import Chatbot from './components/Chatbot';

class App extends Component {

  state = {
    todos: [],
    user:null,
    error:null,
    fetchingUser:true
  }

  // Make sure all the initial data that you show to the user is fetched here
  componentDidMount(){
    axios.get(`${config.API_URL}/api/todos`,{withCredentials:true})
      .then((response) => {
        console.log(response.data)
        this.setState({ 
          todos: response.data
        })
      })
      .catch(() => {
        console.log('Fecthing failed')
      })
      axios.get(`${config.API_URL}/api/user`,{withCredentials:true})
      .then((response)=>{
        this.setState({user: response.data,
          fetchingUser:false
        })
      })
      .catch((errorObj)=>{
        this.setState({
          error:errorObj.response.data,
          fetchingUser:false
        })
      })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    let name = event.target.name.value
    let description = event.target.description.value
    let image = event.target.todoImage.files[0]
    let formData= new FormData()
    formData.append('imageUrl', image)

    axios.post(`${config.API_URL}/api/upload`,formData)
    .then((response)=>{
      //console.log(response.data.image)
      //1. Make an API call to the server side Route to create a new todo
      return axios.post(`${config.API_URL}/api/create`, {
              name: name,
              description: description,
              completed: false,
              image:response.data.image,
              },{withCredentials:true})
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
    axios.delete(`${config.API_URL}/api/todos/${todoId}`,{withCredentials:true})
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
    },{withCredentials:true})
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

  handleSignUp=(event)=>{
    event.preventDefault()

    const {username,email,password}=event.target
    let newUser ={
      username:username.value,
      email:email.value,
      password:password.value
    }
    console.log(newUser)

    axios.post(`${config.API_URL}/api/signup`, newUser,{withCredentials:true})
    .then((response)=>{
      //the real data is always in response.data
      //console.log(response.data)({
      this.setState({
        user: response.data
      },()=>{
        this.props.history.push('/')
      })
    })
    .catch(()=>{console.log('error creating new user')})
  }

  handleSignIn =(event)=>{
    event.preventDefault()
    const {email,password}=event.target
    let newUser ={
      email:email.value,
      password:password.value
    }
    console.log(newUser)

    axios.post(`${config.API_URL}/api/signin`, newUser,{withCredentials:true})
    .then((response)=>{
      //the real data is always in response.data
      //console.log(response.data)({
      this.setState({
        user: response.data,
        error:null
      },()=>{
        this.props.history.push('/')
      })
    })
    .catch((errorObj)=>{
      //the real error json is always in the .response.data
      //console.log(errorObj.response.data)
      this.setState({
        error:errorObj.response.data
      })
      //console.log('error signin')
    })

  }

  handleLogout=(event)=>{
    event.preventDefault()

    axios.post(`${config.API_URL}/api/logout`,{},{withCredentials:true})
    .then(()=>{
      this.setState({
        user:null
      })
    })
    .catch((errorObj)=>{
      this.setState({
        error:errorObj.response.data
      })
    })
  }

  render() {
    const {todos,error,user,fetchingUser} = this.state
    if(fetchingUser){
      return <p>Loading...</p>
    }
    return (
      <div>
        <MyNav onLogout={this.handleLogout}user={user}/>
        <Chatbot />
        <h1>Shopping List</h1>
        <Switch>
            <Route exact path="/" render={() => {
                return <TodoList todos={todos} />
            }} />
            <Route  path="/todos/:todoId" render={(routeProps) => {
    
                return <TodoDetail user={user} onDelete={this.handleDelete} {...routeProps} />
            }} />
             <Route path="/add-form" render={() => {
                return <AddForm onAdd={this.handleSubmit} />
            }} />
            <Route  path="/todo/:todoId/edit" render={(routeProps) => {
                return <EditForm onEdit={this.handleEditTodo} {...routeProps}/>
            }} />
            <Route  path="/signin"  render={(routeProps) => {
	              return  <SignIn error={error} onSignIn={this.handleSignIn}{...routeProps}  />
            }}/>
            <Route  path="/signup"  render={(routeProps) => {
              	return  <SignUp onSubmit={this.handleSignUp}{...routeProps}  />
            }}/>
            {/* <Route component={NotFound}/> */}
        </Switch>
      </div>
    )
  }
}

export default withRouter(App)







