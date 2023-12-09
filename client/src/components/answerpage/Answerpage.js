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
        toggle_answer_form:false
      }
      this.toggle_answer_form = this.toggle_answer_form.bind(this)
    }
    toggle_answer_form(event){
        this.setState((prevstate) =>({toggle_answer_form: !prevstate.toggle_answer_form}))
    }
    handleUpVote = async (qid) => {
      const { user } = this.props;
      
      const userId = user.id
      console.log(userId);
      try {
        console.log(qid, user.id);
        
        const response = await axios.post(`http://localhost:8000/questions/${qid}/${userId}/upvote`)
        console.log(response);
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    handleDownvote = async (qid) => {
      const {  user } = this.props;
      
      try {
        const response = await axios.post(`http://localhost:8000/questions/${qid}/${user.id}/downvote`)
        console.log(response);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    handleUpVote01 = async (aid) => {
      const { user } = this.props;
      
      const userId = user.id
      console.log(userId);
      try {
        console.log(aid, user.id);
        const response = await axios.post(`http://localhost:8000/answers/${aid}/${userId}/upvote`)
        console.log(response);
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    handleDownvote01 = async (aid) => {
      const {  user } = this.props;
      
      try {
        const response = await axios.post(`http://localhost:8000/answers/${aid}/${user.id}/downvote`)
        console.log(response);
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
  render() {
    if(this.state.toggle_answer_form){
        return <AnswerForm toggleForm = {this.toggle_answer_form} qid={this.props.question._id} /> 
    }
    return (
<div>
    <AnswerPageHeader 
    question={this.props.question} 
    onAskQuestion={this.props.onAskQuestion} 
    onUpVote = {this.handleUpVote}
    onDownVote = {this.handleDownvote}
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
