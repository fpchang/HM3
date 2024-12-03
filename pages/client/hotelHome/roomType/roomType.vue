<template>
 <view> 
  <xt-panal-list :dataList="roomType" maxWidth="1200">
				
    <!-- #ifdef MP -->
    <view v-for="(item,index) of roomType" slot="card{{index}}">
      
    </view>
    <!-- #endif -->
    <!-- #ifdef H5 || APP-PLUS -->
     <template v-for="(item,index) of roomType" v-slot:[`card${index}`]="data">
        <view class="roomCard">
           <image :src="item.firstImages" mode="aspectFill" :style="{'width':'100%','height':`${data.cardWidth*3/4}px`}"/>
          <view  class="label-area">
            <view class="name-sytle">
              <text class="label-item" style="color:#323233;font-weight:bold">{{item.name}}</text>
              <text class="label-item">{{item.area}}m²</text>
            </view>
            <view>
              <text>可住{{item.guestNumber||2}}人</text>
              <uni-icons type="forward"></uni-icons>
            </view>
          </view>
         
        </view>
     </template>
     <!-- #endif -->
  
    
</xt-panal-list>
 </view>
</template>

<script>
import {HotelService} from '@/services/HotelService';
import uniIcons from '../../../../uni_modules/uni-icons/components/uni-icons/uni-icons.vue';
export default {
  components: { uniIcons },
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

<style scoped lang="scss">
.label-area{
  display:flex;justify-content:space-between;align-items:center;padding:20px;
  cursor: pointer;
  color:#969799;
  .name-sytle{
    display:flex;flex-direction:column;
    gap:8px;
    .label-item{}
  }
}
</style>