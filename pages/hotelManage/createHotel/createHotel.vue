<template>
  <view>
    <scroll-view
      :scroll-y="true"
      :scroll-x="false"
      class="scroll-view"
      style=""
    >
    <view class="container"> 
      <createHotelComponent
        v-if="targetObj"
		:targetObj="targetObj"
		:type="type"
        @closePopup="closePopup"
      ></createHotelComponent>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import createHotelComponent from "../components/createHotelComponent";
export default {
  components: {
    createHotelComponent,
  },
  data() {
    return {
      targetObj: null,
	  type:0
    };
  },
  onLoad(obj) {
    console.log("参数传递", obj);
    try {
      this.type = obj.type;
      this.targetObj =JSON.parse(decodeURIComponent(obj.targetObj));
      const titleArray=["新增酒店","修改酒店信息","酒店详情"];
      uni.setNavigationBarTitle({title:titleArray[obj.type]})
    } catch (error) {
      this.type = 0;
	  this.targetObj={}
    }
  },
  methods: {
    closePopup() {
      uni.navigateBack();
    },
  },
};
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
