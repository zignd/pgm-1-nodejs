'use strict';

const chai = require('chai');
const fs = require('fs');
const path = require('path');
const VError = require('verror');

const config = require('../../src/services/config');

const assert = chai.assert;

describe('services/config.js', function () {
    describe('get()', function () {
        it('should return an object loaded with the values that were defined in a configuration file when no arguments are given', function () {
            const cfg = config.get();
            assert.equal(cfg['app_name'], 'pgm-1-nodejs');
        });

        it('should return a specific configuration when a key is given as an argument', function () {
            const appName = config.get('app_name');
            assert.equal(appName, 'pgm-1-nodejs');
        });

        it("should fail if the configuration files aren't at the expected location", function () {
            const paths = [];
            paths.push(process.env['XDG_DATA_HOME'] ? process.env['XDG_DATA_HOME'] : `${process.env['HOME']}/.local/share`);
            paths.push('pgm-1-nodejs');

            const fileName = `${process.env['NODE_ENV'] == 'production' ? 'production' : 'development'}.json`;
            const fileName2 = '_' + fileName;

            const filePath = path.join(...paths, fileName);
            if (!fs.existsSync(filePath))
                throw new VError('configuration file not found at %s', filePath);

            const filePath2 = path.join(...paths, fileName2);

            fs.renameSync(filePath, filePath2);

            const rollback = () => {
                console.log('rollback to be executed', fs.existsSync(filePath));
                fs.renameSync(filePath2, filePath);
                console.log('rollback executed', fs.existsSync(filePath));
            };

            try {
                config.clean();
                config.get();
            } catch (err) {
                assert.equal(err.name, 'NoConfigurationFileFound');
                return;
            } finally {
                rollback();
            }

            throw new VError('should have thrown an error');
        });
    });
});