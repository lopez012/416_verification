import React, { Component } from 'react'
import FormatDate from '../Homepage/FormatDate';
import axios from 'axios';
import Comment from './Comment';



export default class Answer extends Component {
    constructor(props){
        super(props);
        this.state = {
          comment_box:false,
          comment_text: '',
          comment_text_error: '',

          page_controls:true,
          current_page:0,
          comments_per_page:3, 
        }
        this.handleCommentClick = this.handleCommentClick.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmitForm = this.handleSubmitForm.bind(this);
      }
 

handleCommentClick() {
  if(this.props.user.reputation<50){
    alert('need 50 reputation points to comment');
    return;
  }
    this.setState(prevState => ({
        comment_box: !prevState.comment_box
    }));
    this.setState({comment_text_error:''});
}
handleInputChange(event){
    this.setState({[event.target.name]:event.target.value});
    this.setState({comment_text_error:false});
}
handleSubmitForm(event){
    //event.preventDefault();
 
    let comment_text_error = '';
    let validinput = true;
  
    if(!this.state.comment_text){
      comment_text_error = 'Please enter a comment '
      validinput = false;
    }
    if(this.state.comment_text.length>140){
        comment_text_error = 'comment too long'
        validinput = false;
    }
    if(validinput){
        const comment_data = {
            text: this.state.comment_text,
            commented_by: this.props.user,
            comment_time: new Date(),
            answerId: this.props.answer._id
        };

        
        axios.post('http://localhost:8000/comments/answer/add', comment_data)
            .then(res=> {
                this.props.comment_submitted();
                this.setState({
                    comment_text: '',
                    comment_text_error: '',
                    comment_box:false 
                  });
            })
            .catch(err=>{
                console.log('error adding comment: ',err);

            })
            
    }else{
      this.setState({comment_text_error});
    }
  }
  total_pages = () =>{
    return Math.ceil(this.props.answer.comments.length/this.state.comments_per_page);
  };

  next_page = ()=>{
    this.setState(prevState =>({
      current_page: (prevState.current_page +1)% this.total_pages()

    }));
  };
  prev_page =()=>{
    this.setState(prevState=>({
      current_page: prevState.current_page===0?0: prevState.current_page-1
    }));
  };







  render_comments_for_answer(comments){
    const sorted_c = comments.sort((a, b) => {
      const A = new Date(a.comment_time);
      const B = new Date(b.comment_time);
    return B - A;
    });
    const start_ind = this.state.current_page * this.state.comments_per_page;
    const comments_on_ans_page = sorted_c.slice(start_ind, start_ind+this.state.comments_per_page);


    const ans_comments = comments_on_ans_page.map(comment => (
        <Comment 
        key={comment._id}
        onUpVote = {this.props.onUpVote}
        //onDownVote = {this.props.onDownVote}
        answer = {this.props.answer}
        //username ={comment.commented_by.username}
        comment = {comment}
        //comment_submitted = {this.props.comment_submitted}
        />
       ));

       return (
        <div>
          <div className="comment-list">
            {ans_comments}
          </div>
          {this.state.page_controls && comments.length>3&&(
        <div className="Page_controls2">
        <button onClick={this.prev_page} disabled={this.state.current_page === 0}>Prev</button>
        <button onClick={this.next_page}>Next</button>
        </div>
        )}
           
        </div>
      );
    

  }


  render() {
    const { onUpVote, onDownVote , answer , hyperLinks } = this.props;
    
    return (
        <div className='answer_div'>
        
  
        {/* Vote Section (Upvote, Downvote, Vote Count) */}
        <div className='vote-section'>
          {/* Upvote button */}
          <button onClick={() => onUpVote(answer._id)} style={{ display: 'block', verticalAlign: 'middle' }}>
            ▲
          </button>
          {/* Vote Count Display */}
          <span style={{ marginLeft: '5px' }}>{answer.upvotes.length - answer.downvotes.length}</span>

          {/* Downvote Button */}
          <button onClick={() => onDownVote(answer._id)} style={{ display: 'block', verticalAlign: 'middle', }}>
            ▼
          </button>
  
          
        </div>
        {/* Answer text */}
        <div className='answer_text' dangerouslySetInnerHTML={hyperLinks(answer.text)} />
      
        {/* Answer metadata */}
        <div className='answer_metadata'>
          <div className='asked-by'>{answer.ans_by.username}</div>
          answered {FormatDate(answer.ans_date_time)}
        </div>
        {this.render_comments_for_answer(this.props.answer.comments)}

        {this.props.user &&
        (<button className='comment-button' onClick={this.handleCommentClick}>Add Comment</button>
        )}
        {this.state.comment_box&&
        (<><br />
        <textarea 
        className='comment-box'
        rows={3}
        cols={100}
        name="comment_text"
        value = {this.state.comment_text}
        onChange={this.handleInputChange}
        />
        <br/>
        <button onClick = {this.handleSubmitForm}>submit</button></>)}
        <div id="comment_text_error">{this.state.comment_text_error?this.state.comment_text_error:''}</div>
        <br/>
        
      </div>
      
    )
  }
}

