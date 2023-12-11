import React, { Component } from 'react'
import AnswerForm from './answerForm'
import AnswerPageHeader from './AnswerPageHeader'
import QuestionInfo from './QuestionInfo'
import Answers from './Answers'
import AnswerQuestionButton from './AnswerQuestionButton'
import axios from 'axios'
export default class AnswerPage extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
        toggle_answer_form:false,
      }
      this.toggle_answer_form = this.toggle_answer_form.bind(this)
    }
    toggle_answer_form(event){
        this.setState((prevstate) =>({toggle_answer_form: !prevstate.toggle_answer_form}))
    }
    handleUpVote = async (qid) => {
      const { user } = this.props;    
      const userId = user._id
      const userReputation = user.reputation;
      const response = await axios.get(`http://localhost:8000/questions/${qid}`);
      const askedBy = response.data.askedBy;
      if (userReputation >= 50) {
       if(askedBy !== user._id){
      try {
        
        
        const vote = await axios.post(`http://localhost:8000/questions/${qid}/${userId}/upvote`)
        const voteMessage = vote.data.message;
        const response = await axios.post(`http://localhost:8000/users/${askedBy}/${voteMessage}`);
        console.log(response.data.message);
      } 
      catch (error) {
        console.error('Error:', error);
      }}
      else {
        alert("can't upvote your own own questions");
      }
      }
      else {
        alert('You need 50 or more reputation to upvote.');
      }
    };
  
    handleDownvote = async (qid) => {
      const {  user } = this.props;
      const userReputation = user.reputation;
      const response = await axios.get(`http://localhost:8000/questions/${qid}`);
      const askedBy = response.data.askedBy;
      if (userReputation >= 50){
        if(askedBy !== user._id){
      try {
        console.log("ivan");
        const vote = await axios.post(`http://localhost:8000/questions/${qid}/${user._id}/downvote`);
        const voteMessage = vote.data.message;
        const response = await axios.post(`http://localhost:8000/users/${askedBy}/${voteMessage}`);
        
        console.log(response);
      } catch (error) {
        console.error('Error:', error);
      }
      }
      else {
        alert("can't downvote your own own questions");
      }
    }
     else {
      alert('You need 50 or more reputation to downvote.');
     }
    };

    handleUpVote01 = async (aid) => {
      const { user } = this.props;
      const userReputation = user.reputation;
      const userId = user._id;
      const response = await axios.get(`http://localhost:8000/answers/${aid}`);
      const askedBy = response.data.ans_by;
      console.log(userId);
      if(userReputation >= 50){
        if(user._id !== askedBy){
      try {
        console.log(aid, user._id);
        const vote = await axios.post(`http://localhost:8000/answers/${aid}/${userId}/upvote`);
        const voteMessage = vote.data.message;
        const response = await axios.post(`http://localhost:8000/users/${askedBy}/${voteMessage}`);
        console.log(response);
      } catch (error) {
        console.error('Error:', error);
      }
    }
    else {
      alert("Cannot upvote your own answer.");
    }
    }
    else {
      alert("Cannot upvote answer with less than 50 reputation.");
    }
    };
  
    handleDownvote01 = async (aid) => {
      const { user } = this.props;
      const userReputation = user.reputation;
      const userId = user._id;
      const response = await axios.get(`http://localhost:8000/answers/${aid}`);
      const askedBy = response.data.ans_by;
      console.log(userId);
      if(userReputation >= 50){
        if(user._id !== askedBy){
      try {
        const vote = await axios.post(`http://localhost:8000/answers/${aid}/${userId}/downvote`);
        const voteMessage = vote.data.message;
        const response = await axios.post(`http://localhost:8000/users/${askedBy}/${voteMessage}`);
        console.log(response);
      } catch (error) {
        console.error('Error:', error);
      }
    }
    else {
      alert("Cannot downvote your own answer.");
    }
    }
    else {
      alert("Cannot downvote answer with less than 50 reputation.");
    }
    };
  
  render() {
    if(this.state.toggle_answer_form){
        return <AnswerForm toggleForm = {this.toggle_answer_form} qid={this.props.question._id} user = {this.props.user}/> 
    }
    return (
<div>
    <AnswerPageHeader 
    question={this.props.question} 
    onAskQuestion={this.props.onAskQuestion} 
    onUpVote = {this.handleUpVote}
    onDownVote = {this.handleDownvote}
    user ={this.props.user}
    />
    <QuestionInfo question={this.props.question} />
    <Answers
      questionid={this.props.question._id}
      user ={this.props.user}
      onUpVote = {this.handleUpVote01}
      onDownVote = {this.handleDownvote01}
      //model={this.props.model}
    />
    {this.props.user &&
    (<AnswerQuestionButton toggleForm={this.toggle_answer_form} />)}
  </div>
    )
  }
}
