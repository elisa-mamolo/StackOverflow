const mongoose = require('mongoose'); // We need the mongoose library

//class where i have hidden all the access to db
class Db {
    constructor() {
        //defines how question schema looks
        // This is the schema we need to store questions in MongoDB
        const questionSchema = new mongoose.Schema({
            question: String,
            answers: [{
                text: String,
                vote: Number
            }]// A list of answers as string
        });
        this.questionModel = mongoose.model('question', questionSchema);
    }

    async getQuestions() {
        try {
            return await this.questionModel.find({});
        } catch (error) {
            console.error("getQuestions:", error.message);
            return {};
        }
    }

    async getQuestion(id) {
        try {
            return await this.questionModel.findById(id);
        } catch (error) {
            console.error("getQuestion:", error.message);
            return {};
        }
    }


    async createQuestion(newQuestion) {
        // TODO: Error handling
        let question = new this.questionModel(newQuestion);
        try {
            return await question.save();
        } catch (error) {
            console.error("createQuestion:", error.message);
            return {};
        }

    }


    async addAnswer(id, answer) {
        // TODO: Error handling
        //get question by id
        const question = await this.getQuestion(id);
        //push the answer to question
        question.answers.push({text: answer, vote: 0});
        try {
            return question.save();

        } catch{
            console.log("addAnswer", error.message);
        }

    }
    getAnswer(question, answerId){
        try{
            return question.answers.find(answer => answer._id = answerId)
        } catch{
            return {}
        }
    }
    //vote
    async putVote(id, answerId) {
        // TODO: Error handling
        const question = await this.getQuestion(id);
        const answer = this.addAnswer(question, answerId);
        answer.votes = answer.votes + 1;
        return question.save();
    }

    /**
     * This method adds a bunch of test data if the database is empty.
     * @param count The amount of questions to add.
     * @returns {Promise} Resolves when everything has been saved.
     */
    async bootstrap(count = 10) {
        const answers = [
            {text: 'I have no idea', vote: 2},
            {text: 'Maybe you can try on the real stackOverflow' , vote: 2},
            {text:'Ask the admin' , vote: 2},
            {text: 'Are you sure you have posted in the correct section?' , vote: 2}
            ];

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }

        function getRandomName() {
            return ['How do i run npm start', 'Can i install React globally?', 'Character not accepted as command', 'How do I connect to Mongoose?']
                [getRandomInt(0,3)]
        }

        function getRandomAnswers() {
            const shuffled = answers.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, getRandomInt(1,shuffled.length));
        }

        let l = (await this.getQuestions()).length;
        console.log("question collection size:", l);

        if (l === 0) {
            let promises = [];

            for (let i = 0; i < count; i++) {
                let question = new this.questionModel({
                    question: getRandomName(),
                    answers: getRandomAnswers()
                });
                promises.push(question.save());
            }

            return Promise.all(promises);
        }
    }
}

// We export the object used to access the questions in the database
module.exports = mongoose => new Db(mongoose);