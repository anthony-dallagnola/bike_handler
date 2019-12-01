
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const should = chai.should();
const assert = chai.assert;

const fs = require('fs');
const { HTTP, FILE, ENCODING, ERRORS, REGEXP } = require('../config/constants');

let getDatabase = () => JSON.parse(fs.readFileSync(FILE.PATH, ENCODING.UTF8));

chai.use(chaiHttp)

// get
describe('/GET get bike', () => {
  let database = getDatabase();
  it('should list the bike corresponding to the id', done => {
    let bikeId = '7ef8e968-7d5b-4bbb-9779-5abe4de457b6';
    chai.request(app)
      .get('/bike/get?id=' + bikeId)
      .end((err, res) => {
        res.should.have.status(HTTP.OK);
        res.body.should.be.an('object');
        // deep testing
        res.body.should.be.eql(database.find(e=>e.id===bikeId))
        done();
      });
  });
  it('should return 400, id doesn\'t have a valid format', done => {
    let bikeId = '7ef8e968';
    chai.request(app)
      .get('/bike/get?id=' + bikeId)
      .end((err, res) => {
        res.should.have.status(HTTP.BAD_REQUEST);
        // deep testing
        res.body.should.be.eql(ERRORS.READ[0]);
        done();
      });
  });
  it('should return 400, id doesn\'t exists in the database', done => {
    let bikeId = '7ef8e968-7d5b-4bbb-9779-6ab78064bcda';
    chai.request(app)
      .get('/bike/get?id=' + bikeId)
      .end((err, res) => {
        res.should.have.status(HTTP.BAD_REQUEST);
        // deep testing
        res.body.should.be.eql(ERRORS.READ[1]);
        done();
      });
  });
});

// getAll 
describe('/GET get bikes', () => {
  let database = getDatabase();
  it('should list all bikes', done => {
    chai.request(app)
      .get('/bike/getAll')
      .end((err, res) => {
        res.should.have.status(HTTP.OK);
        // deep testing
        res.body.should.be.eql(database);
        done();
      });
  });
});

// create
describe('/POST create bike', () => {
  it('should create a new bike', done => {
    let database = getDatabase();
    chai.request(app)
      .post('/bike/create')
      .send({
        'bike': {
          'name': 'The best',
          'brand': 'KTM',
          'year': 2019,
          'motorType': 'Great',
          'type': 'mountain'
        }
      })
      .end((err, res) => {
        res.should.have.status(HTTP.OK);
        // at least has these keys
        res.body.bike.should.include.all.keys(['id', 'name', 'brand', 'year', 'type']);
        assert.equal(REGEXP.UUID.test(res.body.bike.id), true, 'Id is not uuid conform')

        // test parameters types
        res.body.bike.name.should.be.a('string');
        res.body.bike.brand.should.be.a('string');
        res.body.bike.year.should.be.a('number');
        res.body.bike.type.should.be.a('string');

        let newDatabase = getDatabase();
        // deep testing
        res.body.bike.should.be.eql(newDatabase[newDatabase.length - 1]);
        newDatabase.length.should.be.equal(database.length + 1);
        done();
      });
  });
  it('should fail to create a new bike with additional fields', done => {
    let database = getDatabase();
    chai.request(app)
      .post('/bike/create')
      .send({
        'bike': {
          'name': 'The best V2',
          'brand': 'KTM',
          'year': 2022,
          'type': 'mountain',
          'details': 'Half price the first year'
        }
      })
      .end((err, res) => {
        res.should.have.status(HTTP.BAD_REQUEST);
        res.body.should.be.eql(ERRORS.CREATE[0]);

        // check nothing changed
        database.should.be.eql(getDatabase());
        done()
      });
  });
  it('should fail to create a new bike with wrong motorType', done => {
    let database = getDatabase();
    chai.request(app)
      .post('/bike/create')
      .send({
        'bike': {
          'name': 'The best',
          'brand': 'KTM',
          'year': 2019,
          'motorType': 123,
          'type': 'mountain'
        }
      })
      .end((err, res) => {
        res.should.have.status(HTTP.BAD_REQUEST);
        res.body.should.be.eql(ERRORS.CREATE[1]);

        // check nothing changed
        database.should.be.eql(getDatabase());
        done()
      });
  });
  it('should fail to create a new bike with wrong parameters', done => {
    let database = getDatabase();
    chai.request(app)
      .post('/bike/create')
      .send({})
      .end((err, res) => {
        res.should.have.status(HTTP.BAD_REQUEST);
        res.body.should.be.eql(ERRORS.CREATE[1]);

        // check nothing changed
        database.should.be.eql(getDatabase());
        done()
      });
  });
});

// update
describe('/PATCH update bike', () => {
  it('should update an existing bike', done => {
    let database = getDatabase();
    let bikeId = 'cfc47736-9a27-4dbe-9d65-2055aced6aef';
    chai.request(app)
      .patch('/bike/update')
      .send({
        'id': bikeId,
        'bike': {
          'name': 'The best',
          'brand': 'KTM',
          'year': 2019,
          'type': 'mountain'
        }
      })
      .end((err, res) => {
        res.should.have.status(HTTP.OK);
        // at least has these keys
        res.body.bike.should.include.all.keys(['id', 'name', 'brand', 'year', 'type']);

        // test parameters types
        res.body.bike.id.should.be.a('string');
        res.body.bike.name.should.be.a('string');
        res.body.bike.brand.should.be.a('string');
        res.body.bike.year.should.be.a('number');
        res.body.bike.type.should.be.a('string');

        let newDatabase = getDatabase();
        // deep testing
        res.body.bike.should.be.eql(newDatabase.find(e=>e.id===bikeId));
        newDatabase.length.should.be.equal(database.length);
        done();
      });
  });
  it('should fail to update a bike with additional fields', done => {
    let database = getDatabase();
    let bikeId = 'cfc47736-9a27-4dbe-9d65-2055aced6aef';
    chai.request(app)
      .patch('/bike/update')
      .send({
        'id': bikeId,
        'bike': {
          'name': 'The best V2',
          'brand': 'KTM',
          'year': 2022,
          'type': 'mountain',
          'details': 'Half price the first year'
        }
      })
      .end((err, res) => {
        res.should.have.status(HTTP.BAD_REQUEST);
        res.body.should.be.eql(ERRORS.UPDATE[0]);

        // check nothing changed
        database.should.be.eql(getDatabase());
        done()
      });
  });
  it('should fail to update a bike with wrong id format', done => {
    let database = getDatabase();
    let bikeId = '7ef8e968';
    chai.request(app)
      .patch('/bike/update')
      .send({
        'id': bikeId,
        'bike': {
          'name': 'The best',
          'brand': 'KTM',
          'year': 2019,
          'type': 'mountain'
        }
      })
      .end((err, res) => {
        res.should.have.status(HTTP.BAD_REQUEST);
        res.body.should.be.eql(ERRORS.UPDATE[1]);

        // check nothing changed
        database.should.be.eql(getDatabase());
        done()
      });
  });
  it('should fail to update a bike with unregistered id', done => {
    let database = getDatabase();
    let bikeId = '1e2ab5c7-0e44-4dda-0689-3dc5ba1c50b8';
    chai.request(app)
      .patch('/bike/update')
      .send({
        'id': bikeId,
        'bike': {
          'name': 'The best',
          'brand': 'KTM',
          'year': 2019,
          'type': 'mountain'
        }
      })
      .end((err, res) => {
        res.should.have.status(HTTP.BAD_REQUEST);
        res.body.should.be.eql(ERRORS.UPDATE[2]);

        // check nothing changed
        database.should.be.eql(getDatabase());
        done()
      });
  });
});

// delete
describe('/DELETE delete bike', () => {
  it('should delete an existing bike', done => {
    let database = getDatabase();
    let bikeId = '01228c19-e4aa-4859-84ce-210a9803148f';
    chai.request(app)
      .delete('/bike/delete/'+bikeId)
      .end((err, res) => {
        res.should.have.status(HTTP.OK);
        // at least has these keys
        res.body.bike.should.include.all.keys(['id', 'name', 'brand', 'year', 'type']);

        // test parameters types
        res.body.bike.id.should.be.a('string');
        res.body.bike.name.should.be.a('string');
        res.body.bike.brand.should.be.a('string');
        res.body.bike.year.should.be.a('number');
        res.body.bike.type.should.be.a('string');

        let newDatabase = getDatabase();
        // deep testing
        assert(typeof newDatabase.find(e => e.id === bikeId), 'undefined');
        newDatabase.length.should.be.equal(database.length-1);
        done();
      });
  });
  it('should fail to delete a bike with wrong id format', done => {
    let database = getDatabase();
    let bikeId = 'cfc47736';
    chai.request(app)
      .delete('/bike/delete/'+bikeId)
      .end((err, res) => {
        res.should.have.status(HTTP.BAD_REQUEST);
        res.body.should.be.eql(ERRORS.DELETE[0]);

        // check nothing changed
        database.should.be.eql(getDatabase());
        done()
      });
  });
  it('should fail to delete a bike with unregistered id', done => {
    let database = getDatabase();
    let bikeId = 'f5f18eb0-9522-4cef-0466-b8733941c18b';
    chai.request(app)
      .delete('/bike/delete/'+bikeId)
      .end((err, res) => {
        res.should.have.status(HTTP.BAD_REQUEST);
        res.body.should.be.eql(ERRORS.DELETE[1]);

        // check nothing changed
        database.should.be.eql(getDatabase());
        done()
      });
  });
});