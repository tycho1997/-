'use strict';
const mongoose = require('mongoose')
const moment = require('moment');

const Schema = mongoose.Schema;

const filmArticleSchema = new Schema({
    title: { type: String, required: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'Admin'},
    author_name: {type: String, required: true},
    abstract: String,
    content: {type: String, required: true},
    comment: [{type: mongoose.Schema.Types.ObjectId, ref: 'FilmComment'}],
    status: { type: Number, default: 0}, // 0: 草稿  1：审核中  2：审核成功  3：审核失败  4、已发布
    is_top: {type: Boolean, default: false}, //是否置顶
    enable: {type: Boolean, default: true}, //是否可用
    pre_release_time: { type: Date, default: Date.now },
    create_time: { type: Date, default: Date.now },
    update_time: { type: Date, default: Date.now},
    cover_url: String,
    film_info: {
        name: {type: String, required: true},
        quote: {type: String, required: true}, //引用
        film_images: [{
            type: String
        }]
    },
    views_count: {type: Number, default: 0},
    likes_count: {type: Number, default: 0},
    collect_count: {type: Number, default: 0},
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    collect: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    share_info: {
        title: String,
        description: String,
        link: String,
        imageUrl: String,
    },
})

filmArticleSchema.index({id: 1});
filmArticleSchema.path('create_time').get(function (v) {
    return moment(v).format("YYYY-MM-DD HH:mm:ss");
});
filmArticleSchema.path('update_time').get(function (v) {
    return moment(v).format("YYYY-MM-DD HH:mm:ss");
});
filmArticleSchema.path('pre_release_time').get(function (v) {
    return moment(v).format("YYYY-MM-DD HH:mm:ss");
});

let FilmArticle = mongoose.model('FilmArticle', filmArticleSchema);

module.exports = FilmArticle
