const { expect } = require('chai');
const fetch = require('node-fetch');

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
      fetch('http://localhost:4567/api/company/user/login', options)
      .then(res => res.json())
      .then(data => {
        expect(data).to.be.an('object');
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
      fetch('http://localhost:4567/api/company/user/login', options)
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
          companyId: '5b9750e5bddb071efcaea9d4',
          companyName: 'Porcupine',
          accessToken: 'lBsg8sASddwKQRt3',
          password: 'hunter12'
        })
      };

      fetch('http://localhost:4567/api/company/user/signup', options)
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
          firstName: 'Harry',
          lastName: 'Gates',
          email: 'harry@lol.com',
          companyId: '5b9750e5bddb071efcaea9d4',
          companyName: 'Porcupine',
          accessToken: 'XD',
          password: 'hunter12'
        })
      };

      fetch('http://localhost:4567/api/company/user/signup', options)
      .then(res => {
        expect(res.status).to.equal(401);
        done();
      })
      .catch(err => {
        done(err);
      });
    });
  });
});
