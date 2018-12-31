import React from "react";
import { Link } from "react-router-dom";
import "./CompanyNav.css";

const CompanyNav = () => {
  return (
    <div className="topcompanynav">
      <div>
        <div>
          <Link to="/company/">Dashboard</Link>
        </div>
        <div>
          <Link to="/company/applicants">Applicants</Link>
        </div>
        <div>
          <Link to="/company/jobs">Editor</Link>
        </div>
      </div>
    </div>
  );
};

export default CompanyNav;
