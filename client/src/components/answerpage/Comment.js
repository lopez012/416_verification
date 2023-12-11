import React, { Component } from 'react'
import FormatDate from '../Homepage/FormatDate';
import axios from 'axios';


export default class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
        };
    }
    componentDidMount() {
        this.getUsername();
    }
    getUsername = async () => {
        try {
            const userId = this.props.comment.commented_by;
            const response = await axios.get(`http://localhost:8000/users/${userId}`);
            this.setState({ username: response.data.username });
        } catch (error) {
            console.error(error);
        }
    }
    




  render() {
    return (
      <div className='comment_div'>  
        <div className='comment_text'>
        {this.props.comment.text}
        </div>
        <div className='comment_metadata'>
          <div className='commented-by'>{this.state.username}</div>
          commented {FormatDate(this.props.comment.comment_time)}
        </div>
      </div>
    )
  }
}
