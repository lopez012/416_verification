import React, { Component } from 'react'
import axios from 'axios';


export default class AnswerForm extends Component {
  constructor(props){
    super(props)
    this.state = {
      answer_username: '',
      answer_text: '',
      username_error: '',
      answer_text_error:''

    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmitForm = this.handleSubmitForm.bind(this);

  }
  handleInputChange(event){
    this.setState({[event.target.name]:event.target.value});
  }
  handleSubmitForm(event){
    event.preventDefault();
    //let username_error = '';
    let answer_text_error = '';
    let validinput = true;
    /*if(!this.state.answer_username){
      username_error = 'Please enter a Username '
      validinput = false;
    }*/
    if(!this.state.answer_text){
      answer_text_error = 'Please enter an answer: '
      validinput = false;
    }
    if(validinput){
        const answer_data = {
            text: this.state.answer_text,
            ans_by: this.props.user,
            ans_date_time: new Date(),
            questionId: this.props.qid
        };
        //TODO: append Answer Document to Question Collection.
        axios.post('http://localhost:8000/answers/add', answer_data)
            .then(res=> {
                this.props.toggleForm();
                this.setState({
                    //answer_username: '',
                    answer_text: '',
                    username_error: '',  
                    answer_text_error: ''  
                  });
            })
            .catch(err=>{
                console.log('error adding answer: ',err);

            })
      /*
      this.props.model.addanswer(this.props.qid, this.state.answer_username,this.state.answer_text);
      this.props.toggleForm();
      this.setState({
        answer_username: '',
        answer_text: '',
        username_error: '',  
        answer_text_error: ''  
      });
      */
    }else{
      this.setState({answer_text_error});
    }
  }



  render() {
    return (
      <form id = "answer_form" onSubmit={this.handleSubmitForm}>
        
        <label className='answer_username'>Answer Text*</label><br/>
        <textarea  
        id="answer_text" 
        className="answer_text_box"
        name="answer_text"
        value = {this.state.answer_text}
        onChange={this.handleInputChange}
        ></textarea>
        <div id="answer_text_error">{this.state.answer_text_error?this.state.answer_text_error:''}</div>
        <br/><br/>
        <button type="submit">Post Answer</button>
        <span className='mandatory'> *indicates mandatory fields</span>
      </form>
    )
  }
}

