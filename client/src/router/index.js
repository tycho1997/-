import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import RegisterOne from '../pages/RegisterOne';
import RegisterTwo from '../pages/RegisterTwo';
import Login from '../pages/Login';
import AppMain from '../pages/AppMain';
import Home from '../pages/Home';
import Moment from '../pages/Moment';
import Me from '../pages/Me';
import User from '../pages/User';
import Profile from '../pages/Profile';
import Make from '../pages/Make';
import ReadingArticle from '../pages/article/reading';
import FilmArticle from '../pages/article/film';
import MusicArticle from '../pages/article/music';
import SoundArticle from '../pages/article/sound';
import ReadingList from '../pages/list/reading';
import FilmList from '../pages/list/film';
import MusicList from '../pages/list/music';
import SoundList from '../pages/list/sound';
import ImageList from '../pages/list/image';
import ReadingCollect from '../pages/collect/reading';
import MusicCollect from '../pages/collect/music';
import FilmCollect from '../pages/collect/film';
import SoundCollect from '../pages/collect/sound';
import UserList from '../pages/list/user';



export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/register1',
            name: 'register1',
            component: RegisterOne,
        },
        {
            path: '/register2',
            name: 'register2',
            component: RegisterTwo,
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
        },
        {
            path: '/',
            name: 'AppMain',
            component: AppMain,
            redirect: 'home',
            children: [
                {
                    path: 'home',
                    name: 'all',
                    component: Home,
                    meta: {
                        title: 'Home',
                    }
                },
                {
                    path: 'moment',
                    name: 'moment',
                    component: Moment,
                    meta: {
                        title: 'Reader',
                    }
                },
                {
                    path: 'me',
                    name: 'me',
                    component: Me,
                    meta: {
                        title: 'Me',
                    }
                }
            ]
        },
        {
            path: '/profile',
            name: 'Profile',
            component: Profile,
        },
        {
            path: '/make',
            name: 'Make',
            component: Make,
        },
        {
            path: '/readinglist',
            name: 'ReadingList',
            component: ReadingList,
        },
        {
            path: '/reading/:id',
            name: 'ReadingArticle',
            component: ReadingArticle,
        },
        {
            path: '/filmlist',
            name: 'FilmList',
            component: FilmList,
        },
        {
            path: '/film/:id',
            name: 'FilmArticle',
            component: FilmArticle,
        },
        {
            path: '/musiclist',
            name: 'MusicList',
            component: MusicList,
        },
        {
            path: '/music/:id',
            name: 'MusicArticle',
            component: MusicArticle,
        },
        {
            path: '/soundlist',
            name: 'SoundList',
            component: SoundList,
        },
        {
            path: '/sound/:id',
            name: 'SoundArticle',
            component: SoundArticle,
        },
        {
            path: '/imagelist',
            name: 'ImageList',
            component: ImageList,
        },
        {
            path: '/user',
            name: 'User',
            component: User,
        },
        {
            path: '/userlist',
            name: 'UserList',
            component: UserList,
        },
        {
            path: '/readingcollect',
            name: 'ReadingCollect',
            component: ReadingCollect,
        },
        {
            path: '/musiccollect',
            name: 'MusicCollect',
            component: MusicCollect,
        },
        {
            path: '/filmcollect',
            name: 'FilmCollect',
            component: FilmCollect,
        },
        {
            path: '/soundcollect',
            name: 'SoundCollect',
            component: SoundCollect,
        },
    ]
})
