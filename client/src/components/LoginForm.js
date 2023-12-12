
import React, { Component } from 'react'
import axios from 'axios';

export default class LoginForm extends Component {
    constructor(props){
        super(props)
        this.state = {
          email: '',
          password: '',
          valid_login:false,
          email_error: '',
          password_error:''
        };
    
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmitForm = this.handleSubmitForm.bind(this);
    
      }
      handleInputChange(event){
        this.setState({[event.target.name]:event.target.value});
        this.setState({
          email_error: '',
          password_error:''
        })
      }
    verify_credentials(){
        const user_data = {
            email: this.state.email,
            password: this.state.password 
        };

        axios.post('http://localhost:8000/users/login', user_data).then(res => {
            if (res.status === 200) {//user logged in 
                this.props.set_logged_in_user(res.data.user)
                this.props.toggleHome();
            }
        })
        .catch(err => {
            
            this.setState({password_error: 'Username or Password is incorrect'});
            console.error('Error logging in', err);
        });
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
        
        if(!this.state.password){
          password_error = 'Please enter a password: '
          validinput = false;
  
        }
        
       
        if(validinput){
            this.verify_credentials();
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