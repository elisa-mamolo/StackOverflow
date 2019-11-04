import React, {Component} from 'react';
import {Link} from "@reach/router";
import AnswerQuestion from "./AnswerQuestion";
class Question extends Component {

    render() {
        const question = this.props.getQuestion(this.props.id);
        let listAnswers = "";
        /*const list = question.answers.map(ans => <li>{ans.text}
            - ({ans.votes})</li>);*/
        listAnswers = <p>Loading</p>
        if (question) {
         if (question.answers){
             listAnswers = question.answers.map((answer, id) => (
                 <div key={answer._id}>

                     <li>{answer.text} Vote: {answer.vote}</li>
                     <div className="vote-buttons">

                         <button className="upvote" qid={this.props.id}
                                 putVote={(id, answerId) => this.props.putVote(id, answerId)}>
                             +
                         </button>
                         <button className="downvote">
                             -
                         </button>
                     </div>

                 </div>
             ))
         }
         }



        return (
            <React.Fragment>
                {/*<h3>Question!</h3>
                <p key={question.id}>{question.question}</p>
                <ul>
                    {question.answers.length === 0 ? <p>No Answers!</p> : list}
                </ul>
                */}
                {listAnswers}
                <AnswerQuestion qid={this.props.id} addAnswer={(id, answer) => this.props.addAnswer(id, answer)}/>
                <Link to="/">Go back to questions</Link>
            </React.Fragment>
        )
}

}
export default Question;

