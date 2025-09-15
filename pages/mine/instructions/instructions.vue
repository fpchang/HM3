<template>
	<view class="instructions">
		<uni-section class="mb-10" title="PC访问" type="line"  padding="0 0 5px 10px">
			<view class="list-item">
				<view class="t1">地址</view><view>http://hm.hotelsys.fun</view><view class="control" @click="copyEvent('http://hm.hotelsys.fun')">复制</view>
			</view>
		</uni-section>
		<view style="padding:20px">APP等其它平台正在陆续上架中....</view>
		<!-- <uni-section class="mb-10" title="App" type="line"  padding="0 0 5px 10px">
			<view class="list-item">
				<view class="t1">IOS</view><view>http://hm.hotelsys.fun</view><view class="control">复制</view>
			</view>
			<view class="list-item">
				<view class="t1">Android</view><view>http://hm.hotelsys.fun</view><view class="control">复制</view>
			</view>
		</uni-section>
		<uni-section class="mb-10" title="微信小程序" type="line"  padding="0 0 5px 10px">
			<view class="list-item">
				<view class="t1">地址</view><view>http://hm.hotelsys.fun</view><view class="control">复制</view>
			</view>
		</uni-section>
		<uni-section class="mb-10" title="抖音小程序" type="line"  padding="0 0 5px 10px">
			<view class="list-item">
				<view class="t1">地址</view><view>http://hm.hotelsys.fun</view><view class="control">复制</view>
			</view>
		</uni-section> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			copyEvent(str){
				uni.setClipboardData({
        data: str,
        success: function () {
          //console.log("success");
        },
      });
			}
		}
	}
</script>

<style lang="scss">
.list-item{
	display: flex;
	justify-content: space-around;
	.t1{
		width: 80px;
	}
}
.control{
	color:#0765ae;
	cursor: pointer;
}
</style>
