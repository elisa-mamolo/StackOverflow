const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const db = require("mongodb");
const path = require('path');

/**** Configuration ****/
const port = (process.env.PORT || 8000);
const app = express();
//configure libraries
app.use(cors());
app.use(bodyParser.json()); // Parse JSON from the request body
app.use(morgan('combined')); // Log all requests to the console
app.use(express.static('../client/build')); // Only needed when running build in production mode

/**** Database ****/
// The "Question Data Access Layer". file question_dal.js
// give module to mongoose as a parameter to make operations with the data
const questionDAL = require('./question_dal')(mongoose);

/**** Routes ****/
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
app.post('/api/questions/:id', (req, res) => {
    questionDAL.addAnswer(req.params.id, req.body.answer)
        .then(updatedQuestion => res.json(updatedQuestion));
});

//Update Vote
app.put(
    "/api/questions/:questionId/answers/:answerId/vote",
    (request, response) => {
        //Path parameter
        // request.body is an answer object
        questionDAL.putVote(request.params.questionId, request.params.answerId)
            .then(updatedVote => response.json(updatedVote));
    }
);

//delete question - not implemented
app.delete('/api/questions/:id', (req, res)=>{
    let id = req.params.id;
    questionDAL.getQuestion(id).then(question => question.remove);
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