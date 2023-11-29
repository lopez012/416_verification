import React, { Component } from 'react'
import axios from 'axios'

export default class TagPageHeader extends Component {
  constructor(props){
    super(props);
    this.state = {
        num_of_tags:0
    }
  }
  componentDidMount() {
    axios.get('http://localhost:8000/tags')
      .then((res) => {
        
        this.setState({ num_of_tags: res.data.length || 0 });
      })
      .catch((error) => {
        console.error('Error getting num of tags', error);
      });
  }

  render() {
    return (
        <div className = 'TagsPage'>
        <div className = 'TagsPageHeader'>
          <div className = 'numoftags'><h2>{this.state.num_of_tags} Tags</h2></div>
          <div className = 'alltags'><h1>All Tags</h1></div>
          <button className = "tagsq" id="addqtagspage" onClick={this.props.onAskQuestion}>Add Question</button>
        </div>
      </div>
    );
  }
}
