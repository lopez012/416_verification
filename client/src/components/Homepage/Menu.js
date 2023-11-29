import React, { Component } from 'react'

export default class Menu extends Component {
    render() {
        return(
            <div id="menubar">
                <button id="questions_button">Questions</button>
                <br />
                <button id="tags_button">Tags</button>
            </div>
        );
    }
}