import React, { Component } from 'react';

export default class AnswerPageHeader extends Component {

  render() {
    const { question, user, onAskQuestion, onUpVote, onDownVote } = this.props;

    return (
      <div className='answer_page_header'>
        <span className='bold'>{question.answers.length} answers</span>
        <div id='question_title_answer_page' className='bold'>
          <span>{question.title}</span>
          {/* Ask Question Button */}
        {user && (
          <button className='askq2' onClick={onAskQuestion}>
            Ask Question
          </button>
        )}

        </div>

        {/* Upvote button */}
        {user && (
          <button
            onClick={() => onUpVote(question._id)}
            style={{ display: 'block', verticalAlign: 'middle', marginLeft: '10px' }}
          >
            ▲
          </button>
        )}
        {/* Vote Count Display */}
        <span style={{ marginLeft: '20px' }}>{question.upvotes.length - question.downvotes.length}</span>
        {/* Downvote Button */}
        {user && (
          <button
            onClick={() => onDownVote(question._id)}
            style={{ display: 'block', verticalAlign: 'middle', marginLeft: '10px' }}
          >
            ▼
          </button>
        )}

        
        
      </div>
    );
  }
}
