<template>
	<view>
		<xt-panal-list :count="3"> 
			<template v-slot:["card0"]>
				<uni-list>
					<!-- <uni-list-item title="意见反馈" link to="/pages/mine/feedback/feedback" ></uni-list-item> -->
					<uni-list-item title="账号安全" link to="/pages/set/accountSafe/accountSafe" @click="onClick($event,1)" ></uni-list-item>
					<uni-list-item title="清除缓存" clickable   @click="clearCache"  ></uni-list-item>
					<uni-list-item title="关于议宿" link to="/pages/set/aboutYisu/aboutYisu" @click="onClick($event,1)" ></uni-list-item>
					
				</uni-list>
			</template>
			<template v-slot:["card2"]>
				<uni-list>
					<uni-list-item  clickable  @click="onClick" >
						<template v-slot:body>
							<view style="text-align:center;flex:1;color:#3b4144" @click="loginOut"> 
								<text class="slot-box slot-text" >退出登录</text>
							</view>
							
						</template>
					</uni-list-item>
				</uni-list>
			</template>
			<template v-slot:["card1"]>
				<uni-list>
					<uni-list-item title="用户协议" link to="/pages/common/userAgreement/userAgreement" ></uni-list-item>
					<uni-list-item title="隐私政策" link to="/pages/common/privacyPolicy/privacyPolicy" @click="onClick($event,1)" ></uni-list-item>
					
				</uni-list>
			</template>
		</xt-panal-list>
	</view>
</template>

<script>
	export default {
  components: {},
  setup(){
	

  },
		data() {
			return {
				
			}
		},
		methods: {
			async loginOut() {
				console.log("loginout")
				const conf = await uni.showModal({
					title: '确认登出',
					content: '是否确认退出登录',
					showCancel: true,
					cancelText: '取消',
					confirmText: '确认'
				});
				if (conf["cancel"]) {
					return;
				}
				this.$store.dispatch("loginOut");
			},
			clearCache(){
				uni.showToast({
					title: '清除成功',
					icon: 'none'
				})
			}
		}
	}
</script>

<style>

</style>
