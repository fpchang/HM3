<template>
	<view class="mobile-show-style" style="max-width: 850px;margin:auto">
	
			<!-- <uni-collapse v-model="accordionVal" >
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
									
								
								</view>
							</view>
						</view>
	
					</view>
				</uni-collapse-item>
	
			</uni-collapse> -->
			<uni-segmented-control :current="current" :values="items"
			active-color="#ED9121" @clickItem="onClickItem" />
			<view>
				<unicloud-db ref="udb" v-slot:default="{data, loading, error, options}" :collection="colList" 
						   orderby="createTime desc" >
						 <block v-if="!loading&&data.length<1"> 
							<view><noData></noData></view>
						 </block>
						 <block v-if="data.length>0"> 
							<xt-panal-list :dataList="data">

								<!-- #ifdef MP -->
								<view v-for="(item,index) of data" slot="card{{index}}">
					
					
								</view>
								<!-- #endif -->
								<!-- #ifdef H5 || APP-PLUS -->
								<template v-for="(item,index) of data" v-slot:[`card${index}`]>
									<view class="p-card">
										
										<view class="title">
											<text>{{item.orderType=='bargain'?'议价单':'普通订单'}}</text>
										</view>
										<view class="header">
											<view><text>{{item.userName}}</text></view>
											
										</view>
										<view class="info">
											<text>{{formatDateLabel(item.checkInStartDate)}}至{{formatDateLabel(item.checkInEndDate)}}</text>
											<text style="padding:0 15px">{{item.roomTypeArray.length}}间{{dayNum([item.checkInStartDateTimeStamp,item.checkInEndDateTimeStamp])}}晚</text><text>{{item.roomTypeArray[0].name}}</text>
										</view>
										<view class="price">
											<text v-if="item.payType=='online'">在线支付</text>
											<text v-if="item.payType=='offline'">到店支付</text>
											<text>￥{{item.totalAmount}}</text>
										</view>
										<view class="control-area">
											<view v-if="item.orderStatus==0"> 
												<button size="default" type="default" class="btn" @click="receiveOrder(item)">接受</button>
											</view>	
											<view v-if="item.orderStatus==2"> 
												<button size="default" type="default" class="btn btn-red" @click="agreenOrder(item)">同意</button>
											</view>	
											<view v-if="item.orderStatus==2"> 
												<button size="default" type="default" class="btn btn-red" @click="rejectOrder(item)">拒绝</button>
											</view>	
												
										</view>
										
									</view>
								</template>
								<!-- #endif -->
					
					
							</xt-panal-list>
						 </block>
		
	</unicloud-db>
			</view>
	
		
	</view>
</template>

<script>
	import  {OrderService} from "../../../services/OrderService";
	import {alert} from "@/alert";
	export default {
		data() {
			return {
				accordionVal:1,
				current:0,
				items: ['待处理', '待入住']
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
			hotel(){
				return this.$store.state.hotel;
			},
			_WHERE(){//待办1
				let os='';
				if(this.current==0){
					os='(orderStatus==0||orderStatus==2)';
				}
				if(this.current==1){
					os='orderStatus==1';
				}
				return `hotel_id=='${this.hotel_id}'&&${os}&&checkInStartDateTimeStamp>${Date.now()-1000*60*60*10}`
			},
			user(){
				return this.$store.state.user;
			},
			colList(){
				const db = uniCloud.database();
				return [
          		db.collection('hm-order').where(this._WHERE).getTemp(),
          		db.collection('hm-hotel').field("_id,hotelName,hotelAddress").getTemp()
			  ]
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
			onClickItem(e){
				console.log(e)
				this.current=e.currentIndex;
			},
			async receiveOrder(item){
				const conf = await uni.showModal({
				title: "确认接受此议价单",
				content: "请核对订单价格",
				cancelText: "取消",
				confirmText: "确认",
			});
			if (conf["cancel"]) {
				return;
			}
			await OrderService.updateOrder(item._id,{orderStatus:1});
			this.$refs.udb.refresh();
			},
			//议价单同意
			async agreenOrder(item){
				const conf = await uni.showModal({
				title: "确认接受此议价单",
				content: "请核对订单价格",
				cancelText: "取消",
				confirmText: "确认",
			});
			if (conf["cancel"]) {
				return;
			}
				await OrderService.updateOrder(item._id,{orderStatus:0});
				this.$refs.udb.refresh();
			},
			async rejectOrder(item){
				const conf = await uni.showModal({
				title: "确认拒绝此议价单",
				content: "请核对订单价格",
				cancelText: "取消",
				confirmText: "确认",
			});
			if (conf["cancel"]) {
				return;
			}
				await OrderService.updateOrder(item._id,{orderStatus:3});
				this.$refs.udb.refresh();
			},
			 formatDateLabel(d){
				return new Date(d).Format("MM-dd")
			},
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

		.p-card{
			padding:15px;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			gap:8px;
			color:#a1a1a1;
			.header{
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
			.title{
				font-weight: bold;
				font-size: 18px;
				color:#1a1a1a;
			}
			.control-area{
				display: flex;
				align-items: center;
				justify-content: flex-end;
				gap:10px;
				.btn{
					background-color: #ED9121;
					color:#fff;
					width: 86px;
					height: 40px;
					font-size: 13px;
					display: flex;
					align-items: center;
					justify-content: center;
					border-top-left-radius:37%;
					border-bottom-right-radius:37%;
					text-overflow: clip;
				}
				.btn-red{
					background-color: #B33F22;
				}
			}
		
		}
</style>