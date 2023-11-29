import React, { Component } from 'react'
import FormatDate from '../Homepage/FormatDate'



export default class QuestionInfo extends Component {
    
  hyperLinks(text) {
    const regex = /\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g;
    const replacedText = text.replace(regex, '<a href="$2" target="_blank">$1</a>');
    return { __html: replacedText };
  }
  
  render() {
    return (
      <div className = "anspage_question_data">
          <span className = "bold">{this.props.question.views} views</span>
          <div className="anspage_q_text" dangerouslySetInnerHTML={this.hyperLinks(this.props.question.text)} />
          <div className = "answer_metadata">
            <div className='mandatory'>{this.props.question.askedBy}</div>
            <div>asked {FormatDate(this.props.question.askDate)}</div>
          </div>
        </div>
    )
  }
}
