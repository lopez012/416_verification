import React, { Component } from 'react';
import axios from 'axios';
import FormatDate from './FormatDate';
import memSince from './memSince';



class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
          Names: [],
          Answers:[],
          users:[],
          tags: [],
        };


        this.getusers = this.getusers.bind(this);
        this.renderusers = this.renderusers.bind(this);
        this.deleteUser = this.deleteUser.bind(this);

      }
    async componentDidMount() {
        const { user } = this.props;
          try {
            const response = await axios.get(`http://localhost:8000/questions/${user._id}/names`);
            this.setState({ Names: response.data.questions });
            const response01 = await axios.get(`http://localhost:8000/questions/${user._id}/getanswers`);
            const b = response01.data.questions.map(question => question._id);
            this.setState({Answers: b});
            const response02 = await axios.get(`http://localhost:8000/tags/${user._id}/getCreation`);
          
            this.setState({tags : response02.data.tags});
            console.log(this.state.tags);
            this.getusers();
          } catch (error) {
            console.error('Error fetching titles', error);
          }
      }
      async getusers(){
        try{
          const response = await axios.get(`http://localhost:8000/users/all`);
          this.setState({users: response.data});
        }catch(err){
          console.error('error getting users',err);
        }
      }
      async deleteUser(id){
        const confirmation = window.confirm("Are you sure you want to delete this user?");
        if(confirmation){
          try {
            await axios.delete(`http://localhost:8000/users/${id}`);
            console.log('user deleted');
            this.setState(prevState => ({
                users: prevState.users.filter(user => user._id !== id)
            }));
        } catch (error) {
            console.error("error deleting user", error);
        }

        }
      }
      async taketoUserProfile(user){
        this.props.set_logged_in_user(user);
        try {
          const response = await axios.get(`http://localhost:8000/questions/${user._id}/names`);
          this.setState({ Names: response.data.questions });
        } catch (error) {
          console.error('Error fetching titles', error);
        }
      }
       renderusers(){
        
        if(this.state.users.length>0){
          let user_comp = this.state.users.map(user=>(
            <>
            <a onClick= {() => this.taketoUserProfile(user)} className='username'>{user.username}</a>
            <button onClick={() => this.deleteUser(user._id)} className='delete_button'>X</button>
            <br/>
            <br/>
            </>
          ));
          return(<>
          {user_comp}</>)
       }
      
    


      }






  render() {
    const { user, onChangeQuestion, onDeleteQuestion, onUserAnswers, onTagsPage } = this.props;
    const membershipDuration = user ? memSince(user.member_since) : '--';
    
    if(user.role==="admin"){  //ADMIN PROFILE PAGE
      return (
      <>
      <h1>Admin-Info:</h1>
      <div>
      <p>
        User Name: {user ? user.username : '--username--'} <br />
        Member Since: {user ? FormatDate(user.member_since) : '--member_since--'} <br />
        Member for {membershipDuration} <br />
        Reputation: {user.reputation} <br />
        <strong style={{ fontSize: '1.2em'}}>Questions User Asked</strong> <br />
        {this.state.Names && (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {this.state.Names.map((question, index) => (
              <li key={index} >
                <span style={{ display: 'block'}}>{question.title}</span>
                <div style={{ marginBottom: '10px' }}>
                  <button onClick={() => onDeleteQuestion(question)}>Delete</button>
                  <button onClick={() => onChangeQuestion(question)}>Modify</button>
                </div>
              </li>
            ))}
          </ul>
        )} 
      </p>
    </div>
    <div className='Users'>
      <h3>Users:</h3>
      {this.renderusers()}
    </div>

    </>
      
      )
    }else{
      return (
        <div>
          <h2>User Profile</h2>
          <p>
            <strong style={{ fontSize: '1.2em' }}>User Information</strong> <br />
            User Name: {user ? user.username : '--username--'} <br />
            Member Since: {user ? FormatDate(user.member_since) : '--member_since--'} <br />
            Member for {membershipDuration} <br />
            Reputation: {user.reputation} <br />
            <strong style={{ fontSize: '1.2em' }}>Questions User Asked</strong> <br />
            {this.state.Names && this.state.Names.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {this.state.Names.map((question, index) => (
                  <li key={index}>
                    {/* Make the title clickable */}
                    <span
                      style={{ display: 'block', cursor: 'pointer', color: 'blue' }}
                      onClick={() => onChangeQuestion(question)}
                    >
                      {question.title}
                    </span>
                    <div style={{ marginBottom: '10px' }}>
                      <button onClick={() => onDeleteQuestion(question)}>Delete</button>
                      <button onClick={() => onChangeQuestion(question)}>Modify</button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>You have no Questions</p>
            )}
          </p>
          <p>
            <strong style={{ fontSize: '1.5em', cursor: 'pointer', color: 'Red', marginBottom: "20px" }} onClick={() => onUserAnswers(this.state.Answers)}>
              Questions User answered Page
            </strong>
            <br />
            <strong style={{ fontSize: '1.5em', marginTop: '20px', cursor: 'pointer' }} onClick={() => onTagsPage(this.state.tags)}>
              Tags User Created
            </strong>
            <br />
          </p>
        </div>
      );
              }
  }
}
export default UserProfile;