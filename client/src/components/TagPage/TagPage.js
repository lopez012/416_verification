import React, { Component } from 'react'
//import TagPageHeader from './tagPageHeader'
import TagsContainer from './tagsContainer'
import '../../stylesheets/App.css'




export default class TagPage extends Component {
  constructor(props) {
    super(props)

  }
 
  render() {
    return (
      <div className='TagsPage'>
        <div className= 'TagsContainer'>
        <TagsContainer onTagclick ={this.props.onTagclick} />
        </div>
     </div>
    )
  }
}
