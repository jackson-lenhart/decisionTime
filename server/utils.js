import bcrypt from 'bcrypt';
import _jwt from 'jsonwebtoken';

export function hashPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) reject(err);

      bcrypt.hash(password, salt, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    });
  });
}

export function comparePasswords(password, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, success) => {
      if (err) reject(`Error comparing passwords: ${err}`);

      if (!success) {
        resolve(false);
      }

      resolve(success);
    });
  });
}

export const jwt = {
  sign: (payload, secret, options = {}) => {
    return new Promise((resolve, reject) => {
      _jwt.sign(payload, secret, options, (err, token) => {
        if (err) reject(err);

        resolve(token);
      });
    });
  },
  verify: (token, secret, options = {}) => {
    return new Promise((resolve, reject) => {
      _jwt.verify(token, secret, options, (err, authData) => {
        if (err) reject(err);

        resolve(authData);
      });
    });
  }
};
