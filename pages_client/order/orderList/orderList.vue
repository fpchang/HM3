<template>
	<view class="orderList">
		
		<unicloud-db ref="udb" v-slot:default="{data, loading, error, options}" :collection="colList"
						 :getone="false" :where="_WHERE" orderby="createTime desc">
						 {{ console.log("订单",data) }}
						 <block v-if="!loading&&data.length<1"> 
							<view><noData></noData></view>
						 </block>
						 <block v-if="data.length>0"> 
							<xt-panal-list :count="data.length">

								<!-- #ifdef MP -->
								<view v-for="(item,index) of data" slot="card{{index}}">
									<view class="p-card">
										
										<view class="title">
											<text>{{item.hotel_id[0].hotelName}}</text>
										</view>
										<view class="header">
											<view><text>{{item.userName}}</text></view>
											<view><text>{{formatOrderStatus(item)}}</text></view>
										</view>
										<view class="address">
											<text>{{item.hotel_id[0].hotelAddress}}</text>
										</view>
										<view class="info">
											<text>{{formatDateLabel(item.checkInStartDate)}}至{{formatDateLabel(item.checkInEndDate)}}</text><text style="padding:0 15px"><text>{{item.roomTypeArray.length}}</text>间{{dayNum([item.checkInStartDateTimeStamp,item.checkInEndDateTimeStamp])}}晚</text><text>大床房</text>
										</view>
										<view class="price">
											<text v-if="item.payType=='online'">在线支付</text>
											<text v-if="item.payType=='offline'">到店支付</text>
											<text>￥{{item.totalAmount}}</text>
										</view>
										<view> 
											
										</view>
										<!--议价单同意-->
							
										<view v-if="item.orderType=='bargain'&&item.orderStatus==4" class="pay-area"> 
											<view v-if="item.hotel_id[0].payType=='online'"> 
												<button size="default" type="default" class="btn" @click="payEvent">立即支付</button>
											</view>	
											<view  v-if="item.hotel_id[0].payType!='online'"> 
												<button size="default" type="default" class="btn" @click="confirmOrder(item)">确认</button>
											</view>	
											<view> 
												<button size="default" type="default" class="btn btn-red" @click="cancelOrder(item)">取消订单</button>
											</view>	
											
										</view>
										<!--普通单等待支付-->
										<view v-if="item.orderType=='normal'&&item.orderStatus==5" class="pay-area"> 
											<view > 
												<button size="default" type="default" class="btn" @click="payEvent">立即支付</button>
											</view>	
										</view>
										<!--普通单同意,可进行退订操作-->
										<view v-if="item.orderType=='normal'&&item.orderStatus==1" class="pay-area"> 
											<view  v-if="item.payType=='offline'"> 
												<button size="default" type="default" class="btn" @click="payEvent">退订</button>
											</view>	
										</view>
									</view>
					
								</view>
								<!-- #endif -->
								<!-- #ifdef H5 || APP-PLUS -->
								<template v-for="(item,index) of data" v-slot:[`card${index}`]>
									<view class="p-card">
										
										<view class="title">
											<text>{{item.hotel_id[0].hotelName}}</text>
										</view>
										<view class="header">
											<view><text>{{item.userName}}</text></view>
											<view><text>{{formatOrderStatus(item)}}</text></view>
										</view>
										<view class="address">
											<text>{{item.hotel_id[0].hotelAddress}}</text>
										</view>
										<view class="info">
											<text>{{formatDateLabel(item.checkInStartDate)}}至{{formatDateLabel(item.checkInEndDate)}}</text><text style="padding:0 15px"><text>{{item.roomTypeArray.length}}</text>间{{dayNum([item.checkInStartDateTimeStamp,item.checkInEndDateTimeStamp])}}晚</text><text>大床房</text>
										</view>
										<view class="price">
											<text v-if="item.payType=='online'">在线支付</text>
											<text v-if="item.payType=='offline'">到店支付</text>
											<text>￥{{item.totalAmount}}</text>
										</view>
										<view> 
											
										</view>
										<!--议价单同意-->
							
										<view v-if="item.orderType=='bargain'&&item.orderStatus==4" class="pay-area"> 
											<view v-if="item.hotel_id[0].payType=='online'"> 
												<button size="default" type="default" class="btn" @click="payEvent">立即支付</button>
											</view>	
											<view  v-if="item.hotel_id[0].payType!='online'"> 
												<button size="default" type="default" class="btn" @click="confirmOrder(item)">确认</button>
											</view>	
											<view> 
												<button size="default" type="default" class="btn btn-red" @click="cancelOrder(item)">取消订单</button>
											</view>	
											
										</view>
										<!--普通单等待支付-->
										<view v-if="item.orderType=='normal'&&item.orderStatus==5" class="pay-area"> 
											<view > 
												<button size="default" type="default" class="btn" @click="payEvent">立即支付</button>
											</view>	
										</view>
										<!--普通单同意,可进行退订操作-->
										<view v-if="item.orderType=='normal'&&item.orderStatus==1" class="pay-area"> 
											<view  v-if="item.payType=='offline'"> 
												<button size="default" type="default" class="btn" @click="payEvent">退订</button>
											</view>	
										</view>
									</view>
								</template>
								<!-- #endif -->
					
					
							</xt-panal-list>
						 </block>
		
	</unicloud-db>
	</view>
</template>

<script>
import {useStore} from 'vuex';
import {  computed, ref,getCurrentInstance  } from 'vue';
import  {OrderService} from "@/services/OrderService";
import noData from '@/components/noData/noData.vue';
export default{
  components: { noData },	
		setup(){
			// uniCloud.callFunction({
	  		// name:"hm_order_task"				
	 		//  }).then(res=>{
			// 	console.log("task",res)1734580800000
			//  })
			const instance = getCurrentInstance();//类似this
			const store = useStore();
			const db = uniCloud.database();
			console.log(store.state)
			let user=computed(()=>{
				return 	store.state.user;
			})
			let colList=computed(()=>{
				if(!user){
					return ;
				}
				return [
          		db.collection('hm-order').where(`fromClient==true && createrPhone=='${store.state.user.phone}'`).getTemp(),
          		db.collection('hm-hotel').field("_id,hotelName,hotelAddress,payType").getTemp()
			  ]
			});
			const formatDateLabel=(d)=>{
				return new Date(d).Format("MM-dd")
			}
			const dayNum=(params)=> {
				return Math.ceil((params[1] - params[0]) / (1000 * 60 * 60 * 24))
			}
			let type =ref('all');
			let _WHERE =computed(()=>{
				let w ='';
				switch(type.value){
					case 'all':
						w=``;
						break;
					case 'pay':
						w=`orderStatus==0`
						break;
					case 'in':
						w=`orderStatus==1&&checkInStartDateTimeStamp>${Date.now()}`
					break;
				}
				return w;
			})
			const udb =ref();
		const confirmOrder=async (item)=>{
				await OrderService.updateOrder(item._id,{orderStatus:1});
				udb.value.refresh();
		}
		const cancelOrder=async (item)=>{
			const conf = await uni.showModal({
				title: "确认取消",
				content: "取消后无法恢复",
				cancelText: "取消",
				confirmText: "确认",
			});
			if (conf["cancel"]) {
				return;
			}
				await OrderService.updateOrder(item._id,{orderStatus:10});
				udb.value.refresh();
		}
		const formatOrderStatus=(item)=>{
			if(item.orderType=='bargain'){
				let status = item.bargainStatus;
				let obj ={
				"0":"等待商家同意",
				"1":"商家已同意",
				"2":"商家拒绝",
			}
				return obj[status]
			}
			if(item.orderType=='normal'){
				let status = item.orderStatus;
				let payType=item.payType;
				let payStatus=item.payStatus;

				let obj ={
				"0":"待审核",
				"1":"生效中",
				"2":"拒绝",
				"5":"已完成",
				"9":"过期",
				"10":"已取消",
				}
				if(payType=='online'&&payStatus==0){
					return "待支付"
				}
				return obj[status]
				
			}
		}
		return{
			user,
			udb,
			formatDateLabel,
			colList,
			type,
			_WHERE,
			dayNum,
			confirmOrder,
			cancelOrder,
			formatOrderStatus


		}
		},
		data() {
			return {
				orderList:[]
			}
		},
		onLoad(params){
			console.log("参数",params)
			if(params['type']){
				this.type =params['type'];
				console.log(this.type)
			}
		},
		computed:{
			t2(){
				return this.$store.state.tt;
			}
		}
	}
</script>

<style lang="scss" scoped>
.orderList{

}
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
}
.pay-area{
	height: 60px;
	display: flex;
	justify-content: flex-end;
	gap:15px;
	align-items: center;
	font-size: 14px;
	.rmb{
		color:#ED9121;
		font-weight: bold;
		font-size: 20px;
		padding:0 10px;
	}
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
</style>

