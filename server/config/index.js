'use strict';

module.exports = {
	port: 8888,
	url: 'mongodb://127.0.0.1:27017/Reader',

    akismet: {
        key: 'your akismet Key',
        blog: 'your akismet blog site'
    },

	email: {
        account: '984152245@qq.com',
        password: 'uxrqopcmxvrgbbad'
	},

	siteInfo: {
        name: 'Reader Manage',
        version: '1.0.0',
        author: 'tychow',
        site: 'www.reader.cn',
        github: '',
        keyword: ['文艺类阅读App', '碎片化阅读']
    },

    qiniu: {
        accessKey: '7BCB3_KgqBKkpCrSxZMdE_vJB2uP41yx7vm4aAnL',
        secretKey: 'JV1zmzGc3SMZZQcd4S0BBJqcVrm_aGOZoeRX5OAF',
        bucket: 'mafei-reader',
        origin: '',
        uploadURL: 'https://up-z2.qiniup.com',  //华南
    }
}