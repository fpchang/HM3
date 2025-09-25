<template>
	<view class="echartComponent"> 
			 <e-chart ref="echartRef" width="100%"/> 
	</view>
</template>

<script>
	import eChart from './e-chart/e-chart';
	export default {
		components:{
			eChart
		},
		props:{
			width:{
				type:String,
				default:"100%"
			},
			height:{
				type:String,
				default:"100%"
			},
			option:{
				type:Object,
				default:{}
			}
		},
		data(){},
		mounted(){
			//this.init();
		},
		methods:{
			init(option){
				this.$refs.echartRef.init(option)
			}
		}
		
	}
</script>

<style lang="scss">
	.echartComponent{
		width: 100%;
		height: 100%;
	}
</style>