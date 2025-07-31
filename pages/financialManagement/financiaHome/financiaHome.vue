<template>
	<view>
		<fmIndexComponent ref="fmIndexComponent"></fmIndexComponent>
	</view>
</template>

<script>
	import fmIndexComponent from "../components/fmIndexComponent"
	export default {
		components:{
			fmIndexComponent
		},
		data() {
			return {
				
			}
		},
		async onPullDownRefresh() {
			await this.$refs.fmIndexComponent.refrushData();
    		uni.stopPullDownRefresh();
  		},
		methods: {
			
		}
	}
</script>

<style>

</style>
