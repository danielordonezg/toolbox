const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../routes/index');
const request = require('supertest');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Files API", () => {
    describe("GET /files/data", () => {
      it("should return status 200", (done) => {
        request(app)
          .get('/files/data')
          .expect(200, done);
      });
      it("should return an array", (done) => {
        request(app)
          .get('/files/data')
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            if (!Array.isArray(res.body)) {
              return done(new Error("Response body should be an array"));
            }
            if (res.body.length === 0) {
              return done(new Error("Response body should not be empty"));
            }
            // Add more assertions as needed
            done();
          });
      });
      it("should return an array of objects with the correct data", (done) => {
        request(app)
        .get('/files/data')
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            if(typeof res.body[0] !== 'object') {
                return done(new Error("Response body should be an object"));
            }
            if(!res.body[0].hasOwnProperty('file')) {
                return done(new Error("Response body should have a file property"));
            }
            if(!res.body[0].hasOwnProperty('text')) {
                return done(new Error("Response body should have a text property"));
            }
            if(!res.body[0].hasOwnProperty('number')) {
                return done(new Error("Response body should have a number property"));
            }
            if(!res.body[0].hasOwnProperty('hex')) {
                return done(new Error("Response body should have a hex property"));
            }
            done();
    });
    });
});
});

describe("Files API BY FILENAME", () => {
    describe("GET /files/data?filename", () => {
        it("should return status 200", (done) => {
            request(app)
            .get('/files/data?filename=test2.csv')
            .expect(200, done);
        });
        it("should return an empty array if the file does not exist", (done) => {
            request(app)
            .get('/files/data?filename=notfound.csv')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                if (!Array.isArray(res.body)) {
                return done(new Error("Response body should be an array"));
                }
                if (res.body.length !== 0) {
                return done(new Error("Response body should be empty"));
                }
                done();
            });
        });
        it("should return an array", (done) => {
            request(app)
            .get('/files/data?filename=test2.csv')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                if (!Array.isArray(res.body)) {
                return done(new Error("Response body should be an array"));
                }
                if (res.body.length === 0) {
                return done(new Error("Response body should not be empty"));
                }
                // Add more assertions as needed
                done();
            });
        });
        it("should return an array of objects with the correct data", (done) => {
            request(app)
            .get('/files/data?filename=test2.csv')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                if(typeof res.body[0] !== 'object') {
                    return done(new Error("Response body should be an object"));
                }
                if(!res.body[0].hasOwnProperty('file')) {
                    return done(new Error("Response body should have a file property"));
                }
                if(!res.body[0].hasOwnProperty('text')) {
                    return done(new Error("Response body should have a text property"));
                }
                if(!res.body[0].hasOwnProperty('number')) {
                    return done(new Error("Response body should have a number property"));
                }
                if(!res.body[0].hasOwnProperty('hex')) {
                    return done(new Error("Response body should have a hex property"));
                }
                done();
        });
        });
        it("should only return objects with the correct filename", (done) => {
            request(app)
            .get('/files/data?filename=test2.csv')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                if(typeof res.body[0] !== 'object') {
                    return done(new Error("Response body should be an object"));
                }
                res.body.forEach(element => {
                    if(element.file !== 'test2.csv') {
                        return done(new Error("Response body should only have objects with the correct filename"));
                    }
                });
                done();
        });
        });
    });
})


  describe("GET /files/list", () => {
    it("should return an array of filenames", (done) => {
      chai.request(app)
        .get('/files/list')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          // Add more assertions as needed
          done();
        });
    });
    it("should have at least 4 elements", (done) => {
        chai.request(app)
          .get('/files/list')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an('array').that.has.lengthOf.at.least(4);
            // Add more assertions as needed
            done();
          });
      });
      it("should be an array of strings", (done) => {
        chai.request(app)
          .get('/files/list')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an('array');
            res.body.forEach(element => {
                element.should.be.a('string');
            });
            done();
          });
      });
  });