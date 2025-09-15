<template>
	<view class="orderDishes content">
		<view class="flex-center top-area">
			<view style="background: #fff; padding: 5px; width: 180px">
				<uni-datetime-picker v-model="orderDishesForm.mealDate" type="date" @change="dateConfim">
					<view class="flex-center">
						<uni-icons type="calendar" size="24" color="#60626680"></uni-icons><text :style="{
                color: orderDishesForm.mealDate ? '#313131' : '#60626680',
              }" :start="Date.now()">{{ orderDishesForm.mealDate || "请选择用餐时间" }}</text>
					</view>
				</uni-datetime-picker>
			</view>
			<view>
				<uni-data-checkbox v-model="orderDishesForm.mealType" :localdata="mealTypeItems"></uni-data-checkbox>
			</view>
		</view>
		<uv-vtabs :chain="chain" :list="menuList" hdHeight="44px" :height="vtabsHeight" @change="change">
			<template v-for="(item, index) in menuList" :key="index">
				<uv-vtabs-item :index="index">
					<view class="item" :key="index2">
						<view class="item-title">
							<text class="text">{{ item.name }}</text>
						</view>
						<view class="item-content menuDetail">
              <block v-for="i of item._id['hm-menuDetail']"> 
                <view  class="menuDetail-item">
                  <view class="l">
                    <image
                      :src="i.imgsrc||'https://env-00jxhfhjd231.normal.cloudstatic.cn/HM/images/nofoodImage.png'"
                      style="width: 100px; height: 100px"></image>
                  </view>
                  <view class="r">
                    <view class="r-item"><text style="padding-left: 15px">{{ i.name }}</text></view>
                    <view class="r-item" style="font-size:12px;color:#6464649c;">
                      <text>{{i.mark}}</text></view>
                    <view class="r-item">
                      <view class="price-style"><text>￥</text><text>{{ i.price }}</text>
                      </view>
                      <view class="ad-lose-num flex-center">
                        <uni-icons type="minus-filled" size="24" color="#0765ae"
                          @click="loseMenuCount(i)" v-if="i.checkCount > 0"></uni-icons>
                        <text style="padding: 0 8px" v-if="i.checkCount > 0">{{
                          i.checkCount
                        }}</text>
                        <uni-icons type="plus-filled" size="24" color="#0765ae"
                          @click="addMenuCount(i)"></uni-icons>
                      </view>
                    </view>
                  </view>
                </view>
                <view style="height:1px;background:#eee"></view>
              </block>
							
						</view>
					</view>
					<!-- <view 
						class="gap"
						v-if="index<list.length-1">
						<uv-gap bg-color="#f1f1f1" height="4"></uv-gap>
					</view> -->
				</uv-vtabs-item>
			</template>
			<uv-gap bg-color="#fff" height="600"></uv-gap>
		</uv-vtabs>
		<view style="height: 60px; position: relative" class="bottom-panal">
			<view class="bottom-panal-detail" v-if="goodsListPanalHeight != '0'"
				:style="{ height: goodsListPanalHeight }">
				<view style="background: rgba(0, 0, 0, 0.3); flex: 1" @click="openGoodsList"></view>
				<view class="list">
					<view class="list-item" v-for="item of checkMenuList">
						<view class="list-item-name">{{ item.name }}</view>
						<view class="ad-lose-num flex-center">
							<uni-icons type="minus-filled" size="24" color="#0765ae" @click="loseMenuCount(item)"
								v-if="item.checkCount > 0"></uni-icons>
							<text style="padding: 0 8px" v-if="item.checkCount > 0">{{
                item.checkCount
              }}</text>
							<uni-icons type="plus-filled" size="24" color="#0765ae"
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
				<view class="btn-l control-area-left" @click="openGoodsList">
					<view style="display: flex; align-items: center">
						<view style="position: relative">
							<uni-icons type="cart-filled" size="30" :color="checMenuCount ? '#0765ae' : '#616161'">
							</uni-icons>
							<uni-badge :text="checMenuCount" absolute="rightTop"
								style="position: absolute; right: 0; top: 0"></uni-badge>
						</view>

						<!-- <text style="padding-left:8px" v-if="checMenuCount<1">
						订单为空
					</text> -->
						<!-- <text style="padding-left:8px" v-if="checMenuCount>0">
						已选<text style="color:#0765ae;padding:0 4px">{{ checMenuCount }}</text>道菜
					</text> -->
						<text style="color: red; font-weight: 400; padding-left: 12px">￥{{ checMenuPriceTotal }}</text>
						<text style="color: #0765ae" v-if="checMenuPriceTotal > 0">*（不包含餐具等其它费用）</text>
					</view>
					<!-- <view> 
					
				</view>  -->
				</view>
				<view style="display: flex; min-width: 103px">
					<view @click="openOrderDishesList" class="order-commit-style btn btn-normal">
						<text>订单</text>
					</view>
					<view @click="submit" :class="[
              'order-commit-style',
              'btn',
              checMenuCount < 1 ? 'btn-disabled' : '',
            ]">
						<text>选好了</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		HotelService
	} from "@/services/HotelService";
	import {
		MenuService
	} from "@/services/MenuService";

	export default {
		props: {
			hotel_id: {
				type: String,
				default: "",
			},
		},
		data() {
			return {
				hotel: null,
				mealTypeItems: [{
						value: "lunch",
						text: "午餐",
					},
					{
						value: "dinner",
						text: "晚餐",
					},
				],
				goodsListPanalHeight: 0,
				orderDishesForm: {
					mealDate: "",
					mealDateTimestamp: 0,
					mealType: "dinner",
					userName: "",
					phone: "",
				},
				menuList: [],
			};
		},
		computed: {
			windowHeight() {
				const sys = uni.getSystemInfoSync();
				let h = sys["windowHeight"];
				// #ifdef MP-WEIXIN ||APP-PLUS
				h = uni.getWindowInfo().windowHeight;
				// #endif
				return h;
			},
			vtabsHeight() {
				//#ifdef H5
				return this.windowHeight - 70 - 60;
				//#endif
				return this.windowHeight - 70 - 60 - 44;
			},
			user() {
				return this.$store.state.user;
			},
			checkMenuList() {
				let resultArray = [];
				this.menuList.map((item) => {
					let arr = item._id["hm-menuDetail"].filter((it) => it.checkCount > 0);
					if (arr.length) {
						resultArray.push(arr);
					}
					return item;
				});
				return resultArray.flat();
			},
			checMenuCount() {
				if (!this.checkMenuList.length) {
					return 0;
				}
				let count = 0;
				this.checkMenuList.map((item) => {
					count += item.checkCount;
				});
				return count;
			},
			checMenuPriceTotal() {
				if (!this.checkMenuList.length) {
					return 0;
				}
				let priceTotal = 0;
				this.checkMenuList.map((item) => {
					priceTotal += item.checkCount * item.price;
				});
				return priceTotal;
			},
		},
		watch: {
			checMenuCount(newval) {
				if (newval < 1) {
					this.goodsListPanalHeight = 0;
				}
			},
		},
		mounted() {
			//console.log("hotel", this.hotel);
			this.getData();
		},
		methods: {
			async getData() {
				if (!this.hotel_id) {
					return;
				}
				try {
					//uni.showLoading();

					const hotelRes = await HotelService.getHotelInfoById(this.hotel_id);
					const res = await MenuService.getMenuList(this.hotel_id);
					//console.log("酒店信息", hotelRes);
					//console.log("菜单列表", res);
					this.hotel = hotelRes.result.data[0];
					this.menuList = this.getMenuListFormat(res.result.data);
					//console.log("menulist", this.menuList);

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
			//重选
			resetMenuList() {
				for (let i = 0; i < this.menuList.length; i++) {
					for (let j = 0; j < this.menuList[i]._id["hm-menuDetail"].length; j++) {
						this.menuList[i]._id["hm-menuDetail"][j].checkCount == 0;
					}
				}
			},
			async openOrderDishesList() {
				if (!this.user) {
					await this.$store.dispatch("loginEvent");
					uni.redirectTo({
							url: `/pages_client/orderDishesList/orderDishesList?hotel_id=${this.hotel_id}`,
						});
					return;
				}
				uni.navigateTo({
					url: `/pages_client/orderDishesList/orderDishesList?hotel_id=${this.hotel_id}`,
				});
			},
			getMenuListFormat(menuList = []) {
				try {
					let arr = menuList.map((item) => {
						item._id["hm-menuDetail"].map((it) => {
							it.checkCount = 0;
							return it;
						});
						item.childrens = {
							name: item.name,
							list: item._id["hm-menuDetail"],
						};

						return item;
					});
					return arr;
				} catch (error) {
					console.error(error);
					return [];
				}
			},
			addMenuCount(itObj) {
				//console.log(itObj);
				this.menuList = this.menuList.map((item) => {
					item._id["hm-menuDetail"].map((it) => {
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
				this.menuList = this.menuList.map((item) => {
					item._id["hm-menuDetail"].map((it) => {
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
				this.goodsListPanalHeight =
					this.goodsListPanalHeight == "0" ? "calc(100vh - 60px)" : 0;
				//this.$refs.goodsItemPopup.open();
				//console.log(this.goodsListPanalHeight);
			},
			closeGoodsList() {
				//this.goodsListPanalHeight='0'
			},

			async submit() {
				if (this.checMenuCount < 1 || this.isLoading) {
					return;
				}
				if (!this.orderDishesForm.mealDate) {
					uni.showToast({
						title: "请选择用餐日期",
						icon: "none",
					});
					return;
				}
				const f = async () => {
					this.isLoading = true;
					//uni.showLoading();
					let orderDishesObj = Object.assign(this.orderDishesForm, {
						phone: this.user.phone,
						userName: this.user.userName,
						hotel_id: this.hotel._id,
						checkMenuList: this.checkMenuList,
					});
					//console.log(orderDishesObj, this.user);
					orderDishesObj.mealDateTimestamp = new Date(
						orderDishesObj.mealDate
					).getTime();
					try {
						const res = await MenuService.addOrderDishes(orderDishesObj);
						this.isLoading = false;
						this.resetMenuList();
						this.openOrderDishesList();
						uni.hideLoading();
					} catch (error) {
						let errobj = JSON.parse(JSON.stringify(error));
						this.isLoading = false;
						uni.hideLoading();
						const text = errobj.errMsg.includes("exists") ?
							"请不要重复提交" :
							"请确认是否已经下单！";
						uni.showModal({
							content: text,
							confirmText: "确认",
						});
					}
				};
				if (!this.user) {
					await this.$store.dispatch("loginEvent");
					f && f();
					return;
				}

				f && f();
			},
		},
	};
</script>

<style lang="scss" scoped>
	$showWidth: 800px;

	.orderDishes {
		width: $showWidth;
		max-width: 100vw;
		margin: auto;

		.top-area {
			height: 44px;
			display: flex;
			justify-content: space-between;
			background-color: #f3f4f6;
		}
	}

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
			align-items: stretch;
			justify-content: space-between;
			padding: 24px 12px 24px 12px;
			font-size: 15px;
			font-weight: 400;
			color: #646464;

			.l {
				display: flex;
				align-items: center;

			}

			.r {
				display: flex;
				flex: 1;
				flex-direction: column;
				justify-content: space-between;

				.r-item {
					display: flex;
					align-items: center;
					justify-content: flex-end;

				}
			}

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
			background-color: #0765ae;

			&:hover {
				color: #fff;
			}
		}

		.btn-normal {
			background-color: #fff;
			color: #0765ae;

			&:hover {
				color: rgb(1, 96, 190);
			}
		}

		.btn-disabled {
			background-color: #aeaeae;
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
	}

	.list {
		display: flex;
		flex-direction: column;
		background-color: #fff;

		.list-item {
			display: flex;
			padding: 20px 12px;
			justify-content: space-between;
			align-items: center;
		}
	}
</style>