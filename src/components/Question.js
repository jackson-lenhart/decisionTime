import React from "react";
import TextAreaFieldGroup from "./UI/Form/TextAreaFieldGroup";

const Question = props => {
  let question = "";
  switch (props.question.questionType) {
    case "MULTIPLE_CHOICE":
      question = (
        <div style={{ padding: "10px", borderBottom: "solid purple 2px" }}>
          <p style={{ color: "purple", fontSize: "20px" }}>
            <strong>
              <em>Exercise {props.index + 1}</em>
            </strong>
          </p>
          <p style={{ textDecoration: "underline" }}>
            <strong>{props.question.body}</strong>
          </p>
          {props.question.options.map(x => (
            <div key={x._id}>
              <input
                type="radio"
                name={props.question._id}
                value={x.body}
                onClick={props.handleChange}
              />
              <label htmlFor={x._id}>{x.body}</label>
            </div>
          ))}
        </div>
      );
      break;
    case "OPEN_RESPONSE":
      question = (
        <div style={{ padding: "10px", borderBottom: "solid purple 2px" }}>
          <p style={{ color: "purple", fontSize: "20px" }}>
            <strong>
              <em>Exercise {props.index + 1}</em>
            </strong>
          </p>
          <p style={{ textDecoration: "underline" }}>
            <strong>{props.question.body}</strong>
          </p>
          <TextAreaFieldGroup
            type="text"
            name={props.question._id}
            placeholder="Place response here"
            onChange={props.handleChange}
          />
        </div>
      );
      break;
    default:
      question = <p>Invalid question type</p>;
  }

  return <div>{question}</div>;
};

export default Question;
