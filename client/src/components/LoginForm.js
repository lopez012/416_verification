
import React, { Component } from 'react'
import axios from 'axios';

export default class LoginForm extends Component {
    constructor(props){
        super(props)
        this.state = {
          email: '',
          password: '',
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
        let email_error = '';
        let password_error = '';
  
        let validinput = true;

        if(!this.state.email){
          email_error = 'Please enter an Email: '
          validinput = false;
        }
        //TODO: verify password and email.
        if(!this.state.password){
          password_error = 'Please enter a password: '
          validinput = false;
  
        }
        if(validinput){
          /*
           TODO:
                */
        }else{
          this.setState({email_error,password_error});
        }
      }
    
    
    
      render() {
        return (
          <div className='login_form'>
          <form id = "login_form" onSubmit={this.handleSubmitForm}>
            <h1>Login Form</h1><br/>
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

            <br/>
  
            <button type="submit" className='submit_button'>Login</button>
          </form>
          </div>
        )
      }
    }