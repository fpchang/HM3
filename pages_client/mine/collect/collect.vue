<template>
	<view>
		<unicloud-db
		v-slot:default="{ data, loading, error, options }"
	
		collection="hm-collect , hm-hotel"
		:where="`phone=='${user.phone}'`"

	  >
	 <hotelListComponent :hotelList="getHotelList(data)"></hotelListComponent>
		
	</unicloud-db>
		
	</view>
</template>

<script>
import hotelListComponent from '../../components/hotelListComponent';
	export default {
		components: {
			hotelListComponent
		},
		data() {
			return {
				
			}
		},
		computed:{
			user(){
				return this.$store.state.user||uni.getStorageSync("user");
			},
			location(){
				return this.$store.state.location
			}
		},
		methods: {
		getHotelList(data){
			let list =[];
			data.map(item=>{
				list.push(item.hotel_id[0])
			})
			return list;
		}
		}
	}
</script>

<style lang="scss" scoped>
	.search-style {
		max-width: 450px;
		margin:auto;
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
		cursor: pointer;
		&:hover{
			/*transform: scale(1.01);*/
			box-shadow: 2px 4px 12px #000;
			
		}
		.zcard-right{
			flex: 1;
			color: #4b4b4b;
			font-size:$uni-font-size-sm ;
			display: flex;
			flex-direction: column;
			.title{
				color: #313131;
				font-weight: bold;
				font-size:$uni-font-size-base ;
			}
			.item{
				padding:3px 0;
				.tabscontainer{
					display:flex;
					justify-content:flex-start;
					align-items:center;gap:8px;
					flex-wrap: wrap;
				}
			}
			.bottom{
				flex: 1;
				display: flex;
				justify-content: flex-end;
				align-items: flex-end;
			}
		}
	}
</style>
