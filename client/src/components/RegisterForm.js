import React, { Component } from 'react'
import axios from 'axios';


export default class RegisterForm extends Component {
    constructor(props){
      super(props)
      this.state = {
        username: '',
        email: '',
        password: '',
        password_verification: '',
        username_error:'',
        email_error: '',
        password_error:''
      };
  
      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleSubmitForm = this.handleSubmitForm.bind(this);
  
    }
    handleInputChange(event){
      this.setState({[event.target.name]:event.target.value});
    }
    handleSubmitForm(event){
      event.preventDefault();
      let username_error = '';
      let email_error = '';
      let password_error = '';

      let validinput = true;
      if(!this.state.username){
        username_error = 'Please enter a Username'
        validinput = false;
      }
      if(!this.state.email){
        email_error = 'Please enter an Email: '
        validinput = false;
      }
      //TODO: verify password and verfication match. 
      //      implement constraints on password, email , and username.
      if(!this.state.password){
        password_error = 'Please enter a password: '
        validinput = false;

      }
      if(validinput){
        /*
          TODO:
              */
      }else{
        this.setState({username_error,email_error,password_error});
      }
    }
  
  
  
    render() {
      return (
        <div className='register_form'>
        <form id = "register_form" onSubmit={this.handleSubmitForm}>
            <h1>Sign Up Form</h1><br/>
          <label >Username</label><br/>
          <input 
          type="text" 
          name="username" 
          value = {this.state.username} 
          onChange={this.handleInputChange} /><br/>
          <div id = "username_error">{this.state.username_error?this.state.username_error:''}</div>
          <label >Email</label><br/>
          <input   
          type="text"
          name="email"
          value = {this.state.email}
          onChange={this.handleInputChange}
          ></input >
          <div id="username_error">{this.state.email_error?this.state.email_error:''}</div>
          <br/>
          <label >Password</label><br/>
          <input 
          type="password" 
          name="password" 
          value = {this.state.password} 
          onChange={this.handleInputChange} /><br/>
          <div id = "password_error">{this.state.password_error?this.state.password_error:''}</div>

          <label >Reenter Password</label><br/>
          <input 
          type="password" 
          name="password_verification" 
          value = {this.state.password_verification} 
          onChange={this.handleInputChange} /><br/>
          <div id = "password_error">{this.state.password_error?this.state.password_error:''}</div>
          <br/>

          <button type="submit" className='submit_button'>Sign Up</button>
        </form>
        </div>
      )
    }
  }