<template>
    <view>
    <scroll-view class="scroll-style" :scroll-x="false" :scroll-y="true">
        <view class="scenicSpot">
            <unicloud-db ref="udb" v-slot:default="{data, loading, error, options}" :collection="colList">
                {{ console.log(data) }}          
                <xt-panal-list :dataList="data" maxWidth=1200>
            
                            <!-- #ifdef MP -->
                            <view v-for="(item,index) of data" slot="card{{index}}">
                           
                            </view>
                            <!-- #endif -->
                            <!-- #ifdef H5 || APP-PLUS -->
                             <template v-for="(item,index) of data" v-slot:[`card${index}`]="data">
                                <view class="roomCard">
                                    <view class="img-area" style=""> 
                                      <image :src="item.firstImages" mode="widthFix" style="width:100%;height:100%"  @click="roomDetail(item)"/>
                                    </view>
                                    
                                    <view  class="label-area" @click="roomDetail(item)">
                                      <view class="name-sytle">
                                        <text class="label-item" style="color:#323233;font-weight:bold">{{item.scenicSport_name}}}</text>
                                        <text class="label-item">{{item.scenicSport_address}}</text>
                                       
                                      </view>
                                      <view>
                                       
                                        <uni-icons type="forward"></uni-icons>
                                      </view>
                                      
                                    </view>
                                   
                                    <view class="p-list"> 
                                      <view class="p-list-item" v-for="it of item._id['hm-scenicSpotPriceDetail']">
                                        <view class="title-area"> 
                                          <text>{{it.package_name}}</text>
                                        </view>
                                        <view class="pr-area"> 
                                          <text class="pr-line">官方价:￥{{it.scenicSpot_price}}</text>
                                          <text  class="pr-text">售价:￥{{it.offering_price}}</text>
                    
                                        </view>
                                        
                                      </view>
                                    </view>
                                  </view>
                             </template>
                             <!-- #endif -->
                          
                            
                        </xt-panal-list>
                        </unicloud-db>   
     
    </view>
      </scroll-view>
    </view>
</template>

<script>
import {useStore} from 'vuex';
import {  computed, ref,getCurrentInstance  } from 'vue';
export default {
    props: {
    hotel_id:{
      type:String,
      default:""
    }
  },
  setup(props){
    const db = uniCloud.database();
    console.log("props",props)
    let colList=computed(()=>{
				return [
                    db.collection("hm-scenicSpot").where({hotel_id:props.hotel_id}).getTemp(),
                    db.collection("hm-scenicSpotPriceDetail").field("scenicSpot_id,package_name,scenicSpot_price,offering_price").getTemp()
			  ]
			});
    return {
        colList
    }
  }
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

.scenicSpot{
  
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
    gap:12px;
    .pr-line{
        text-decoration: line-through;
        color: #a1a1a1;
        font-size: 14px;
    }
    .pr-text{
      color: #ED9121;
      font-weight: bold;
      padding:0 4px;
    }
  }
 
  }
} 
.strong {
  font-size: 18px;
  font-weight: bold;
}
.normal {
  font-size: 13px;
  color: #a1a1a1;
}
</style>