import React, { Component } from 'react';
//import _ from 'lodash';
import NewApplicant from './NewApplicant';
import ApplicantList from './ApplicantList';

class Company extends Component{
    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
            isAuth: false,
            applicants: [
                {
                    key: 0,
                    lname: "Martin",
                    fname: "Zachary",
                    email: "zmartin@umassd.edu",
                    password: "abcdefgh",
                    completed: false
                },
                {
                    key: 1,
                    lname: "Gates",
                    fname: "Bill",
                    email: "bgates@umassd.edu",
                    password: "afjdkljd",
                    completed: true
                }
            ],
            keyId: 1
        };
    }

    componentDidMount() {
        if (localStorage.getItem("token") === null) {
            this.setState({ isLoading: false });
            return;
        }

        const options = {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        };

        fetch("http://localhost:4567/company", options)
        .then(res => {
            this.setState({ isLoading: false });
            if (res.status === 200) {
                this.setState({ isAuth: true });
            }
        }).catch(err => console.error(err));
    }

    deleteApplicantsHandler = (applicant) => {
        let array = [...this.state.applicants];
        let index = array.indexOf(applicant)
        array.splice(index, 1);
        this.setState({applicants: array});
    }

    generateKeyId = () => {
        let Id = this.state.keyId;
        Id += 1;
        this.setState({keyId: Id});
        return Id;
    }


    generatePasswordHandler = () => {
            var length = 8,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }

    createApplicant = (lname, fname, email) => {
        this.state.applicants.unshift({
            key: this.generateKeyId,
            lname,
            fname,
            email,
            password: this.generatePasswordHandler(),
            completed: false
        });
        this.setState({ applicants: this.state.applicants});
    }


    render() {
        return(
            <div style={{backgroundColor: '#d8d8d8', margin: '100px 200px 0px 200px', padding: '20px 0px', boxShadow: '1px 1px 1px 0px rgba(0,0,0,0.75)'}}>
                <h1>All Potential Applicants</h1>
                <NewApplicant createApplicant={this.createApplicant.bind(this)} />
                <ApplicantList 
                    applicants={this.state.applicants}
                    deleteApplicantsHandler={this.deleteApplicantsHandler.bind(this)} />
            </div>
        );
    }
}

export default Company;