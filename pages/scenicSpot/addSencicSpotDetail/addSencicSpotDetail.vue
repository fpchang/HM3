<template>
	<view>
		<scroll-view :scroll-y="true" :scroll-x="false" class="scroll-view" style="">
			<view class="container"> 
			<addScenicSpotDetailComponent
			v-if="targetObj"
			@closePopup="closePopup"
			:type="type"
			:targetObj="targetObj"
		  ></addScenicSpotDetailComponent>
		  </view>
		</scroll-view>
	</view>
</template>

<script>
import addScenicSpotDetailComponent from '../components/addScenicSpotDetailComponent.vue'
	export default {
		data() {
			return {
				type:0,
      			targetObj:null
			}
		},
		components:{
			addScenicSpotDetailComponent
		},
		onLoad(obj) {
    console.log("参数传递", obj);
    try {
      this.type = obj.type;
      this.targetObj = JSON.parse(obj.targetObj);
	  console.log("解析",this.targetObj)
      uni.setNavigationBarTitle({
        title: obj.type == "1" ? "修改景点价目" : "新增景点价目",
      });
    } catch (error) {
		console.log(error)
      this.type = 0;
	  this.targetObj={}
    }
  },
		methods: {
			closePopup(){
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss">
.scroll-view {
	.container{
		padding: 20px 15px;
	}
	
	box-sizing: border-box;
	height:100vh;
}
</style>
