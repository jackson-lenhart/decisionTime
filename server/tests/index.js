const { expect } = require('chai');
const fetch = require('node-fetch');

const host = 'http://localhost:4567/api';

let testCompanyAccessToken = null;
describe('Company', function() {

  describe('Create Company', function() {

    it('Successfully creates new company', function(done) {
      const options = {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ name: 'Test Company' })
      };
      fetch(host + '/company/', options)
      .then(res => res.json())
      .then(data => {
        expect(data).to.have.property('accessToken');
        testCompanyAccessToken = data.accessToken;
        done();
      })
      .catch(err => {
        done(err);
      });
    });

  });

  // TODO: test generate new token

});

let testToken = null;
describe('Company Users', function() {

  describe('Login', function() {

    it('Successfully logs in and gets auth data from server', function(done) {
      const options = {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          email: 'jacksonlenhart@gmail.com',
          password: 'vortex37'
        })
      };
      fetch(host + '/company/user/login', options)
      .then(res => res.json())
      .then(data => {
        expect(data).to.have.property('companyId');
        expect(data).to.have.property('token');
        done();
      })
      .catch(err => {
        done(err);
      });
    });

    it('Sends back 401 Unauthorized on incorrect login credentials', function(done) {
      const options = {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          email: 'jacksonlenhart@gmail.com',
          password: 'vortex36'
        })
      };
      fetch(host + '/company/user/login', options)
      .then(res => {
        expect(res.status).to.equal(401);
        done();
      })
      .catch(err => {
        done(err);
      });
    });

  });

  describe('Signup', function() {

    it('Successfully signs up a mock user', function(done) {
      const options = {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          firstName: 'Harry',
          lastName: 'Gates',
          email: 'harry@lol.com',
          accessToken: testCompanyAccessToken,
          password: 'hunter12'
        })
      };

      fetch(host + '/company/user/signup', options)
      .then(res => res.json())
      .then(data => {
        expect(data).to.have.property('token');
        done();
      })
      .catch(err => {
        done(err);
      });
    });

    it('Rejects signup with faulty accessToken', function(done) {
      const options = {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          firstName: 'Bob',
          lastName: 'Malicious',
          email: 'bob@spygate.com',
          accessToken: 'XD',
          password: 'hunter12'
        })
      };

      fetch(host + '/company/user/signup', options)
      .then(res => {
        expect(res.status).to.equal(401);
        done();
      })
      .catch(err => {
        done(err);
      });
    });

  });

  describe('Password Reset', function() {

    it('Resets password of user without error', function(done) {
      const options = {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          email: 'harry@lol.com',
          password: 'hunter12',
          newPassword: 'hunter13'
        })
      };

      fetch(host + '/company/user/password-reset', options)
      .then(res => res.json())
      .then(data => {
        expect(data).to.have.property('token');
        done();
      })
      .catch(err => {
        done(err);
      });
    });

    it('Logs in successfully with new password', function(done) {
      const options = {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          email: 'harry@lol.com',
          password: 'hunter13'
        })
      };

      fetch(host + '/company/user/login', options)
      .then(res => res.json())
      .then(data => {
        expect(data).to.have.property('companyId');
        expect(data).to.have.property('token');
        testToken = data.token;
        done();
      })
      .catch(err => {
        done(err);
      });
    });

  });

});

let testJob = null;
describe('Jobs', function() {

  describe('Create Job', function() {

    it('Creates a new job for the test company', function(done) {
      const options = {
        headers: {
          'Authorization': `Bearer ${testToken}`,
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          title: 'Test Job',
          description: 'Test description.'
        })
      };
      fetch(host + '/job/', options)
      .then(res => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch(err => {
        done(err);
      });
    });

  });

  describe('Get Jobs', function() {

    it('Retrieves list of jobs for test company', function(done) {
      const options = {
        headers: {
          'Authorization': `Bearer ${testToken}`
        }
      };
      fetch(host + '/job/', options)
      .then(res => res.json())
      .then(data => {
        expect(data).to.have.property('jobs');
        expect(data.jobs.length).to.equal(1);
        testJob = data.jobs[0];
        done();
      })
      .catch(err => {
        done(err);
      });
    });

  });

  describe('Edit Job', function() {

    it('Edits an existing job', function(done) {
      const options = {
        headers: {
          'Authorization': `Bearer ${testToken}`,
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          id: testJob._id,
          title: 'Test Job Edited',
          description: 'Test description edited.'
        })
      };
      fetch(host + '/job/edit', options)
      .then(res => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch(err => {
        done(err);
      });
    });

  });

  // to make sure the job actually got edited in the database
  describe('Gets Edited Job', function() {

    it('Retrieves job with updated properties', function(done) {
      const options = {
        headers: {
          'Authorization': `Bearer ${testToken}`
        }
      };
      fetch(host + '/job/', options)
      .then(res => res.json())
      .then(data => {
        expect(data).to.have.property('jobs');
        expect(data.jobs.length).to.equal(1);
        const { title, description } = data.jobs[0];
        expect(title).to.equal('Test Job Edited');
        expect(description).to.equal('Test description edited.');
        done();
      })
      .catch(err => {
        done(err);
      });
    });

  })

});

// TODO: company-side applicant testing

let testScreeningId = null;
describe('Screening', function() {

  it('Saves new exam with corresponding jobId and companyId', function(done) {
    const options = {
      headers: {
        'Authorization': `Bearer ${testToken}`,
        'content-type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        jobId: testJob._id,
        questions: [
          {
            questionType: 'OPEN_RESPONSE',
            body: 'Testing exam creation'
          }
        ]
      })
    };
    fetch(host + '/screening/', options)
    .then(res => res.json())
    .then(data => {
      expect(data).to.have.property('_id');
      testScreeningId = data._id;
      done();
    })
    .catch(err => {
      done(err);
    });
  });

  it('Edits an existing exam', function(done) {
    const options = {
      headers: {
        'Authorization': `Bearer ${testToken}`,
        'content-type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        screeningId: testScreeningId,
        questions: [
          {
            questionType: 'MULTIPLE_CHOICE',
            body: 'Testing exam modify',
            options: [{ body: 'Test option' }]
          }
        ]
      })
    };
    fetch(host + '/screening/edit', options)
    .then(res => {
      expect(res.status).to.equal(200);
      done();
    })
    .catch(err => {
      done(err);
    });
  });

  it('Fetches the newly edited exam', function(done) {
    const options = {
      headers: {
        'Authorization': `Bearer ${testToken}`
      }
    };
    fetch(host + '/screening/' + testJob._id, options)
    .then(res => res.json())
    .then(data => {
      expect(data.exams.length).to.equal(1);
      const question = data.exams[0].questions[0];
      expect(question.body).to.equal('Testing exam modify');
      done();
    })
    .catch(err => {
      done(err);
    })
  });

});

describe('Tear Down Logic', function() {

  it('Removes company from database', function(done) {
    const options = {
      headers: {
        'Authorization': `Bearer ${testToken}`
      }
    };
    fetch(host + '/company/remove', options)
    .then(res => {
      expect(res.status).to.equal(200);
      done();
    })
    .catch(err => {
      done(err);
    });
  });

  it('Removes companyUser from database', function(done) {
    const options = {
      headers: {
        'Authorization': `Bearer ${testToken}`
      }
    };
    fetch(host + '/company/user/remove', options)
    .then(res => {
      expect(res.status).to.equal(200);
      done();
    })
    .catch(err => {
      done(err);
    });
  });

  it('Removes job from database', function(done) {
    const options = {
      headers: {
        'Authorization': `Bearer ${testToken}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ id: testJob._id })
    };
    fetch(host + '/job/remove', options)
    .then(res => {
      expect(res.status).to.equal(200);
      done();
    })
    .catch(err => {
      done(err);
    });
  });

  it('Removes screening exam from database', function(done) {
    const options = {
      headers: {
        'Authorization': `Bearer ${testToken}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ screeningId: testScreeningId })
    };
    fetch(host + '/screening/remove', options)
    .then(res => {
      expect(res.status).to.equal(200);
      done();
    })
    .catch(err => {
      done(err);
    });
  });

});
