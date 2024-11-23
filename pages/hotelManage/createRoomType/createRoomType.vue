<template>
  <view>
    <scroll-view
      :scroll-y="true"
      :scroll-x="false"
      class="scroll-view"
      style=""
    >
    <view class="container"> 
      <createRoomTypeComponent
        @closePopup="closePopup"
        :type="type"
        :rt="targetObj"
        v-if="targetObj"
      ></createRoomTypeComponent>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import createRoomTypeComponent from "../components/createRoomTypeComponent.vue";
export default {
  components: {
    createRoomTypeComponent,
  },
  data() {
    return {
      type: 0,
      targetObj: null,
    };
  },
  onLoad(obj) {
    console.log("参数传递", obj);
    try {
      this.type = obj.type;
      this.targetObj = JSON.parse(decodeURIComponent(obj.rt));
      console.log("参数转换", this.targetObj)
      const titleArray=["创建房型","修改房型","房型详情"];
      uni.setNavigationBarTitle({title:titleArray[obj.type]})
    } catch (error) {
     // console.error(error);
      this.type = 0;
      this.targetObj = {};
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
