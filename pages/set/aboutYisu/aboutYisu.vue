<template>
	<view>
		<view class="container">
			<view class="img-container"> 
				<image style="width: 200px; height: 150px; background-color: #eeeeee;"  src="https://env-00jxhfhjd231.normal.cloudstatic.cn/HM/images/app.png"></image>
			</view>
			<uni-list>
				<uni-list-item title="企业"   right-text="湖州玄天科技有限公司"></uni-list-item>
				<uni-list-item title="联系人"  right-text="19083441181"> </uni-list-item>
				<uni-list-item title="备案号"  right-text="浙ICP备2024130639号-3A"></uni-list-item>
				
			</uni-list>
			
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
.container{
	margin:auto;
	width: 100vw;
	max-width:800px ;
	padding:15px;
	box-sizing: border-box;
	.img-container{
		display: flex;
		justify-content: center;
		align-items: center;
		padding:10px;
	}
}
</style>
