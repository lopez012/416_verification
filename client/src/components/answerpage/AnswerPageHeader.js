import React, { Component } from 'react'

export default class AnswerPageHeader extends Component {
  render() {
    return (
      <div className='answer_page_header'>
        <span className='bold'>{this.props.question.answers.length} answers</span> 
          <div id = "question_title_answer_page" className="bold"><span>{this.props.question.title}</span></div>
          <button id= "askq" className = 'askq2' onClick={this.props.onAskQuestion}>Ask Question</button>
      </div>
    )
  }
}