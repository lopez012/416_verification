import React from 'react';


function SearchHeader(props) {
  return (
    <div id="search_header">
      <span style={{ paddingLeft: '10px', fontWeight: 'bold', fontSize: 'x-large' }}>
        SearchResults
      </span>
      <div style={{ paddingLeft: '10px', fontSize: 'large'}}>
        {props.totalQuestions} Questions
      </div>
      <button id="ask_question" onClick={props.onAskQuestion}>Ask Question</button>
      <br />
      <br />
      <span id="num_questions"></span>
      <div id="sortButtons" style={{ right: '25px', bottom: '35px' }}>
        <button id="newest_button" onClick={props.sortbynewest}>Newest</button>
        <button id="active_button" onClick={props.sortbyactive}>Active</button>
        <button id="unanswered_button" onClick={props.sortbyunanswered}>Unanswered</button>
      </div>
    </div>
  );
}

export default SearchHeader;
