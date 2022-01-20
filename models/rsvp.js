const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendeeSchema = new Schema({ userId: {type:Schema.Types.ObjectId} });

const rsvpSchema = new Schema({
    blogId:{type:String},
    yes:{type:[String]},
    no:{type:[String]},
    maybe:{type:[String]} 
})

module.exports=mongoose.model('Rsvp',rsvpSchema);
