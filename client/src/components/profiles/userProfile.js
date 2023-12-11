import React, { Component } from 'react';
import axios from 'axios';
import FormatDate from './FormatDate';
import memSince from './memSince';



class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
          Names: null,
        };
      }
    async componentDidMount() {
        const { user } = this.props;
          try {
            const response = await axios.get(`http://localhost:8000/questions/${user._id}/names`);
            this.setState({ Names: response.data.questions });
          } catch (error) {
            console.error('Error fetching titles', error);
          }
      }
  render() {
    const { user, onChangeQuestion, onDeleteQuestion } = this.props;
    const membershipDuration = user ? memSince(user.member_since) : '--';
    console.log(this.state.Names);
    return (
    <div>
        <h2>User Profile</h2>
        <p>
        <strong style={{ fontSize: '1.2em'}}>User Information</strong> <br />
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
    );
  }
}

export default UserProfile;