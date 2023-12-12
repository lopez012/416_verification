import React, { Component } from 'react';
import FormatDate from './FormatDate';
import axios from 'axios';

class Question extends Component {
  constructor(props) {
    super(props);
    this.state = {
      askedByUsername: null,
    };
  }
  async componentDidMount() {
    const { question } = this.props;
    if (question.askedBy) {
      try {
        const response = await axios.get(`http://localhost:8000/users/${question.askedBy}`);
        this.setState({ askedByUsername: response.data.username });
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    }
  }
  render() {
    
    const { question, onViewQuestion, tagName, onUpVote, onDownVote  } = this.props;
    const { askedByUsername } = this.state;
    const formattedDate = FormatDate(question.askDate);

    return (
      <div className="question">
        <div className="question_container">
          <div className="left_q">
            <span style={{ color: 'grey' }}>{question.answers.length} answers</span>
            <div style={{ color: 'grey' }}>{question.views} views</div>
          </div>
          {/* upvote button*/}
          <div>
          <button onClick={() => onUpVote(question._id)}
           style={{ display: 'block', verticalAlign: 'middle' }}>
               ▲
              </button>
               {/* Vote Count Display */}
          <span style={{ marginLeft: '5px' }}> {question.upvotes.length - question.downvotes.length}</span>
          {/* Downvote Button */}
          <button onClick={() => onDownVote(question._id)}
           style= {{display: 'block', verticalAlign: 'middle'}}>▼</button>
           </div>
             
          <div></div>
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
            <p className='summary'>{question.summary}</p>

            <div id="q_tag_container">
            {this.props.question.tags.map((tags) => (
         <span key={tags._id} className="q_tag">
            {tags.name}
          </span>
          ))}
          </div>
      </div>  
          <div className="right_q">
            <div style={{ color: 'red' }}>{askedByUsername}</div>
            <div>asked {formattedDate}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Question;
