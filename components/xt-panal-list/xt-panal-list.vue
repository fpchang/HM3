<template>
  <view class="xt-panal-list">
    <view style="display: flex; justify-content: center">
			<view class="card-container" :style="{width: `${cardContainerWidth}px`}">
				<view class="card" v-for="(item,index) of dataList"
					:style="{width: `${cardWidth}px`}">
					<view class="card-item">
						<slot :name="'card'+index"></slot>
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
    dataList:{
      type:Array,
      default:[]
    },
    num:{
      type:Number,
      default:1
    }
  },
  data() {
    return {
      widthTemp: 0
    }
  },
  computed: {
			
			viewWidth() {
        const sys =uni.getSystemInfoSync(); 
			let isPc = sys['deviceType'] == "pc"
			let w = sys['windowWidth'];
			// #ifdef MP-WEIXIN ||APP-PLUS
			w = uni.getWindowInfo().windowWidth;
			isPc =uni.getDeviceInfo()['deviceType'] == "pc" ;
			// #endif
			let scrollWidth =isPc ? 20 : 0;
			let val = w - scrollWidth;

				return val + this.widthTemp - this.widthTemp;
			},

			cardWidth() {
				let windowWidth = this.viewWidth; //-20 为pc端滚动条宽度
				let count = Math.floor(windowWidth / 370);
				if (count == 0) {
					return windowWidth;
				}
				let ys = windowWidth % 370;
				return Math.min(370 + ys / count, 450);
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
			this.getOrderDishesList();
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
      background: #fff;
      box-shadow: 0 0 4px 4px #e4e0e0;
      border-radius: 8px;
    }
  }
}
</style>