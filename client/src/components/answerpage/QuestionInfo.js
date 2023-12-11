import React, { Component } from 'react'
import FormatDate from '../Homepage/FormatDate'
import axios from 'axios'
import Comment from './Comment';


export default class QuestionInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      askedByUsername: null,
      comment_box:false,
      comment_text: '',
      comment_text_error: '',
      comment_submitted: 0
      
    };
   
    this.comment_submitted = this.comment_submitted.bind(this);


    this.handleCommentClick = this.handleCommentClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmitForm = this.handleSubmitForm.bind(this);
  }
  async componentDidMount() {
    const { question } = this.props;
    if (question.askedBy) {
      try {
        const response = await axios.get(`http://localhost:8000/users/${question.askedBy}`);
        this.setState({ askedByUsername: response.data.username });
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    }
  }
  

  comment_submitted(event){
    this.setState((prevstate)=> ({comment_submitted: prevstate.comment_submitted+1}))
  }
  /*
  componentDidUpdate(prevState) {
    if (this.comment_submitted !== prevState.comment_submitted) {
      this.getanswers();
    }
  }
  */


  handleCommentClick() {
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
            questionId: this.props.question._id
        };

        
        axios.post('http://localhost:8000/comments/question/add', comment_data)
            .then(res=> {
              this.props.refreshQuestionData();
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

  render_comments_for_question(comments){
    return comments.map(comment => (
        <Comment 
        key={comment._id}
        onUpVote = {this.props.onUpVote}
        onDownVote = {this.props.onDownVote}
        question = {this.props.question}
        //username ={comment.commented_by.username}
        comment = {comment}
        //comment_submitted = {this.props.comment_submitted}
        />
       ));
  }





    
  hyperLinks(text) {
    const regex = /\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g;
    const replacedText = text.replace(regex, '<a href="$2" target="_blank">$1</a>');
    return { __html: replacedText };
  }
  
  render() {
    const { askedByUsername } = this.state;
    return (
      <>
       
      <div className = "anspage_question_data">
          <span className = "bold">{this.props.question.views} views</span>
          <div className="anspage_q_text" dangerouslySetInnerHTML={this.hyperLinks(this.props.question.text)} />
          <div className = "answer_metadata">
            <div className='mandatory'>{askedByUsername}</div>
            <div>asked {FormatDate(this.props.question.askDate)}</div>
          </div>
       </div>
       {this.render_comments_for_question(this.props.question.comments)}
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
        </>
    )
  }
}
