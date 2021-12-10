const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const messageRoutes = express.Router();
const port =  5000;

let Message = require('./message.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/guestbook', {useNewUrlParser: true})
const connection = mongoose.connection;

connection.once('open', function (){
    console.log('mongodb connection established successfully');
});

app.use('/messages', messageRoutes);

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});