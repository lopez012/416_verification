import React, { Component } from 'react'
import AnswerForm from './answerForm'
import AnswerPageHeader from './AnswerPageHeader'
import QuestionInfo from './QuestionInfo'
import Answers from './Answers'
import AnswerQuestionButton from './AnswerQuestionButton'

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
  render() {
    if(this.state.toggle_answer_form){
        return <AnswerForm toggleForm = {this.toggle_answer_form} qid={this.props.question._id} /> 
    }
    return (
<div>
    <AnswerPageHeader question={this.props.question} onAskQuestion={this.props.onAskQuestion} user ={this.props.user}/>
    <QuestionInfo question={this.props.question} />
    <Answers
      questionid={this.props.question._id}
      //model={this.props.model}
    />
    {this.props.user &&
    (<AnswerQuestionButton toggleForm={this.toggle_answer_form} />)}
  </div>
    )
  }
}
