import React, { Component } from 'react'

class AddForm extends Component {

  render() {
    return (
      <form onSubmit={this.props.onAdd}>
        <input name="name" type="text" placeholder="Enter name"/>
        <input name="description" type="text" placeholder="Enter desc"/>
        <button type="submit" >Submit</button>
      </form>
    )
  }
}


export default AddForm