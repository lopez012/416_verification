// Setup database with initial test data.
// Include an admin user.
// Script should take admin credentials as arguments as described in the requirements doc.

/*
The initial data must contain the user profile
for admin. The username and password for an admin user must be
provided as the first argument to server/init.js.
*/
const bcrypt = require('bcrypt');
let User = require('./models/users');
let Tag = require('./models/tags');
let Answer = require('./models/answers');
let Question = require('./models/questions');
let Comment = require('./models/comments')



let mongoose = require('mongoose');
let mongoDB = 'mongodb://127.0.0.1:27017/fake_so';
mongoose.connect(mongoDB);
// mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let tags = [];
let answers = [];

let userArgs = process.argv.slice(2);
if(userArgs.length<2){
    console.error("<Username> <Password> for admin missing");
    process.exit(1);
} 
const [username, password] = userArgs;

const saltRounds = 10;


    


function tagCreate(name, createdBy) {
  let tag = new Tag({ name: name, createdBy : createdBy });
  return tag.save();
}
function commentCreate(text, commented_by){
  comment_detail = {text:text};
  comment_detail.commented_by = commented_by;
  let comment = new  Comment(comment_detail);
  return comment.save();
}

function answerCreate(text, ans_by, ans_date_time, comments) {
  answerdetail = {text:text};
  if (ans_by != false) answerdetail.ans_by = ans_by;
  if (ans_date_time != false) answerdetail.ans_date_time = ans_date_time;
  if(comments != false) answerdetail.comments = comments;

  let answer = new Answer(answerdetail);
  return answer.save();
}

function questionCreate(title,summary, text, tags, answers, asked_by, ask_date_time, views , comments) {
  qstndetail = {
    title: title,
    summary: summary,
    text: text,
    tags: tags,
    askedBy: asked_by
  }
  if (answers != false) qstndetail.answers = answers;
  if (ask_date_time != false) qstndetail.ask_date_time = ask_date_time;
  if (views != false) qstndetail.views = views;
  if (comments!= false) qstndetail.comments = comments;

  let qstn = new Question(qstndetail);
  return qstn.save();
}
async function generateHash(password) {
    try {
        let salt = 10;
        let hashed_pass = await bcrypt.hash(password, saltRounds);
        return hashed_pass;
    } catch (error) {
        console.error(error);
    }
}


async function adminCreate(email,password){
    let hash = await generateHash(password);

    user = {
        email: email,
        hashed_password: hash,
        role: "admin",
        reputation:999
      }
      let admin = new User(user);
      return admin.save();
}
async function userCreate(email,username,password){
  let hash = await generateHash(password);
  user_detail = {
    email: email,
    hashed_password: hash,
    role: "regular",
    username:username
  }
  let user = new User(user_detail);
  return user.save();
}
function newDate(dateString) {
  return new Date(dateString);
}

const populate = async () => {


  //users
  await adminCreate(username, password);
  let u1 = await userCreate('johnSmith@hotmail.com','john_smith12','difficultpass');
  let u2 = await userCreate('janedoe@gmail.com', 'Jane_Doe7','jumbo');
  let u3 = await userCreate('maryjane@gmail.com','Mary-jane1','lolol');


  //tags
  let t1 = await tagCreate('react',u1);
  let t2 = await tagCreate('javascript',u2);
  let t3 = await tagCreate('android-studio',u3);
  let t4 = await tagCreate('shared-preferences',u2);

  //comments
  let c1 = await commentCreate('that is a very interesting point that you bring up',u1);
  let c2 = await commentCreate('very interesting indeed',u2);
  let c3 = await commentCreate('you bring up very valid points',u3);
  let c4 = await commentCreate('your analysis is on the right track.',u3);




  //answers
  let a1 = await answerCreate('React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.', u1 , newDate('2023-12-9'),[c1,c3]);
  let a2 = await answerCreate('On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.', u2, newDate('2022-10-23'),[c2,c4]);
  let a3 = await answerCreate('Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.', u3 , newDate('2003-06-9'),[c1,c2]);
  let a4 = await answerCreate('YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);', u1, newDate('2017-11-10'),[c3,c4]);
  let a5 = await answerCreate('I just found all the above examples just too confusing, so I wrote my own. ',u3, newDate('2021-12-25'),[c1,c3]);
  
  
  //questions
  await questionCreate('Programmatically navigate using React router', 'the alert shows the proper index for the li clicked, and when I alert the variable within the ....', 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function I\'m calling, moveToNextImage(stepClicked), the same value shows but the animation isn\'t happening. This works many other ways, but I\'m trying to pass the index value of the list item clicked to use for the math to calculate.', [t1, t2], [a1, a2], u1, newDate('2006-11-23'), 342, [c1,c2]);
  await questionCreate('android studio save string shared preference, start activity and load the saved string','I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a ....', 'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.', [t3, t4, t2], [a3, a4, a5], u3, newDate('2002-06-07'), 121,[c3,c4]);
  

  if(db) db.close();
  console.log('done');
}

populate()
  .catch((err) => {
    console.log('ERROR: ' + err);
    if(db) db.close();
  });

console.log('processing ...');



