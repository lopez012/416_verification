import React, { Component } from 'react'
import FormatDate from '../Homepage/FormatDate';
import axios from 'axios';
import Answer from './answer'


export default class Answers extends Component {
  constructor(props){
    super(props);
    this.state = {
      answers: [],
      comment_box:false,
      comment_submitted:0
      
    }
    this.getanswers = this.getanswers.bind(this);
    this.hyperLinks = this.hyperLinks.bind(this);
    this.renderAnswers = this.renderAnswers.bind(this);
    this.comment_submitted = this.comment_submitted.bind(this);
    

  }
  
  componentDidMount(){
    this.getanswers();
  }

    componentDidUpdate(prevState) {
      if (this.comment_submitted !== prevState.comment_submitted) {
        this.getanswers();
      }
    }

  comment_submitted(event){
    this.setState((prevstate)=> ({comment_submitted: prevstate.comment_submitted+1}))
  }


  getanswers(){
    axios.get(`http://localhost:8000/answers/question/${this.props.questionid}`)
      .then(res=> {
        this.setState({answers: res.data});
      })
      .catch(err=>{
        console.error('error gettign answers',err);
      });
  }
 
  
  

  hyperLinks(text) {
    const regex = /\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g;
    const replacedText = text.replace(regex, '<a href="$2" target="_blank">$1</a>');
    return { __html: replacedText };
  }
  renderAnswers(answers) {
    const { onUpVote, onDownVote } = this.props;
  
    return answers.map(answer => (
     <Answer 
     key={answer._id}
     onUpVote = {this.props.onUpVote}
     onDownVote = {this.props.onDownVote}
     answer = {answer}
     hyperLinks = {this.hyperLinks}
     user ={this.props.user}
     comment_submitted = {this.comment_submitted}

     />
    ));
  }
    
  render() {
    //TODO
    //const answers = this.props.model.getAnswersofquestion(this.props.questionid);

    
    return (
      <div className='answer_container'>
        {this.renderAnswers(this.state.answers)}
      </div>
    );
  }
}
