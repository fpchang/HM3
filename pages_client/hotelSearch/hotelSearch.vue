<template>
	<view>
		<view style="padding:0 20px">
			<view class="search-style">
				<input style="background-color:transparent;flex:1" placeholder="位置/品牌/酒店" v-model="filterVal" :focus="true"></input>
				<view @click="search" style="padding:5px 0 5px 10px">
					<uni-icons type="search" size="22px" ></uni-icons>
				</view>
				
			</view>

		</view>
		<scroll-view style="height: calc(100vh - 84px);" scroll-x="false" scroll-y="true">
			<view>
				<xt-panal-list :count="list.length">

					<!-- #ifdef MP -->
					<view v-for="(item,index) of list" slot="card{{index}}">
						<view  class="zcard" @click="selectEvent(item)">	
							<view><uni-icons type="location-filled" size="20"></uni-icons></view>
							<view class="content">
								<view class="title"><text>{{item.name}}</text></view>
								<view class="ad"><text>{{item.district}}</text></view>
							</view>
							<view  class="flex-center">
								<text style="color:#bbb">地标</text>
							</view>			
						</view>

					</view>
					<!-- #endif -->
					<!-- #ifdef H5 || APP-PLUS -->
					<template v-for="(item,index) of list" v-slot:[`card${index}`]>
						<view  class="zcard" @click="selectEvent(item)">	
							<view><uni-icons type="location-filled" size="20"></uni-icons></view>
							<view class="content">
								<view class="title"><text>{{item.name}}</text></view>
								<view class="ad"><text>{{item.district}}</text></view>
							</view>
							<view  class="flex-center">
								<text style="color:#bbb">地标</text>
							</view>			
						</view>
					</template>
					<!-- #endif -->


				</xt-panal-list>
			</view>
			<view> 
				<uni-section label="热门"></uni-section>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import amap from "@/common/amap-wx.130";
import uniSection from '@/uni_modules/uni-section/components/uni-section/uni-section.vue';
	export default {
  components: { uniSection },
		data() {
			return {
				filterVal: "",
				list:[]
			}
		},
		onLoad() {
			console.log("config",this.$store.state.config)
			this.amapPlugin = new amap.AMapWX({
				key: this.$store.state.config.miniProgramKey,
			});
			//this.searchAddress(val)
		},
		watch: {
			filterVal(val) {
				console.log(val);
				if(val){
					this.searchAddress(val)
					return;
				}
				this.list=[];
			}
		},
		methods: {
			searchAddress(keywords) {
				let that = this;
				let location = this.$store.state.location;
				console.log("location",location)
				this.amapPlugin.getInputtips({
					keywords: keywords,
					location: location.toString(","),
					success: function(data) {
						console.log("sssss", data)												
						 that.list=data.tips
						
					}
				})
			},
			selectEvent(item){
				const eventChannel = this.getOpenerEventChannel();
				let obj={
							filterVal:item.name,
							address:item.address,
							location:item.location.split(",").map(Number)
				}
				this.$store.commit("hotelClientStore/updateSearchCondition",obj);
  				eventChannel.emit('getAddress',obj);
				uni.navigateBack()
			},
			search(){
				const eventChannel = this.getOpenerEventChannel();
				let obj={
						filterVal:this.filterVal,
						address:"",
						location:this.$store.state.location
				}
				this.$store.commit("hotelClientStore/updateSearchCondition",obj);
				console.log("返回参数",obj)
  				eventChannel.emit('getAddress',obj);
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.search-style {
		max-width: 450px;
		margin: auto;
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
		display: flex;
		padding:15px;
		box-sizing: border-box;
		.content{
			flex: 1;
			display: flex;
			flex-direction: column;
			gap:10px;
			.title{
				font-weight: bold;
				color: #000;
				font-size: 16px;
			}
			.ad{
				color: 13px;
				color: #a1a1a1;
			}
		}
	}
</style>