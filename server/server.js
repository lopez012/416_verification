// Application server
// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.

const express = require('express');
const cors = require('cors');

const mongoose = require('mongoose');

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

var mongoDB = 'mongodb://127.0.0.1:27017/fake_so';
mongoose.connect(mongoDB,{useNewUrlParser: true, useUnifiedTopology:true});
var db = mongoose.connection;
db.once('open', ()=>{
    console.log("MongoDB connection established")

});
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const answerRouter = require('./routes/answer_route');
const tagRouter = require('./routes/tag_route');
const questionRouter = require('./routes/question_route.js');
app.use('/answers', answerRouter);
app.use('/tags', tagRouter);
app.use('/questions',questionRouter);




app.listen(port, () => {
    console.log(`server running on port: ${port}`)
  });

process.on('SIGINT',()=>{
    console.log("\nServer closed. Database instance disconnected");
    db.close(() => {
        console.log("MongoDB connection disconnected");
        process.exit(0);
    });
});