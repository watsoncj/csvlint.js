var Csvlint = require('../csvlint');
var fs = require('fs');

describe('csvlint', function () {
    function expectPass(csvFile, done) {
        var csvlint = Csvlint()

        var onError = jest.fn();
        csvlint.on('error', onError);

        fs.createReadStream(csvFile)
            .pipe(csvlint)
            .on('data', () => {/* fully consume stream */})
            .on('end', function () {
                expect(onError).not.toHaveBeenCalled();
                done();
            });
    }

    function expectError(csvFile, expectedMessage, done) {
        var csvlint = Csvlint()

        csvlint.on('error', function (err) {
            expect(err.message).toBe(expectedMessage);
            done();
        });

        fs.createReadStream(csvFile)
            .pipe(csvlint)
            .on('data', () => {/* fully consume stream */})
            .on('end', function () {
                done('end should not have been called');
            });
    }

    it('should pass on test1.csv', function (done) {
        expectPass('./test/test1.csv', done);
    });

    it('should error on test1_err.csv', function (done) {
        expectError('./test/test1_err.csv', 'Field length is not the same. In line 2', done);
    });

    it('should pass on test2.csv', function (done) {
        expectPass('./test/test2.csv', done);
    });

    it('should pass on test3.csv', function (done) {
        expectPass('./test/test3.csv', done);
    });

    it('should pass on test4.csv', function (done) {
        expectPass('./test/test4.csv', done);
    });

    it('should error on test4_err.csv', function (done) {
        expectError('./test/test4_err.csv', 'If using double qoutes to start, CSV fields should enclosed with double-quotes. If using double quotes in fields you should escape by using double-quotes. In line 0', done);
    });

    it('should pass on test6.csv', function (done) {
        expectPass('./test/test6.csv', done);
    });

});
