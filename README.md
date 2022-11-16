#Api Routes
Following are the api rotes

### ping

| Method | Path  | Description                                            |
| ------ | ----- | ------------------------------------------------------ |
| GET    | /api/ | ping the server is it working or not send current time |

### auth

| Method | Path                    | Description                   |
| ------ | ----------------------- | ----------------------------- |
| POST   | /api/users/register     | create a new user in database |
| POST   | /api/users/authenticate | Login                         |

### event

| Method | Path                  | Description                                   |
| ------ | --------------------- | --------------------------------------------- |
| POST   | /api/event/add        | create a new event in the data base           |
| GET    | /api/event/all        | get all the active events from the data base  |
| GET    | /api/event/get/:id    | get the specific event by giving id           |
| PUT    | /api/event/update/:id | update a specific event                       |
| POST   | /api/event/filter     | filter the event according to define criteria |

### city

| Method | Path             | Description                            |
| ------ | ---------------- | -------------------------------------- |
| POST   | /api/city/add    | create a new city in database          |
| GET    | /api/city/getAll | get all available cities from database |

# before running kindly run db.sql in postgress so that db will be created as we are using db first approch

# To run application on your local machine

- clone the app on your pc
- in app directory use the following commads

```
$ npm install
$ cd client
$ npm install
$ npm run build
$ cd..
$ npm start

```

# to run application in development mode

- open two terminals one in server root directory and one in client folder
- use following commands in both terminals
- before starting the client site change the config/config.js variables according to your needs change the url and env

```
$ npm install
$ npm start

```
