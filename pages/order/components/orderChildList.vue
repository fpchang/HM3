<template>
	<view class="mobile-show-style" style="max-width: 850px;">
		<block v-if="noData">
			<noData text_content="当前无订单数据"></noData>
		</block>
		<block v-if="!noData">
			<uni-collapse v-model="accordionVal" >
				<uni-collapse-item v-for="item of checkInOrderList">
					<template v-slot:title>
						<uni-section class="mb-10" :title=" item.userName " :sub-title="formatDateTitle(item)">
							<template v-slot:right>
								<text style="font-weight: bold;">{{item.roomTypeArray.length}}间-</text>
								<text style="font-weight: bold;">{{dayNum([item.checkInStartDateTimeStamp,item.checkInEndDateTimeStamp])}}天</text>
							</template>
						</uni-section>
					</template>
					<view class="col-content">
						<view class="list">
							
							<view class="list-item">
								<view class="list-item-c"><text>定单来源：</text><text>{{item.orderSouce_Zn}}</text></view>
								
							</view>
							<view class="list-item">
								<view class="list-item-c"><text>入住日期：</text><text>{{item.checkInStartDate}}</text></view>
								
							</view>
							<view  class="list-item">
								<view class="list-item-c"><text>退房日期：</text><text>{{item.checkInEndDate}}</text></view>
							</view>
							<view class="list-item">
								<view class="list-item-c"><text>创建人：</text><text>{{item.createrPhone}}【{{item.createrName || "--"}}】</text></view>
								
							</view>
							<view  class="list-item">
								<view class="list-item-c"><text>创建日期：</text><text>{{new Date(item.createTime).Format("yyyy/MM/dd HH:mm:ss")}}</text></view>
							</view>
							<view class="list-item">
								<view class="list-item-c"><text>房型：</text><text v-for="it of item.roomTypeArray">【{{it.name}}】* <text
									:class="[it.count>1?'strongText':'']">{{it.count}}</text></text></view>
								
							</view>
							<view class="list-item">
								<view class="list-item-c"><text>定金：</text><text class="num-style">{{item.downPayment}}</text>元</view>
								
							</view>
							<view class="list-item">
								<view class="list-item-c"><text>总金额：</text><text class="num-style">{{item.totalAmount}}</text>元</view>
								
							</view>
							<view class="list-item">
								<view class="list-item-c"><text>欠款：</text><text class="num-style" :style="{color:item.totalAmount - item.downPayment>0?'#e64340':''}">{{item.totalAmount - item.downPayment}}</text>元</view>
								
							</view>
							<view class="list-item" style="justify-content:flex-end">
								<view class="list-item-c">
									<uv-icon
				   name="trash-fill"
				   color="#e64340"
				   labelColor="#e64340"
				   size="22"
				   label="撤消订单"
				   labelPos="bottom"
				   labelSize="12px"
				   @click="deleteOrder(item)"
				 ></uv-icon>
									 <!-- <button class="uni-button" size="mini" type="warn"
									@click="deleteOrder(item)">撤消订单</button> -->
								
								</view>
							</view>
						</view>
	
					</view>
				</uni-collapse-item>
	
			</uni-collapse>
		</block>
		
	</view>
</template>

<script>
	import  {OrderService} from "../../../services/OrderService";
	import {alert} from "@/alert";
	export default {
		data() {
			return {
				accordionVal: '0'
			}
		},
		onLoad() {
			
		},
		created() {
			this.getOrderList();
		},
		computed:{
			hotel_id(){
				return this.$store.state.hotel_id;
			},
			partialRefreshComName(){
				return this.$store.state.partialRefreshComName;
			},
			checkInOrderList(){
				return this.$store.state.orderStore.orderListTodayAfter ||[];
			},
			noData(){
				return this.checkInOrderList&&this.checkInOrderList.length<1;
			}
		},
		watch:{
			async partialRefreshComName(val){
				//下拉刷新
				if(val=='orderComponent'){
					console.log("局部刷新 orderComponent")
					await this.$store.dispatch("getOrderListTodayAfter",this.hotel_id);
					console.log("刷新完成");
					this.$store.commit("setPartialRefreshComName","");
					uni.hideLoading();
					uni.stopPullDownRefresh();
				}				
			}
		},
		methods: {
			formatDateTitle(item) {
				return `${new Date(item.checkInStartDateTimeStamp).Format("MM-dd")}~${new Date(item.checkInEndDateTimeStamp).Format("MM-dd")}`;
			},
			dayNum(params) {
				return Math.ceil((params[1] - params[0]) / (1000 * 60 * 60 * 24))
			},
			async getOrderList() {
				//uni.showLoading();
				try {
					await  this.$store.dispatch("getOrderListTodayAfter",this.hotel_id);
				} catch (error) {
					
				}
				uni.hideLoading();
			},
			async deleteOrder(item) {
				if(!this.$store.state.permissionStore.permissionList.includes('ORDER_DELETE')){
					alert.alertNoPermisson();
					return;
				}
				let _id = item._id;
				const conf = await uni.showModal({
					title: '确认取消订单',
					content: '取消后将无法恢复,需要重新创建订单',
					cancelText: '取消',
					confirmText: '确认'
				})
				if (conf['cancel']) {
					return;
				}
				//uni.showLoading();
				const res = await uniCloud.callFunction({
					name: 'hm-deleteOrder',
					data: {
						_id
					}
				});
				uni.hideLoading();
				if (res.result.code == 0) {
					uni.showToast({
						title: '取消成功'
					});
				}
				this.getOrderList();
			}
		}
	}
</script>

<style lang="scss">
	.col-content {
		/* background: linear-gradient(to bottom, #FFF, #EEF); */
		border-radius: 4px;
		padding: 0 20px;

		.list {
			display: flex;
			flex-direction: column;

			.list-item {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				padding: 10px 0;

				.list-item-c {
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: $uni-font-size-base;
				}
			}
		}
	}

	.wrap {
		padding: 12px;
	}

	.demo-layout {
		height: 50px;
		border-radius: 4px;
	}
	.num-style{
		padding-right: 8px;
		font-weight: bold;
	}
	/* .bg-purple {
	        background: #CED7E1;
	    }
	
	    .bg-purple-light {
	        background: #e5e9f2;
	    }
	
	    .bg-purple-dark {
	        background: #99a9bf;
	    } */
</style>