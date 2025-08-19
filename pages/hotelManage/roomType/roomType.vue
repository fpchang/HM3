<template>
	<view>
		<roomTypeListComponent ref="roomTypeListComponent"></roomTypeListComponent>
	</view>
</template>

<script>
	import roomTypeListComponent from "@/pages/hotelManage/components/roomTypeListComponent.vue";
	export default {
		components: {
		  roomTypeListComponent
		  },
		data() {
			return {
				
			}
		},
		  async onPullDownRefresh() {
     await this.$refs.roomTypeListComponent.getEmployeeList();
    uni.stopPullDownRefresh();
  },
		methods: {
			
		}
	}
</script>

<style>

</style>
