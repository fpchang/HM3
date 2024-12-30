<template>
	<view class="mobile-show-style">
	
		<view> 
				<!-- <uni-segmented-control :current="current" :values="items"
				active-color="#ED9121" @clickItem="onClickItem" /> -->
				<xt-subsection :items="items" @checkTab="onClickItem" activeBgColor="#ED9121" activeFColor="#fff"></xt-subsection>
				
				
			</view>
			
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
											<!--普通订单待办-->
											<block v-if="updateOrderPermission&&item.orderType=='normal'&&item.orderStatus==0"> 
												<view> 
													<button size="default" type="default" class="btn" @click="receiveOrder(item)">接受</button>
												</view>
												<view> 
													<button size="default" type="default" class="btn btn-red" @click="rejectOrder(item)">拒绝</button>
												</view>	
											</block>
											<!--普通订单待入住-->
											<block v-if="updateOrderPermission&&item.orderType=='normal'&&item.orderStatus==1">
												<!--可撤销后台下的单--> 
												<view>
													<button v-if="item.fromClient" size="default" type="default" class="btn btn-red" @click="deleteOrder(item)">撤销</button>
											
												</view>
											</block>
											<block v-if="updateOrderPermission&&item.orderType=='bargain'&&item.bargainStatus==0"> 
												<view> 
													<button size="default" type="default" class="btn btn-red" @click="receiveBargainOrder(item)">同意</button>
												</view>	
												<view> 
													<button size="default" type="default" class="btn btn-red" @click="rejectBargainOrder(item)">拒绝</button>
												</view>	
											</block>

											
												
										</view>
										
									</view>
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
											<!--普通订单待办-->
											<block v-if="updateOrderPermission&&item.orderType=='normal'&&item.orderStatus==0"> 
												<view> 
													<button size="default" type="default" class="btn" @click="receiveOrder(item)">接受</button>
												</view>
												<view> 
													<button size="default" type="default" class="btn btn-red" @click="rejectOrder(item)">拒绝</button>
												</view>	
											</block>
											<!--普通订单待入住-->
											<block v-if="updateOrderPermission&&item.orderType=='normal'&&item.orderStatus==1">
												<!--可撤销后台下的单--> 
												<view>
													<button v-if="item.fromClient" size="default" type="default" class="btn btn-red" @click="deleteOrder(item)">撤销</button>
											
												</view>
											</block>
											<block v-if="updateOrderPermission&&item.orderType=='bargain'&&item.bargainStatus==0"> 
												<view> 
													<button size="default" type="default" class="btn btn-red" @click="receiveBargainOrder(item)">同意</button>
												</view>	
												<view> 
													<button size="default" type="default" class="btn btn-red" @click="rejectBargainOrder(item)">拒绝</button>
												</view>	
											</block>

											
												
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
			_WHERE(){
				let os='';
				if(this.current==0){//待办1
					const s1="bargainStatus==0&&orderType=='bargain'";//议价单
					const s2="payType=='online'&&payStatus==1&&orderStatus==0";//线上支付订单
					const s3="payType=='offline'&&orderStatus==0";//线下支付订单
					os=`${s1}||${s2}||${s3}`

				}
				if(this.current==1){//待入住
					os="orderStatus==1&&orderType=='normal'";
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
			},
			updateOrderPermission(){
				return this.$store.state.permissionStore.permissionList.includes('ORDER_UPDATE')
			}
		},
		watch:{
			async partialRefreshComName(val){
				//下拉刷新
				if(val=='orderComponent'){
					console.log("局部刷新 orderComponent")
					await this.$store.dispatch("getOrderListTodayAfter",this.hotel_id);
					this.$refs.udb.refresh();
					console.log("刷新完成");
					this.$store.commit("setPartialRefreshComName","");
					uni.hideLoading();
					uni.stopPullDownRefresh();
				}				
			}
		},
		methods: {
			onClickItem(index){
				this.current=index;
			},
			async receiveOrder(item){
				if(!this.$store.state.permissionStore.permissionList.includes('ORDER_UPDATE')){
					alert.alertNoPermisson();
					return;
				}
				const conf = await uni.showModal({
				title: "确认接受此订单",
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
			async receiveBargainOrder(item){
				if(!this.$store.state.permissionStore.permissionList.includes('ORDER_UPDATE')){
					alert.alertNoPermisson();
					return;
				}
				const conf = await uni.showModal({
				title: "确认接受此议价单",
				content: "请核对订单价格",
				cancelText: "取消",
				confirmText: "确认",
			});
			if (conf["cancel"]) {
				return;
			}
			await OrderService.updateOrder(item._id,{bargainStatus:1});
				this.$refs.udb.refresh();
			},
			
			async rejectBargainOrder(item){
				if(!this.$store.state.permissionStore.permissionList.includes('ORDER_UPDATE')){
					alert.alertNoPermisson();
					return;
				}
				const conf = await uni.showModal({
				title: "确认拒绝此订单",
				content: "请核对订单价格",
				cancelText: "取消",
				confirmText: "确认",
			});
			if (conf["cancel"]) {
				return;
			}
				await OrderService.updateOrder(item._id,{bargainStatus:2});
				this.$refs.udb.refresh();
			},
			async rejectOrder(item){
				if(!this.$store.state.permissionStore.permissionList.includes('ORDER_UPDATE')){
					alert.alertNoPermisson();
					return;
				}
				const conf = await uni.showModal({
				title: "确认拒绝此议价单",
				content: "请核对订单价格",
				cancelText: "取消",
				confirmText: "确认",
			});
			if (conf["cancel"]) {
				return;
			}
				await OrderService.updateOrder(item._id,{orderStatus:2});
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
				this.$refs.udb.refresh();
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