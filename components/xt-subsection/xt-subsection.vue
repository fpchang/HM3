<template>
  <view class="xt-subsection">
    <view class="xt-sub-container" :style="{'background-color':bgColor}">
      <view v-for="(item,index) in items" @click="checkTab(index)" :class="['sub-item',index==current?'sub-item-active':'']" :style="{'background-color':current==index?activeBgColor:''}">
        {{ item }}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "xt-subsection",
  props: {
    items:{
       type:Array,
      default:["选项一","选项二","选项三"]
    },
    bgColor:{
      type:String,
      default:"#eee"
    },
    activeBgColor:{
      type:String,
      default:"#fff"
    }
  },
  data() {
    return {
      current:0
    }
  },
  computed: {},
  methods: {
    checkTab(index){
      if(this.current==index){
        return;
      }
      this.current=index;
      this.$emit("checkTab",index);
    }
  },
  watch: {},

  // 组件周期函数--监听组件挂载完毕
  mounted() {},
  // 组件周期函数--监听组件数据更新之前
  beforeUpdate() {},
  // 组件周期函数--监听组件数据更新之后
  updated() {},
  // 组件周期函数--监听组件激活(显示)
  activated() {},
  // 组件周期函数--监听组件停用(隐藏)
  deactivated() {},
  // 组件周期函数--监听组件销毁之前
  beforeDestroy() {},
}
</script>

<style scoped lang="scss">
.xt-sub-container{
  display: flex;
  .sub-item{
    flex: 1;
    padding:10px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    color:#b3b3b3;

  }
  .sub-item-active{
    color:#000;
  }
}
</style>