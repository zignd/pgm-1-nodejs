# pgm-1-nodejs

## Installation

Clone the repository and from its root execute the following command:

    $ npm install

or

    $ ./bin/install

The installation process copies the configuration files (`development.json` and `production.json`) to `$HOME/.local/share/pgm-1-nodejs`. The configuration file to be loaded by the application will be chosen based on the value of the `NODE_ENV` environment variable which defaults to `development`, but can be set to `development` or `production`. Another thing to point out is that the application conforms with the XDG Base Directory Specification, therefore, setting the `XDG_DATA_HOME` environment variable will affect the installation directory of the configuration files.