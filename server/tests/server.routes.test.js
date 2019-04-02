var should = require('should'),
  request = require('supertest'),
  express = require('../config/express');

describe('Listings CRUD tests', function() {
  this.timeout(10000);

  before(function(done) {
    app = express.init();
    agent = request.agent(app);

    done();
  });

  it('should be able to retrieve all cards', function(done) {
    agent.get('/api/cards')
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);
        done();
      });
  });

  var id;

  it('should be able to add a card', function(done) {
    var card = {
      playerName: 'Michael Jordan',
      year: 1988,
      manufacturer: 'Starrcards',
    };
    agent.post('/').send(card).expect(200).end(function(err, res) {
      should.not.exist(err);
      should.exist(res.body._id);
      res.body.playerName.should.equal('Michael Jordan');
      res.body.year.should.equal(1988);
      res.body.manufacturer.should.equal('Starrcards');
      id = res.body._id;
      done();
    });
  });

  it('should be able to remove a card', function(done) {
    agent.delete('/' + id).expect(200).end(function(err, res) {
      should.not.exist(err);
      should.exist(res);

      agent.get('/' + id).expect(400).end(function(err, res) {
        id = undefined;
        done();
      });
    });
  });

  after(function(done) {
    if (id) {
      Listing.remove({
        _id: id
      }, function(err) {
        if (err) throw err;
        done();
      });
    } else {
      done();
    }
  });
});
