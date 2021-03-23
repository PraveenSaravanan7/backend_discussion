const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Users = require('./users')

const replySchema = new Schema({
    userid: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    reply:{
        type:String,
        required:true
    },
}, {
    timestamps: true
});

const postsSchema = new Schema({
    userid: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    title:{
        type: String,
        required:true,
        unique: true
    },
    description:{
        type:String,
        required:true
    },
    replies: [ replySchema ],
}, {
    timestamps: true
});

var Posts = mongoose.model('Posts',postsSchema,'posts');

module.exports = Posts;