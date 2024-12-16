<template>
	<view class="orderList">
		
		<unicloud-db v-slot:default="{data, loading, error, options}" :collection="colList"
						 :getone="false" :where="_WHERE" orderby="createTime desc">
						
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
										<view class="header">
											<view><text>{{item.userName}}</text></view>
											<view><text>{{item.orderStatus}}</text></view>
										</view>
										<view class="title">
											<text>{{item.hotel_id[0].hotelName}}</text>
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
						 </block>
		
	</unicloud-db>
	</view>
</template>

<script>
import {useStore} from 'vuex';
import {  computed, ref } from 'vue';
import noData from '../../../../components/noData/noData.vue';
export default{
  components: { noData },	
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
		return{
			user,
			formatDateLabel,
			colList,
			type,
			_WHERE,
			dayNum

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
</style>

