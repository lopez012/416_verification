// Application server
// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.

const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcrypt');
const cors = require('cors');




const app = express();
const port = 8000;

//app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const corsOptions = {
    origin: 'http://localhost:3000', 
    credentials: true,
};

app.use(cors(corsOptions));




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
const userRouter = require('./routes/users_route.js');
const commentRouter = require('./routes/comment_route.js');

app.use(session({
    secret: "very secret string",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/fake_so' }),
    cookie: {
        httpOnly: true, 
        secure:false,
        maxAge: 1000 * 60 * 60,
        resave: false,
        saveUninitialized: false
    }
}));

app.use('/answers', answerRouter);
app.use('/tags', tagRouter);
app.use('/questions',questionRouter);
app.use('/users',userRouter);
app.use('/comments',commentRouter);



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