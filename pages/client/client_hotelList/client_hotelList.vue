<template>
	<view>
		<view style="padding:0 20px">
			<view class="search-style">
				<view v-if="conditionForm['dateRange']">
					<uni-datetime-picker v-model="conditionForm.dateRang" type="daterange" return-type="timestamp"
						@change="dateConfim">
						<view class="d1">
							<text>{{foramtDateLabel(conditionForm['dateRange'][0]).de}}</text><text>{{foramtDateLabel(conditionForm['dateRange'][1]).de}}</text>
						</view>

					</uni-datetime-picker>

				</view>
				<input style="background-color:transparent;flex:1" placeholder="位置/品牌/酒店"
					v-model="conditionForm.filterVal"></input>
				<uni-icons type="search" size="22px"></uni-icons>
			</view>

		</view>
		<view style="margin:auto;max-width:450px">
			<xt-dropdown :dataList="dataList" activeId="c1">
				<template v-slot:["c1"]>
					<view style="height:100px;background:red"></view>
				</template>
				<template v-slot:["c2"]>
					<view style="height:200px;background:green"></view>
				</template>
				<template v-slot:["c3"]>
					<view style="height:300px;background:orange"></view>
				</template>
			</xt-dropdown>

		</view>
		<scroll-view style="height: calc(100vh - 84px);" scroll-x="false" scroll-y="true">
			<view>
				<xt-panal-list :dataList="hotelList">

					<!-- #ifdef MP -->
					<view v-for="(item,index) of hotelList" slot="card{{index}}">
						 <view style="display:flex;" class="zcard" @click="openHotel(item)">
							<view style="width:120px;min-height:160px">
								<image style="width:100%;height:100%" mode="aspectFill" :src="item.firstImages" />
							</view>
							<view style="padding:10px" class="zcard-right">
								<view class="item"><text class="title">{{item.hotelName}}</text></view>
								<view class="item"><text>距你直线距离{{getDistance(conditionForm.location ,item.hotelCoordinate)}}米</text></view>
								<view class="item">
									<view class="tabscontainer" style=""> 
										<uni-tag v-for="i of item.feature" :inverted="true" :text="i" size="mini"/>
									</view>

								</view>
								<view class="bottom item"><text></text></view>
							</view>
						</view>

					</view>
					<!-- #endif -->
					<!-- #ifdef H5 || APP-PLUS -->
					<template v-for="(item,index) of hotelList" v-slot:[`card${index}`]>
						<view style="display:flex;" class="zcard" @click="openHotel(item)">
							<view style="width:120px;min-height:160px">
								<image style="width:100%;height:100%" mode="aspectFill" :src="item.firstImages" />
							</view>
							<view style="padding:10px" class="zcard-right">
								<view class="item"><text class="title">{{item.hotelName}}</text></view>
								<view class="item"><text>距你直线距离{{ getDistance(conditionForm.location ,item.hotelCoordinate)}}米</text></view>
								<view class="item">
									<view class="tabscontainer" style=""> 

										<uni-tag v-for="i of item.feature" :inverted="true" :text="i" size="mini"/>
								
									</view>

								</view>
								<view class="bottom item"><text>499￥</text></view>
							</view>
						</view>
					</template>
					<!-- #endif -->


				</xt-panal-list>
			</view>

		</scroll-view>
	</view>

</template>

<script>
	import xtDropdown from '../../../components/xt-dropdown/xt-dropdown.vue';
	import UniEasyinput from '../../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.vue';
	import UniIcons from '../../../uni_modules/uni-icons/components/uni-icons/uni-icons.vue';
	export default {
		components: {
			xtDropdown,
			UniEasyinput,
			UniIcons
		},
		data() {
			return {
				isLoading:false,
				dataList: [{
						id: "c1",
						label: "智能",

					},
					{
						id: "c2",
						label: "距离",

					},
					{
						id: "c3",
						label: "价格",

					}
				],
				conditionForm: {}
			}
		},
		computed: {
			isPcShow(){
				return this.$store.state.isPcShow;
			},
			hotelList() {
				return this.$store.state.hotelClientStore.hotelList;
			}
		},
		methods: {
			foramtDateLabel(dateTime) {
				let dyStr = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
				return {
					de: new Date(dateTime).Format("MM-dd"),
					dy: dyStr[new Date(dateTime).getDay()]
				}

			},
			async getHotelList() {
				if (this.isLoading) {
					console.log("isloading....");
					return;
				}
				uni.showLoading();
				console.log(">>>>>",this.conditionForm)
				try {
					const res = await this.$store.dispatch("hotelClientStore/getHotelList",this.conditionForm);
					console.log("hotelList",res);
					uni.hideLoading();
				} catch (error) {
					console.log(error);
					uni.hideLoading();
				}
			},
			openHotel(hotel){
				if(this.isLoading){
					return;
				}
				this.isLoading=true;
				let href = `#/pages/client/hotelHome/hotelHome?st=${this.conditionForm.dateRange[0]}&&et=${this.conditionForm.dateRange[1]}&&hotel=${encodeURIComponent(JSON.stringify(hotel))}`;
				// #ifdef H5
				window.open(href, "_blank");
				//return;
				// #endif
				//// #ifndef H5
				
			
				//// #endif
				uni.navigateTo({
					url:`/pages/client/hotelHome/hotelHome?st=${this.conditionForm.dateRange[0]}&&et=${this.conditionForm.dateRange[1]}&&hotel=${encodeURIComponent(JSON.stringify(hotel))}`,
					complete:()=>{
						this.isLoading=false;
					}
				})
			},		
			getDistance(location,location_){
				let lon1 = location[0],la1=location[1];
				let lon2 = location_[0],la2=location_[1];
					let radLat1 = la1 * Math.PI / 180.0;
					let radLat2 = la2 * Math.PI / 180.0;
					let a = radLat1 - radLat2;
					let b = lon1 * Math.PI / 180.0 - lon2 * Math.PI / 180.0;
					let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
					s = s * 6378.137;
					s = Math.round(s * 10000) / 10;
					console.log("距离",s);
					return s;
					//this.distance=s

					

		}
		},
	
		onShow() {
			try {
				if (this.$store.state.isPcShow) {
					document.getElementsByTagName('uni-page-head')[0].style.display = 'none';
				}

			} catch (error) {

			}
		},
		onLoad(obj) {
			console.log("参数传递", obj, obj.condition);
			
			try {
				this.type = obj.type;
				this.conditionForm = JSON.parse(decodeURIComponent(obj.condition));
				console.log("conditionForm",this.conditionForm)
				this.conditionForm.location= [119.882659, 30.626099];
				this.getHotelList();

			} catch (error) {
				console.log(error)
			}
		},
		mounted(){
			console.log("config",this.$store.state.config);
			//this.getDistance([120.0868811, 30.894178],[121.0868811, 30.894178])
		}
	}
</script>

<style lang="scss" scoped>
	.search-style {
		max-width: 450px;
		margin:auto;
		display: flex;
		align-items: center;
		background-color: #eee;
		border-radius: 20px;
		padding: 0 15px;
		height: 40px;

		.d1 {
			display: flex;
			flex-direction: column;
			font-size: 12px;
			padding-right: 8px;
			color: #a1a1a1;
		}
	}
	.zcard{
		cursor: pointer;
		&:hover{
			/*transform: scale(1.01);*/
			box-shadow: 2px 4px 12px #000;
			
		}
		.zcard-right{
			flex: 1;
			color: #4b4b4b;
			font-size:$uni-font-size-sm ;
			display: flex;
			flex-direction: column;
			.title{
				color: #313131;
				font-weight: bold;
				font-size:$uni-font-size-base ;
			}
			.item{
				padding:3px 0;
				.tabscontainer{
					display:flex;
					justify-content:flex-start;
					align-items:center;gap:8px;
					flex-wrap: wrap;
				}
			}
			.bottom{
				flex: 1;
				display: flex;
				justify-content: flex-end;
				align-items: flex-end;
			}
		}
	}
</style>