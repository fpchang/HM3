<template>
	<view class="mine">
		<view class="card-list">
			<view class="card" style="padding: 15px">
				<view style="display:flex;">
					<view class="flex-center">
						<uni-icons  fontFamily="iconfont" size="60">	
							{{ '&#xe62c;'}}				
						 </uni-icons>
						
					</view>
					<view class="flx-column name-style" style="flex:1">
						<view class="flex-left"> 
							<text style="padding:4px 8px;min-width:100px;cursor:pointer" @click="openNameUpdate">{{user.userName|| '--'}}</text>
							<uni-icons type="forward"></uni-icons>
						</view>
						
						<text style="padding:4px 8px">{{user.phone}}</text>

					</view>
				</view>
				<view>
				</view>

			</view>
			<view class="card">
		<view class="menu-list">
					<view class="menu-list-item" v-for="item in menuList" @click="menuEvent(item.key)">
						<view class="icon-area flex-center">
							 <uni-icons  fontFamily="iconfont" size="24">	
								{{ item.unicode }}				
							 </uni-icons>
						</view>
						<view class="content-area">
							<text>{{item.title}}</text>
							<uni-icons v-if="item.showArrow" type="forward" size="22"></uni-icons>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="t"> 
			<xt-panal-list count="1">

				<!-- #ifdef MP -->
				<view v-for="(item,index) of [1]" slot="card{{index}}">


				</view>
				<!-- #endif -->
				<!-- #ifdef H5 || APP-PLUS -->
				<template v-for="(item,index) of [1]" v-slot:[`card${index}`]>
					<view>
						<view><text>收藏</text></view>
						<view><text>订单</text></view>
						<view><text>收藏</text></view>
					</view>
				</template>
				<!-- #endif -->


			</xt-panal-list>
		</view>
		<view class="flex-center"> 
			<text style="padding:10px;color:#ececec">浙ICP备2024130639号</text>
		</view>
		
		<uni-popup ref="nameDialog" type="dialog">
			<uni-popup-dialog ref="inputClose" before-close  mode="input" title="更改名称" value=""
				placeholder="请输入名称" @close="closeNameUpdate" @confirm="submitNameUpdate"></uni-popup-dialog>
		</uni-popup>
		<uni-pay ref="pay"></uni-pay>
	</view>
</template>

<script>
	import recharge from "@/pages/mine/recharge/rechargeComponent";
	import feedback from "./feedback/feedback";
	import  {AccountService} from "../../services/AccountService";
	export default {
		components: {
			feedback,
			recharge
		},
		data() {
			return {
				avatar: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png',
				menuList: [
					{
						key: "instructions",
						unicode: "\ue8cc",
						title: "使用说明",
						showArrow: true
					},
					
					{
						key: "feedback",
						unicode: '\ue6c0',
						title: "意见反馈",
						showArrow: true
					},
					{
						key: "loginOut",
						unicode: "\ue625",
						title: "退出登录",
						showArrow: true
					}
				]
			}
		},
		computed: {
			isPcShow() {
				return this.$store.state.isPcShow;
			},
			hotel_id() {
				return this.$store.state.hotel_id;
			},
			user() {
				//return uni.getStorageSync("user");
				return this.$store.state.user||uni.getStorageSync("user");
			}
		},
		onShow() {
		},
		created() {
			
		},
		async onPullDownRefresh() {
			console.log("mine  refrush");
			await this.$store.dispatch("getUser");
			uni.stopPullDownRefresh();			
		},
		methods: {
			login() {
				uni.navigateTo({
					url: "/uni_modules/uni-id-pages/pages/login/login-smscode?phoneNumber=18516285834"

				})
			},
			vipDate(d){
				if(!d){
					return '--';
				}
				return new Date(Number(d)).Format("yyyy-MM-dd");
			},
			closeNameUpdate(){
				this.$refs.nameDialog.close()
			},
			openNameUpdate(){
				this.$refs.nameDialog.open()
			},
			async submitNameUpdate(val){
				console.log(val)
				if(!val){
					return;
				}
				uni.showLoading();
				try {
					const res = await AccountService.updateUserName(this.user._id,val);
					
				console.log("修改成功");
				this.closeNameUpdate();
				uni.hideLoading();
				uni.showToast({title:"修改成功",icon:"success"})
				} catch (error) {
					console.log("修改失败",error);
					uni.hideLoading();
					uni.showToast({title:"修改失败",icon:"error"})
				}
				await this.$store.dispatch("getUser");

			},
			menuEvent(key) {
				switch (key) {
					case "instructions":
					if (this.isPcShow) {
							uni.$emit("closeRightDrawer");
							uni.$emit("showPopupPivot","popupInstructions",1);
							break;
						}
						uni.navigateTo({
							url: `/pages/mine/instructions/instructions`
						});
					break;
					case "loginOut":
						this.loginOut();
						break;
					case "feedback":
						if (this.isPcShow) {
							uni.$emit("closeRightDrawer");
							uni.$emit("showPopupPivot","popupFeedback",1);
							break;
						}
						uni.navigateTo({
							url: `/pages/mine/feedback/feedback`
						});
						break;
					case "recharge":
						if (this.isPcShow) {
							uni.$emit("closeRightDrawer");
							uni.$emit("showPopupPivot","popupRecharge",1);
							break;
						}
						// uni.navigateTo({
						// 	url: `/pages/mine/recharge/recharge`
						// });
						this.$refs.popupRecharge.open();
						break;

				}
				
			},
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
		
		
		}
	}
</script>

<style lang="scss">
.mine{
	height: 100vh;
	display: flex;
	flex-direction: column;
}
	.card-list {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 15px;
		box-sizing: border-box;

		.card {
			box-sizing: border-box;
			background: #fff;
			padding: 0 15px;
			box-shadow: 0 0 6px 0px #e4e0e0;
			border-radius: 8px;
			margin-bottom: 15px;
			display: flex;
			flex-direction: column;

			.name-style {
				color: #909399;
			}
		}
	}

	.menu-list {
		.menu-list-item {
			min-height: 44px;
			display: flex;
			justify-content: space-between;

			.icon-area {
				padding-right: 12px;

			}

			.content-area {
				display: flex;
				flex: 1;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1px solid #d5d4d4;
				box-sizing: border-box;
				font-size: 14px;

			}

			&:last-child {
				.content-area {
					border-width: 0;
				}
			}
		}
	}

	.vip-style {
		font-size: 13px;
	}
	@font-face {
		font-family: 'iconfont';  /* Project id 4630870 */
		src: url('../../static/iconfont.ttf')
	}
 
</style>