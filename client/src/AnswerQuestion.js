import React, {Component} from 'react';

class AnswerQuestion extends Component {

    constructor(props) {
        super(props);

        this.state = {
            input: ""
        }
    }

    onChange(event) {
        this.setState({
            input: event.target.value
        })
    }

    onClick(event) {
        this.props.answerQuestion(this.state.input);
    }

    render() {
        return (
            <React.Fragment>
                <h3>Answer Question</h3>
                <input onChange={(event) => this.onChange(event)}
                       type="text" placeholder="Type answer here!"></input>
                <button onClick={() => this.onClick()}>Answer!</button>
            </React.Fragment>
        )

        console.log(this.props.answerQuestion());
    }
}

export default AnswerQuestion;
