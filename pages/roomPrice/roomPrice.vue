<template>
	<view class="roomPrice">
		<uni-forms ref="priceForm" :modelValue="priceForm" label-width="80px">
			<uni-forms-item label="价格预览"></uni-forms-item>
			<!-- <view>							 
			<uni-calendar class="uni-calendar--hook" :selected="calendarConfig.selected" :showMonth="true" @change="change" @monthSwitch="monthSwitch" />						
			</view> -->
			<uni-forms-item label="日期">
				<view class="daterange">
					<uni-datetime-picker v-model="daterange" type="daterange" return-type="timestamp"
						@change="dateConfim">
						<text class="strong">{{ foramtDateLabel(daterange[0]).de }}</text><text class="normal"
							style="padding: 0 10px">{{
              foramtDateLabel(daterange[0]).dy
            }}</text>
						<text style="padding: 0 25px">-</text>
						<text class="strong">{{ foramtDateLabel(daterange[1]).de }}</text><text class="normal"
							style="padding: 0 10px">{{
              foramtDateLabel(daterange[1]).dy
            }}</text>
					</uni-datetime-picker>
				</view>
			</uni-forms-item>
			<uni-forms-item label="房型">
				<view class="roomType-area">
					<unicloud-db ref="udb" v-slot:default="{ data, loading, error, options }" collection="hm-roomType"
						field="name,priceBase,priceBase_name,priceA_name,priceA,priceB,priceB_name"
						:where="`hotel_id=='${hotel_id}'`" orderby="name asc" @load="getRoomType">
						<view v-for="item of roomTypeList">
							<checkbox-group @change="checkboxChange(item)">
								<view class="itm">
									<view  style="display: flex;align-items:center">
									<view>
										<checkbox :value="item._id" emptyText="" :checked="item.checked" />
									</view>
									<text>{{ item.name }}</text>
								</view>
									<text class="edit-text-btn-style" style="font-size:13px" @click="showPrice(item)">价格预览</text>
								</view>
								<view class="pr-area">
									<view class="pr-area-item" style="display: flex">
										<view>{{ item.priceBase_name || "标准价格" }}</view>
										<view class="digit-style"><uni-easyinput type="digit" v-model="item.priceBase"
												placeholder="请输入价格" :clearable="false"
												:disabled="!item.checked"></uni-easyinput></view>
									</view>
									<view class="pr-area-item" style="display: flex" v-if="item.priceA_name">
										<view>{{ item.priceA_name }}</view>
										<view class="digit-style"><uni-easyinput type="digit" v-model="item.priceA"
												placeholder="请输入价格" :disabled="!item.checked"
												:clearable="false"></uni-easyinput></view>
									</view>
									<view class="pr-area-item" style="display: flex" v-if="item.priceB_name">
										<view>{{ item.priceB_name }}</view>
										<view class="digit-style"><uni-easyinput type="digit" v-model="item.priceB"
												placeholder="请输入价格" :disabled="!item.checked"
												:clearable="false"></uni-easyinput></view>
									</view>

								</view>
								<view class="dev"></view>
							</checkbox-group>
						</view>
					</unicloud-db>
				</view>
			</uni-forms-item>
			<uni-forms-item>
				<uv-button type="success" text="保存" color="#007aff" @click="submit()" :disabled="noSelectDate"
					:loading="submitLoading" ></uv-button>
			</uni-forms-item>
		</uni-forms>
		<uni-calendar ref="calendar" class="uni-calendar--hook" :clear-date="true" :date="calendarConfig.date" :insert="calendarConfig.insert" :lunar="calendarConfig.lunar" :startDate="calendarConfig.startDate"
		 :endDate="calendarConfig.endDate" :range="calendarConfig.range" @confirm="confirm" @close="close"/>
	</view>
</template>

<script>
	import {
		ref,
		computed,
		watch
	} from "vue";
	import {
		useStore
	} from "vuex";
	import {
		TIME
	} from "@/static/utils/TIME"
import { HotelService } from '../../services/HotelService';
	export default {
		setup() {
			const store = useStore();
			const hotel_id = computed(() => {
				return store.state.hotel_id;
			});
			let ct = TIME.getTodayStartTimeAndEndTime();
			let daterange = ref([ct.startTime, ct.endTime]);
			let roomTypeList = ref([]);
			const formatRoomTypeList = computed(() => {
				let arr = [];
				let rl = roomTypeList.value.filter(item => item.checked);
				rl.map(item => {
					let {
						_id,
						priceA = 0,
						priceB = 0,
						priceBase
					} = item;
					priceA = Number(priceA), priceB = Number(priceB), priceBase = Number(priceBase);
					let roomType_id = _id;
					let startTime = TIME.startTime(daterange.value[0]),
						endTime = TIME.endTime(daterange.value[1]);
					let hotel_id = store.state.hotel_id;
					arr.push({
						hotel_id,
						roomType_id,
						startTime,
						endTime,
						priceA,
						priceB,
						priceBase
					})
				})
				return arr;
			})

			const noSelectDate = computed(() => {
				let list = roomTypeList.value.filter(item => {
					return item.checked
				});
				return list.length < 1;
			});
			const submitDisabled = computed(() => {
				return noSelectDate
			})
			const submitLoading = ref(false);
			let calendarConfig= ref({
					lunar: true,
					range: true,
					insert: false,
					selected: [{date: '2025-02-12', info: '422' }]
				})
			let priceForm=ref({})
			return {
				hotel_id,
				daterange,
				roomTypeList,
				submitDisabled,
				noSelectDate,
				formatRoomTypeList,
				submitLoading,
				priceForm,
				calendarConfig
			};
		},
		data() {
			return {};
		},
		methods: {
			showPrice(item){
				console.log("1111",item);
			},
			foramtDateLabel(dateTime) {
				let dyStr = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
				return {
					de: new Date(dateTime).Format("MM-dd"),
					dy: dyStr[new Date(dateTime).getDay()],
				};
			},
			getRoomType(list) {
				console.log("1111111", list);
				let l = list.map((item) => {
					item.checked = false;
					return item;
				});
				this.roomTypeList = l;
			},
			checkboxChange(item) {
				item.checked = !item.checked;
				console.log(item)
			},
		
			async submit() {
				let isvalid = this.roomTypeList.find(item => {
					return item.checked && (!item.priceBase || item.priceBase <= 0);
				});
				if (isvalid) {
					uni.showToast({
						title: `${isvalid.name}标准价格有误`,
						icon: 'none'
					})
					return;
				}
				this.submitLoading=true;
				console.log(this.formatRoomTypeList);
				try {
					await HotelService.addRoomTypePrice(this.formatRoomTypeList);
					this.submitLoading=false;
					console.log("房价添加成功")
					uni.showToast({title:"添加成功",icon:"none"});
					uni.navigateBack();
				} catch (error) {
					console.error("添加房价出现错误",error);
					this.submitLoading=false;
				}
				
			},
		},
	};
</script>

<style lang="scss">
	.roomPrice {
		padding: 20px;
		max-width: 800px;
		box-sizing: border-box;
		margin: auto;
	}

	.daterange {
		display: flex;
		align-items: center;
		justify-content: space-between;

		.strong {
			font-size: 18px;
			font-weight: bold;
		}

		.normal {
			font-size: 13px;
			color: #a1a1a1;
		}
	}

	.roomType-area {
		padding: 10px;
		background-color: #eee;
		box-sizing: border-box;

		.dev {
			height: 1px;
			background: #c3c2c28a;
			margin: 10px 0 10px;


		}

	}
	.itm{
		display: flex;justify-content:space-between;padding-bottom:15px
	}
	.pr-area {
		display: flex;
		flex-direction: column;
		gap: 10px;

		.pr-area-item {
			padding-left: 30px;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.digit-style {
				width: 100px;
			
			}
		}
	}
</style>