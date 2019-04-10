const express           = require('express'),
      app               = express(),
      expressHandlebars = require('express-handlebars'),
      bodyParser        = require('body-parser'),
      redis             = require('redis');

const client  = redis.createClient(url = 'redis://redis-16177.c59.eu-west-1-2.ec2.cloud.redislabs.com:16177');
client.auth('j5KhDhLSCaQ085RCxkdD4WqlozXi1Zwi');

app.use(express.static(__dirname + '/views'));
app.use(bodyParser.urlencoded({extend:true}));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set( __dirname + 'views');

client.on('connect', () => {
    console.log('redis client connected....');
});
client.on('error', (err) => {
    console.log('Something went wrong!' + err);
});

client.set('name', 'John Doe', redis.print);

client.set('other_name', 'Jane Doe', redis.print);


client.get('name', (err, result) => {
    if(err){
        console.log(err)
    } else {
        console.log('GET results: ' + result);
    }
});

client.get('other_name', (err, result) => {
    if(err){
        console.log(err)
    } else {
        console.log('GET results: ' + result);
    }
});

app.get('/', (req, res) => {
    res.render('index');

    client.get('name', (result) => {

    })
});

app.get('/new', (req, res) => {
    res.render('new');
});

app.post('/new', (req, res) => {
    let name = req.body.name

    client.set('name', name, redis.print)

    console.log(name);

    res.redirect('/');
})

app.get('/latest', (req, res) => {
    client.get('name', (err, result) => {
        if(err){
            console.log(err)
        } else {
            res.send('Latest entry is ' + result);
        }
    })
})

app.listen(3001, () => {
    console.log('server is running');
})