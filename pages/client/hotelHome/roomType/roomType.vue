<template>
  <scroll-view class="scroll-style" :scroll-x="false" :scroll-y="true">
    <view class="roomType"> 

   
  <xt-panal-list :dataList="roomType" maxWidth=1200>
				
    <!-- #ifdef MP -->
    <view v-for="(item,index) of roomType" slot="card{{index}}">
      <view class="roomCard">
        <view class="img-area" style=""> 
          <image :src="item.firstImages" mode="widthFix" style="width:100%;height:100%"  @click="roomDetail(item)"/>
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
          <view class="p-list-item" v-if="item.priceBase>0">
            <view class="title-area"> 
              <text>{{item.priceBase_name||'标准价格'}}</text>
            </view>
            <view class="pr-area"> 
              <text class="pr-text">￥{{item.priceBase}}</text>
              <text class="edit-text-btn-style" @click="reserve(item,'priceBase')">预定</text>
              <text class="edit-text-btn-style" @click="bargain(item,'priceBase')" v-if="item.isBargain">议价</text>
            </view>
            
          </view>
          <view class="p-list-item" v-if="item.priceA>0">
            <view class="title-area"> 
              <text>{{item.priceA_name}}</text>
            </view>
            <view class="pr-area"> 
              <text class="pr-text">￥{{item.priceA}}</text>
              <text class="edit-text-btn-style" @click="reserve(item,'priceA')">预定</text>
              <text class="edit-text-btn-style" @click="bargain(item,'priceA')" v-if="item.isBargain">议价</text>
            </view>
          </view>
          <view class="p-list-item" v-if="item.priceB>0">
            <view class="title-area"> 
              <text>{{item.priceB_name}}</text>
              <text class="text-overflow-ellipsis"></text>
            </view>
            
            <view class="pr-area"> 
              <text class="pr-text">￥{{item.priceB}}</text>
              <text class="edit-text-btn-style" @click="reserve(item,'priceB')">预定</text>
              <text class="edit-text-btn-style" @click="bargain(item,'priceB')" v-if="item.isBargain">议价</text>
            </view>
          </view>
        </view>
      </view>
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
            <view class="p-list-item" v-if="item.priceBase>0">
              <view class="title-area"> 
                <text>{{item.priceBase_name||'标准价格'}}</text>
              </view>
              <view class="pr-area"> 
                <text class="pr-text">￥{{item.priceBase}}</text>
                <text class="edit-text-btn-style" @click="reserve(item,'priceBase')">预定</text>
                <text class="edit-text-btn-style" @click="bargain(item,'priceBase')" v-if="item.isBargain">议价</text>
              </view>
              
            </view>
            <view class="p-list-item" v-if="item.priceA>0">
              <view class="title-area"> 
                <text>{{item.priceA_name}}</text>
              </view>
              <view class="pr-area"> 
                <text class="pr-text">￥{{item.priceA}}</text>
                <text class="edit-text-btn-style" @click="reserve(item,'priceA')">预定</text>
                <text class="edit-text-btn-style" @click="bargain(item,'priceA')" v-if="item.isBargain">议价</text>
              </view>
            </view>
            <view class="p-list-item" v-if="item.priceB>0">
              <view class="title-area"> 
                <text>{{item.priceB_name}}</text>
                <text class="text-overflow-ellipsis"></text>
              </view>
              
              <view class="pr-area"> 
                <text class="pr-text">￥{{item.priceB}}</text>
                <text class="edit-text-btn-style" @click="reserve(item,'priceB')">预定</text>
                <text class="edit-text-btn-style" @click="bargain(item,'priceB')" v-if="item.isBargain">议价</text>
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
      
    },
    reserve(item,p){
      uni.showToast({title:"暂未开放",icon:"none"});
    },
    bargain(item,p){
      uni.showToast({title:"暂未开放",icon:"none"});
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
    color: #6e6e6e;
  }
  .pr-area{
    display: flex;
    flex-wrap: nowrap;
    align-items: baseline;
    justify-content: space-between;
    min-width: 86px;
    gap:8px;
    .pr-text{
      color: orange;
      font-weight: bold;
      padding:0 4px;
    }
  }
 
  }
} 
</style>