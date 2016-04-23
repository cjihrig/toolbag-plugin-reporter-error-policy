'use strict';

const Code = require('code');
const Lab = require('lab');
const Manager = require('toolbag/lib/manager');
const Policy = require('../lib');

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const describe = lab.describe;
const it = lab.it;


describe('Reporter Error Policy', () => {
  it('registers a reporter error policy but does not use it', (done) => {
    const m = new Manager({ errors: { policy: 'throw' } });
    const name = 'foo';

    m.client.addReporter({ report: Code.fail });

    expect(m.getErrorHandler(name)).to.not.exist();
    Policy.register(m, { name }, (err) => {
      expect(err).to.not.exist();
      expect(() => {
        m.error(new Error('test error'));
      }).to.throw(Error, 'test error');
      done();
    });
  });

  it('registers a reporter error policy and uses it', (done) => {
    const m = new Manager({ errors: { policy: 'throw' } });
    const name = 'foo';

    m.client.addReporter({
      report: (data) => {
        const err = JSON.parse(data);

        expect(err.message).to.equal('test error');
        done();
      }
    });

    expect(m.getErrorHandler(name)).to.not.exist();
    Policy.register(m, { name, use: true }, (err) => {
      expect(err).to.not.exist();
      expect(() => { m.error(new Error('test error')); }).to.not.throw();
    });
  });
});
