import React from 'react'

function AddForm({onAdd}) {
  return (
    <form onSubmit={onAdd}>
      <input name="name" type="text" placeholder="Enter name"/>
      <input name="description" type="text" placeholder="Enter desc"/>
      <button type="submit" >Submit</button>
    </form>
  )
}

export default AddForm
