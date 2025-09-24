<template>
	<view class="xt-panal-list">
		<view style="display: flex; justify-content: center">
			<view class="card-container" :style="{width: `${cardContainerWidth}px`}">
				<view class="card" v-for="(item,index) in count" :style="{width: `${cardWidth}px`,'max-width':maxWidth}">
				
					<view class="card-item" :style="{'background':bgColor,'box-shadow':isShadow?shadow:''}">
						<!-- #ifdef MP -->
						<slot name="card{{index}}"></slot>
						<!-- #endif -->
						<!-- #ifdef H5 || APP-PLUS -->
						
						<slot :name="`card${index}`" :cardWidth="cardWidth -20"></slot>
						<!-- #endif -->
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "xt-panal-list",
		props: {
			wrap:{
				type:Boolean,
				default:true
			},
			bgColor:{
				type:String,
				default:"#fff"
			},
			isShadow:{
				type:Boolean,
				default:true
			},
			shadow:{
				type:String,
				default:"0px 0px 9px #00000014"
			},
			maxWidth:{
				type:Number,
				default:3840
			},
			dataList: {
				type: Array,
				default: []
			},
			count:{
				type:Number,
				default:1
			},
			num: {
				type: Number,
				default: 1
			}
		},
		data() {
			return {
				obj:{tt:"123"},
				widthTemp: 0
			}
		},
		computed: {

			viewWidth() {
				const sys = uni.getSystemInfoSync();
				let isPc = sys['deviceType'] == "pc"
				let w = sys['windowWidth'];
				// #ifdef MP-WEIXIN ||APP-PLUS
				w = uni.getWindowInfo().windowWidth;
				isPc = uni.getDeviceInfo()['deviceType'] == "pc";
				// #endif
				w=Math.min(this.maxWidth,w);
				let scrollWidth = isPc ? 20 : 0;
				let val = w - scrollWidth;

				return val + this.widthTemp - this.widthTemp;
			},

			cardWidth() {
				let windowWidth = this.viewWidth; //-20 为pc端滚动条宽度
				let count = Math.floor(windowWidth / 370);
				if (count == 0) {
					return windowWidth;
				}
				if(!this.wrap){
					return windowWidth;
				}
				let ys = windowWidth % 370;
				return Math.min(370 + ys / count, 450);
			},
			maxWidth(){
				if(this.wrap){
					return '450px';
				}
				return 'none';
			},
			cardContainerWidth() {
				let count = Math.max(Math.floor(this.viewWidth / this.cardWidth), 1);
				return this.cardWidth * count;
			},

		},
		methods: {},
		watch: {},

		// 组件周期函数--监听组件挂载完毕
		mounted() {
			if (window) {
				window.onresize = () => {
					this.widthTemp = Math.random(10);
				};
			}
		},
		// 组件周期函数--监听组件数据更新之前
		beforeUpdate() {},
		// 组件周期函数--监听组件数据更新之后
		updated() {},
		// 组件周期函数--监听组件激活(显示)
		activated() {},
		// 组件周期函数--监听组件停用(隐藏)
		deactivated() {},
		// 组件周期函数--监听组件销毁之前
		beforeDestroy() {},
	}
</script>

<style scoped lang="scss">
:root{
--cardItemBgColor:#fff;
}
 
	.card-container {
		display: flex;
		flex-wrap: wrap;
		min-width: 370px;

		.card {
			min-width: 370px;
			max-width: 450px;
			padding: 10px;
			box-sizing: border-box;

			.card-item {
				height: 100%;
				box-sizing: border-box;
				background: var(--cardItemBgColor);
				/* box-shadow: 0 0 4px 4px #e4e0e0;*/
				border-radius: 10px;
				overflow: hidden;

				
			}
		}
	}
</style>