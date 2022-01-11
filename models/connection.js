const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const connectionSchema = new Schema(
{
    categoryTopic: {type: String, required: [true, 'Topic is required']},
    connectionName: {type: String, required: [true, 'Title is required']},
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    details: {type: String, required: [true, 'details are required'], minLength: [10, 'the details should have at least 10 characters']},
    location: {type: String, required: [true, 'location is required']},
    date: {type: String, required: [true, 'date is required']},
    startTime: {type: String, required: [true, 'Start time is required']},
    endTime: {type: String, required: [true, 'End Time is required']},
    image: {type: String, required: [true, 'image url is required']},
},
{timestamps: true}
);

module.exports = mongoose.model('Connection', connectionSchema, 'connections');