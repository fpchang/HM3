<template>
  <view class="noData">
    <view><image src="https://env-00jxhfhjd231.normal.cloudstatic.cn/HM/images/data.png" /> </view>

      <view class="flex-center">
        <text style="color:#bbb">{{ text_content_foramt}}</text>
        <view class="flex-center control" v-if="showControl" @click="Event_one"> 
          <!-- <uni-icons type="plusempty" size="30" color='$font-color-control'></uni-icons> -->
           <view class="btn"> 
            <view class="btn-la"> <l-icon name="material-symbols:add-rounded" size="15px" color="#fff" /></view>
           <view class="btn-la"> <text>{{text_control_add_fromat}}</text></view>
           </view>
           
        </view>
          <view class="flex-center control loginOut" v-if="showLoginOut" @click="Event_LoginOut"> 
          
          <view class="btn" style="background:#6B7280" @click="loginOut">
            <view class="btn-la"><l-icon name="mdi:location-exit" size="15px" color="#fff" /></view>
            <view class="btn-la"><text>切换账号</text></view>
          </view>
        </view>
        </view>
  </view>
</template>

<script>
export default{
  name: "noData",
  props: {
    text_content:String,
    showControl:Boolean,
    text_control_add:String,
    showLoginOut:Boolean
  },
  data() {
    return {
      
    }
  },
  computed: {
    text_content_foramt(){
      return this.text_content?this.text_content:"没有数据";
    },
    text_control_add_fromat(){
      return this.text_control_add?this.text_control_add:"创建新的";
    }
  },
  methods: {
    Event_one(){
      this.$emit("Event_one");
    },
    async loginOut() {
      console.log("loginout");
      const conf = await uni.showModal({
        title: "确认登出",
        content: "是否确认退出登录",
        showCancel: true,
        cancelText: "取消",
        confirmText: "确认",
      });
      if (conf["cancel"]) {
        return;
      }
      this.$store.dispatch("loginOut");
    }
  },
  watch: {}
}
</script>

<style scoped lang="scss">
.noData{
  width: 100%;
 
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  .control{
    padding-left: 20px;
    color:$font-color-control;
    &:hover{
      color:$font-color-control-hover;
      cursor: pointer;
    }
  }
  .loginOut{
    padding-left: 10px;

   
  }
      .btn{
        height: 30px;
        padding:0 8px;
    border-radius: 15px;
    background:#0765ae ;
    color: #fff;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    gap: 5px;
    .btn-la{
      height: 100%;
      display: flex;
    align-items: center;
    justify-content: center;
    }
    
    }
}
</style>