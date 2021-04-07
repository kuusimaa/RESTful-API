# RESTful-API

Basic RESTful-API using node.js and mongoDB.

## Built With

This section should list any major frameworks that you built your project using. Leave any add-ons/plugins for the acknowledgements section. Here are a few examples.
* [Node.js](https://nodejs.org/en/)
* [MongoDB](https://www.mongodb.com/)


## Installation
* npm
    ```bash
    npm install
    ```

## API

#### /api/:api_key/users
* `GET` : Get all users.
* `POST` : Create a new user.
* `DELETE` : Delete all users.

#### /api/:api_key/user/:id
* `GET` : Get users by id.
* `PATCH` : Update users by id.
* `DELETE` : Delete users by id.

#### /api/user/login
* `POST` : Login using username and password.


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
