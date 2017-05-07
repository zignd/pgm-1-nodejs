'use strict';

const fs = require('fs');
const path = require('path');
const VError = require('verror');

let cfg;

function get() {
    // XDG Base Directory Specification https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html
    
    if (!cfg) {
        const paths = [];
        paths.push(process.env['XDG_DATA_HOME'] ? process.env['XDG_DATA_HOME'] : `${process.env['HOME']}/.local/share`);
        paths.push('pgm-1-nodejs');
        paths.push(`${process.env['NODE_ENV'] == 'production' ? 'production' : 'development'}.json`);

        const filePath = path.join(...paths);
        if (!fs.existsSync(filePath))
            throw new VError({ name: 'NoConfigurationFileFound' }, 'configuration file not found at %s', filePath);

        const text = fs.readFileSync(filePath, 'utf-8');
        cfg = JSON.parse(text);
    }

    if (arguments.length > 0) {
        return cfg[arguments[0]];
    }

    return cfg;
}

function clean() {
    cfg = null;
}

module.exports = {
    get,
    clean
};