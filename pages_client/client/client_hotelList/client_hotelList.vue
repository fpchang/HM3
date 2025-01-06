<template>
	<view>
		<view style="padding:0 20px">
			<view class="search-style">
				<view v-if="searchDateRange">
					<uni-datetime-picker type="daterange" return-type="timestamp"
						@change="dateConfim">
						<view class="d1">
							<text>{{foramtDateLabel(searchDateRange[0]).de}}</text><text>{{foramtDateLabel(searchDateRange[1]).de}}</text>
						</view>

					</uni-datetime-picker>

				</view>
				<!-- <input style="background-color:transparent;flex:1" placeholder="位置/品牌/酒店"></input> -->
				 <view style="background-color:transparent;flex:1;color:#bbb" @click="toSearch"><text>{{searchCondition.filterVal||'位置/品牌/酒店'}}</text></view>
				<uni-icons type="search" size="22px"></uni-icons>
			</view>

		</view>
		<view style="margin:auto;max-width:450px">
			<xt-dropdown :dataList="dataList" activeId="c1">
				<template v-slot:["c1"]>
					<view></view>
				</template>
				<template v-slot:["c2"]>
					<view></view>
				</template>
				<template v-slot:["c3"]>
					<view></view>
				</template>
			</xt-dropdown>

		</view>
		<block v-if="hotelList&&hotelList.length<1">
			<noData text_content="未找到相关酒店"></noData>
		</block>
		<block v-if="hotelList">
		<scroll-view style="height: calc(100vh - 84px);" scroll-x="false" scroll-y="true">
			
			<view>
				<xt-panal-list :count="hotelList.length">

					<!-- #ifdef MP -->
					<view v-for="(item,index) of hotelList" slot="card{{index}}">
						 <view style="display:flex;" class="zcard" @click="openHotel(item)">
							<view style="width:160px;min-height:120px">
								<image style="width:100%;height:100%" mode="aspectFill" :src="item.firstImages" />
							</view>
							<view style="padding:10px" class="zcard-right">
								<view class="item"><text class="title">{{item.hotelName}}</text></view>
								<view class="item"><text>距你直线距离 <text style="padding:0 4px;font-weight:bold">{{getDistance(location ,item.hotelCoordinate)}}</text>KM</text></view>
								<view class="item">
									<view class="tabscontainer" style=""> 
										<uni-tag v-for="i of item.feature" :inverted="true" :text="i" size="mini"/>
									</view>

								</view>
								<view class="item"><text style="color:#a1a1a1">{{item.hotelAddress}}</text></view>
								<view class="bottom item"><text></text></view>
							</view>
						</view>

					</view>
					<!-- #endif -->
					<!-- #ifdef H5 || APP-PLUS -->
					<template v-for="(item,index) of hotelList" v-slot:[`card${index}`]>
						<view style="display:flex;" class="zcard" @click="openHotel(item)">
							<view style="width:160px;min-height:120px">
								<image style="width:100%;height:100%" mode="aspectFill" :src="item.firstImages" />
							</view>
							<view style="padding:10px" class="zcard-right">
								<view class="item"><text class="title">{{item.hotelName}}</text></view>
								<view class="item"><text>距你直线距离<text style="padding:0 4px;font-weight:bold">{{getDistance(location ,item.hotelCoordinate)}}</text>KM</text></view>
								<view class="item">
									<view class="tabscontainer" style=""> 

										<uni-tag v-for="i of item.feature" :inverted="true" :text="i" size="mini"/>
								
									</view>

								</view>
								<view class="item"><text style="color:#a1a1a1">{{item.hotelAddress}}</text></view>
								<view class="bottom item"><text></text></view>
							</view>
						</view>
					</template>
					<!-- #endif -->


				</xt-panal-list>
			</view>

		</scroll-view>
	</block>
	</view>

</template>

<script>
	import xtDropdown from '../../../components/xt-dropdown/xt-dropdown.vue';
	import UniEasyinput from '../../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.vue';
	import UniIcons from '../../../uni_modules/uni-icons/components/uni-icons/uni-icons.vue';
	import {useStore} from 'vuex';
	import {  computed, ref,watch  } from 'vue';

	export default {
		components: {
			xtDropdown,
			UniEasyinput,
			UniIcons
		},
		setup(){
			const store = useStore();
			const searchCondition = computed(()=>{
				return store.state.hotelClientStore.searchCondition; 
			});
			const searchDateRange = computed(()=>{
				return store.state.hotelClientStore.searchDateRange; 
			});
			
			// watch(searchDateRange,(n,o)=>{
			// 	console.log("watch,,,",n)
			// })
			return {
				searchCondition,
				searchDateRange

			}
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
				
				
			}
		},
		computed: {
			isPcShow(){
				return this.$store.state.isPcShow;
			},
			 location(){
				return this.$store.state.location
			},
     
   
			hotelList() {
				return this.$store.state.hotelClientStore.hotelList;
			}
		},
		watch:{
			searchDateRange(n,o){
				//console.log("wwwwww",o)
				this.getHotelList();
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
			dateConfim(e) {
      console.log(e);
      this.$store.commit("hotelClientStore/updateSearchDateRange",e);
    },
			toSearch(){
				uni.navigateTo({
					url:"/pages_client/client/hotelSearch/hotelSearch",
					events:{
						getAddress:obj=>{
							console.log("ooooooooo",obj)
							this.getHotelList();
							}
						}
					
				})
			},
			async getHotelList() {
				if (this.isLoading) {
					console.log("isloading....");
					return;
				}
				uni.showLoading();
				
				try {
					let conditionForm= {
						filterVal:this.searchCondition.filterVal,
						address:this.searchCondition.address,
						location:this.searchCondition.location,
						dateRange:this.searchDateRange

			}
					const res = await this.$store.dispatch("hotelClientStore/getHotelList",conditionForm);
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
				this.$store.commit("hotelClientStore/updateHotel",hotel);
				//this.$store.commit("hotelClientStore/updateSearchCondition",this.conditionForm);				
				let href = `#/pages_client/client/hotelHome/hotelHome`;
				uni.navigateTo({
					url:`/pages_client/client/hotelHome/hotelHome`,
					complete:()=>{
						this.isLoading=false;
					}
				})
			},		
			getDistance(location,location_){//km距离
				let lon1 = location[0],la1=location[1];
				let lon2 = location_[0],la2=location_[1];
					let radLat1 = la1 * Math.PI / 180.0;
					let radLat2 = la2 * Math.PI / 180.0;
					let a = radLat1 - radLat2;
					let b = lon1 * Math.PI / 180.0 - lon2 * Math.PI / 180.0;
					let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
					s = s * 6378.137;
					s = Math.round(s * 10000) / 10000;
					console.log("距离",s);
					return this.numDelivery(s);
					//this.distance=s					

		},
		numDelivery(num) {

			let result = parseFloat(num);

			if (isNaN(result)) {

			console.log("传递参数错误，请检查！");

			return '--';

			}

			result = Math.round(num * 100) / 100;

			return result;

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