<template>
	<view>
		<view class="add-content-style">
			<view class="left-panal">
				<uni-data-checkbox v-model="tabRadioVal" :localdata="tabitems"></uni-data-checkbox>
			</view>
			<view class="control-panal" v-if="tabRadioVal==0">
				<uv-icon name="plus-circle-fill" color="#000" size="22" label="点菜" labelPos="bottom" labelSize="12px"
					@click="addOrderDishes"></uv-icon>
			</view>
			<view class="control-panal" v-if="tabRadioVal==1">
				<uv-icon name="plus-circle-fill" color="#000" size="22" label="添加菜单" labelPos="bottom" labelSize="12px"
					@click="addMenuType"></uv-icon>
				<button class="clearBtn" :plain="true" open-type="share" @click="shareWx">
					<uv-icon name="share-fill" color="#000" size="22" label="分享至客户" labelPos="bottom"
						labelSize="12px"></uv-icon>
				</button>
			</view>
		</view>
		<block v-if="noDataObj.val">
			<noData :text_content="noDataObj.text" :showControl="noDataObj.showControl" text_control_add="创建"
			@Event_one="addMenuType"></noData>
		</block>
		<block v-if="!noDataObj.val">
		 <view style="display: flex; justify-content: center">
			<view class="card-container" :style="{width: `${cardContainerWidth}px`}">
				<view v-if="tabRadioVal==0" class="card" v-for="item of orderDishesList"
					:style="{width: `${cardWidth}px`}">
					<view class="card-item">
						<menuOrderCardComponent :orderDishesItem="item" @getOrderDishesList="getOrderDishesList">
						</menuOrderCardComponent>
					</view>
				</view>
				<view v-if="tabRadioVal==1" class="card" v-for="item of menuList" :style="{width: `${cardWidth}px`}">
					<view class="card-item">
						<menuCardComponent :menuItem="item" @editMenuType="editMenuType"></menuCardComponent>
					</view>
				</view>
			</view>
		</view> 
		<!-- <xt-panal-list :dataList="orderDishesList" v-if="tabRadioVal==0">
			<template v-for="(item,index) of orderDishesList" v-slot:[`card${index}`]>
				<menuOrderCardComponent :orderDishesItem="item" @getOrderDishesList="getOrderDishesList">
				</menuOrderCardComponent>
			</template>
		</xt-panal-list>
		<xt-panal-list :dataList="menuList" v-if="tabRadioVal==1">
			<template v-for="(item,index) of menuList" v-slot:[`card${index}`]>
				<menuCardComponent :menuItem="item" @editMenuType="editMenuType"></menuCardComponent>
			</template>
		</xt-panal-list> -->
	</block>
		<uni-popup ref="popupMenuType" background-color="transprant">
			<view class="popup-content">
				<view class="create-order-title-style">{{
					type==1? "修改菜单分类":"新增菜单分类"
				}}</view>
				<view class="comContent">
					<addMenuTypeComponent @closePopup="closePopup" :type="type" :targetObj="targetObj">
					</addMenuTypeComponent>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import menuCardComponent from "./menuCardComponent.vue";
	import menuOrderCardComponent from "./menuOrderCardComponent.vue";
	import addMenuTypeComponent from "./addMenuTypeComponent.vue";
	import  {MenuService} from "../../../services/MenuService";
	import {alert} from "@/alert";
import XtPanalList from '../../../components/xt-panal-list/xt-panal-list.vue';
	export default {
		name: "menuList",
		components: {
			menuCardComponent,
			addMenuTypeComponent,
			menuOrderCardComponent,
XtPanalList,
		},
		props: {},
		data() {
			return {
				tabRadioVal: 0,
				tabitems: [{
						value: 0,
						text: "订单管理",
					},
					{
						value: 1,
						text: "菜单管理",
					},
				],
				widthTemp: 0,
				type: 0,
				targetObj: {}
			};
		},
		computed: {
			hotel_id() {
				return this.$store.state.hotel_id;
			},
			hotelList() {
				return this.$store.state.hotelList;
			},
			partialRefreshComName(){
				return this.$store.state.partialRefreshComName;
			},
			hotelName() {
				let tar = this.hotelList.find((item) => item._id == this.hotel_id);
				return tar.hotelName;
			},
			orderDishesList(){
				return this.$store.state.menuStore.orderDishesList;
			},
			menuList() {
				return this.$store.state.menuStore.menuList;
			},
			noDataObj(){
				if(this.tabRadioVal==0){
					return {
						text:"无订单数据",
						val:this.orderDishesList&&this.orderDishesList.length<1,
						showControl:false
					}
				}
				return  {
					text:"无菜单数据",
					val:this.menuList&&this.menuList.length<1,
					showControl:true
				};
			},
			isPc() {
				try {
					return (
						uni.getSystemInfoSync().deviceType == "pc" ||
						uni.getDeviceInfo().deviceType == "pc"
					);
				} catch (e) {
					return false;
				}
			},
			viewWidth() {
				return this.$store.state.viewWidth + this.widthTemp - this.widthTemp;
			},

			cardWidth() {
				let windowWidth = this.viewWidth; //-20 为pc端滚动条宽度
				let count = Math.floor(windowWidth / 370);
				if (count == 0) {
					return windowWidth;
				}
				let ys = windowWidth % 370;
				return Math.min(370 + ys / count, 450);
			},
			cardContainerWidth() {
				let count = Math.max(Math.floor(this.viewWidth / this.cardWidth), 1);
				return this.cardWidth * count;
			},
			isPcShow() {
				return this.$store.state.isPcShow;
			},
		},
		watch: {
			hotel_id() {
				this.$store.dispatch("getMenuList", this.hotel_id);
				this.getOrderDishesList();
			},
			tabRadioVal(nval) {
				if (nval == 1) {
					this.$store.dispatch("getMenuList", this.hotel_id);
					return;
				}
				this.getOrderDishesList();
			},
			async partialRefreshComName(val){
				//下拉刷新
				if(val=='menuListComponent'){
					console.log("局部刷新 menuListComponent")
					
					if (this.tabRadioVal == 1) {
						await this.$store.dispatch("getMenuList", this.hotel_id);
						
					}else{
						await this.$store.dispatch("getOrderDishesList",this.hotel_id);
					}
					console.log("刷新完成");
					this.$store.commit("setPartialRefreshComName","");
					uni.hideLoading();
					uni.stopPullDownRefresh();
				}				
			}
		},
		created() {
			
		},
	
		methods: {
			addOrderDishes() {
				try {
					if (this.isPcShow) {
						let href = `#/pages/catering/orderDishes/orderDishes?hotel_id=${this.hotel_id}`;
						window.open(href, "_blank");
						return;
					}

					uni.navigateTo({
						url: `/pages/catering/orderDishes/orderDishes?hotel_id=${this.hotel_id}`,
					});
				} catch (error) {
					uni.navigateTo({
						url: `/pages/catering/orderDishes/orderDishes?hotel_id=${this.hotel_id}`,
					});
				}
			},
			addMenuType(item = {}) {
				if (
					!this.$store.state.permissionStore.permissionList.includes(
						"MENU_CREATE"
					)
				) {
					alert.alertNoPermisson();
					return;
				}
				this.type = 0;
				if (this.$store.state.isPcShow) {
					this.$refs.popupMenuType.open();
					return;
				}

				uni.navigateTo({
					url: `/pages/catering/addMenuType/addMenuType?type=${this.type}`,
				});
			},
			editMenuType(item = {}) {
				if (
					!this.$store.state.permissionStore.permissionList.includes(
						"MENU_UPDATE"
					)
				) {
					alert.alertNoPermisson();
					return;
				}
				this.type = 1;
				this.targetObj = item;
				if (this.$store.state.isPcShow) {
					this.$refs.popupMenuType.open();
					return;
				}
				uni.navigateTo({
					url: `/pages/catering/addMenuType/addMenuType?type=${
          this.type
        }&&targetObj=${JSON.stringify(item)}`,
				});
			},
			closePopup() {
				if (this.$store.state.isPcShow) {
					this.$refs.popupMenuType.close();
					return;
				}
				uni.navigateBack();
			},
			shareWx() {
				let href =
					`${this.$store.state.config.hostName}/index.html#/pages/catering/orderDishes/orderDishes?hotel_id=${this.hotel_id}`;
				// #ifdef H5
				uni.setClipboardData({
					data: href,
					showToast: false,
					success: function() {
						uni.showToast({
							title: "相关链接已复制",
							icon: "success",
						});
					},
				});
				return;
				// #endif

				// #ifdef APP-PLUS
				uni.share({
					provider: "weixin", //分享服务提供商（即weixin|qq|sinaweibo）
					type: 0, //图文
					scene: "WXSceneSession", //provider 为 weixin 时必选 WXSceneSession分享到聊天界面，WXSceneTimeline分享到朋友圈，WXSceneFavorite分享到微信收藏
					title: "民宿点菜", //分享内容的标题
					summary: "点菜内容", //分享内容的摘要
					href: href, //跳转链接，type 为 0 时必选
					//href: `http://localhost:8080/index.html#/pages/catering/orderDishes/orderDishes?hotel_id=${this.hotel_id}`, //跳转链接，type 为 0 时必选
					imageUrl: "", //图片地址，type 为 0、2、5 时必选
					success(res) {
						//成功返回的参数
						console.log(res);
					},
					fail(err) {
						//失败返回的参数
						console.log(err);
					},
				});
				// #endif
			},
			async getOrderDishesList() {
				await this.$store.dispatch("getOrderDishesList",this.hotel_id);
				uni.hideLoading();
			},
		},

		// 组件周期函数--监听组件挂载完毕
		mounted() {
			if (window) {
				window.onresize = () => {
					this.widthTemp = Math.random(10);
				};
			}
			this.getOrderDishesList();
		},
		// 组件周期函数--监听组件数据更新之前
		beforeUpdate() {},
		// 组件周期函数--监听组件数据更新之后
		updated() {},
		// 组件周期函数--监听组件激活(显示)
		activated() {},
		// 组件周期函数--监听组件停用(隐藏)
		deactivated() {},
		// 组件周期函数--监听组件销毁之前
		beforeDestroy() {},
	};
</script>

<style scoped lang="scss">
button {
	border: none !important;
	}
  button::after{
	border:none!important;
  }
	.card-container {
		display: flex;
		flex-wrap: wrap;
		min-width: 370px;

		.card {
			min-width: 370px;
			max-width: 450px;
			padding: 10px;
			box-sizing: border-box;

			.card-item {
				height: 100%;
				box-sizing: border-box;
				background: #fff;
				padding: 10px 20px;
				box-shadow: 0 0 4px 4px #e4e0e0;
				border-radius: 8px;
				color: #646464;
			}
		}
	}
</style>