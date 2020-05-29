<template>
    <div class="footer">
        <p class="copyRight">Copyright © 2020-2021 <a href="" class="reader">Reader</a>. All rights reserved.</p>
    </div>
</template>

<script>
    export default {
        name: "AppFooter",

    }
</script>

<style lang="scss" scoped>
    .footer{
        width: 100%;
        height: 50px;
        line-height: 50px;
        .copyRight{
            font-family: "Apple Chancery";
            text-align: center;
            .reader:hover{
                color: #000;
            }
        }
    }
</style>
