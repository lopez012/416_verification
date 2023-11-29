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
  renderAnswers(answers){
    return answers.map(answer=>(
      <div className='answer_div' key={answer._id} >
        <div className='answer_text' dangerouslySetInnerHTML={this.hyperLinks(answer.text)} />
        <div className='answer_metadata'>
          <div className='asked-by'> {answer.ans_by}</div> answered {FormatDate(answer.ans_date_time)}
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
