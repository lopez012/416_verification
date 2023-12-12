import React, { Component } from 'react'
import FormatDate from '../Homepage/FormatDate';
import axios from 'axios';


export default class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            comment_text: props.comment.text,
            comment_votes:props.comment.upvotes,
            hasUpvoted: false,
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
    handleCommentUpVote = async (comment_id) => {
      if (!this.state.hasUpvoted) {
        this.setState(prevState => ({
            hasUpvoted: true,
            comment_votes: prevState.comment_votes + 1,
        }));
        try {
            await axios.post(`http://localhost:8000/comments/upvote/${comment_id}`);
        } catch (error) {
            console.error('Error:', error);
        }
      }
    };
    




  render() {
    return (
      <div className='comment_div'>
      
        {/* Vote Section (Upvote, Downvote, Vote Count) */}
        <div className='vote-section'>
          {/* Upvote button */}
          <button disabled={this.state.hasUpvoted} onClick={() => this.handleCommentUpVote(this.props.comment._id)} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight:'20px' }}>
            ▲
          </button>
          {/* Vote Count Display */}
          <span style={{ marginLeft: '12px', display: 'block' }}>{this.state.comment_votes}</span>  
        
     
        <div className='comment_text'>
        {this.props.comment.text}
        </div>
        <div className='comment_metadata'>
          <div className='commented-by'>{this.state.username}</div>
          commented {FormatDate(this.props.comment.comment_time)}
        </div>
      </div>
      </div>
    )
  }
}
