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
      this.setState({
        username_error: '',
        email_error:'',
        password_error: '',
        password_verification_error: ''
      })
    }
    handleSubmitForm = async(event)=>{
      event.preventDefault();
      let username_error = '';
      let email_error = '';
      let password_error = '';
      let password_verification_error ='';

      let validinput = true;
      if(!this.state.username){
        username_error = 'Please enter a Username'
        validinput = false;
      }
      if(!this.state.email){
        email_error = 'Please enter an Email: '
        validinput = false;
      }
      const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+\.[a-zA-Z]+$/;
      if(!regex.test(this.state.email)){
        validinput = false;
        email_error = 'email is not correct format'
      }
   
      
      if(!this.state.password){
        password_error = 'Please enter a password: '
        validinput = false;
      }
      if(this.state.password!==this.state.password_verification){
        password_verification_error = 'Passwords do not match!'
        validinput = false;
      }
      const emailid = this.state.email.split('@')[0];

    if (this.state.password.includes(this.state.username) || this.state.password.includes(emailid)) {
        validinput = false;
        password_verification_error = 'password cannot contain username or email.'
    }

      
      const res = await axios.post('http://localhost:8000/users/check-existing-email', { email:this.state.email });
      if(res.data.valid_email===false){
        validinput = false;
        email_error = 'Email already exists' 
      }
      
      


      if(validinput){

        const user_data = {
            email: this.state.email,
            username: this.state.username,
            password: this.state.password ,
            role: "regular"
        };

        axios.post('http://localhost:8000/users/add', user_data)
            .then(res=> {
                this.props.toggleForm();
                this.setState({
                    email: '',
                    username: '',
                    password: '', 
                    password_verification:'', 
                    username_error:'',
                    password_error:'',
                    email_error:'',  
                  });
            })
            .catch(err=>{
                console.log('error adding user: ',err);

            })
      }else{
        this.setState({username_error,email_error,password_error,password_verification_error});
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
          <div id = "password_verification_error">{this.state.password_verification_error?this.state.password_verification_error:''}</div>
          <br/>

          <button type="submit" className='submit_button'>Sign Up</button>
        </form>
        </div>
      )
    }
  }