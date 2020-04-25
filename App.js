const fs = require('fs');
const express = require('express');
const app = express();
app.use(express.json());

app.use(function (req, res, next) {
  const allowedOrigins = ['http://127.0.0.1:4200', 'http://localhost:3000'];
  const origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);

  return next();
});

app.post('/messages', function (req, res) {
  const users = req.body;
  try {
    const data = fs.readFileSync('./history/' + users.firstUser + '_' + users.secondUser + '.json');
    res.send(JSON.parse(data));
  } catch (error) {
    res.send([]);
  }
});

app.post('/messages/save', function (req, res) {
  fs.writeFileSync('./history/' + req.body.firstUser + '_' + req.body.secondUser + '.json', JSON.stringify(req.body.messages))
  res.send('Saved');
});

app.delete('/messages', function (req, res) {
  fs.unlinkSync('./history/' + req.body.firstUser + '_' + req.body.secondUser + '.json', (err) => { });
  res.send('Deleted');
});

app.post('/login', function (req, res) {
  const username = req.body.user;
  const password = req.body.password;
  const data = JSON.parse(fs.readFileSync('./database/credentials.json'));

  const found = data.filter(element => element.user === username && element.password === password);

  if (found.length === 0) {
    res.send(false);
  } else {
    res.send(true);
  }
});

app.post('/signup', function (req, res) {
  const data = JSON.parse(fs.readFileSync('./database/credentials.json'));
  const newUser = req.body;

  const found = data.map(element => element.user).filter(element => element === newUser.user);
  if (found.length > 0) {
    res.status(400).send('There is already a user with this username. Try a different one!');
  }

  data.push(req.body);
  fs.writeFileSync('./database/credentials.json', JSON.stringify(data));
  res.send('created');
});

const server = app.listen(4200, function () {
  const host = server.address().address;
  const port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});