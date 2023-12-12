import React, { Component } from 'react'
import axios from 'axios';

import '../stylesheets/App.css'
import LoginForm from '../components/LoginForm'

import Homepage from './Homepage'
import RegisterForm from '../components/RegisterForm'

axios.defaults.withCredentials = true;


class WelcomePage extends Component {
    constructor(props) {
        super(props)
      
        this.state = {
          toggle_register_form:false,
          toggle_login_form:false,
          show_homepage: false,
          Logged_In_User: null
          
        }
        this.toggle_register_form = this.toggle_register_form.bind(this);
        this.toggle_login_form = this.toggle_login_form.bind(this);
        this.showhomepage = this.showhomepage.bind(this);
        this.set_logged_in_user = this.set_logged_in_user.bind(this);
        this.logout = this.logout.bind(this);
        
    }
    async componentDidMount() {
      
      axios.get('http://localhost:8000/users/verify-session')
        .then(response => {
            if (response.data.sessionValid) {
              console.log("valid-session");
                this.setState({ Logged_In_User: response.data.user });
            } else {
                this.setState({ Logged_In_User: null });
            }
        })
        .catch(error => {
            this.setState({ Logged_In_User: null });
        });
    }
    toggle_register_form(event){
        this.setState((prevstate) =>({toggle_register_form: !prevstate.toggle_register_form}))
        
    }
    toggle_login_form(event){
        this.setState((prevstate) =>({toggle_login_form: !prevstate.toggle_login_form}))
    }
    set_logged_in_user(User){
      this.setState({Logged_In_User:User})
    
    }
    logout() {
      
      //console.log("Logout clicked");
      this.setState({
          toggle_register_form:false,
          toggle_login_form:false,
          show_homepage: false });

      axios.get('http://localhost:8000/users/logout')
        .then(response => {
            this.setState({ Logged_In_User: null});
        })
        .catch(error => {
            this.setState({ Logged_In_User: null });
        });
        
       //console.log('Test logout function');



    }


    showhomepage(event) {
        //console.log("showhomepage method called");

        this.setState({ 
          toggle_register_form:false,
          toggle_login_form:false,
          show_homepage: true });
    }



  render() {
    if(this.state.Logged_In_User){ // Rendered for REGISTERED Users.
      return <Homepage user={this.state.Logged_In_User} logout = {this.logout} set_logged_in_user={this.set_logged_in_user}  />;
    }
    if(this.state.toggle_login_form){
        return <LoginForm toggleHome = {this.showhomepage} set_logged_in_user={this.set_logged_in_user} /> 
    }
    if(this.state.toggle_register_form){
        return <RegisterForm toggleForm = {this.toggle_login_form} /> 
    }
    
    if (this.state.show_homepage) { //rendered when guest enters 
        
        return <Homepage  user={this.state.Logged_In_User} logout = {this.logout}/>;
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