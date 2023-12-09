import React, { Component } from 'react';

export default class AnswerPageHeader extends Component {

  render() {
    const { question, user, onAskQuestion, onUpVote, onDownVote } = this.props;

    return (
      <div className='answer_page_header'>
        <span className='bold'>{question.answers.length} answers</span>
        <div id='question_title_answer_page' className='bold'>
          <span>{question.title}</span>
        </div>

        {/* Upvote button */}
        {user && (
          <button
            onClick={() => onUpVote(question._id)}
            style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '10px' }}
          >
            ▲
          </button>
        )}
        {/* Downvote Button */}
        {user && (
          <button
            onClick={() => onDownVote(question._id)}
            style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '20px' }}
          >
            ▼
          </button>
        )}

        {/* Vote Count Display */}
        <span style={{ marginLeft: '20px' }}>{question.upvotes.length - question.downvotes.length}</span>
        {/* Ask Question Button */}
        {user && (
          <button id='askq' className='askq2' onClick={onAskQuestion}>
            Ask Question
          </button>
        )}
      </div>
    );
  }
}
