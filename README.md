# pgm-1-nodejs

## Installation

Clone the repository and from its root execute the following command:

    $ npm install

or

    $ ./bin/install

The installation process copies the configuration files (`development.json` and `production.json`) to `$HOME/.local/share/pgm-1-nodejs`. The configuration file to be loaded by the application will be chosen based on the value of the `NODE_ENV` environment variable which defaults to `development`, but can be set to `development` or `production`. Another thing to point out is that the application conforms with the XDG Base Directory Specification, therefore, setting the `XDG_DATA_HOME` environment variable will affect the installation directory of the configuration files.

## Endpoints

### `PUT /pokemons/name/:name/price/:price/stock/:stock`

#### Example

Request headers:

    PUT /pokemons/name/zig1/price/15/stock/9 HTTP/1.1
    Host: localhost:3000

Response content:

    {
        "id": 1,
        "name": "zig1",
        "price": "15",
        "stock": "9",
        "createdAt": "2017-05-08T01:31:58.221Z",
        "updatedAt": "2017-05-08T01:39:11.993Z"
    }

### `GET /pokemons`

#### Example

Request headers:

    GET /pokemons HTTP/1.1
    Host: localhost:3000
    
Response content:
    
    [
        {
            "id": 1,
            "name": "zig1",
            "price": 15,
            "stock": 9,
            "createdAt": "2017-05-08T01:31:46.255Z",
            "updatedAt": "2017-05-08T01:31:46.736Z"
        },
        {
            "id": 2,
            "name": "zig2",
            "price": 30,
            "stock": 3,
            "createdAt": "2017-05-08T01:31:58.221Z",
            "updatedAt": "2017-05-08T01:31:58.221Z"
        }
    ]

### `POST /pokemons/name/:name/price/:price/stock/:stock`

#### Example

Request:

    POST /pokemons/name/zig1/buy HTTP/1.1
    Host: localhost:3000
    Content-Type: application/x-www-form-urlencoded
    
    quantity=4&card_number=4024007138010896&card_expiration_date=1050&card_holder_name=Ash+Ketchum&card_cvv=123
    
Response content:
    
    {
        "code": "PurchaseCompleted",
        "message": "Purchase completed."
    }