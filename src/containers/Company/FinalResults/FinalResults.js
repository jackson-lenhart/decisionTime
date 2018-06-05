import React from 'react';
import Aux from '../../../hoc/Aux/Aux';
import { Link } from 'react-router-dom';

class FinalResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isError: false,
            data: {}
        };
        this.ApplicantId = this.props.match.params.ApplicantId;
    }

    componentDidMount() {
        const token = localStorage.getItem("token");
        if (token === null) {
            this.setState({
                isLoading: false,
                isError: true
            });
            return;
        }

        const options = {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        };

        fetch(`https://decisiontime.herokuapp.com/api/company/test-results/${this.ApplicantId}`, options)
        .then(res =>
            res.status === 403 ?
                Promise.reject("Auth denied") :
                res.json()
        ).then(data => {
            this.setState({
                data,
                isLoading: false
            });
        }).catch(err => console.error(err));
    }


    formattedSeconds = (sec) => {
        return (Math.floor(sec / 60) +
            ' minutes and ' +
          ('0' + sec % 60).slice(-2) + ' seconds');
    }

    render() {
        if (this.state.isLoading) {
            return <p>Loading...</p>;
        }

        return (
            <Aux>
                <div style={{padding: '20px', textAlign: 'left'}}>
                    {/* <a onClick={this.props.modalClosed} style={{backgroundColor: '#6d6dc4', textDecoration: 'none', color: 'white', padding: '10px', cursor: 'pointer', boxShadow: '2px 2px 1px 0px rgba(0,0,0,0.75)', backgroundColor: 'purple'}}>BACK</a> */}
                    <Link to='/company' style={{textDecoration: 'none', color: 'white', padding: '10px', cursor: 'pointer', boxShadow: '2px 2px 1px 0px rgba(0,0,0,0.75)', backgroundColor: 'purple'}}>BACK</Link>
                </div>
                <h3 style={{color: 'purple'}}>Results for {this.state.data.firstName} {this.state.data.lastName}</h3>
                <h4 style={{color: 'purple'}}>Total amount of time taken is <span style={{color: 'red', textDecoration: 'underline'}}>{this.formattedSeconds(this.state.data.secondsElapsed)}</span></h4>
                <p>Exercise A:</p>
                <p><em>{this.state.data.results[0]}</em></p>
                <p>Exercise B:</p>
                <p><em>{this.state.data.results[1]}</em></p>
            </Aux>
        );
    }
}

export default FinalResults;
