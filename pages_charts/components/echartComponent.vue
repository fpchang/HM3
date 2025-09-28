<template>
	<view class="echartComponent" :style="{'width':width,'height':height}"> 
			 <e-chart ref="echartRef" width="100%" height="100%"/> 
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
				default:"380px"
			},
			option:{
				type:Object,
				default:{}
			}
		},
		data(){
			return {option:null}
		},
		mounted(){
	
		},
		methods:{
			init(option){
				this.option=option;
				this.$refs.echartRef.init(this.option);
				
			}
		}
		
	}
</script>

<style lang="scss" scoped>
	.echartComponent{
		flex:1;
		
		
	}
</style>