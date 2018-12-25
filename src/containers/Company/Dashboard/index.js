import React, { Component } from 'react';

import Spinner from "../../../components/UI/Spinner/Spinner";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      visits: []
    };

    this.token = localStorage.getItem('token');
  }

  componentDidMount() {
    const options = {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    };
    fetch('/api/analytics/', options)
    .then(res => res.json())
    .then(visits => {
      // debug
      console.log(visits);
      this.setState({ visits, isLoading: false })
    });
  }

  render() {
    const { isLoading, visits } = this.state;

    if (isLoading) {
      return <Spinner />
    }

    return (
      <div>

      </div>
    );
  }
}

export default Dashboard;
