import React from 'react';

import Question from '../../../components/Question';

class Test extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            answers: {},
            secondsElapsed: props.secondsElapsed
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.incrementer = null;
    }

    componentDidMount() {
        this.incrementer = setInterval(() =>
            this.setState({
                secondsElapsed: this.state.secondsElapsed + 1
            })
        , 1000);
    }

    handleChange = e => {
        this.setState({
            answers: {
                ...this.state.answers,
                [e.target.name]: e.target.value
            }
        });
    };

    handleSubmit = () => {
        clearInterval(this.incrementer);

        const options = {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                applicantId: this.props.applicant.id,
                secondsElapsed: this.state.secondsElapsed,
                answers: this.state.answers
            })
        };

        fetch(`http://localhost:4567/api/applicant/test-results/${this.props.token}`, options)
        .then(res =>
            res.status === 403 ?
                Promise.reject("Auth denied") :
                res.json()
        ).then(data => {
            if (!data.success) {
                return this.props.propagateError();
            }

            this.props.redirectToFinished();
        }).catch(err => console.error(err));
    };

    formattedSeconds = sec => {
        return (Math.floor(sec / 60) +
          ':' +
        ('0' + sec % 60).slice(-2));
    };

    render() {
        const style = {
            submit: {
                backgroundColor: 'purple',
                textDecoration: 'none',
                color: 'white',
                padding: '10px',
                cursor: 'pointer',
                boxShadow: '2px 2px 1px 0px rgba(0,0,0,0.75)'
            }
        };

        const questions = this.props.test.questions.map((x, i) =>
            <div key={x.id}>
                <Question
                    question={x}
                    index={i}
                    handleChange={this.handleChange}
                />
            </div>
        );

        return (
            <div style={{margin: '200px 500px', padding: '10px 30px 35px 30px', backgroundColor: '#cfcfd1', boxShadow: '1px 1px 1px 0px rgba(0,0,0,0.75)'}}>
                <h1>BEGIN TESTING NOW</h1>
                <h1 style={{color: 'red'}}>{this.formattedSeconds(this.state.secondsElapsed)}</h1>
                {questions}
                <a onClick={this.handleSubmit} style={style.submit}>SUBMIT</a>
            </div>
        );
    }
}

export default Test;
