import React, { Component } from 'react'
import axios from 'axios'
export default class Tagbox extends Component {
    constructor(props) {
      super(props)
      this.state = {}
      
      this.handletagclick = this.handletagclick.bind(this);
    }

  handletagclick(){
    this.props.onTagclick(this.props.tagname, this.props.tagid);
  }
handleDelete = async(tid) => {

  const ress = await axios.get(`http://localhost:8000/questions/${tid}/uniqueTags`);
  if(ress.data.uniqueAskers.length > 1) {
    alert("You cannot delete a tag that another person is also using");
  }
  else {
    const responsed = await axios.delete(`http://localhost:8000/tags/${tid}/delete`);
    alert("Tag Deleted");
  }
};

handleEdit = async(tid) => {
  const ress = await axios.get(`http://localhost:8000/questions/${tid}/uniqueTags`);
  if(ress.data.uniqueAskers.length > 1) {
    alert("You cannot change a tag that another person is also using");
  }
  else{
  const userInput = window.prompt('What would you like to change tagName into?');

  if (userInput && userInput.length <= 10) {
  const responsed = await axios.post(`http://localhost:8000/tags/${tid}/${userInput}/change`);
  alert("Name Changed! Please refresh page to see changes");
  }
  else {
    alert("Can't have tag name be over 10 or Empty");
  }
}
};

  render() {
    return (
      <div className='tagbox'>
        <a className='tagname' onClick={this.handletagclick}>
          {this.props.tagname}
        </a>
        <div>
          {this.props.numofq}
          {this.props.numofq === 1 ? ' question' : ' questions'}
        </div>
        {this.props.tagDel && (
          <div>
            <button className='delete-buttons' onClick={() =>this.handleDelete(this.props.tagid)}>Delete</button>
            <button className='editor-buttons' onClick={() =>this.handleEdit(this.props.tagid)}>Edit</button>
          </div>
        )}
      </div>
    );
  }
}
