<template>

	<view class="order-component">
		<view class="add-content-style">
			<view class="left-panal">
				<view class="switch-group"> 
					<view><text style="color:#fff">房态</text></view>
					<view><switch color="#FFCC33" style="transform:scale(0.8)"/></view>
					<view><text style="color:#FFCC33">订单</text></view>
				</view>
				
				<!-- <uni-data-checkbox selectedTextColor="#fff"  selectedColor="#87b7f5" v-model="tabRadioVal" :localdata="tabitems"></uni-data-checkbox>				 -->
			</view>
			<view class="control-panal">
			<!-- <uv-icon
			   name="plus-circle-fill"
			   color="#fff"
			   size="22"
			   label="创建订单"
			   labelPos="bottom"
			   labelSize="12px"
			   
			   @click="createOrderEvent"
			 ></uv-icon> -->
			 <view class="control-item-group" @click="createOrderEvent">
				<view><l-icon name="solar:add-circle-bold" size="22px" color="#fff"/></view>
				<view><text style="color:#fff">创建订单</text></view>
			 </view>
			 
		   </view>
		   </view>
		<view style="height: 15px;"></view>
		<view class="content">
			<!-- <keep-alive> -->
			<view v-if="tabRadioVal===0">

				<orderChildCalendarList :disHeightVal="disHeightVal" ref="orderChildCalendarListRef">
				</orderChildCalendarList>
			</view>
			<!-- </keep-alive> -->

			<view v-if="tabRadioVal===1">
				<orderChildList ref="orderChildListRef"></orderChildList>

			</view>
			<!-- <keep-alive> -->
			<view v-if="tabRadioVal===2">
				<orderChildTableList ref="orderChildTableListRef"></orderChildTableList>
			</view>
			<!-- </keep-alive> -->


		</view>
		<uni-popup ref="popup" background-color="transprant">
			<view class="popup-content">
				<view class="create-order-title-style">创建订单</view>
				<view class="comContent">
					
					<createOrderComponent @closePopup="closePopup"></createOrderComponent>
					<!-- </keep-alive> -->

				</view>

			</view>
		</uni-popup>
	</view>
</template>

<script>
	import CreateOrder from '../createOrder/createOrder'
import orderChildCalendarList from './orderChildCalendarList';
	import orderChildTableList from './orderChildTableList';
	import createOrderComponent from './createOrderComponent';
	import orderChildList from './orderChildList.vue';
	import {alert} from "@/alert";
import LIcon from '../../../uni_modules/lime-icon/components/l-icon/l-icon.vue';
	export default {
		components: {
    	CreateOrder,
			createOrderComponent,
			orderChildCalendarList,
			orderChildTableList,
			orderChildList,
LIcon
		},
		props: {
			disHeightVal:0,
			createTime:0
		},
		data() {
			return {
				ss: 15868865907,
				current: 2,
				tabRadioVal:0,
				
				selectCondition: {
					dateRangeArray: [new Date().getTime(), new Date().getTime() + (1000 * 60 * 60 * 24 * 30)], //默认30天
					userName: ''
				},
				pattern: {
					color: '#7A7E83',
					backgroundColor: 'rgba(255,255,255,0)',
					selectedColor: '#007AFF',
					buttonColor: 'rgba(41, 121, 255,1)',
					iconColor: '#fff'
				}
				//roomTypeList: dataBase.roomTypeList,

			}
		},
		computed: {
			isPcShow(){
				return this.$store.state.isPcShow;
			},
			hotel_id(){
				return this.$store.state.hotel_id;
			},
			roomTypeList() {
				return this.$store.state.roomTypeList;
			},
			tabitems(){
				//if(this.isPcShow){
					return [{
					value:0,
					text:'房态'
				}, {
					value:1,
					text:'订单'
				 }
				//  ,{
				// 	value:2,
				// 	text:'历史'
				// }
				]
				//}
				// return [{
				// 	value:0,
				// 	text:'房态'
				// }, {
				// 	value:1,
				// 	text:'订单'
				// }]
			} 
		},
		watch:{
			
	},
		created() {
			console.log('orderComponent create');

		},
		onLoad: function() {
			console.log('orderComponent Show')
		},
		mounted() {
			
		},
		methods: {
			async initData(){
					await this.$refs.orderChildCalendarListRef.getOrderList();					
					return;
			},
			dataConfigEvent(){

			},
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex
				}
			},
			createOrderEvent() {
				if(!this.$store.state.permissionStore.permissionList.includes('ORDER_CREATE')){
					 alert.alertNoPermisson();
					return;
				}
				if (!this.$store.state.isPcShow) {
					uni.navigateTo({
						url: '/pages/order/createOrder/createOrder'
					})
					return;
				}
				this.$refs.popup.open();

			},
			closePopup() {
				try {
					this.$refs.popup.close();
					this.$refs.orderChildTableListRef.getOrderListByCondition();
					this.$refs.orderChildCalendarList.getOrderList();
					this.$refs.orderChildListRef.getOrderList();
				} catch (e) {
					//TODO handle the exception
				}

			},
			testData(valArray) {

			}
		}
	}
</script>

<style lang="scss">
.add-content-style{
	 background: #0765ae;
	 .switch-group{
		display: flex;
		gap: 4px;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		    
			padding: 5px 12px;
			border-radius: 26px;
			background: #919191;
	 }
}
.order-component {
	box-sizing: border-box;
}

.uni-group {
	display: flex;
	align-items: center;
}

.uni-button {
	white-space: nowrap;
}

.tbs-style {
	display: flex;
	align-items: center;

	.tbs-c-btn {
		width: 105px;
		display: flex;
		align-items: center;
	}
}
</style>