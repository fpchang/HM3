<template>
	<view class="gather">
		<xt-panal-list count="2">			
			<template  v-slot:[`card0`]>

				<xt-subsection :items="['今天','明天']" @checkTab="changeGatgerTab" activeBgColor="#0765ae" activeFColor="#fff"></xt-subsection>
				<view class="grid-container" v-if="GatgerTab_index==0">
					<view v-for="(it,ind) in showDataListToday" class="grid-item">
						<view class="grid-item-c">
							<view style="display:flex;align-items:center;justify-content:center;flex-direction:column"> 
								<text style="font-weight:bold">{{it.numCount}}</text>
								<text style="color:#a1a1a1">{{it.title}}</text>
							</view>
						</view>
					</view>
					<view v-for="it in 5" class="grid-item" style="height:0;padding-bottom:0">
					</view>
				</view>
				<view class="grid-container" v-if="GatgerTab_index==1">
					<view v-for="(it,ind) in showDataListTommorow" class="grid-item">
						<view class="grid-item-c">
							<view style="display:flex;align-items:center;justify-content:center;flex-direction:column"> 
								<text style="font-weight:bold">{{it.numCount}}</text>
								<text style="color:#a1a1a1">{{it.title}}</text>
							</view>
						</view>
					</view>
					<view v-for="it in 5" class="grid-item" style="height:0;padding-bottom:0">
					</view>
				</view>
			</template>
			 <template  v-slot:[`card1`]>
				<orderChildList></orderChildList>
			</template> 
		</xt-panal-list>
		
	</view>
</template>

<script>
	import gatherCardComponent from './gatherCardComponent.vue';
	import orderChildList from '../../order/components/orderChildList';
	import {
		OrderService
	} from '../../../services/OrderService';
	import {
		MenuService
	} from '../../../services/MenuService';
	import XtSubsection from '../../../components/xt-subsection/xt-subsection.vue';
	export default {
		components: {
			gatherCardComponent,
			XtSubsection,
			orderChildList
		},
		props: {

		},
		data() {
			return {
				testlist:[{}],
				widthTemp: 0,
				GatgerTab_index: 0,
				todayCheckInOrderList: [],
				chartList: [{
					title: "一个月内入住率",

					OrderList: []
				}, {
					title: "今年入住率",

					OrderList: []
				}],
				image: "",
				option: {}

			}
		},

		computed: {
			hotel_id() {
				return this.$store.state.hotel_id;
			},
			hotelList() {
				return this.$store.state.hotelList;
			},
			roomType() {
				return this.$store.state.roomType;
			},
			user() {
				return this.$store.state.user;
			},
			partialRefreshComName() {
				return this.$store.state.partialRefreshComName;
			},
			//今日办理入住的订单
			orderListByCheckInToday() {
				return this.$store.state.orderStore.orderListByCheckInToday;
			},
			//今日退房订单
			orderListByCheckOutToday() {
				return this.$store.state.orderStore.orderListByCheckOutToday;
			},
			//明日办理入住的订单
			orderListByCheckInTommorow() {
				return this.$store.state.orderStore.orderListByCheckInTommorow;
			},
			//明日退房订单
			orderListByCheckOutTommorow() {
				return this.$store.state.orderStore.orderListByCheckOutTommorow;
			},
			orderListByCheckInToday_format() {
				return {
					title: "今日办理入住",
					list: this.orderListByCheckInToday,
					numCount: this.orderListByCheckInToday.length
				}
			},
			//今日住客订单
			orderListToday() {
				return this.$store.state.orderStore.orderListToday;
			},
			//今日住客订单
			orderListTommorow() {
				return this.$store.state.orderStore.orderListTommorow;
			},
			orderListToday_format() {
				let numCount = 0;
				this.orderListToday.map(item => {
					let num = 0;
					item.roomTypeArray.map(it => {
						num += it.count;
					});
					numCount += num;
				})
				return {
					title: "今日入住房间数",
					list: this.orderListToday,
					numCount: numCount
				}
			},
			//今日餐饮订单
			orderDishesToday() {
				return this.$store.state.menuStore.orderDishesToday;
			},
			//明日餐饮订单
			orderDishesTommorow() {
				return this.$store.state.menuStore.orderDishesTommorow;
			},
			orderDishesToday_format() {
				return {
					title: "今日餐饮订单",
					list: this.orderDishesToday,
					numCount: this.orderDishesToday.length,
				}
			},
			dataList() {
				return [this.orderListByCheckInToday_format, this.orderListToday_format, this.orderDishesToday_format]
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
				let count = Math.floor(windowWidth / 320);
				if (count == 0) {
					return windowWidth;
				}
				let ys = windowWidth % 320
				return Math.min(320 + (ys / count), 450)
			},
			cardContainerWidth() {
				let count = Math.max(Math.floor(this.viewWidth / this.cardWidth), 1);
				return this.cardWidth * count
			},
			isPcShow() {
				return this.$store.state.isPcShow;
			},
			roomTypeCount() {
				let count = 0;
				this.roomType.map(item => {
					count += item.count;
				})
				return count;
			},
			//今日信息
			showDataListToday() {
				const c1 = this.getRoomCountFromOrderList(this.orderListByCheckInToday);
				const c2 = this.getRoomCountFromOrderList(this.orderListByCheckOutToday);
				const c3 = this.getRoomCountFromOrderList(this.orderListToday);
				return [{
					numCount: c1,
					title: '入住'
				}, {
					numCount: c2,
					title: '退房'
				}, {
					numCount: c3,
					title: '在住'
				}, {
					numCount:Math.max( this.roomTypeCount - c3,0),
					title: '空房'
				}, {
					numCount: this.orderDishesToday.length,
					title: '餐单'
				}]
			},
			//明日信息
			showDataListTommorow() {
				const c1 = this.getRoomCountFromOrderList(this.orderListByCheckInTommorow);
				const c2 = this.getRoomCountFromOrderList(this.orderListByCheckOutTommorow);
				const c3 = this.getRoomCountFromOrderList(this.orderListTommorow);
				return [{
					numCount: c1,
					title: '入住'
				}, {
					numCount: c2,
					title: '退房'
				}, {
					numCount: c3,
					title: '在住'
				}, {
					numCount:Math.max( this.roomTypeCount - c3,0),
					title: '空房'
				}, {
					numCount: this.orderDishesTommorow.length,
					title: '餐单'
				}]
			}

		},
		watch: {
			async partialRefreshComName(val) {
				//下拉刷新
				if (val == 'gatherComponent') {
					console.log("局部刷新 gather")
					await this.$store.dispatch("getGatherEvent", this.hotel_id);
					await this.$store.dispatch("getMenuEvent",this.hotel_id);
					this.$store.commit("setPartialRefreshComName", "");
					console.log("局部刷新完成")
					uni.hideLoading();
					uni.stopPullDownRefresh();
				}
			},
			hotel_id() {
				this.initData();
			}
		},

		mounted() {
// uni.downloadFile({
//   url: '../../../static/img/社交头像.pdf',
//   success: function (res) {
//     var filePath = res.tempFilePath;
//     uni.openDocument({
//       filePath: filePath,
//       showMenu: true,
//       success: function (res) {
//         console.log('打开文档成功');
//       }
//     });
//   }
// });

			this.option = {
				grid: {
					right: 20
				},
				xAxis: {
					type: 'category',
					data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
				},
				yAxis: {
					type: 'value'
				},
				series: [{
					data: [150, 230, 224, 218, 135, 147, 260],
					type: 'line'
				}]
			}
			this.initData();
		},
		onLoad: function() {
			console.log('gatherComponent Show')
		},
		created() {
			console.log("gathercomponent created;;;;");

		},

		methods: {
			changeGatgerTab(index) {
				this.GatgerTab_index = index;
			},
			async initData() {
				console.log("init data gather")
				this.$store.dispatch("getGatherEvent", this.hotel_id);
				this.$store.dispatch("getMenuEvent",this.hotel_id);
			},
			dayNum(params) {
				return Math.ceil((params[1] - params[0]) / (1000 * 60 * 60 * 24))
			},
			//今日客房数量
			roomNum(it) {
				let num = 0;
				it.roomTypeArray.map(item => {
					num += item.count;
				})
				return num
			},
			//订单列表中计算有多少房间
			getRoomCountFromOrderList(orderList) {
				let numCount = 0;
				orderList.map(item => {
					let num = 0;
					item.roomTypeArray.map(it => {
						num += it.count;
					});
					numCount += num;
				})
				return numCount;
			}

		}
	}
</script>

<style lang="scss" scoped>
	.card-container {
		display: flex;
		flex-wrap: wrap;
		min-width: 320px;

		.card {
			min-width: 320px;
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

			}
		}
	}
	.c-list {
		.c-list-item {
			display: flex;
			justify-content: space-between;
			padding: 8px 10px;
			font-size: 13px;

		}
	}
	.grid-container{
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
		.grid-item{
			width:33.3%;
			height: 0;
			padding-bottom: 33.3%;
			position:relative;
			.grid-item-c{
				position: absolute;
				left: 50%;
				top:50%;
				transform: translate(-50%, -50%);
			}
		}
	}
</style>