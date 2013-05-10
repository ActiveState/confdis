var assert = require('assert');

var Confdis = require('../index');

var c;
var rootKey = 'simpletest';
var dummyData = require('./dummyData.json');

describe('Confdis', function() {

    describe('test constructor & opts', function() {

        it('should initiate with error', function() {
            var y = new Confdis();
            assert(y instanceof Error);
        });

        it('should initiate without error', function() {

            c = new Confdis({
                rootKey: rootKey,
                host: process.env.TEST_HOST,
                port: process.env.TEST_PORT
            });

            assert(c instanceof Object);

            describe('test connection', function() {
                it('it should connect to redis', function(done) {
                    c.connect(function(err) {
                        assert(!err);
                        done(err);
                    });
                });

                it('it should sync with error - config empty', function(done) {
                    c.sync(function(err, config) {
                        assert(err);
                        done();
                    });
                });

                it('it should save the dummy data', function(done) {
                    dummyData.version = 1;
                    c.config = JSON.stringify(dummyData);
                    c.save(function(err) {
                        assert(err === undefined);
                        assert(c.config);
                        done(err);

                    });
                });

                it('should load & sync the dummy data', function(done) {
                    c.sync(function(err, config) {
                        assert(err === null);
                        assert(config);
                        c.config = JSON.parse(config);
                        done(err);
                    });
                });

                it('verify integrity of the dummy data', function(done) {
                    assert(c.config.version === 1);
                    assert(c.config.properties["molecular mass"] === 30.0690);
                    assert(c.config.atoms.coords["3d"].indexOf(1.166929) >= 0);
                    done();

                });

                it('should clear the config data in redis & memory', function(done2) {
                    c.clear(function(err) {
                        assert(!c.config);
                        assert(!err);
                        done2();
                    });
                });


            });
        });


    });
});
