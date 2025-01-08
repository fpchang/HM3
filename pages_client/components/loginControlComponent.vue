<template>
    <view class="loginControlComponent" v-if="!user">
        <view class="login-control">
            <text style="flex:1">登录后体验更佳</text>
            <view class="b-area"><button size="mini" class="btn"  @click="toLogin">登录</button></view>
          </view>
    </view>
 
</template>

<script>
export default {
    computed:{
        user(){
            return this.$store.state.user;
        }
    },
methods:{
    async toLogin(){
        await this.$store.dispatch("loginEvent")
    }
}
}
</script>

<style lang="scss" scoped>
.loginControlComponent{
    position:fixed;
    bottom: 100px;
    width: 100vw;
    background-color: rgba(153,153,153,0.2);
}
.login-control{
    max-width: 500px;
    margin: auto;
    height: 60px;
    display: flex;
    align-items: center;
    padding:0 15px;
    color: #646464;
    font-size: 14px;
   
    .b-area{
        width: 80px;
        padding:0;
        
        .btn{
            background-color: #ED9121!important;
            color: #fff;
            display: block;
        }
    }
}
</style>