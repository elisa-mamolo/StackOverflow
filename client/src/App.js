import React, {Component} from 'react';
import { Router } from "@reach/router";

import Questions from "./Questions";
import Question from "./Question";


class App extends Component {

    API_URL = process.env.REACT_APP_API_URL;
    constructor(props) {
        super(props);

        // This is my state data initialized
        this.state = {
            questions: []
        }
    }
    componentDidMount() {
        this.getQuestions().then(() => console.log("questions have been received"));
    }

    //method foe getting the questions
    async getQuestions() {
        let url = `${this.API_URL}/questions`;
        let result = await fetch(url); //get the data
        let json = await result.json(); //turn data into JSON
        return this.setState({
            questions: json //set it in the state
        })
    }
    getQuestion(id){
        //find question by id
        return this.state.questions.find(q => q._id === id);
    }


    //method for posting a question
    async askQuestion(question){

        this.postData(question);
    }
    //the above method calls this method for the post request
    async postData(question) {
        let url = `${this.API_URL}/questions`;
        fetch(url, {
            method: "POST",
            body: JSON.stringify({
                question: question
            }), headers : {
                "Content-type" : "application/json"
            }
        })
            .then(res => res.json())
            .then( json => {
                this.getQuestions();
            })
    }

    //method for posting answer
    async addAnswer(id, answer){

        this.postAnswer(id, answer);
    }
    //post answer method
    async postAnswer(id, answer) {
        let url = `${this.API_URL}/questions/${id}`;
        fetch(url, {
            method: "POST",
            body: JSON.stringify({
                answer: answer
            }), headers : {
                "Content-type" : "application/json"
            }
        })
            .then(res => res.json())
            .then( json => {
                this.getQuestions();
            })
    }

    //Function to vote the answers
    async putVote(id, answerId) {
        let url = `${this.API_URL}/questions/`
            .concat(id)
            .concat("/answers/")
            .concat(answerId)
            .concat("/vote");
        fetch(url, {
            method: "PUT",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(json => {
                console.log("Result of posting a new question:");
                console.log(json);
                this.getQuestions();
            }); // Get the data
    }

    async handleVote(id, answerId) {
        //PUT
        this.putVote(id, answerId).then(r => console.log(answerId));
        console.log("The link was clicked.");
    }

    render() {
        return (
            <React.Fragment>
                <h1>QA Website</h1>
                <Router>

                    <Questions path="/" questions={this.state.questions}
                       askQuestion={(text) => this.askQuestion(text)}/>

                    <Question path="/question/:id"
                    getQuestion={id => this.getQuestion(id)}
                    addAnswer={(id, answer) => this.addAnswer(id, answer)}
                    handleVote={(id, answerId) => this.handleVote(id, answerId)}/>

                </Router>

            </React.Fragment>
        )
    }
}

export default App;

