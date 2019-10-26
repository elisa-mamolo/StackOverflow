import React, {Component} from 'react';
import {Link} from "@reach/router";
import AskQuestion from "./AskQuestion";

class Questions extends Component {

    render() {
                return (
                    <React.Fragment>
                        <h3>Questions</h3>
                        <ol>
                            {this.props.questions.map(question =>
                                <li key={question._id}>
                                    <Link to={`/question/${question._id}`}>{question.question}</Link>

                                </li>
                            )}
                        </ol>
                        <AskQuestion></AskQuestion>
                    </React.Fragment>
                );
}
}

export default Questions;

