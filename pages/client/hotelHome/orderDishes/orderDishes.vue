<template>
	<view class="content">
		<uv-vtabs
			:chain="chain"
			:list="menuList"
			hdHeight="0"
			:height="vtabsHeight"
			@change="change">
			<template v-for="(item,index) in menuList" :key="index">
				<uv-vtabs-item :index="index">
					<view class="item" :key="index2">
						<view class="item-title">
							<text class="text">{{item.name}}</text>
						</view>
						<view class="item-content menuDetail">
							<view v-for="i of item._id['hm-menuDetail']" class="menuDetail-item">

								<view  style="display:flex;align-items:center;">
									<view ><text style="padding-left:15px">{{i.name}}{{vtabsHeight}} {{windowHeight}}</text> </view>
									
								</view>
								<view style="display:flex;align-items:center"> 
									<view class="price-style"><text>￥</text><text>{{i.price}}</text> </view>
									<view class="ad-lose-num flex-center">
										<uni-icons type="minus-filled" size="24" color="orange" @click="loseMenuCount(i)"
											v-if="i.checkCount>0"></uni-icons>
										<text style="padding:0 8px" v-if="i.checkCount>0">{{i.checkCount}}</text>
										<uni-icons type="plus-filled" size="24" color="orange"
											@click="addMenuCount(i)"></uni-icons>
									</view>
								</view>
							</view>

						</view>
					</view>
					<view 
						class="gap"
						v-if="index<list.length-1">
						<uv-gap bg-color="#f1f1f1" height="4"></uv-gap>
					</view>
				</uv-vtabs-item>
			</template>
			<uv-gap bg-color="#fff" height="600"></uv-gap>
		</uv-vtabs>
		<view style="height:60px;position:relative" class="bottom-panal">
			<view class="bottom-panal-detail" v-if="goodsListPanalHeight!='0'" :style="{'height':goodsListPanalHeight}">
				<view style="background:rgba(0,0,0,0.3);flex:1" @click="openGoodsList"></view>
				<view class="list">
					<view class="list-item" v-for="item of checkMenuList">
						<view class="list-item-name">{{item.name}}</view>
						<view class="ad-lose-num flex-center">
							<uni-icons type="minus-filled" size="24" color="orange" @click="loseMenuCount(item)"
								v-if="item.checkCount>0"></uni-icons>
							<text style="padding:0 8px" v-if="item.checkCount>0">{{item.checkCount}}</text>
							<uni-icons type="plus-filled" size="24" color="orange"
								@click="addMenuCount(item)"></uni-icons>
						</view>
					</view>
					<!-- <uni-list>
					<uni-list-item  :title="item.name" v-for="item of checkMenuList">
						
					</uni-list-item>					
				</uni-list> -->
				</view>
			</view>

			<view class="control-area">
				<view class=" btn-l control-area-left" @click="openGoodsList">
					<view style="display:flex;align-items:center">
						<view style="position:relative">
							<uni-icons type="cart-filled" size="30" :color="checMenuCount?'orange':'#616161'">
							</uni-icons>
							<uni-badge :text="checMenuCount" absolute="rightTop"
								style="position:absolute;right:0;top:0"></uni-badge>
						</view>

						<!-- <text style="padding-left:8px" v-if="checMenuCount<1">
						订单为空
					</text> -->
						<!-- <text style="padding-left:8px" v-if="checMenuCount>0">
						已选<text style="color:orange;padding:0 4px">{{ checMenuCount }}</text>道菜
					</text> -->
						<text style="color:red;font-weight:bold;padding-left:12px">￥{{checMenuPriceTotal}}</text>
						<text style="color:orange" v-if="checMenuPriceTotal>0">*（不包含餐具等其它费用）</text>
					</view>
					<!-- <view> 
					
				</view>  -->
				</view>
				<view @click="submit" :class="['order-commit-style', 'btn',checMenuCount<1?'btn-disabled':'']">
					<text>选好了</text>
				</view>

			</view>

		</view>
	</view>
</template>

<script>
import  {HotelService} from '../../../../services/HotelService';
import  {MenuService} from '../../../../services/MenuService';
const getList = [{
	name: 'uv-ui简介',
	childrens: [{
		name: 'uv-ui简介',
		desc: '1. uv-ui最初是在uview2.x的基础上进行改进优化，支持vue3等优化，最重要的是支持单独导入直接使用，无需在main.js中进行配置。\n\n2. uv-ui来源于社区，也回归到社区，正是有一群热爱uni-app生态的同学推着它前行，而我们也一如既往的承诺，uv-ui永久开源，永远免费。但是会在下载处进行广告配置，作为开发团队的研发费用的部分来源，所以希望大家理解。'
	}]
}, {
	name: 'uv-ui特点',
	childrens: [{
		name: '全端兼容',
		desc: 'uv-ui支持App（vue）、App（nvue）、H5、小程序、VUE2、VUE3，支持nvue原生渲染。uv-ui的组件都是多端自适应的，底层会抹平很多小程序平台的差异或bug。'
	}, {
		name: '集成工具',
		desc: 'uv-ui中的uv-ui-tools组件集成了强大的网络请求 HTTP 及常用的工具函数，无需自己再去寻找，并且直接挂载在uni上面，方便使用，只需要在mian.js中引入即可，更多工具请参考：https://www.uvui.cn/js/http.html。使用方式请参考：https://www.uvui.cn/components/setting.html。'
	}, {
		name: '主题扩展',
		desc: 'uv-ui中的uv-ui-tools组件下面的theme.scss为主题文件，直接在uni.scss中引入主题即可，可以根据自己的需求进行扩展。下面也有说明具体使用方式。使用方法请参考：https://www.uvui.cn/components/setting.html'
	}]
}, {
	name: '更新日志',
	badge: {
		show: true,
		value: 5
	},
	childrens: [{
		name: '更新日志',
		desc: 'uv-ui的重大更新在更新日志中都有所说明，如果在开发的过程中遇到文档不完善，可以提供给我们，我们会持续完善，非常感谢大家的支持。更新日志：https://www.uvui.cn/components/changelog.html'
	}]
}, {
	name: '设计规范',
	childrens: [{
		name: '设计规范',
		desc: '为了约束合成更多优秀的组件和模板，打造优质的体验，我们拟定了一些UI界面设计和建议。同时部分之间会有依赖，这是为了减少代码冗余的同时提高开发效率，模块化是我们的基础。如果大家有好的建议，可以提出进行改进。'
	}]
}, {
	name: '交流反馈',
	childrens: [{
		name: '交流反馈',
		desc: 'uv-ui为采用MIT许可证的开源项目，使用完全免费。欢迎加QQ群交流反馈，一起学习，共同进步。QQ群： 549833913'
	}]
}];
	export default {
		props: {
			hotel_id:{
				type:String,
				default:""
			}
		},
		data() {
			return {
				hotel:null,
				mealTypeItems: [
					{
						value: "lunch",
						text: "午餐",
					}, {
						value: "dinner",
						text: "晚餐",
					}
				],
				orderDishesForm: {
					mealDate: '',
					mealDateTimestamp:0,
					mealType: 'dinner',
					userName: "",
					phone: "",
				},
				menuList:[],
				list:getList
			}
		},
		computed:{
			windowHeight() {
				const sys = uni.getSystemInfoSync();
				let h = sys['windowHeight'];
				// #ifdef MP-WEIXIN ||APP-PLUS
				h = uni.getWindowInfo().windowHeight;
				// #endif
				return h;
			},
			vtabsHeight(){
				return this.windowHeight - 70 - 60;
			}
		},
		mounted(){	
			console.log("mounted")		
			this.getData();
			console.log("屏幕高度",uni.getWindowInfo().windowHeight,uni.getSystemInfoSync())
		},
		methods: {
			async getData() {
				if(!this.hotel_id){
					return;
				}
				try {
					//uni.showLoading();
					
					const hotelRes = await HotelService.getHotelInfoById(this.hotel_id);
					const res = await MenuService.getMenuList(this.hotel_id);
					console.log("酒店信息", hotelRes)
					console.log("菜单列表", res)
					this.hotel = hotelRes.result.data[0];
					this.menuList = this.getMenuListFormat(res.result.data);
					console.log("menulist",this.menuList)
					uni.setNavigationBarTitle({
        			title:`【${this.hotel.hotelName}】定餐服务` ,
      				});
					uni.hideLoading();
				} catch (error) {
					console.error(error);
					uni.hideLoading();
					uni.showModal({
						content: "系统异常，请稍候再试！",
						confirmText: "确认",
					});
				}
			},

			getMenuListFormat(menuList = []) {
				try {
					
					let arr = menuList.map(item => {
						item._id['hm-menuDetail'].map(it => {							
							it.checkCount = 0;
							return it;
						});
						item.childrens={
								name:item.name,
								list:item._id['hm-menuDetail']
							}
						
						return item;
					});
					return arr
				} catch (error) {
					console.error(error)
					return []
				}

			},
			addMenuCount(itObj) {
				console.log(itObj)
				this.menuList = this.menuList.map(item => {
					item._id['hm-menuDetail'].map(it => {
						if (it._id == itObj._id) {
							let count = it.checkCount || 0;
							it.checkCount = count + 1;
						}
						return it;
					});
					return item;
				});

			},
			loseMenuCount(itObj) {
				this.menuList = this.menuList.map(item => {
					item._id['hm-menuDetail'].map(it => {
						if (it._id == itObj._id) {
							it.checkCount--;

						}
						return it;
					});
					return item;
				});

			},
			openGoodsList() {
				if (!this.checkMenuList.length) {
					this.goodsListPanalHeight = 0;
					return;
				}
				this.goodsListPanalHeight = this.goodsListPanalHeight == '0' ? 'calc(100vh - 60px)' : 0;
				//this.$refs.goodsItemPopup.open();
			},
			closeGoodsList() {
				//this.goodsListPanalHeight='0'
			},
			 submit() {
				//http://localhost:8080/#/pages/catering/orderDishes/orderDishes?hotel_id=66f4d677e4ec9dbeca1f8ff9
				if(this.checMenuCount<1||this.isLoading){
					return;
				}
				this.$refs.orderDishesRef.validate().then(async (res) => {
					this.isLoading=true;
					//uni.showLoading();
					let orderDishesObj =Object.assign(this.orderDishesForm,{hotel_id:this.hotel_id, checkMenuList:this.checkMenuList})
					console.log(orderDishesObj);
					orderDishesObj.mealDateTimestamp=new Date(orderDishesObj.mealDate).getTime();;
					try {
					const res =	await MenuService.addOrderDishes(orderDishesObj);
					this.isLoading=false;
					uni.hideLoading();
					this.$store.dispatch("getMenuEvent",this.hotel_id);
					if(getCurrentPages().length>1){
						await this.$store.dispatch("getOrderDishesList",this.hotel_id);
						uni.navigateBack();
						return;
					}
					uni.reLaunch({
						url:`/pages/common/success?hotel=${JSON.stringify(this.hotel)}`,
					});
			
					} catch (error) {
						let errobj = JSON.parse(JSON.stringify(error));
						console.log("1111",errobj,errobj.errMsg);
						this.isLoading=false;
						uni.hideLoading();
						const text = errobj.errMsg.includes("exists")?'请不要重复提交':"系统异常，请稍候再试！"
						uni.showModal({
						content: text,
						confirmText: "确认",
					});
					
				}
					
					
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.header {
	padding: 30rpx;
	font-size: 30rpx;
	color: #333;
}
.item {
	padding: 10rpx 20rpx;
	&-title {
		.text {
			font-weight: 700;
			font-size: 32rpx;
			color: #111;
		}
	}
	&-content {
		padding: 20rpx 0;
		.text {
			line-height: 48rpx;
			font-size: 30rpx;
			color: #111;
			/* #ifndef APP-NVUE */
			word-break: break-all;
			/* #endif */
		}
	}
}
.gap {
	padding: 0 30rpx;
}

.menuDetail {
	.menuDetail-item {
		min-height: 40px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 12px 12px 12px;
		font-size: 15px;
		font-weight: 400;

		.price-style {
			color: #ff0000;
			padding: 0 15px;
		}
	}
}

.bottom-panal {

	box-shadow: 0px -1px 4px -4px #000;

	.control-area {
		background-color: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 60px;
		overflow: hidden;
	}

	.bottom-panal-detail {
		display: flex;
		flex-direction: column;
		position: absolute;
		bottom: 60px;
		width: 100%;
		height: 0;
		overflow: hidden;
		;
		transition: all 0.3s linear;
	}

	.control-area-left {
		color: #616161;
		padding-left: 8px;
		cursor: pointer;

		&:hover {
			color: #000;
		}
	}

	.btn {
		display: flex;
		align-items: center;
		padding: 0 8px;
		color: #eee;
		height: 60px;
		font-size: 14px;
		cursor: pointer;
		background-color: orange;

		&:hover {
			color: #fff;
		}
	}

	.btn-disabled {
		background-color: #aeaeae
	}
}

.goodsListPanal {
	width: 100vw;
	background: green;
	height: 0;
	overflow: hidden;
	position: fixed;
	bottom: 60px;
	display: flex;
	flex-direction: column;
	transition: height 0.3s linear;
	.list {
		display: flex;
		flex-direction: column;
		background-color: #fff;
	
		.list-item {
			display: flex;
			height: 40px;
			padding: 0 12px;
			justify-content: space-between;
			align-items: center;
		}
	}
}


</style>
