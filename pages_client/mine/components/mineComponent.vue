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

			</view>
			<view class="card">
				<!-- <uni-list>
				<uni-list-item title="使用说明书" showArrow></uni-list-item>
				<uni-list-item title="注销" showArrow @click="loginOut"></uni-list-item>
				<navigator url="/pages/mine/feedback/feedback">
					<uni-list-item title="意见反馈" showArrow></uni-list-item>
				</navigator>
				
			</uni-list> -->
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
			<view class="t" style="height:400px"> 
				<xt-panal-list :count="2">			
					<template  v-slot:["card0"]>
						<view class="menu-card">
							<view class="menu-card-list"> 
								<navigator url="/pages_client/mine/collect/collect">
					
								<view  class="menu-card-list-item">
																		
									<unicloud-db
									v-slot:default="{ data, loading, error, options }"
									field="_id"
									collection="hm-collect"
									:where="`phone=='${user.phone}'`"

								  >
							
								  <text>{{data.length}}</text>
								</unicloud-db>								
								<text>收藏</text>
								
									
								</view>
							</navigator>
								<view  class="menu-card-list-item">
									<text>0</text>
									<text>浏览历史</text>
								</view>
								
							</view>
							
						</view>
					</template>
					<template  v-slot:["card1"] v-if="user">
						<view class="menu-card">
							<view class="menu-card-list"> 
								<view  class="menu-card-list-item" @click="toOrder('all')">
									<text><uv-icon name="order" color="#a1a1a1" size="28"></uv-icon></text>
									<text>全部订单</text>
								</view>
								<!-- <view  class="menu-card-list-item" @click="toOrder('pay')">
									<text><uv-icon name="red-packet" color="#a1a1a1" size="28"></uv-icon></text>
									<text>待付款</text>
								</view> -->
								<view  class="menu-card-list-item" @click="toOrder('in')">
									<text><uv-icon name="empty-favor" color="#a1a1a1" size="28"></uv-icon></text>
									<text>待入住</text>
								</view>
								
							</view>
							
						</view>
					</template>
					
	
	
				</xt-panal-list>
			</view>
		</view>
		
		<view class="flex-center"> 
			<text style="padding:10px;color:#ececec">浙ICP备2024130639号</text>
		</view>
		
		<uni-popup ref="nameDialog" type="dialog" :change="change">
			<uni-popup-dialog ref="inputClose" before-close  mode="input" title="更改名称" value=""
				placeholder="请输入名称" @close="closeNameUpdate" @confirm="submitNameUpdate"></uni-popup-dialog>
		
			</uni-popup>
		<!-- <uni-pay ref="pay"></uni-pay> -->
		<uni-popup ref="popupRecharge" background-color="#fff" type="bottom">
			<view class="popup-content">
				<view class="create-order-title-style">充值中心</view>
				<view class="comContent">
				
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>

	import  {AccountService} from "@/services/AccountService";
	export default {
		components: {

		},
		setup(){
			
		},
		data() {
			return {
				showPopup:false,
				avatar: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png',
				menuList: [
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
				return this.$store.state.user;
			}
		},
		onShow() {
		},
		created() {			
		},
	
		async onPullDownRefresh() {
			console.log("mine  refrush");
			//await this.$store.dispatch("getUser");
			uni.stopPullDownRefresh();			
		},
		methods: {
			change(e){
				console.log(e)
			},
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
				this.showPopup=false;
				this.$refs.nameDialog.close()
			},
			openNameUpdate(){
				this.showPopup=true;
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
					case "loginOut":
						this.loginOut();
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
		   toOrder(type){			
			
			uni.navigateTo({
				url:`/pages_client/order/orderList/orderList?type=${type}`
			})
		   }
		
		}
	}
</script>

<style lang="scss" scoped>

.mine{
	height: 100vh;
	display: flex;
	flex-direction: column;
}
.menu-card{
	padding:20px;
	box-sizing: border-box;
	.menu-card-list{
		display: flex;
		align-items: center;
		justify-content: space-around;
		.menu-card-list-item{
			display: flex;
			flex-direction: column;
			gap: 8px;
			align-items: center;
			color: #a1a1a1;
			cursor: pointer;
		}
	}
}
	.card-list {
		flex: 1;
		display: flex;
		flex-direction: column;
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