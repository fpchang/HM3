<template>
	<view>
		<uni-forms ref="baseForm" :modelValue="orderForm" label-width="80px">
			<uni-forms-item label="来源">
				<view class="form-item-content-container">
					<uni-data-checkbox v-model="orderForm.orderSource" mode="default" :multiple="false"
						:localdata="sourceFormat" />
				</view>
			</uni-forms-item>
			<uni-forms-item label="日期时间">
				<view class="example-body">
					<uni-datetime-picker v-model="orderForm.dateRangeArray" type="daterange" :start="startDate" return-type="timestamp" @change="dateConfim" />
				</view>
			</uni-forms-item>
			<uni-forms-item label="房型" required>
				<!-- <uni-data-checkbox v-model="orderForm.roomTypeArray" mode="list"  multiple :localdata="roomTypeListFormat">1111</uni-data-checkbox> -->
				<view class="uni-list">
					<checkbox-group @change="roomTypeCheckboxChange">
						<view class="disabled-style" style="display: flex" v-for="item in remainRoomTypeList"
							:key="item._id">
							<view>
								<checkbox :value="item._id" emptyText="请先选择日期" :checked="item.checked"
									:disabled="noSelectDate" />
							</view>
							<view style="display: flex; flex: 1">{{ item.name }}</view>
							<view><uni-number-box v-model="item.selectCount" min="1" :max="item.remainCount"
									:disabled="!item.checked || noSelectDate" @change="numChange()" /></view>
						</view>
					</checkbox-group>
				</view>
			</uni-forms-item>
			<uni-forms-item label="客户名" required>
				<uni-easyinput v-model="orderForm.userName" trim="all" placeholder="请输入用户名" />
			</uni-forms-item>
			<uni-forms-item label="手机号">
				<uni-easyinput v-model="orderForm.phone" type="number" placeholder="请输入手机号" />
			</uni-forms-item>
			<uni-forms-item label="通讯方式">
				<uni-easyinput v-model="orderForm.wxNickName" placeholder="请输入通讯号或昵称" />
			</uni-forms-item>
			<uni-forms-item label="定金">
				<uni-easyinput v-model="orderForm.downPayment" type="digit" placeholder="请输入定金" />
			</uni-forms-item>
			<uni-forms-item label="总金额">
				<uni-easyinput v-model="orderForm.totalAmount" type="digit" placeholder="请输入总金额" />
			</uni-forms-item>
			<uni-forms-item label="备注">
				<uni-easyinput type="textarea" v-model="orderForm.mark" placeholder="备注内容"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item>
				<uv-button type="success" text="保存" color="#007aff" @click="submitForm()" :disabled="submitDisabled"
					:loading="submitLoading"></uv-button>
			</uni-forms-item>
		</uni-forms>

	</view>
</template>

<script>
	import {
		OrderService
	} from "../../../services/OrderService";
	import uniIcons from '../../../uni_modules/uni-icons/components/uni-icons/uni-icons.vue';
	export default {
		components: {
			uniIcons
		},
		data() {
			return {
				submitLoading: false,
				dateSelectShow: false,
				modeSource: getApp().globalData.systemInfo.deviceType == "phone" ?
					"list" :
					"default",
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
						name: "ohters",
						name_Zn: "其它",
						value: 6,
					}

				],
				startDate: new Date().Format("yyyy-MM-dd"),
				remainRoomTypeList: [],
				orderForm: {
					orderSource: 0,
					dateRangeArray: [], // [new Date().getTime(),new Date().getTime()+1000*60*60*24],
					userName: "",
					// checkInStartDateTimeStamp: 1724824800000,
					// checkInEndDateTimeStamp: 1724904000000,
					// checkInStartDate: "2024-08-28 14:00:00",
					// checkInEndDate: "2024-08-29 12:00:00",
					phone: "",
					mark: "",
					wxNickName: "",
					downPayment: 0,
					totalAmount: 0
					//orderSouce_Zn: "携程",
					//orderStatus: 0,
				},
			};
		},
		created() {
			// this.initValidRoomTypeData();
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
			hotel_id() {
				return this.$store.state.hotel_id;
			},
			user() {
				return this.$store.state.user;
			},
			noSelectDate() {
				//return false;
				return this.orderForm.dateRangeArray.length < 1;
			},
			sourceFormat() {
				return this.source.map((item) => {
					return {
						text: item.name_Zn,
						value: item.value,
					};
				});
			},
			dateRangeArrayFormat() {

				let startTime = new Date(
					new Date(this.orderForm.dateRangeArray[0]).Format("yyyy/MM/dd") +
					" 14:00:00"
				).getTime();
				let endTime = new Date(
					new Date(this.orderForm.dateRangeArray[1]).Format("yyyy/MM/dd") +
					" 12:00:00"
				).getTime();
				// if(this.orderForm.dateRangeArray[0]==this.orderForm.dateRangeArray[1]){
				//   endTime = endTime+1000*60*60*24;
				// }
				return [startTime, endTime];
			},

			roomTypeArray() {
				let list = this.remainRoomTypeList.filter((item) => {
					return item["checked"];
				});
				return list.map((item) => {
					return {
						roomType_id: item._id,
						count: item.selectCount,
						name: item.name
					};
				});
			},
			submitDisabled() {
				let condition =
					this.orderForm.dateRangeArray.length < 1 ||
					this.roomTypeArray.length < 1 ||
					(this.orderForm.userName.trim() == "" && this.orderForm.phone.trim() == "");
				return condition;
			},
		},
		methods: {
			showDateSelect() {
				this.dateSelectShow = true;
				this.$refs.calendars.open();
			},
			dateClose() {
				this.dateSelectShow = false;
				//this.$refs.calendars.close();
			},
			dateConfimEvent(obj) {
				this.dateConfim(obj.range.data);
			},
			dateConfim(e) {
				let range = e;
				if (e[0] == e[1]) {
					this.remainRoomTypeList = [];
					uni.showToast({
						title: "开始日期与结束日期不能相同",
						icon: "none"
					});
					return;
				}
				this.orderForm.dateRangeArray = e;
				this.initValidRoomTypeData();
			},
			//初始化可用的房型
			initValidRoomTypeData(e) {
				uni.showLoading();
				let startTime = this.dateRangeArrayFormat[0],
					endTime = this.dateRangeArrayFormat[1];
				console.log("日期值改变", this.orderForm, startTime, endTime);
				let hotel_id = this.hotel_id;
				uniCloud
					.callFunction({
						name: "hm_getRemainderRoomType",
						data: {
							hotel_id,
							startTime,
							endTime,
						},
					})
					.then((res) => {
						console.log("res::",res)
						this.remainRoomTypeList = res.result.map((it) => {
							it.selectCount = 1;
							return it;
						});
						uni.hideLoading();
					});
			},

			//复选框事件
			roomTypeCheckboxChange(e) {
				let valArray = e.detail.value;
				this.remainRoomTypeList = this.remainRoomTypeList.map((item) => {
					item.checked = valArray.includes(item._id);
					return item;
				});
			},
			numChange() {},

			getValidOrder() {},
			async submitForm() {
				//uni.showLoading();
				this.submitLoading = true;
				let dateRange = this.dateRangeArrayFormat;
				let sourceObj = this.source.find(
					(item) => item.value == this.orderForm.orderSource
				);
				let obj = {
					hotel_id: this.hotel_id,
					roomTypeArray: this.roomTypeArray,
					userName: this.orderForm.userName,
					checkInStartDateTimeStamp: dateRange[0],
					checkInEndDateTimeStamp: dateRange[1],
					checkInStartDate: new Date(dateRange[0]).Format("yyyy/MM/dd HH:mm:ss"),
					checkInEndDate: new Date(dateRange[1]).Format("yyyy/MM/dd HH:mm:ss"),
					phone: this.orderForm.phone,
					createrPhone: this.user.phone,
					createrName: this.user.userName,
					orderSource: Number(this.orderForm.orderSource),
					wxNickName: this.orderForm.wxNickName,
					orderSouce_Zn: sourceObj.name_Zn,
					orderStatus: 1,
					downPayment: Number(this.orderForm.downPayment),
					totalAmount: Number(this.orderForm.totalAmount),
				};
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
</style>