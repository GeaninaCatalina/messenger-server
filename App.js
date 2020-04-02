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
  //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);

  return next();
});

app.post('/messages', function (req, res) {
  const users = req.body;
  try {
    const data = fs.readFileSync(users.firstUser + '_' + users.secondUser + '.json');
    res.send(JSON.parse(data));
  } catch (error) {
    res.send([]);
  }
});

app.post('/messages/save', function (req, res) {
  fs.writeFileSync(req.body.firstUser + '_' + req.body.secondUser + '.json', JSON.stringify(req.body.messages))
  res.send('Saved');
});

app.delete('/messages', function (req, res) {
  fs.unlinkSync('./' + req.body.firstUser + '_' + req.body.secondUser + '.json', (err) => { });
  res.send('Deleted');
});

const server = app.listen(4200, function () {
  const host = server.address().address;
  const port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});