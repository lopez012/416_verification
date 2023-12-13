import React, { Component } from 'react'
import Tagbox from './Tagbox';
import axios from 'axios';

export default class tagsContainer extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
        //tags: this.props.model.data.tags,
        tags: [],
        selectedTag:null,
        selectedtagid:null
      }
      this.handleselectedtag = this.handleselectedtag.bind(this);
    }
    componentDidMount(){
        axios.get('http://localhost:8000/tags')
            .then(res =>{
                let tagswithQcount = res.data.map(tag=>({
                  ...tag, count:0
                }));
                console.log(this.props.passTag);
                if (this.props.tagDel) {
                  tagswithQcount = this.props.passTag.map(tag => ({
                    ...tag,
                    count: 0
                  }));
                }
                this.setState({ tags: tagswithQcount});
                console.log(tagswithQcount);

                tagswithQcount.forEach((tag,index)=>{
                  axios.get(`http://localhost:8000/tags/tag/count/${tag._id}`)
                    .then(qcount =>{
                      this.setState(prevstate=>{
                        const newtags = [...prevstate.tags];
                        newtags[index].count = qcount.data.count;
                        return {tags: newtags};
                      });
                    })
                    .catch(err=>{
                      
                      console.error('error in tagcount ',err);
                    });
                });

            })

            .catch(err=> {
                console.error('error getting tags: ',err);
             });

        
    }


    handleselectedtag(tagname,tagid){
      this.setState({
        selectedTag:tagname,
        selectedtagid: tagid
      }, ()=> {
            axios.get(`http://localhost:8000/tags/tag/${tagid}`) //fetch questions that have tagid. 
                .then(res=>{
                    
                    this.props.onTagclick(res.data);
                })
                .catch(err=>{
                    console.log('error getting questions for tag',err);
                });
      });
      //const qoftag = this.props.model.getquestionsoftagid(tagid);
      //this.props.onTagclick(qoftag);
    }

    rendertags(){
      return this.state.tags.map(tag=>(
        <Tagbox 
         key={tag._id} 
         tagname ={tag.name} 
         tagid={tag._id}
          onTagclick ={this.handleselectedtag} 
          numofq ={tag.count} 
          tagDel = {this.props.tagDel}
          /> 
      ));

    }

  render() {

    return (
      <div className= 'TagsContainer'>
        {this.rendertags()}
      </div>
    );
  }
}
