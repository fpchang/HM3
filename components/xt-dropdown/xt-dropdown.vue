<template>
  <view>
    <view class="dropdown-container">
      <view class="dp-label-area"> 
        <view  v-for="item of dataList" class="dp-item" @click="clickTab(item.id)"> 
          <text style="padding:0 5px" :class="[item.id==active_id?'active_text':'']">{{item.label}}</text>
          <uv-icon  name="arrow-down-fill" :color="item.id==active_id?'#06c':'#a1a1a1'" size="12px"
									top="2"></uv-icon>
        </view> 
      </view>
      
      <view class="dp-item-popup" v-if="active_id">
        <view  v-for="item of dataList" :class="['popup-container',item.id==active_id?'popup-container-active':'popup-container-noactive']" style="">
          <slot :name="item.id"></slot>
        </view>
        <view style="flex:1;" @click="clickShade"></view>
      </view>
    </view>
  </view>
</template>

<script>
import uniIcons from '../../uni_modules/uni-icons/components/uni-icons/uni-icons.vue'
export default{
  components: { uniIcons },
  name: "xt-dropdown",
  props: {
    dataList:{
      type:Array,
      default:[
        {
          id:"c1",
          label:"智能",

        },
        {
          id:"c2",
          label:"智能",

        },
        {
          id:"c3",
          label:"智能",

        }]
    }
  },
  data() {
    return {
      active_id:""
    }
  },
  computed: {},
  methods: {
    clickTab(id){
      this.active_id=id;
    },
    clickShade(){
      this.active_id="" 
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
.dropdown-container{ 
 
  position: relative;
  z-index:900;
  .dp-label-area{
    display: flex;
    align-items: center;
    justify-content: space-around;
   
    .dp-item{
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      color:#a1a1a1;
      cursor: pointer;
      &:hover{
        color: #313131;
      }
      .active_text{
        color:#06c;
      }
    }
  }
  
  .dp-item-popup{
    position: absolute;
    top:44px;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0,0,0,0);
    z-index: 999;
    display: flex;
    flex-direction: column;
    .popup-container{
      width: 100%;
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.5s linear;
    }
    .popup-container-noactive{
      transition: max-height 0s linear;
    }
    .popup-container-active{

      max-height: 100vh;

    }
  }
}
</style>