<template>
  <view class="container">
    <view class="panel">
      <view class="title">欢迎使用 [民宿管理系统]</view>
      <view class="subtitle">手机号快捷登录/注册</view>
      <view style="height: 80px"></view>
      <uni-forms ref="userForm" :modelValue="userForm" :rules="rules">
        <uni-forms-item name="phone">
          <view class="flex-center input-area">
            <input  type="number" v-model="userForm.phone" placeholder="请输入手机号" />       
          </view>
        </uni-forms-item>
        <uni-forms-item name="smsCode">
          <view class="flex-center input-area" > 
            <input  type="number"  v-model="userForm.smsCode" placeholder="请输入验证码" />
            <text @click="getCode" :class="['smstext', sendSmsDisabled ? 'smstext-disable' : '']">{{tips}}</text>
          </view>
          
        </uni-forms-item>
        <uni-forms-item >
          <button  :class="['submit-btn',submitDisabled?'submit-btn-disabled':'']"  :disabled="submitDisabled" @click="submit":loading="submitLoading">登录</button>
        </uni-forms-item>
      </uni-forms>
      <view style="height: 80px"></view>
    </view>
  </view>
</template>

<script>
import{DB} from "../../api/DB";
import {AccountService} from "../../services/AccountService";
export default {
  data() {
    return {
      submitLoading: false,
      canGetCode:true,
      tips: "获取验证码",
      userForm: {
        tk: uni.getStorageSync("tk") || "",
        smsCode: "",
        phone: "13122905834",
      },
      rules: {
        phone: [
          {
            required: true,
            message: "请输入手机号",
            trigger: ["blur"],
          },
          {
            // 自定义验证函数，见上说明
            validator: (rule, value, callback) => {
              // 上面有说，返回true表示校验通过，返回false表示不通过
              // uni.$u.test.phone()就是返回true或者false的
              return uni.$u.test.phone(value);
            },
            message: "手机号码不正确",
            // 触发器可以同时用blur和change
            trigger: ["blur"],
          },
        ],
      },
    };
  },
  computed: {
    sendSmsDisabled() {
      return this.userForm.phone.length != 11;
    },
    submitDisabled() {
      return (
        this.userForm.phone.length != 11 || this.userForm.smsCode.length != 4
      );
    },
    user() {
      return this.$store.state.user;
    },
  },
  watch:{
  
  },
  onload() {},
  created(){
    console.log("login created>>>>");
  },
  methods: {
    sendSmsSuccess(time = 30){
      let t = time;
       this.tips=`${t}S`;
       this.canGetCode=false;
    let timevent = setInterval(()=>{
      if(t<1){
        clearInterval(timevent);
        this.tips=`重新发送`;
        this.canGetCode=true;
        return ;
      }
        t--;
        this.tips=`${t}S`
      },1000)
 
    
    },
    getCode() {  
      if(!this.canGetCode){
        uni.showToast({title:"倒计时结束后再发送",icon:"none"});
        return;
      }  
        if (!this.sendSmsDisabled) {
          uni.showLoading();
          uniCloud.callFunction({
              name: "hm-sendSms",
              data: {
                phone: this.userForm.phone,
                templateId: "100",
              },
            })
            .then((res) => {
              console.log("sendsms value", res);
              this.userForm.tk = res.result.tk;
              uni.setStorageSync("tk", res.result.tk);
              uni.hideLoading();
              this.sendSmsSuccess();
              // this.reverseNumber = Number(this.count);
              // this.$refs.uCode.start();
            });
        } 
     
     
    },
    submit() {
      this.$refs.userForm
        .validate()
        .then(async (res) => {
          this.submitLoading = true;
          try {
          const res =  await AccountService.login(this.userForm);
          console.log("ressss",res)
          
          if(res.result.code){
                uni.showToast({
                title:res.result.msg,
                duration: 2000,
                icon: "error",
              });
              this.submitLoading=false;
            return;
          }
          const {token} = res.result.data;
          uni.setStorageSync("hm_token", token);
               this.getUserInfo();
          this.submitLoading=false;
          } catch (error) {
            console.log("登录失败",error);
            this.submitLoading=false;
          }
          
        })
        .catch((errors) => {
          uni.showToast({
                title:"登录失败，请联系管理员",
                duration: 2000,
                icon: "error",
              });
        });
    },
    async getUserInfo() {
      console.log(this.userForm.phone);
      const db = uniCloud.database();
      const userRes = await db
        .collection("hm-user")
        .where(`phone=='${this.userForm.phone}'`)
        .get();
      console.log("更新userInfo", userRes, userRes.result.data[0]);
      uni.setStorageSync("user", userRes.result.data[0]);
      this.$store.commit("setUser", userRes.result.data[0]);
      uni.reLaunch({
        url: "/pages/index/index",
      });
    },
  }
};
</script>

<style lang="scss">
.input-area{
  width: 298px;
  background-color: #eee;
  height: 45px;
  padding: 18px;
  border-radius: 22.5px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  font-size:$uni-font-size-sm;
  input{
    flex:1;
    font-size:$uni-font-size-sm;
  }
}

.submit-btn{
  background:#06c;
  border-radius: 22.5px;
  color: #fff!important;
  cursor: pointer;
  
}
.submit-btn-disabled{
  background:#0066cc78!important;
  color: #eee!important;
}
.sms-btn {
  border-radius: 22.5px;
  color: #fff;
  background-color:#06c ;
  cursor: pointer;

}

.smstext {
  color: #06c;
  margin-right: 6px;
  cursor: pointer;
}

.smstext-disable {
  color: #bbb;
}

.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  .panel {
    width: 300px;

    .title {
      font-size: 25px;
      padding: 15px 0;
    }

    .subtitle {
      font-size: 16px;
      color: #aaa;
    }
  }
}
</style>
