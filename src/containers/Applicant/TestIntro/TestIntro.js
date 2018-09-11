import React from "react";
import "./TestIntro.css";

const TestIntro = props => {
  const style = {
    startBtn: {
      backgroundColor: "#6d6dc4",
      textDecoration: "none",
      color: "white",
      padding: "10px",
      cursor: "pointer",
      boxShadow: "2px 2px 1px 0px rgba(0,0,0,0.75)"
    }
  };

  return (
    <div className="intro">
      <div style={style.inner}>
        <p>
          Hey {props.applicant.firstName}! Thanks for showing interest in
          working at {props.companyName}. We have put together a timed test for
          the position titled: {props.jobTitle}. Once clicking "START TEST NOW"
          the timer will begin. Please make sure you give yourself enough time
          to take the test. After the test begins, there is no way to pause the
          timer until you click complete. Good luck!!
        </p>
        <p style={{ color: "purple", textAlign: "center" }}>
          <strong>Best of luck!</strong>
        </p>
      </div>
      <div className="btnsupport">
        <a
          onClick={props.startTest}
          className="startbtn"
          style={{ color: "white" }}
        >
          START TEST NOW
        </a>
      </div>
    </div>
  );
};

export default TestIntro;
