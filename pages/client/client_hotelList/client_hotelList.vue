<template>
	<view> 	
	<view>
	<xt-dropdown>
		<template v-slot:["c1"]><view style="height:100px;background:red"></view></template>
		<template v-slot:["c2"]><view style="height:200px;background:green"></view></template>
		<template v-slot:["c3"]><view style="height:300px;background:orange"></view></template>
	</xt-dropdown>
		
	</view>
		<scroll-view style="height: 40vh;" scroll-x="false" scroll-y="true">
			<view></view>						
			<view style="height:2300px"></view>
		</scroll-view>
	</view>

</template>

<script>
import xtDropdown from '../../../components/xt-dropdown/xt-dropdown.vue';
	export default {
  components: { xtDropdown },
		data() {
			return {

			}
		},
		computed: {
			hotelList() {
				return this.$store.state.hotelClientStore.hotelList;
			}
		},
		methods: {

		},
		onShow(){
			try {
				if(this.$store.state.isPcShow){
					document.getElementsByTagName('uni-page-head')[0].style.display = 'none';
				}
				
			} catch (error) {
				
			}
		}
	}
</script>

<style>

</style>