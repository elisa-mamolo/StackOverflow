import React, {Component} from 'react';
import { Router } from "@reach/router";

import Questions from "./Questions";
import Question from "./Question";
import AskQuestion from "./AskQuestion";

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
        this.getQuestions().then(() => console.log("questions have been gotten"));
    }

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
        return this.state.questions.find(q => q._id === id)
    }

    render() {
        return (
            <React.Fragment>
                <h1>QA Website</h1>
                <Router>

                    <Questions path="/" questions={this.state.questions}
                       /* askQuestion={(text) => this.askQuestion(text)}*/>
                    </Questions>
                    <Question path="/question/:id"
                              getQuestion={id => this.getQuestion(id)}></Question>

                </Router>

            </React.Fragment>
        )
    }
}

export default App;

