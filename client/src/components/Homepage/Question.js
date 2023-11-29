import React, { Component } from 'react';
import FormatDate from './FormatDate';

class Question extends Component {
  render() {
    const { question, onViewQuestion, tagName } = this.props;
    const formattedDate = FormatDate(question.askDate);

    return (
      <div className="question">
        <div className="question_container">
          <div className="left_q">
            <span style={{ color: 'grey' }}>{question.answers.length} answers</span>
            <div style={{ color: 'grey' }}>{question.views} views</div>
          </div>
          <div className="middle_q">
            <p style={{ margin: '0px 20px', fontSize: '20px' }}>
              <a
                href="#"
                id="question_title_anchor"
                style={{ color: 'blue', textDecoration: 'none' }}
                onClick={() => onViewQuestion(question._id)}
              >
                {question.title}
              </a>
            </p>  
            <div id="q_tag_container">
            {this.props.question.tags.map((tags) => (
         <span key={tags._id} className="q_tag">
            {tags.name}
          </span>
          ))}
</div>
          </div>  
          <div className="right_q">
            <div style={{ color: 'red' }}>{question.askedBy}</div>
            <div>asked {formattedDate}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Question;
