import React, {Component} from 'react';
import { Router } from "@reach/router";

import Questions from "./Questions";
import Question from "./Question";
import AuthService from './AuthService';
import AskQuestion from "./AskQuestion";
import Login from "./Login";


class App extends Component {

    API_URL = process.env.REACT_APP_API_URL;
    constructor(props) {
        super(props);

        // Initialize the auth service with the path of the API authentication route.
        this.Auth = new AuthService(`${this.API_URL}/users/authenticate`);

        // This is my state data initialized
        this.state = {
            questions: [],
            userCredentials: { // TODO: These need to come from a React login component.
                //replace with login component that targets the state
                username: "elisa",
                password: "123"
            }
        };
    }
    componentDidMount() {
        //this.getQuestions().then(() => console.log("questions have been received"));
        this.getData();
        // TODO: Do this from a login component instead
        /*this.login(
            this.state.userCredentials.username,
            this.state.userCredentials.password);*/
    }

    async login(username, password) {
        try {
            const resp = await this.Auth.login(username, password);
            console.log("Authentication:", resp.msg);
            this.getData();

        } catch (e) {
            console.log("Login", e);
        }
    }

    async logout(event) {
        event.preventDefault();
        this.Auth.logout();
        await this.setState({
            userCredentials: {},
            questions: []
        });
    }

    async getData() {
        const resp = await this.Auth.fetch(`${this.API_URL}/questions`);
        const data = await resp.json();
        this.setState({
            questions: data
        });
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
                "Content-type" : "application/json",
                Authorization : "Bearer " + this.Auth.getToken()
            }
        })
            .then(res => res.json())
            .then( json => {
                this.getQuestions();
            })
        //let result = await fetch(url); //get the data
        //let json = await result.json(); //turn data into JSON
        //return this.setState({
          //  questions: json //set it in the state
        //})
    }

   

    getQuestion(id){
        //find question by id
        return this.state.questions.find(q => q._id === id)
    }

    render() {



        return (
            <React.Fragment>
                <h1>QA Website</h1>
                <div className="container">
                    {this.Auth.getUsername() ?
                        <small>Logged in: {this.Auth.getUsername()}. <button
                            onClick={(event) => {this.logout(event)}}>Logout.</button></small>
                        : <Login login={(username, password) => this.login(username, password)}/>}

                </div>
                <Router>

                    <Questions path="/" questions={this.state.questions}
                       askQuestion={(text) => this.askQuestion(text)}/>

                    <Question path="/question/:id"
                              getQuestion={id => this.getQuestion(id)}></Question>
                    <Login path="/login" login={(username, password) => this.login(username, password) }></Login>

                </Router>

            </React.Fragment>
        )
    }
}

export default App;

