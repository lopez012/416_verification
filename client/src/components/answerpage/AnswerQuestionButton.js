import React, { Component } from 'react'

export default class AnswerQuestionButton extends Component {
    
  render() {
    return (
      <button className='answer_question_button' onClick={this.props.toggleForm}>Answer Question</button>
    )
  }
}