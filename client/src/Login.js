import React, {Component} from 'react';
import {navigate} from "@reach/router";
class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
                username: "",
                password: ""


        }
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleLogin(event) {
        this.props.login(this.state.username, this.state.password);
    }




    render() {
        //if user is not logged in show form
        //else show homepage
        return (
            <React.Fragment>
                <h4>Login</h4>
                <form>
                    Name:
                    <input type="text" name="username" onChange={(event) => this.handleChange(event)}></input>
                    <br></br>Password:
                        <input type="text" name="password" onChange={(event) => this.handleChange(event)}></input>
                        <button onClick={() => this.handleLogin()}>Submit</button>
                </form>



            </React.Fragment>
        )
    }
}

export default Login;
