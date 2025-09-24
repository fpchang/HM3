<template>
	<view class="xt-tag">
		<view class="con-x" v-if="closable" @click="close">
			<l-icon name="material-symbols:cancel-rounded" color="rgb(198, 199, 203)" size="18px"></l-icon>
		</view>
		<view class="con-t" :style="{'background-color':bgColor,'color':color}">{{text}}</view>
	</view>
</template>

<script>
	export default {
		name:"xt-tag",
		props:{
			text:{
				type:String,
				default:""
			},
			closable:{
				type:Boolean,
				default:false
			},
			bgColor:{
				type:String,
				default:"#3c9cff"
			},
			color:{
				type:String,
				default:"#fff"
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			close(){
				this.$emit("close");
			}
		}
	}
</script>

<style lang="scss">
	.xt-tag{
		
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		padding:8px 12px 0 0;
		.con-x{
			position: absolute;
			right:0;
			top:0;
		}
		.con-t{
			
			padding:3px;
			text-align: center;
			border-radius: 1px;
			font-size: 15px;
			min-width: 45px;
		}
	}
</style>