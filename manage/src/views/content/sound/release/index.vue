<template>
    <div>
        <new-post :isEdit="isEdit" :postId="postId" type="SoundArticle" :tinymceId="tinymceId" :defaultForm="defaultForm" :key="tinymceId"></new-post>
    </div>
</template>

<script>
    import NewPost from '../../../common/NewPost'

    export default {
        name: "sound-release",
        components: {
            NewPost,
        },
        data(){
            const isEdit = this.$route.query.isEdit || false
            const postId = this.$route.query.postId
            return {
                isEdit: isEdit,
                postId: postId,
                tinymceId: 'sound-release',
                defaultForm: {
                    title: '', // 文章题目
                    author: JSON.parse(window.localStorage.getItem('userInfo')).data.role === 'admin' ? '' : JSON.parse(window.localStorage.getItem('userInfo')).data.username,
                    content: '', // 文章内容
                    abstract: '', // 文章摘要
                    pre_release_time: '', // 前台展示时间
                    cover_url: '',
                    role: JSON.parse(window.localStorage.getItem('userInfo')).data.role,
                    sound_url: ''
                },
            }
        }
    }
</script>

<style scoped>

</style>