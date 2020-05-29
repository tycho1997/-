<template>
    <div class="main" id="scrollContainer">
        <div class="container">
            <transition name="fade-transform" mode="out-in">
                <keep-alive>
                    <router-view />
                </keep-alive>
            </transition>
            <!-- <transition name="fade" mode="out-in">
                <router-view></router-view>
            </transition> -->
            <app-footer></app-footer>
        </div>
    </div>
</template>

<script>
    import AppFooter from './AppFooter'
    export default {
        name: "manage",
        computed: {
            routes(){
            }
        },
        components: {
            AppFooter,
        }
    }
</script>

<style lang="scss" scoped>
    .main{
        padding: 20px 40px;
        width: calc(100vw - 270px);
        margin-left: 10px;
        margin-top: 10px;
        color: #353535;
        position: relative;
        overflow-y: scroll;
        .container{
            width: 100%;
            margin-top: 20px;
        }
    }
</style>
