<template>
	<view class="orderList">
		<unicloud-db v-slot:default="{data, loading, error, options}" :collection="colList"
						 :getone="false"  orderby="createTime desc">
		<xt-panal-list :dataList="data">

			<!-- #ifdef MP -->
			<view v-for="(item,index) of data" slot="card{{index}}">


			</view>
			<!-- #endif -->
			<!-- #ifdef H5 || APP-PLUS -->
			<template v-for="(item,index) of data" v-slot:[`card${index}`]>
				<view>
					
					<view class="title">
						<text>{{item.hotel_id[0].hotelName}}</text>
					</view>
					<view class="address">
						<text>{{item.hotel_id[0].hotelAddress}}</text>
					</view>
					<view class="info">
						<text>{{formatDateLabel(item.checkInStartDate)}}至{{formatDateLabel(item.checkInEndDate)}}</text><text>1间2晚</text><text>大床房</text>
					</view>
					<view class="price">
						<text v-if="item.payType=='online'">在线支付</text>
						<text v-if="item.payType=='offline'">到店支付</text>
						<text>￥{{item.totalAmount}}</text>
					</view>
					<view> 
						<text>下单日期：{{formatDateLabel(item.createTime)}}</text>
					</view>
					<!--议价单同意-->
					<view v-if="orderType=='bargain'&&ordetStatus==0"> 
						<text v-if="item.payType=='online'">去付款</text>
						<text v-if="item.payType=='offline'">确认</text>
					</view>
					<!--普通单同意,可进行退订操作-->
					<view v-if="orderType=='normal'&&ordetStatus==1"> 
						<text v-if="item.payType=='online'">退订</text>
					</view>
				</view>
			</template>
			<!-- #endif -->


		</xt-panal-list>
	</unicloud-db>
	</view>
</template>

<script>
import {useStore} from 'vuex';
import {  computed, ref } from 'vue';
export default{	
		setup(){
			const store = useStore();
			const db = uniCloud.database();
			console.log(store.state)
			let user=computed(()=>{
				return 	store.state.user;
			})
			let colList=computed(()=>{
				return [
          		db.collection('hm-order').where(`fromClient==true && createrPhone=='${store.state.user.phone}'`).getTemp(),
          		db.collection('hm-hotel').field("_id,hotelName,hotelAddress").getTemp()
			  ]
			});
			const formatDateLabel=(d)=>{
				return new Date(d).Format("MM-dd")
			}
		return{
			user,
			formatDateLabel,
			colList
		}
		},
		data() {
			return {
				orderList:[]
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
</style>
