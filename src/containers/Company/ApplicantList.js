import _ from "lodash";
import React, { Component } from "react";
import IndividualApplicant from "./IndividualApplicant/IndividualApplicant";
import Pagination from "../../components/UI/Pagination/Pagination";

class ApplicantList extends Component {
  constructor() {
    super();
    this.state = {
      pageOfItems: []
    };

    this.onChangePage = this.onChangePage.bind(this);
  }

  onChangePage(pageOfItems) {
    // update state with new page of items
    this.setState({ pageOfItems: pageOfItems });
  }

  renderItems = () => {
    let filteredApplicant = this.props.applicants.filter(applicant => {
      return (
        applicant.lastName
          .toLowerCase()
          .indexOf(this.props.searchedApplicant.toLowerCase()) !== -1
      );
    });
    const props = _.omit(this.props, "applicants");

    const sorted = filteredApplicant
      .slice()
      .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));

    return (
      <div className="column">
        <div className="row">
          {this.state.pageOfItems.map(applicant => (
            <IndividualApplicant
              applicant={applicant}
              deleteApplicant={props.deleteApplicant}
              editApplicant={props.editApplicant}
              key={applicant._id}
              {...props}
            />
          ))}
        </div>
        <center>
          <div className="row">
            <Pagination items={sorted} onChangePage={this.onChangePage} />
          </div>
        </center>
      </div>
    );
  };

  render() {
    return <div>{this.renderItems()}</div>;
  }
}

export default ApplicantList;
