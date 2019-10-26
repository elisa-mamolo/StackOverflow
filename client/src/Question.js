import React, {Component} from 'react';
import {Link} from "@reach/router";
import AnswerQuestion from "./AnswerQuestion";
class Question extends Component {

    render() {
        const question = this.props.getQuestion(this.props.id);

        /*const list = question.answers.map(ans => <li>{ans.text}
            - ({ans.votes})</li>);*/
        let content = <p>Loading</p>
        if (question) {
            content =
                <React.Fragment>
                    <h1>{question.question}</h1>

                    <h3>Answers</h3>
                    <ul>
                        {/*_id to have an unique key */}
                        {question.answers.map(q => <li key={q._id}>{q.text}  Votes:{q.vote}</li>
                        )}
                    </ul>


                </React.Fragment>
        }
        return (
            <React.Fragment>
                {/*<h3>Question!</h3>
                <p key={question.id}>{question.question}</p>

                <ul>
                    {question.answers.length === 0 ? <p>No Answers!</p> : list}
                </ul>
                */}
                {content}
                <AnswerQuestion answerQuestion={(text) => this.props.answerQuestion(text)}></AnswerQuestion>
                <Link to="/">Go back to questions</Link>
            </React.Fragment>
        )
    }
}

export default Question;

