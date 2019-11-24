const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const db = require("mongodb");

const checkJwt = require('express-jwt');    // Check for access tokens automatically
const bcrypt = require('bcryptjs');         // Used for hashing passwords!

/**** Configuration ****/
const port = (process.env.PORT || 8000);
const app = express();
//configure libraries
app.use(cors());
app.use(bodyParser.json()); // Parse JSON from the request body
app.use(morgan('combined')); // Log all requests to the console
app.use(express.static('../client/build')); // Only needed when running build in production mode


// Open paths that do not need login. Any route not included here is protected!
let openPaths = [
    { url: '/api/users/authenticate', methods: ['POST'] },
    //add questions so the user not logged in can still see my questions
    { url: '/api/questions', methods: ['GET'] }
];

//this is the first part of the middleware
// Validate the user using authentication. checkJwt checks for auth token.
//use the secret to check the validity of the token
const secret = "the cake is a lie";
app.use(checkJwt({ secret: secret }).unless({ path : openPaths }));

// This middleware checks the result of checkJwt
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') { // If the user didn't authorize correctly
        res.status(401).json({ error: err.message }); // Return 401 with error message.
    } else {
        next(); // If no errors, send request to next middleware or route handler
    }
});

/**** Users ****/

// It is recommended that you store users in MongoDB using Mongoose instead of this.
const users = [
    // These are just some test users with passwords.
    // The passwords are in clear text for testing purposes. (don't do this in production)
    { id: 0, username: "elisa", password: '123'},
    { id: 1, username: "giulia", password: 'password'},
    { id: 2, username: "silvia", password: 'l33th0xor'},
];

// Creating more test data: We run through all users and add a hash of their password to each.
// Again, this is only for testing. In practice, you should hash only when adding new users.
users.forEach(user => {
    //10 is because it is hashed 10 times
    bcrypt.hash(user.password, 10, function(err, hash) {
        user.hash = hash; // The hash has been made, and is stored on the user object.
        delete user.password; // The clear text password is no longer needed
        console.log(`Hash generated for ${user.username}`, user); // For testing purposes
    });
});

/**** Database ****/
// The "Question Data Access Layer". file question_dal.js
// give module to mongoose as a parameter to make operations with the data
const questionDAL = require('./question_dal')(mongoose);

/**** Routes ****/

const usersRouter = require('./users_router')(users, secret);
app.use('/api/users', usersRouter);

//get all questions
app.get('/api/questions', (req, res) => {
    // Get all questions. Put question into json response when it resolves.
    questionDAL.getQuestions().then(questions => res.json(questions));
});

//get question by id
app.get('/api/questions/:id', (req, res) => {
    let id = req.params.id;
    //using my module with the methods I have created to access api
    questionDAL.getQuestion(id).then(question => res.json(question));
});

//post question
app.post('/api/questions', (req, res) => {
    let question = {
        //need to specify question because otherwise is expecting a answer
        question : req.body.question,
        answers : [] // Empty answer array
    };
    questionDAL.createQuestion(question).then(newQuestion => res.json(newQuestion));
});

//post answer
app.post('/api/questions/:id/answers', (req, res) => {
    // To add a hobby, you need the id of the question, and some hobby text from the request body.
    questionDAL.addAnswer(req.params.id, req.body.answers)
        .then(updatedQuestion => res.json(updatedQuestion));
});

//delete question - not working?
app.delete('/api/questions/:id', (req, res)=>{
    let id = req.params.id;
    questionDAL.getQuestion(id).then(question => question.remove);
});

//post vote - not working just example code
app.post('/api/questions/:id/answers/:id/vote', (req, res) => {
    const { id, vote } = req.body;
    db.findOne({ _id: id }, function (err, doc) {
        if (err) {
            return res.status(500).send(err);
        }

        db.update(
            { _id: id },
            { $set: { vote: doc.vote + vote } },
            { returnUpdatedDocs: true }, (err, num, updatedDoc) => {
            if (err) return res.status(500).send(err);
           return  {vote: updatedDoc};
        });
    });
});

// "Redirect" all get requests (except for the routes specified above) to React's entry point (index.html) to be handled by Reach router
// It's important to specify this route as the very last one to prevent overriding all of the other routes
app.get('*', (req, res) =>
    res.sendFile(path.resolve('..', 'client', 'build', 'index.html'))
);

/**** Start ****/
const url = (process.env.MONGO_URL || 'mongodb://localhost/question_db');
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    //when it is connected i listen to my api
    .then(async () => {
        await questionDAL.bootstrap(); // Fill in test data if needed.
        await app.listen(port); // Start the API
        console.log(`Question API running on port ${port}!`)
    })
    .catch(error => console.error(error));