import React, {Component} from 'react';

class AskQuestion extends Component {

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
        this.props.askQuestion(this.state.input);
    }

    render() {
        return (
            <React.Fragment>
                <h3>Ask Question</h3>
                <input onChange={(event) => this.onChange(event)}
                       type="text" placeholder="Type question here!"></input>
                <button onClick={() => this.onClick()}>Ask!</button>
            </React.Fragment>
        )
    }
}

export default AskQuestion;

