<template>
	<view>
		<block v-if="hotelList&&hotelList.length<1">
			<noData text_content="未找到相关酒店"></noData>
		</block>
		<block v-if="hotelList">
			<scroll-view :style="{'height':scrollHeight }" scroll-x="false" scroll-y="true">
				
				<view>
					<xt-panal-list :count="hotelList.length">
		
						<!-- #ifdef MP -->
						<view v-for="(item,index) of hotelList" slot="card{{index}}">
							 <view style="display:flex;" class="zcard" @click="openHotel(item)">
								<view style="width:160px;height:120px">
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
								<view style="width:160px;height:120px">
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
	export default{
		props:{
			hotelList:{
				type:Array,
				default:[]
			},
			scrollHeight:{
				type:String,
				default:"100vh"
			}
		},
		setup(props){},
		computed: {
			user() {
				return this.$store.state.user || uni.getStorageSync("user");
			},
			location() {
				return this.$store.state.location
			}
		},
		created(){
			console.log("111111",this.hotelList)
		},
		methods: {
			openHotel(hotel) {
				if (this.isLoading) {
					return;
				}
				this.isLoading = true;
				this.$store.commit("hotelClientStore/updateHotel", hotel);
				//this.$store.commit("hotelClientStore/updateSearchCondition",this.conditionForm);				
				let href = `#/pages_client/hotelHome/hotelHome`;
				uni.navigateTo({
					url: `/pages_client/hotelHome/hotelHome`,
					complete: () => {
						this.isLoading = false;
					}
				})
			},
			getDistance(location, location_) { //km距离
				let lon1 = location[0],
					la1 = location[1];
				let lon2 = location_[0],
					la2 = location_[1];
				let radLat1 = la1 * Math.PI / 180.0;
				let radLat2 = la2 * Math.PI / 180.0;
				let a = radLat1 - radLat2;
				let b = lon1 * Math.PI / 180.0 - lon2 * Math.PI / 180.0;
				let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math
					.pow(Math.sin(b / 2), 2)));
				s = s * 6378.137;
				s = Math.round(s * 10000) / 10000;
				console.log("距离", s);
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