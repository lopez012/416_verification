import React, { Component } from 'react'
import FormatDate from '../Homepage/FormatDate';
import axios from 'axios';
import Answer from './answer'

//ansDeletion
export default class Answers extends Component {
  constructor(props){
    super(props);
    this.state = {
      answers: [],
      comment_box:false,
      comment_submitted:0,

      page_controls:true,
      current_page:0,
      answers_per_page:5,

    }
    this.getanswers = this.getanswers.bind(this);
    this.hyperLinks = this.hyperLinks.bind(this);
    this.renderAnswers = this.renderAnswers.bind(this);
    this.comment_submitted = this.comment_submitted.bind(this);
    

  }
  
  componentDidMount(){
    this.getanswers();
  }

    componentDidUpdate(prevState) {
      if (this.comment_submitted !== prevState.comment_submitted) {
        this.getanswers();
      }
    }

  comment_submitted(event){
    this.setState((prevstate)=> ({comment_submitted: prevstate.comment_submitted+1}))
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
  total_pages = () =>{
    return Math.ceil(this.state.answers.length/this.state.answers_per_page);
  };

  next_page = ()=>{
    this.setState(prevState =>({
      current_page: (prevState.current_page +1)% this.total_pages()

    }));
  };
  prev_page =()=>{
    this.setState(prevState=>({
      current_page: prevState.current_page===0?0: prevState.current_page-1
    }));
  };

  editAnswer = async(answer) => {
    const userInput = window.prompt('What would you like to change answer into?');
    const responsed = await axios.post(`http://localhost:8000/answers/${answer._id}/${userInput}/change`);
    
    alert("Answer Changed");
  };

 deleteAnswer = async(answer) => {
  const responsed = await axios.post(`http://localhost:8000/answers/${answer._id}/delete`);
  console.log(responsed.data)
  const respon = await axios.post(`http://localhost:8000/comments/${responsed.data.commentArrays}/delete`);
  alert("answer delete");
};

  renderAnswers(answers) {
    const { onUpVote, onDownVote, ansDeletion, user } = this.props;

    const sorted_answers = answers.sort((a, b) => {
      const A = new Date(a.ans_date_time);
      const B = new Date(b.ans_date_time);
    return B - A; 
    });
    const start_ind = this.state.current_page * this.state.answers_per_page;
    const answers_on_page = sorted_answers.slice(start_ind, start_ind+this.state.answers_per_page);
    console.log(answers_on_page);
    if(ansDeletion) {
      answers_on_page.sort((a) => {
        if (a.ans_by._id !== user._id) {
          console.log("ff");
          return 1; // Move answer with ans_by equal to user._id to the front
        } else {
          console.log("fff");

          return 0; // Keep the original order for other answers
        }
      });
    }    
    const answer_comp = answers_on_page.map(answer => (
     <Answer 
     key={answer._id}
     onUpVote = {this.props.onUpVote}
     onDownVote = {this.props.onDownVote}
     answer = {answer}
     hyperLinks = {this.hyperLinks}
     user ={this.props.user}
     comment_submitted = {this.comment_submitted}
     answerDeletion = {this.props.ansDeletion}
     handleDeleteAnswer = {this.deleteAnswer}
     handleEditAnswer = {this.editAnswer}

     />
    ));

    return (
      <div>
        <div >
          {answer_comp}
        </div>
      
         
      </div>
    );
  }
    
  render() {
    //TODO
    //const answers = this.props.model.getAnswersofquestion(this.props.questionid);

    
    return (
      <>
      <div className='answer_container'>
        {this.renderAnswers(this.state.answers)}
      </div>
      {this.state.page_controls &&this.state.answers.length>5&&(
        <div className="Page_controls2">
        <button onClick={this.prev_page} disabled={this.state.current_page === 0}>Prev</button>
        <button onClick={this.next_page}>Next</button>
        </div>
        )}
        </>
    );
  }
}
