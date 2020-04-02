const fs = require('fs'); 
const express = require('express');
const app = express();
app.use(express.json());

app.use(function(req, res, next) {
    var allowedOrigins = ['http://127.0.0.1:4200', 'http://localhost:3000'];
    var origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
         res.setHeader('Access-Control-Allow-Origin', origin);
    }
    //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    return next();
  });

app.post('/messages', function (req, res) {
    const users = req.body;
    const data = fs.readFileSync(users.firstUser + '_' + users.secondUser + '.json'); 
    const messages = JSON.parse(data);

    res.send(messages);
});

app.post('/messages/save', function (req, res) {
    console.log('Received messager history');
    console.log(req.body);
    fs.writeFileSync(req.body.firstUser + '_' + req.body.secondUser + '.json', JSON.stringify(req.body.messages))
    res.send('Saved');
});

app.delete('/messages/delete', function (req, res) {
    console.log('Delete history');
    console.log(req.body);
    fs.unlink('./' + req.body.firstUser + '_' + req.body.secondUser + '.json', (err) => {});
    res.send('Deleted');
});

const server = app.listen(4200, function() {
   const host = server.address().address;
   const port = server.address().port;

   console.log("Example app listening at http://%s:%s", host, port);
});