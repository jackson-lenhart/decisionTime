import React, { Component } from 'react';

import Spinner from "../../../components/UI/Spinner/Spinner";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isError: false,
      companyName: '',
      views: []
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
    .then(data => {
      const { companyName, views } = data;
      this.setState({ companyName, views, isLoading: false })
    })
    .catch(err => {
      this.setState({ isError: true });
      console.error(err);
    })
  }

  render() {
    const { isLoading, isError, companyName, views } = this.state;

    if (isError) {
      return <p style={{ color: 'red' }}>Error loading analytics data</p>
    }

    if (isLoading) {
      return <Spinner />
    }

    // Probably should be doing this on the server
    const jobViewMap = {};
    for (const v of views) {
      if (jobViewMap[v.jobId]) {
        jobViewMap[v.jobId].views++;
      } else {
        jobViewMap[v.jobId] = {
          id: v.jobId,
          title: v.jobTitle,
          views: 1
        };
      }
    }

    // The length of this will be at most 10 (pseudo top 10)
    const mostViewedJobs = [];
    const sortingFn = (a, b) => b.views - a.views;
    for (const id in jobViewMap) {
      if (mostViewedJobs.length >= 10) {
        const lastIndex = mostViewedJobs.length - 1;
        if (jobViewMap[id].views > mostViewedJobs[lastIndex].views) {
          mostViewedJobs[lastIndex] = jobViewMap[id];
          mostViewedJobs.sort(sortingFn);
        }
      } else {
        mostViewedJobs.push(jobViewMap[id]);
        mostViewedJobs.sort(sortingFn);
      }
    }

    return (
      <div>
        <div className="row">
          <div className="col-md-6">
            <h1>
              <strong>{companyName}</strong>
            </h1>
          </div>
          <div
            className="col-md-6"
            style={{ float: "right", textAlign: "center" }}
          >
            <strong style={{ fontSize: "100px" }}>
              {views.length}
            </strong>
            <br />
            <strong>Total Job Views and Counting</strong>
          </div>
        </div>
        <div>
          <h3>Top 10 Viewed Jobs All Time</h3>
          {
            mostViewedJobs.map((job, index) =>
              <p key={job.id}>{index + 1}. {job.title} {job.views}</p>
            )
          }
        </div>
      </div>
    );
  }
}

export default Dashboard;
