import _ from "lodash";
import React from "react";
import IndividualApplicant from "./IndividualApplicant/IndividualApplicant";

const ApplicantList = props => {
  let filteredApplicant = props.applicants.filter(applicant => {
    return (
      applicant.lastName
        .toLowerCase()
        .indexOf(props.searchedApplicant.toLowerCase()) !== -1
    );
  });

  const _props = _.omit(props, "applicants");

  const sorted = filteredApplicant
    .slice()
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

  return (
    <div className="column">
      <div className="row">
        {sorted.map(applicant => (
          <IndividualApplicant
            applicant={applicant}
            deleteApplicant={props.deleteApplicant}
            editApplicant={props.editApplicant}
            key={applicant._id}
            {..._props}
          />
        ))}
      </div>
    </div>
  );
}

export default ApplicantList;
