<template>
  <view class="xt-panal-card">
    <view  class="xt-panal-card-container">
      <view class="header-style">

        <view v-if="showControl" style="flex: 1; display: flex; justify-content: flex-end; gap: 15px;padding:5px 10px">
          <uv-icon 
          v-if="control_add"
          name="plus-circle-fill"
          color="#000"
          size="22"
          :label="label_add"
          labelPos="bottom"
          labelSize="12px"
          @click="add_event"
        ></uv-icon>
        <uv-icon
        v-if="control_edit"
        name="edit-pen-fill"
        color="#000"
        size="22"
        :label="label_edit"
        labelPos="bottom"
        labelSize="12px"
        @click="edit_event"
      ></uv-icon>
        <uv-icon
        v-if="control_delete"
          name="trash-fill"
          color="#000"
          size="22"
          :label="label_delete"
          labelPos="bottom"
          labelSize="12px"
          @click="delete_event"
        ></uv-icon>
        <uv-icon
        v-if="control_view"
        name="eye-fill"
        color="#000"
        size="22"
        :label="label_view"
        labelPos="bottom"
        labelSize="12px"
        @click="view_event"
      ></uv-icon>
      <slot name="control"></slot>
        </view>
      </view>
      <view class="title-area"> 
        <view class="logo-style" v-if="showLogo">
          <image style="width:100%;height:100%" mode="aspectFit" :src="logoUrl||defaultLogoUrl" />
        </view>
        <view class="tit-style">          
          <view class="title-c">
            <view><text>{{title}}</text></view>
            <view>
              <slot name="titleRight"></slot></view>
           </view>
          <view><text class="sub-title">{{subtitle}}</text> </view>
          <view><slot name="titleContent"></slot></view>
        </view>
      </view>    
        <slot name="content"></slot>
      </view>
    </view>
</template>

<script>

export default{
  name: "xt-panal-card",
  props: {
    showControl:{
      type:Boolean,
      default:true,
    },
    showLogo:{
      type:Boolean,
      default:true
    },
    logoUrl:{
      type:String,
      default:"https://env-00jxhfhjd231.normal.cloudstatic.cn/HM/images/app.png"
    },
    title:{
      type:String,
      default:""//"亲子房+山景+阳台+影音（86寸TV+独立音箱）》"
    },
    subtitle:{
      type:String,
      default:""//"1张大床 及 2张单人床 4人入住 整套 2室 60M2 部分禁烟"
    },
    label_add:{
      type:String,
      default:"新增"
    },
    control_add:{
      type:Boolean,
      default:false
    },
    label_edit:{
      type:String,
      default:"编辑"
    },
    control_edit:{
      type:Boolean,
      default:true
    },
    label_delete:{
      type:String,
      default:"删除"
    },
    control_delete:{
      type:Boolean,
      default:true
    },
    label_view:{
      type:String,
      default:"详情"
    },
    control_view:{
      type:Boolean,
      default:true
    },

  },
  data() {
    return {
      defaultLogoUrl:"https://env-00jxhfhjd231.normal.cloudstatic.cn/HM/images/app.png"
    }
  },
  computed: {},
  methods: {
    add_event(){
      this.$emit("add_event");
    },
    edit_event(){
      this.$emit("edit_event");
    },
    delete_event(){
      this.$emit("delete_event");
    },
    view_event(){
      this.$emit("view_event");
    }
  },
  watch: {},

  // 组件周期函数--监听组件挂载完毕
  mounted() {
   
  },
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
.xt-panal-card-container{
  display: flex;
    flex-direction: column;
    gap: 10px;
}
.header-style {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.title-area{
  display: flex;
  padding:0 10px;
  .logo-style{
    width: 80px;
    height: 60px;
    border:0px solid #eee;
    box-sizing: border-box;
  }
  .tit-style {
    flex:1;
   padding-left: 8px;
    color: $uni-color-title;
    overflow: hidden;
    .title-c{
      font-weight: bold;
      font-size:16px ;
      display: flex;
      justify-content: space-between;
    }
    .sub-title{
      font-size:14px ;
      overflow: hidden;
    }
  }
}
</style>