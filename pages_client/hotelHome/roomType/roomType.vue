<template>
  <view v-if="!isLoading"> 
    <view class="search"> 
      <uni-datetime-picker v-model="dateRange" type="daterange" return-type="timestamp" @change="dateConfim" >
        <text class="strong">{{foramtDateLabel(dateRange[0]).de}}</text
        ><text class="normal" style="padding: 0 10px">{{foramtDateLabel(dateRange[0]).dy}}</text>
        <text style="padding: 0 25px">-</text>
        <text class="strong">{{foramtDateLabel(dateRange[1]).de}}</text
        ><text class="normal" style="padding: 0 10px">{{foramtDateLabel(dateRange[1]).dy}}</text>
      </uni-datetime-picker>
    </view>
    <block v-if="remainTypeList.length<1">
			<noData text_content="无房型数据"></noData>
		</block>
		<block v-if="remainTypeList&&remainTypeList.length">
      <scroll-view class="scroll-style" scroll-x="false" scroll-y="true" refresher-enabled  @refresherrefresh="getRemainRoomType" :refresher-triggered="isLoading">
        <view class="roomType">   
      <xt-panal-list :count="remainTypeList.length" maxWidth=1200>
            
        <!-- #ifdef MP -->
        <view v-for="(item,index) of remainTypeList" slot="card{{index}}">
          <view class="roomCard">
            <view class="img-area" style=""> 
              <image :src="item.firstImages" mode="widthFix" style="width:100%;height:100%"  @click="roomDetail(item)"/>
            </view>
            
            <view  class="label-area" @click="roomDetail(item)">
              <view class="name-sytle">
                <text class="label-item" style="color:#323233;font-weight:bold">{{item.name}}</text>
                <text class="label-item">{{item.area}}m²</text>
                <text v-if="item.remainCount>0">剩余{{item.remainCount}}间</text>
                  <text v-if="item.remainCount<1" style="color:#0765ae;font-weight:bold">满房</text>
              </view>
              <view>
                <text>可住{{item.guestNumber||2}}人</text>
                <uni-icons type="forward"></uni-icons>
              </view>
              
            </view>
            <view class="p-list" v-if="item.remainCount>0"> 
              <view class="p-list-item" v-if="item.priceBase>0">
                <view class="title-area"> 
                  <text>{{item.priceBase_name||'标准价格'}}</text>
                </view>
                <view class="pr-area"> 
                  <text class="pr-text">￥{{item.priceBase}}</text>
                  <text  class="edit-text-btn-style" @click="reserve(item,'priceBase')" v-if="hotel.onlineReserve&&item.remainCount>0">预定</text>
                  <!-- <text class="edit-text-btn-style" @click="bargain(item,'priceBase')" v-if="item.remainCount>0&&item.isBargain">议价</text> -->
                </view>
                
              </view>
              <view class="p-list-item" v-if="item.priceA>0">
                <view class="title-area"> 
                  <text>{{item.priceA_name}}</text>
                </view>
                <view class="pr-area"> 
                  <text class="pr-text">￥{{item.priceA}}</text>
                  <text class="edit-text-btn-style" @click="reserve(item,'priceA')" v-if="hotel.onlineReserve&&item.remainCount>0">预定</text>
                  <!-- <text class="edit-text-btn-style" @click="bargain(item,'priceA')" v-if="item.remainCount>0&&item.isBargain">议价</text> -->
                </view>
              </view>
              <view class="p-list-item" v-if="item.priceB>0">
                <view class="title-area"> 
                  <text>{{item.priceB_name}}</text>
                  <text class="text-overflow-ellipsis"></text>
                </view>
                
                <view class="pr-area"> 
                  <text class="pr-text">￥{{item.priceB}}</text>
                  <text  class="edit-text-btn-style" @click="reserve(item,'priceB')" v-if="hotel.onlineReserve&&item.remainCount>0">预定</text>
                  <!-- <text class="edit-text-btn-style" @click="bargain(item,'priceB')" v-if="item.remainCount>0&&item.isBargain">议价</text> -->
                </view>
              </view>
            </view>
          </view>
        </view>
        <!-- #endif -->
        <!-- #ifdef H5 || APP-PLUS -->
         <template v-for="(item,index) of remainTypeList" v-slot:[`card${index}`]="data">
            <view class="roomCard">
              <view class="img-area" :style="{'height':`${data.cardWidth*3/4}px`}"> 
                <image :src="item.firstImages" mode="aspectFill" style="width:100%;height:100%"  @click="roomDetail(item)"/>
              </view>
              
              <view  class="label-area" @click="roomDetail(item)">
                <view class="name-sytle">
                  <text class="label-item" style="color:#323233;font-weight:bold">{{item.name}}</text>
                  <text class="label-item">{{item.area}}m²</text>
                  <text v-if="item.remainCount>0">剩余{{item.remainCount}}间</text>
                  <text v-if="item.remainCount<1" style="color:#0765ae;font-weight:bold">满房</text>
                </view>
                <view>
                  <text>可住{{item.guestNumber||2}}人</text>
                  <uni-icons type="forward"></uni-icons>
                </view>
                
              </view>
              <view class="p-list" v-if="item.remainCount>0"> 
                <view class="p-list-item" v-if="item.priceBase>0">
                  <view class="title-area"> 
                    <text>{{item.priceBase_name||'标准价格'}}</text>
                  </view>
                  <view class="pr-area"> 
                    <text class="pr-text">￥{{item.priceBase}}</text>
                    <text  class="edit-text-btn-style" @click="reserve(item,'priceBase')" v-if="hotel.onlineReserve&&item.remainCount>0">预定</text>
                    <!-- <text class="edit-text-btn-style" @click="bargain(item,'priceBase')" v-if="item.remainCount>0&&item.isBargain">议价</text> -->
                  </view>
                  
                </view>
                <view class="p-list-item" v-if="item.priceA>0">
                  <view class="title-area"> 
                    <text>{{item.priceA_name}}</text>
                  </view>
                  <view class="pr-area"> 
                    <text class="pr-text">￥{{item.priceA}}</text>
                    <text  class="edit-text-btn-style" @click="reserve(item,'priceA')" v-if="hotel.onlineReserve&&item.remainCount>0">预定</text>
                    <!-- <text class="edit-text-btn-style" @click="bargain(item,'priceA')" v-if="item.remainCount>0&&item.isBargain">议价</text> -->
                  </view>
                </view>
                <view class="p-list-item" v-if="item.priceB>0">
                  <view class="title-area"> 
                    <text>{{item.priceB_name}}</text>
                    <text class="text-overflow-ellipsis"></text>
                  </view>
                  
                  <view class="pr-area"> 
                    <text class="pr-text">￥{{item.priceB}}</text>
                    <text  class="edit-text-btn-style" @click="reserve(item,'priceB')" v-if="hotel.onlineReserve&&item.remainCount>0">预定</text>
                    <!-- <text class="edit-text-btn-style" @click="bargain(item,'priceB')" v-if="item.remainCount>0&&item.isBargain">议价</text> -->
                  </view>
                </view>
              </view>
            </view>
         </template>
         <!-- #endif -->
      
        
    </xt-panal-list>
    </view>
      </scroll-view>
    </block>
   
  </view>
  
</template>

<script>
import {HotelServiceClient} from '@/services/HotelServiceClient';
import uniIcons from '@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue';
import {useStore} from 'vuex';
import {  computed, ref,watch  } from 'vue';
export default {
  components: { uniIcons },
  name: "roomType",
  props: {
    hotel_id:{
      type:String,
      default:""
    }
  },
  setup(){
      const store = useStore();
    	const searchDateRange = computed(()=>{
				return store.state.hotelClientStore.searchDateRange; 
			});
      let dateRange = ref([searchDateRange.value[0],searchDateRange.value[1]]);
      const hotel =computed(()=>{
        return store.state.hotelClientStore.hotel;
      })
      const user =computed(()=>{
        return store.state.user;
      })
      return {
        user,
        hotel,
        dateRange
      }
  },
  data() {
    return {
      isLoading:true,
      roomType:[],
     // dateRange:this.range,
      remainTypeList:null
    }
  },
 async created(){
 // await this.getRoomType();
  this.getRemainRoomType();
  },

  computed: {},
  methods: {
    foramtDateLabel(dateTime){
      let dyStr = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
					return {
						de: new Date(dateTime).Format("MM-dd"),
						dy: dyStr[new Date(dateTime).getDay()]
					}
				
    },
    roomDetail(item){
    console.error("11111",item);
      uni.navigateTo({
          url: `/pages_client/roomDetail/roomDetail?roomType=${encodeURIComponent(JSON.stringify(item))}`,
        });
    },
    dateConfim(e){
      this.dateRange=e;
      this.getRemainRoomType()
    },
    async getRemainRoomType(){
      this.isLoading=true;
      const list = await  HotelServiceClient.getRemainRoomType(this.hotel_id,this.dateRange[0],this.dateRange[1]);
      this.remainTypeList=list;
      this.isLoading=false;
    },
    async getRoomType(){
      const res = await  HotelServiceClient.getRoomType(this.hotel_id);
				console.log("房型列表 client",res);
				this.roomType = res.result.data;     
    },
    async reserve(item,priceField){
      const f = ()=>{
       
      
      }
      if(!this.user){
         await this.$store.dispatch("loginEvent")
          uni.redirectTo({
          url:`/pages_client/order/createOrder/createOrder?st=${this.dateRange[0]}&&et=${this.dateRange[1]}&&orderType=normal&&priceField=${priceField}&&roomType=${encodeURIComponent(JSON.stringify(item))}`,
          events:{
            updateData:()=>{
              this.getRemainRoomType()
             
            }
          }
        }) 
        return;
      }
      uni.navigateTo({
          url:`/pages_client/order/createOrder/createOrder?st=${this.dateRange[0]}&&et=${this.dateRange[1]}&&orderType=normal&&priceField=${priceField}&&roomType=${encodeURIComponent(JSON.stringify(item))}`,
          events:{
            updateData:()=>{
              this.getRemainRoomType()
             
            }
          }
        })
   
    },
    bargain(item,priceField){
       uni.navigateTo({
      url:`/pages_client/order/createOrder/createOrder?st=${this.dateRange[0]}&&et=${this.dateRange[1]}&&orderType=bargain&&priceField=${priceField}&&roomType=${encodeURIComponent(JSON.stringify(item))}`
     })
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
.search{
  height: 40px;
  padding:20px;
  box-sizing: border-box;
  max-width: 100vw;
  width:$showWidth;
  margin:auto;
  background:#fff;
  display: flex;
  align-items: center;
}
.scroll-style{
  height:calc(100vh - 110px);
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
      color: #0765ae;
      font-weight: 400;
      padding:0 4px;
    }
  }
 
  }
} 
.strong {
  font-size: 18px;
  font-weight: 400;
}
.normal {
  font-size: 13px;
  color: #a1a1a1;
}
</style>