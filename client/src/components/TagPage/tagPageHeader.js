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
    
    const headerText = this.props.tagDel ? "Tags you created" : "All Tags";
    const numTags = this.props.tagDel ? this.props.passTag.length : this.state.num_of_tags;

    return (
        <div className = 'TagsPage'>
        <div className = 'TagsPageHeader'>
          <div className = 'numoftags'><h2>{numTags} Tags</h2></div>
          <div className = 'alltags'><h1>{headerText}</h1></div>
          {this.props.user &&(<button className = "tagsq" id="addqtagspage" onClick={this.props.onAskQuestion}>Add Question</button>)}
        </div>
      </div>
    );
  }
}
