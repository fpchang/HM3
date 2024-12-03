<template>
  <view class="grid-container">
    <slot></slot>
  </view>
</template>

<script>
export default {
  name: "xt-grid",
  props: {
    column:{
      type:Number,
      default:4
    }
  },
  data() {
    return {}
  },
  computed: {
    itemWidth(){
      return `${(100/this.column)}%`
    }
  },
  methods: {},
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
.grid-container{
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
</style>