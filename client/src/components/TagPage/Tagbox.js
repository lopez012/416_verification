import React, { Component } from 'react'

export default class Tagbox extends Component {
    constructor(props) {
      super(props)
      this.state = {}
      
      this.handletagclick = this.handletagclick.bind(this);
    }

  handletagclick(){
    this.props.onTagclick(this.props.tagname, this.props.tagid);

  }

  render() {
    return (
        <div className='tagbox'>
            <a className='tagname' onClick={this.handletagclick}> {this.props.tagname} </a>
            <div>
                {this.props.numofq}
                {this.props.numofq ==1 ? ' question': ' questions'}
            </div>
      </div>
    )
  }
}
