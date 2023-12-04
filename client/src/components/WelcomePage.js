import React, { Component } from 'react'

import '../stylesheets/App.css'
import LoginForm from '../components/LoginForm'

import Homepage from './Homepage'
import RegisterForm from '../components/RegisterForm'

class WelcomePage extends Component {
    constructor(props) {
        super(props)
      
        this.state = {
          toggle_register_form:false,
          toggle_login_form:false,
          show_homepage: false
          
        }
        this.toggle_register_form = this.toggle_register_form.bind(this);
        this.toggle_login_form = this.toggle_login_form.bind(this);
        this.showhomepage = this.showhomepage.bind(this);
    }
    toggle_register_form(event){
        this.setState((prevstate) =>({toggle_register_form: !prevstate.toggle_register_form}))
    }
    toggle_login_form(event){
        this.setState((prevstate) =>({toggle_login_form: !prevstate.toggle_login_form}))
    }


    showhomepage(event) {
        this.setState({ show_homepage: true });
    }



  render() {
    if(this.state.toggle_login_form){
        return <LoginForm toggleForm = {this.toggle_login_form} /> 
    }
    if(this.state.toggle_register_form){
        return <RegisterForm toggleForm = {this.toggle_login_form} /> 
    }
    if (this.state.show_homepage) {
        return <Homepage />;
    }
    return (
        
      <div>
        <h1 className='Welcome'>Welcome to Fake Stack Overflow</h1>
        <div className='center'>
            <button className='register_button' onClick={this.toggle_register_form}>Register</button>
            <button className='login_button' onClick={this.toggle_login_form}>Login</button>
            <button className='guest_button' onClick={this.showhomepage}>Continue as Guest</button>
        </div>
      </div>     
    )
  }
}

export default WelcomePage;