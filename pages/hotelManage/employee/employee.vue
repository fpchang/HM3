<template>
	<view>
		<employeeComponent></employeeComponent>
	</view>
</template>

<script>
	import employeeComponent from "@/pages/hotelManage/components/employeeComponent.vue";
	export default {
		components: {
		  employeeComponent
		  },
		data() {
			return {
				
			}
		},
			  async onPullDownRefresh() {
     await this.$store.dispatch("getRoomType");
    uni.stopPullDownRefresh();
  },
		methods: {
			
		}
	}
</script>

<style>

</style>
