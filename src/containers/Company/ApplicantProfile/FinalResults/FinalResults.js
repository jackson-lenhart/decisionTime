import React from "react";

import Spinner from "../../../../components/UI/Spinner/Spinner";

import "./FinalResults.css";

class FinalResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isError: false,
      results: {},
      showMultipleChoice: false,
      isEmailing: false,
      emailSuccess: false,
      emailError: false
    };

    this.toggleMultipleChoice = this.toggleMultipleChoice.bind(this);

    this.token = localStorage.getItem("token");
  }

  componentDidMount() {
    // fetching on every page load for now for simplicity
    // will optimize eventually to cache results because they should never change
    if (this.props.applicant.status === 'COMPLETE') {
      const options = {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      };
      fetch(`/api/screening/results/${this.props.applicant._id}/${this.props.applicant.jobId}`, options)
      .then(res => res.json())
      .then(results => {
        this.setState({ results, isLoading: false });
      })
      .catch(err => {
        this.setState({ isError: true });
        console.error(err);
      });
    } else {
      this.setState({ isLoading: false });
    }
  }

  formattedSeconds = sec => {
    return (
      Math.floor(sec / 60) +
      " minutes and " +
      ("0" + (sec % 60)).slice(-2) +
      " seconds"
    );
  };

  toggleMultipleChoice() {
    this.setState(prevState => ({
      showMultipleChoice: !prevState.showMultipleChoice
    }));
  }

  renderEmailBtn = () =>
		<div style={{
			paddingLeft: '50px',
      paddingTop: '20px'
		}}>
			<button type="button"
				disabled={this.state.isEmailing}
				onClick={this.sendEmailReminder}
        style={{
          cursor: 'pointer'
        }}
			>
				<i className="far fa-envelope">Send Email Reminder</i>
			</button>
		</div>;

    sendEmailReminder = () => {
  		this.setState({
  			isEmailing: true
  		}, () => {
  			const options = {
  				headers: {
  					"Authorization": `Bearer ${this.token}`,
  					"Content-Type": "application/json"
  				},
  				method: "POST",
  				body: JSON.stringify({
  					applicantId: this.props.applicant._id,
            email: this.props.applicant.email,
            companyName: this.props.applicant.companyName,
            jobTitle: this.props.applicant.jobTitle
  				})
  			};

  			fetch("/api/company/applicants/email-reminder", options)
  			.then(res => {
          if (res.status === 200) {
            this.setState({
    					emailSuccess: true,
    					isEmailing: false
    				});
          } else {
            this.setState({
  						emailError: true,
  						isEmailing: false
  					});
          }
        })
  			.catch(err => {
  				console.error(err);
  				this.setState({
  					emailError: true,
  					isEmailing: false
  				});
  			});
  		});
  	};

  render() {
    const { applicant } = this.props;

    const {
      isLoading,
      isError,
      results,
      showMultipleChoice,
      emailSuccess,
      emailError
    } = this.state;

    if (isError) {
      return <p style={{ color: 'red' }}>Error loading results</p>
    }

    if (isLoading) {
      return <Spinner />;
    }

    const multipleChoiceQuestions = [];
    const openResponseQuestions = [];
    const multipleChoiceAnswers = [];
    const openResponseAnswers = [];

    if (applicant.status === 'COMPLETE') {
      for (const question of results.questions) {
        if (question.questionType === 'MULTIPLE_CHOICE') {
          multipleChoiceQuestions.push(question);
        } else if (question.questionType === 'OPEN_RESPONSE') {
          openResponseQuestions.push(question);
        } else {
          console.error('Invalid question type');
        }
      }

      for (const answer of results.answers) {
        if (answer.answerType === 'MULTIPLE_CHOICE') {
          multipleChoiceAnswers.push(answer);
        } else if (answer.answerType === 'OPEN_RESPONSE') {
          openResponseAnswers.push(answer);
        } else {
          console.error('Invalid answer type');
        }
      }
    }

    return (
      <div>
        {applicant.status === 'COMPLETE' ? (
          <div>
            <div className="resultsheader">
              <h3 style={{ color: "purple" }} className="namedisplay">
                <strong>
                  Test Results for {applicant.firstName} {applicant.lastName}
                </strong>
              </h3>
              <h4 style={{ color: "purple" }} className="timerdisplay">
                Total amount of time taken is{" "}
                <span style={{ color: "red", textDecoration: "underline" }}>
                  {this.formattedSeconds(results.secondsElapsed)}
                </span>
              </h4>
            </div>
            <div className="MCquestionlayout">
              <h4 className="questionheader">Multiple Choice</h4>
              {
                multipleChoiceAnswers.reduce((acc, answer) => {
                  // Warning: this could get slow if # of questions is very large
                  // may want to optimize later
                  const question = multipleChoiceQuestions.find(q => q._id === answer.questionId);
                  const correctOption = question.options.find(o => o.correct);
                  return answer.body === correctOption.body ? acc + 1 : acc;
                }, 0)
              } / { multipleChoiceQuestions.length } multiple choice questions answered correctly
              <br />
              <button type="button" onClick={this.toggleMultipleChoice}>
                { showMultipleChoice ? 'Hide' : 'Show' } Multiple Choice
              </button>
              {
                showMultipleChoice
                ? multipleChoiceQuestions.map((question, index) => {
                  const answer = multipleChoiceAnswers.find(a => a.questionId === question._id);
                  return (
                    <div key={question._id} className="MCquestionStyle">
                      <strong>
                        <em>
                          {index + 1 + ". "} {question.body}
                        </em>
                      </strong>
                      {
                        question.options.map(option => {
                          let style;
                          if (answer.body === option.body && option.correct) {
                            style = {
                              color: "green"
                            };
                          } else if (answer.body === option.body && !option.correct) {
                            style = {
                              color: "red"
                            };
                          } else {
                            style = {};
                          }
                          return (
                            <div key={option._id} style={style}>
                              {option.body}
                            </div>
                          );
                        })
                      }
                    </div>
                  );
                })
                : ''
              }
            </div>
            <div className="questionStyle">
              <h4 className="questionheader">Open Response</h4>
              {
                // This also might get slow if # of questions is very large
                openResponseQuestions.map((question, index) => {
                  const answer = openResponseAnswers.find(a => a.questionId === question._id);
                  return (
                    <div key={question._id} className="ORquestionstyle">
                      <strong>
                        <em>
                          {index + 1 + ". "}
                          {question.body}
                        </em>
                      </strong>
                      <p>{answer.body}</p>
                    </div>
                  );
                })
              }
            </div>
          </div>
        ) : (
          <div>
            <div className="resultsheader">
              <h3 style={{ color: "purple" }} className="namedisplay">
                <strong>
                  {applicant.firstName} {applicant.lastName} has not yet
                  completed the test
                </strong>
                {this.renderEmailBtn()}
        				{
        					emailSuccess ? (
        						<p style={{ color: 'green' }}>Email sent!</p>
        					) : (
        						emailError ? (
        							<p style={{ color: 'red' }}>Failure: could not send email</p>
        						) : ""
        					)
        				}
              </h3>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default FinalResults;
