<template>
 <view> 
  <xt-panal-list :dataList="roomType">
				
    <!-- #ifdef MP -->
    <view v-for="(item,index) of roomType" slot="card{{index}}">
      
    </view>
    <!-- #endif -->
    <!-- #ifdef H5 || APP-PLUS -->
     <template v-for="(item,index) of roomType" v-slot:[`card${index}`]>
1111111111
       </template>
     <!-- #endif -->
  
    
</xt-panal-list>
 </view>
</template>

<script>
import {HotelService} from '@/services/HotelService';
export default {
  name: "roomType",
  props: {
    hotel_id:{
      type:String,
      default:""
    }
  },
  data() {
    return {
      roomType:[]
    }
  },
 async created(){
  await this.getRoomType();
  },

  computed: {},
  methods: {
    async getRoomType(){
      const res = await  HotelService.getRoomType(this.hotel_id);
				console.log("房型列表 client",res);
				this.roomType = res.result.data;
      
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

<style scoped></style>