<template>
	<view>
		<!-- <uni-forms ref="baseForm" :modelValue="orderForm" label-width="80px">
			<uni-forms-item label="客户名" required>
				<uni-easyinput v-model="orderForm.userName" trim="all" placeholder="请输入用户名" />
			</uni-forms-item>
			<uni-forms-item label="手机号">
				<uni-easyinput v-model="orderForm.phone" type="number" placeholder="请输入手机号" />
			</uni-forms-item>
			<uni-forms-item label="备注">
				<uni-easyinput type="textarea" v-model="orderForm.mark" placeholder="备注内容"></uni-easyinput>
			</uni-forms-item>
		
		</uni-forms> -->
		<xt-panal-list :dataList="[1]" maxWidth=1200>
          
			<!-- #ifdef MP -->
			<view v-for="(item,index) of remainTypeList" slot="card{{index}}">
			 
			</view>
			<!-- #endif -->
			<!-- #ifdef H5 || APP-PLUS -->
			 <template v-for="(item,index) of [1]" v-slot:[`card${index}`]="data">
				<view style="padding:20px"> 
					<view class="formitem">						
							<view class="title"><text>订房信息</text></view>
							<view>
								<view class="ad-lose-num flex-center">
									<uni-icons type="minus-filled" size="24" color="orange" @click="loseCount()"></uni-icons>
									<text style="padding:0 8px">{{selectCount}}</text>
									<uni-icons type="plus-filled" size="24" color="orange"
										@click="addCount()"></uni-icons>
								</view>
							</view>
						
					</view>
					<uni-forms ref="baseForm" :modelValue="orderForm" label-width="80px">
						<uni-forms-item label="日期" required>
							<view class="form-content">
								<text>{{formatDate(formData.dateRange[0])}}</text> 
								<text>至</text>
								<text>{{formatDate(formData.dateRange[1])}}</text>
							</view>						
						</uni-forms-item>
						<uni-forms-item label="住客名" required>
							<view style="display:flex;height:100%;flex-direction:column" class="input-area"> 
								<input v-model="orderForm.userName" trim="all" placeholder="住客名"  class="in"/>
							</view>							
						</uni-forms-item>
						<uni-forms-item label="联系人" required>
							<view style="display:flex;height:100%;flex-direction:column" class="input-area"> 
								<input v-model="orderForm.phone" trim="all" placeholder="联系电话"  class="in"/>
							</view>							
						</uni-forms-item>
						<uni-forms-item label="房型" required>
							<view class="form-content">
								<text>{{formData.roomType.name}}</text> 
								<text>{{ formData.roomType[`${formData.priceField}_name`] }}</text>
							</view>
							
						</uni-forms-item>
					</uni-forms>
				</view>

			 </template>
			 <!-- #endif -->
		  
			
		</xt-panal-list>
	</view>
</template>

<script>
	import {
		OrderService
	} from "../../../../services/OrderService";
	export default {
		components: {

		},
		props:{
			formData:{
				type:Object
			}
		},
		setup(props){
			console.log(2222222222,props)
		},
		data() {
			return {
				submitLoading: false,
				dateSelectShow: false,
				source: [{
						name: "xiechen",
						name_Zn: "携程",
						value: 1,
					},
					{
						name: "meituan",
						name_Zn: "美团",
						value: 2,
					},
					{
						name: "meituanminsu",
						name_Zn: "美团民宿",
						value: 3,
					},
					{
						name: "ticktok",
						name_Zn: "抖音",
						value: 4,
					},
					{
						name: "tujia",
						name_Zn: "途家",
						value: 5,
					},
					{
						name: "downline",
						name_Zn: "线下",
						value: 0,
					},
					{
						name: "yisu",
						name_Zn: "议宿",
						value:8,
					},
					{
						name: "ohters",
						name_Zn: "其它",
						value: 6,
					}

				],
				selectCount:1,
				orderForm: {
					orderSource: 8,
					dateRangeArray: [],
					userName: "",
					phone: "",
					orderStatus: 0,
				},
			};
		},
		created() {
			this.orderForm.userName = this.user.userName;
			this.orderForm.phone = this.user.phone;
			this.setPriceTotal();
		},
		computed: {
			isPcShow() {
				return this.$store.state.isPcShow
			},
			isIOS() {
				return uni.getSystemInfoSync().osName == 'ios' || uni.getDeviceInfo().platform == 'ios';
			},
			isH5() {
				// #ifdef  H5
				return true;
				//#endif
				return false;
			},
			// hotel_id() {
			// 	return this.$store.state.hotel_id;
			// },
			user() {
				return this.$store.state.user;
			},
			sourceFormat() {
				return this.source.map((item) => {
					return {
						text: item.name_Zn,
						value: item.value,
					};
				});
			}
	

		},
		methods: {
			loseCount(){
				if(this.selectCount==1){
					uni.showToast({title:"最少选择一间",icon:"none"});
					return;
				}
				this.selectCount= this.selectCount-1;
				this.setPriceTotal();
			},
			addCount(){
				if(this.selectCount+1>this.formData.roomType.count){
					uni.showToast({title:"没有多余房间",icon:"none"});
					return;
				}
				this.selectCount= this.selectCount+1;
				this.setPriceTotal();
			},
			setPriceTotal(){
				let priceTotal=this.selectCount*this.formData.roomType[this.formData.priceField];
				this.$emit("setPriceTotal",priceTotal)
			},
			formatDate(time){
				return new Date(time).Format("yyyy-MM-dd");
			},
			dateRangeArrayFormat() {
				let startTime = new Date(
					new Date(this.formData.dateRange[0]).Format("yyyy/MM/dd") +
					" 14:00:00"
				).getTime();
				let endTime = new Date(
					new Date(this.formData.dateRange[1]).Format("yyyy/MM/dd") +
					" 12:00:00"
				).getTime();
				return [startTime, endTime];
				},
			
			async submitForm() {
				//uni.showLoading();
				this.submitLoading = true;
				let dateRange = this.dateRangeArrayFormat();
				let sourceObj = this.source.find(
					(item) => item.value == this.orderForm.orderSource
				);
				let obj = {
					hotel_id: this.formData.roomType.hotel_id,//--
					roomTypeArray: [{
						roomType_id: this.formData.roomType._id,
						count: this.selectCount,
						name: this.formData.roomType.name
					}], //---
					userName: this.orderForm.userName,
					checkInStartDateTimeStamp: dateRange[0],
					checkInEndDateTimeStamp: dateRange[1],
					checkInStartDate: new Date(dateRange[0]).Format("yyyy/MM/dd HH:mm:ss"), //--
					checkInEndDate: new Date(dateRange[1]).Format("yyyy/MM/dd HH:mm:ss"),
					phone: this.orderForm.phone, //-
					createrPhone: this.user.phone, //--
					createrName: this.user.userName, //--
					orderSource: Number(this.orderForm.orderSource),
					orderSouce_Zn: sourceObj.name_Zn,
					payType:'offline'//--

				};
				console.log(obj)
				return;
				try {
					await OrderService.addOrder(obj);
					console.log("添加成功");
					this.$store.dispatch("getGatherEvent", this.hotel_id);
					this.$store.dispatch("getOrderListTodayAfter", this.hotel_id);
					this.submitLoading = false;
					uni.hideLoading();
					this.$emit("closePopup");
				} catch (error) {
					console.error("添加失败", error);
					this.submitLoading = false;
					uni.hideLoading();
					uni.showToast({
						title: '添加失败，请稍候再试',
						duration: 2000,
						icon: "error"
					});
				}


			},
		},
	};
</script>

<style lang="scss">
	.form-item-content-container {
		display: flex;
		align-items: center;
	}
	.uni-forms-item{
		margin-bottom: 0;
	}
	.calendar-container {
		flex: 1;
		border: 1px solid #dcdfe6;
		color: #606266;
		border-radius: 4px;
		padding: 0 12px;
		height: 35px;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.uni-list-cell {
		justify-content: flex-start;
	}

	.disabled-style {
		color: #bbb;
	}
	.input-area{
		display: flex;
		flex-direction: column;
		height: 100%;
		.in{
			flex: 1;
			color: #7c7c7c;
		}
	}
	.formitem{
		display: flex;
		align-items: center;
		justify-content: space-between;
		.title{
			font-size:18px;
			font-weight: bold;
			padding:10px 0;
		}
	}
	.form-content{
		display:flex;
		align-items: center;
		height:100%;
		gap:10px;
		color:#a1a1a1;
		font-size: 16px;
	}
</style>