import React from 'react';


function QuestionsHeader(props) {
  const headerText = props.ansdel
  ? "Questions that you have answered"
  : "All Questions";
  return (
    <td id="questions_header">
      <span style={{ paddingLeft: '10px', fontWeight: 'bold', fontSize: 'x-large' }}>
        {headerText}
      </span>
      <div style={{ paddingLeft: '10px', fontSize: 'large'}}>
        {props.totalQuestions} Questions
      </div>
      {props.user &&
      <button id="ask_question" onClick={props.onAskQuestion}>Ask Question</button>}
      <br />
      <br />
      <span id="num_questions"></span>
      <div id="sort_buttons" style={{ position: 'absolute', right: '250px', top: '10px' }}>
        <button id="newest_button" onClick={props.sortbynewest}>Newest</button>
        <button id="active_button" onClick={props.sortbyactive}>Active</button>
        <button id="unanswered_button" onClick={props.sortbyunanswered}>Unanswered</button>
      </div>
    </td>
  );
}

export default QuestionsHeader;
