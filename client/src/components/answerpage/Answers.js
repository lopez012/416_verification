import React, { Component } from 'react'
import FormatDate from '../Homepage/FormatDate';
import axios from 'axios';


export default class Answers extends Component {
  constructor(props){
    super(props);
    this.state = {
      answers: []

    }

  }
  componentDidMount(){
    this.getanswers();
  }

  getanswers(){
    axios.get(`http://localhost:8000/answers/question/${this.props.questionid}`)
      .then(res=> {
        this.setState({answers: res.data});
      })
      .catch(err=>{
        console.error('error gettign answers',err);
      });
  }
  
  

  hyperLinks(text) {
    const regex = /\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g;
    const replacedText = text.replace(regex, '<a href="$2" target="_blank">$1</a>');
    return { __html: replacedText };
  }
  renderAnswers(answers) {
    const { onUpVote, onDownVote } = this.props;
  
    return answers.map(answer => (
      <div className='answer_div' key={answer._id}>
        {/* Answer text */}
        <div className='answer_text' dangerouslySetInnerHTML={this.hyperLinks(answer.text)} />
  
        {/* Vote Section (Upvote, Downvote, Vote Count) */}
        <div className='vote-section'>
          {/* Upvote button */}
          <button onClick={() => onUpVote(answer._id)} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
            ▲
          </button>
  
          {/* Downvote Button */}
          <button onClick={() => onDownVote(answer._id)} style={{ display: 'inline-block', verticalAlign: 'middle', }}>
            ▼
          </button>
  
          {/* Vote Count Display */}
          <span style={{ marginLeft: '5px' }}>{answer.upvotes.length - answer.downvotes.length}</span>
        </div>
  
        {/* Answer metadata */}
        <div className='answer_metadata'>
          <div className='asked-by'>{answer.ans_by}</div>
          answered {FormatDate(answer.ans_date_time)}
        </div>
      </div>
    ));
  }
    
  render() {
    //TODO
    //const answers = this.props.model.getAnswersofquestion(this.props.questionid);
    return (
      <div className='answer_container'>
        {this.renderAnswers(this.state.answers)}
      </div>
    );
  }
}
