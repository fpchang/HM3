<template>
  <view class="xt-subsection" :style="styleStr">
    <view class="xt-sub-container">
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
    fColor:{
       type:String,
        default:"#a1a1a1"
    },
    activeBgColor:{
      type:String,
      default:"#FFF"
    },
    activeFColor:{
       type:String,
        default:"#000"
    },
    activeBgColor:{
      type:String,
      default:"#fff"
    }
  },
  data() {
    return {
      current:0,
      styleStr:""
    }
  },
  created(){
     this.styleStr=`--fcolor:${this.fColor};--bgColor:${this.bgColor};--activeBgColor:${this.activeBgColor};--activeFcolor:${this.activeFColor}`
  },

  computed: {
   
  },
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
     flex-direction: row;
  background-color: var(--bgColor,#eee);
  font-size: 18px;
  .sub-item{
    flex: 1;
    padding:10px 0;
    display: flex;
 
    justify-content: center;
    align-items: center;
    color:var(--fcolor,#a1a1a1);
    font-weight: 400;

  }
  .sub-item-active{
    background-color: var(--activeBgColor,#fff);
    color:var(--activeFcolor,#000);
  }
}
</style>