<template>
  <view class="container">
    <view class="panel">
      <view class="title">欢迎使用 [议宿平台]</view>
      <view class="subtitle">手机号快捷登录/注册</view>
      <view style="height: 80px"></view>
      <uni-forms ref="userForm" :modelValue="userForm" :rules="rules">
        <uni-forms-item name="phone">
          <view class="flex-center input-area">
            <input  type="tel" maxlength="11" v-model="userForm.phone" placeholder="请输入手机号" />       
          </view>
        </uni-forms-item>
        <uni-forms-item name="smsCode">
          <view class="flex-center input-area" > 
            <input  type="number" maxlength="4" v-model="userForm.smsCode" placeholder="请输入验证码" />
            <text @click="getCode" :class="['smstext', sendSmsDisabled ? 'smstext-disable' : '']">{{tips}}</text>
          </view>
          
        </uni-forms-item>
        <uni-forms-item >
          <button  :class="['submit-btn',submitDisabled?'submit-btn-disabled':'']"  :disabled="submitDisabled" @click="submit":loading="submitLoading">登录</button>
        </uni-forms-item> <uni-forms-item >
         <view class="up">
          <uni-icons :type="isAgree?'checkbox-filled':'circle'" @click="agreeEvent" size="20" color="#06c"></uni-icons> <text>我已阅读并同意<text class="edit-text-btn-style ct" @click="openUserAgreement">《用户协议》</text>和<text class="edit-text-btn-style ct" @click="openUserPrivacyPolicy">《隐私政策》</text></text>
        </view>
        </uni-forms-item>
        <!-- <uni-forms-item > <button open-type="getPhoneNumber" @getphonenumber="decryptPhoneNumber">微信登录</button></uni-forms-item> -->
      </uni-forms>
      
      <view style="height: 80px"></view>
    </view>
    <uni-popup ref="popupUserAgreement" background-color="transprant">
			<view class="popup-content">
				<view class="create-order-title-style">用户协议</view>
				<view class="comContent">
					<userAgreement></userAgreement>
				</view>
			</view>
		</uni-popup>
    <uni-popup ref="popupPrivacyPolicy" background-color="transprant">
			<view class="popup-content">
				<view class="create-order-title-style">隐私政策</view>
				<view class="comContent">
					<privacyPolicy></privacyPolicy>
				</view>
			</view>
		</uni-popup>
  </view>
</template>

<script>
import{DB} from "../../api/DB";
import {AccountService} from "../../services/AccountService";
import userAgreement from "../common/userAgreement/userAgreement";
import privacyPolicy from "../common/privacyPolicy/privacyPolicy";
export default {
  components:{
    userAgreement,
    privacyPolicy
  },
  data() {
    return {
      isAgree:false,
      submitLoading: false,
      canGetCode:true,
      tips: "获取验证码",
      userForm: {
        tk: uni.getStorageSync("tk") || "",
        smsCode: "",
        phone: "",
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
  onLoad() {
	  console.log("login onload>>>>");
    uni.hideHomeButton();
  },
  onShow(){
    console.log("login onShow>>>>");
	  // #ifdef H5
				document.getElementsByTagName('uni-page-head')[0].style.display = 'none';
			// #endif
  },
  created(){
    console.log("login created>>>>");
    
  },
  methods: {
    decryptPhoneNumber(e){
      console.log(e)
    },
    agreeEvent(){
      this.isAgree = !this.isAgree;
    },
    openUserAgreement(){
      uni.navigateTo({
        url:'/pages/common/userAgreement/userAgreement'

      })
    },
    openUserPrivacyPolicy(){
      uni.navigateTo({
        url:'/pages/common/privacyPolicy/privacyPolicy'

      })
    },
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
      if(!this.isAgree){
        uni.showToast({
          title:"请先阅读并同意协议",
          icon:"none"
        })
        return;
      }
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
      this.submitLoading=false;
      let userRole =uni.getStorageSync("userRole");
      const eventChannel = this.getOpenerEventChannel();
      eventChannel.emit('loginSuccess');
      
      // if(getCurrentPages().length>1){
        
			// 			uni.navigateBack({
      //         success(){
                
      //         }
      //       });
			// 			return;
			// 		}
         
      // uni.reLaunch({
      //   url: userRole=="hotel"?"/pages/home/home":"/pages_client/client_index/client_index",
      // });
    },
  }
};
</script>

<style lang="scss" scoped>
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
  background:#ED9121;
  border-radius: 22.5px;
  color: #fff!important;
  cursor: pointer;
  
}
.submit-btn-disabled{
  background:#ed912178!important;
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
  background-image: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
  display: flex;
  align-items: center;
  justify-content: center;

  .panel {
    width: 300px;

    .title {
      font-size: 25px;
      padding: 15px 0;
      color: #fff;
    }

    .subtitle {
      font-size: 16px;
      color: #f7f7f7;
    }
  }
}
.up{
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  .ct{
    font-size:12px;
    cursor:pointer
  }
}
</style>
