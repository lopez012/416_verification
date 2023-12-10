import React, { Component } from 'react'
import FormatDate from '../Homepage/FormatDate'
import axios from 'axios'


export default class QuestionInfo extends Component {
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
    
  hyperLinks(text) {
    const regex = /\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g;
    const replacedText = text.replace(regex, '<a href="$2" target="_blank">$1</a>');
    return { __html: replacedText };
  }
  
  render() {
    const { askedByUsername } = this.state;
    return (
       
      <div className = "anspage_question_data">
          <span className = "bold">{this.props.question.views} views</span>
          <div className="anspage_q_text" dangerouslySetInnerHTML={this.hyperLinks(this.props.question.text)} />
          <div className = "answer_metadata">
            <div className='mandatory'>{askedByUsername}</div>
            <div>asked {FormatDate(this.props.question.askDate)}</div>
          </div>
        </div>
    )
  }
}
