'use strict';
const mongoose = require('mongoose')
const moment = require('moment')

const Schema = mongoose.Schema;

const soundCommentSchema = new Schema({
    article_id: {type: mongoose.Schema.Types.ObjectId, ref: 'SoundArticle', required: true},
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    content: {type: String, required: true},
    is_top: {type: Boolean, default: false}, //是否置顶
    enable: {type: Boolean, default: true}, //是否可用
    create_time: { type: Date, default: Date.now },
    likes_count: {type: Number, default: 0},
    reply_to_id: {type: mongoose.Schema.Types.ObjectId, ref: 'SoundComment'}  //被回复的评论id
})

soundCommentSchema.index({id: 1});
soundCommentSchema.path('create_time').get(function (v) {
    return moment(v).format("YYYY-MM-DD HH:mm:ss");
});

const SoundComment = mongoose.model('SoundComment', soundCommentSchema);


module.exports = SoundComment
