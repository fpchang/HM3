<template>
  <scroll-view class="scroll-style" :scroll-x="false" :scroll-y="true">
    <view class="roomType"> 

   
  <xt-panal-list :dataList="roomType" maxWidth="1200">
				
    <!-- #ifdef MP -->
    <view v-for="(item,index) of roomType" slot="card{{index}}">
      
    </view>
    <!-- #endif -->
    <!-- #ifdef H5 || APP-PLUS -->
     <template v-for="(item,index) of roomType" v-slot:[`card${index}`]="data">
        <view class="roomCard">
          <view class="img-area" :style="{'height':`${data.cardWidth*3/4}px`}"> 
            <image :src="item.firstImages" mode="aspectFill" style="width:100%;height:100%"  @click="roomDetail(item)"/>
          </view>
          
          <view  class="label-area" @click="roomDetail(item)">
            <view class="name-sytle">
              <text class="label-item" style="color:#323233;font-weight:bold">{{item.name}}</text>
              <text class="label-item">{{item.area}}m²</text>
            </view>
            <view>
              <text>可住{{item.guestNumber||2}}人</text>
              <uni-icons type="forward"></uni-icons>
            </view>
            
          </view>
          <view class="p-list"> 
            <view class="p-list-item">
              <view class="title-area"> 
                <text>标准价格</text>
              </view>
              <view class="pr-area"> 
                <text class="pr-text">￥299</text>
                <text class="edit-text-btn-style">预定</text>
              </view>
              
            </view>
            <view class="p-list-item">
              <view class="title-area"> 
                <text>包含2份早餐</text>
              </view>
              <view class="pr-area"> 
                <text class="pr-text">￥399</text>
                <text class="edit-text-btn-style">预定</text>
              </view>
            </view>
            <view class="p-list-item">
              <view class="title-area"> 
                <text>包含2份早餐</text>
                <text class="text-overflow-ellipsis">包含2张萤火虫票包含2张萤火虫票包含2张萤火虫票包含2张萤火虫票</text>
              </view>
              
              <view class="pr-area"> 
                <text class="pr-text">￥499</text>
                <text class="edit-text-btn-style">预定</text>
              </view>
            </view>
          </view>
        </view>
     </template>
     <!-- #endif -->
  
    
</xt-panal-list>
</view>
  </scroll-view>
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
    roomDetail(item){
      uni.navigateTo({
          url: `/pages/client/roomDetail/roomDetail?roomType=${encodeURIComponent(JSON.stringify(item))}`,
        });
    },
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
$showWidth:1200px;
.scroll-style{
  height:calc(100vh - 70px);
}
.roomType{
  
  max-width: 100vw;
  width:$showWidth;
  margin:auto;
 /* background-color:#f1f1f1*/
}
.img-area{
  box-sizing:border-box;
  padding:10px;
  width:100%;
}
.label-area{
  display:flex;justify-content:space-between;align-items:center;padding:0 20px 20px 20px;
  cursor: pointer;
  color:#969799;
  .name-sytle{
    display:flex;flex-direction:column;
    gap:8px;
    .label-item{}
  }
}
.p-list{
  .p-list-item{
    box-sizing: border-box;
    padding:15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #eee;
    &:last-child{
      border-bottom: 1px solid #eee;
    }
  .title-area{
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex: 1;
  }
  .pr-area{
    display: flex;
    flex-wrap: nowrap;
    align-items: baseline;
    justify-content: space-between;
    min-width: 86px;
    .pr-text{
      color: orange;
      font-weight: bold;
      padding:0 4px;
    }
  }
 
  }
} 
</style>