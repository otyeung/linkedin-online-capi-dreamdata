# linkedin-online-capi-dreamdata

## Start Server indpendently

Modify port number and host in "server/.env", default server is 'localhost' and port '5001'.
Open terminal in your apps directory, run

```
cd server
npm i
npm start
```

## Start Client indpendently

Modify REACT_APP_SERVER_URL in "server/.env", default is "http://localhost:5001"
Client runs on port 3000.
Open terminal in your apps directory, run

```
cd client
npm i
npm start
```

## Start Server & Client at the same time

```
cd client
npm i
npm run start:dev
```
