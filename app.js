require('dotenv').config();

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require('mongoose');
const express = require("express");
const app = express();
const bodyParser = require('body-parser');

const hbs = require('hbs');
const port =  process.env.PORT;

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended:true }));
app.use(express.static(__dirname + '/public'));


mongoose.Promise = Promise;
mongoose
  .connect('mongodb://localhost/project-2-recipes', {useUnifiedTopology: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

// ...other code

// Routes
const router = require("./routes/auth-routes");
app.use('/', router);

app.listen(port, () => console.log("My bcrypt project is running at port 3003!"))