<template>
	<view>
	
		<fmChartComponent ref="fmChartComponent"></fmChartComponent>
	</view>
</template>

<script>
	import fmChartComponent from "../components/fmChartComponent";
	export default {
		components:{
				fmChartComponent
			},
		data() {
			
			return {
				
			}
		},
		     async onPullDownRefresh() {
      await this.$refs.fmChartComponent.refrushData();
    uni.stopPullDownRefresh();
  },
		methods: {
			
		}
	}
</script>

<style>

</style>
