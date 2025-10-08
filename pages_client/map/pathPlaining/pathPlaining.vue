<template>
  
  <view>
    
    
    <view class="flex-style">
      <view :class="['flex-item',tab=='goToCar'?'active':'']" @touchstart="checkLine('goToCar')">驾车</view>
      <view :class="['flex-item',tab=='goToWalk'?'active':'']" @touchstart="checkLine('goToWalk')">步行</view>
      <!-- <view class="flex-item" @touchstart="goToBus">公交</view>
      <view class="flex-item" @touchstart="goToRide">骑行</view> -->
    </view>
    <view class="map_box">
      <map
        id="navi_map"
        :longitude="location[0]"
        :latitude="location[1]"
        scale="12"
        :markers="markers"
        :polyline="polyline"
      ></map>
    </view>

    <view class="text_box">
      <view class="text">{{ distanceStr }}</view>
      <view class="text">{{ cost }}</view>
      
      <view class="detail_button" @touchstart="goDetail">详情</view>
    </view>
  </view>
</template>

<script>
import {GPS} from "@/api/GPS";
import { useStore } from "vuex";
import amap from "@/common/amap-wx.130";
import { computed, ref, getCurrentInstance } from "vue";
export default {
  setup() {
    const key = "a69cc73276ceb1a813f3be0d5d42c2aa";
    const store =  useStore();
    let tab=ref("");
    console.log("key",key);
    let amapPlugin = new amap.AMapWX({ key });
    let polyline = ref([]);
    let distance = ref(0);
    let distanceStr=ref("");
    let  cost = ref("");
	  //获取当前定位
	  const getLocation=()=> {
	       // #ifdef H5
	           let location=[119.872549,30.55434];	 				    
	  				store.commit("setLocation", [119.872549,30.55434]);
	       // #endif
	  		// #ifndef H5
      
			 return new Promise((resolve, reject) => {
				 amapPlugin.getRegeo({
				          type: 'gcj02',
				          success: (data) => {
				            console.log(data);
				            let location = [data[0].longitude, data[0].latitude];
				            console.log("当前坐标",location)
				            store.commit("setLocation",location);
				            uni.hideLoading();
							resolve();
				          },
				          fail: (e) => { 
                    console.log("eee",e)
				            this.isLoading = false;
				            reject(e);
				          },
				        });
			 });
	  			
	  			// #endif
	  			
	      	    
	       }
      //驾车路线
    const getDrivingRouteFun = (origin,destination) => {
      if(!origin || !destination){
        return Promise.reject();
      }
      return new Promise((resolve,reject)=>{
 // "116.481028,39.989643"
      amapPlugin.getDrivingRoute({
        origin: origin,
        destination: destination,
        success: function (data) {
          var points = [];
          if (data.paths && data.paths[0] && data.paths[0].steps) {
            var steps = data.paths[0].steps;
            for (var i = 0; i < steps.length; i++) {
              var poLen = steps[i].polyline.split(";");
              for (var j = 0; j < poLen.length; j++) {
                points.push({
                  longitude: parseFloat(poLen[j].split(",")[0]),
                  latitude: parseFloat(poLen[j].split(",")[1]),
                });
              }
            }
          }

          polyline.value = [
            {
              points: points,
              color: "#0091ff",
              width: 16,
            },
          ];
          if (data.paths[0] && data.paths[0].distance) {
            distance.value = data.paths[0].distance ;
            distanceStr.value=`驾车约 ${distance.value/1000} km`
          }
          if (data.taxi_cost) {
            cost.value = "打车约" + parseInt(data.taxi_cost) + "元";
          }
          resolve();
        },
        fail: function (info) {
          reject()
        },
      });
      })
     
    };
    //步行路线
    const getWalkingRouteFun= (origin,destination) =>{
      amapPlugin.getWalkingRoute({
        origin: origin,
        destination: destination,
      success: function(data){
        console.log("11111",data);
        var points = [];
        if(data.paths && data.paths[0] && data.paths[0].steps){
          var steps = data.paths[0].steps;
          for(var i = 0; i < steps.length; i++){
            var poLen = steps[i].polyline.split(';');
            for(var j = 0;j < poLen.length; j++){
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            } 
          }
        }
        
          polyline.value=[{
            points: points,
            color: "#0091ff",
            width: 16
          }]
        console.log("步行：：",polyline);
        if(data.paths[0] && data.paths[0].distance){       
            distanceStr.value= `步行约${data.paths[0].distance }米`;        
        }
        if(data.paths[0] && data.paths[0].duration){         
            cost.value=`需要${parseInt(data.paths[0].duration/60)}分钟`
         
        }
          
      },
      fail: function(info){

      }
    })
    }
    const hotel=computed(()=>{
      return store.state.hotelClientStore.hotel
    });
    const location = computed(()=>{
      return store.state.location
    });
   
    const markers=computed(()=>{
      return [
        {
          iconPath: "https://env-00jxhfhjd231.normal.cloudstatic.cn/HM/images/miniprogram/icon-location-blue.png",
          id: 0,
          latitude: hotel.value.hotelCoordinate[1],
          longitude: hotel.value.hotelCoordinate[0],
          width: 54,
          height: 54,
        },
        {
          iconPath: "https://env-00jxhfhjd231.normal.cloudstatic.cn/HM/images/miniprogram/location.png",
          id: 1,
          latitude: location.value[1],
          longitude: location.value[0],
          width: 54,
          height: 54,
        }
      ]
    });
    return {
      key,
      tab,
		getLocation,
      polyline,
      distance,
      distanceStr,
      cost,
      hotel,
      location,
      markers,
      getDrivingRouteFun,
      getWalkingRouteFun
    };
  },
  data() {
    return {
     
    };
  },
  onLoad() {
    
  },
  async created(){
	  try {
      uni.showLoading();
	  	await this.getLocation();
		  await this.checkLine("goToCar");
      uni.hideLoading();
	  } catch (error) {
	  	console.log("error",error)
	  }
	  
  
    
  },
  methods: {
    async checkLine(str){
      if(this.tab==str){
        return Promise.resolve();
      }
      uni.showLoading();
      let ori = this.location.join(",");
      let dis = this.hotel.hotelCoordinate.join(",");
      switch(str){
        case "goToCar":
                this.tab=str;
          try {
             await  this.getDrivingRouteFun(ori,dis);
             uni.hideLoading();
            return Promise.resolve();
          } catch (error) {
             uni.hideLoading();
            return Promise.reject({message:"规划路线失败"});
          }
        
        break;
        case "goToWalk": 
        if(this.distance>1000){
          uni.showToast({
            title: '距离过远',
            icon: 'none'
          });
           uni.hideLoading();
         return Promise.resolve();
        }
         this.tab=str;
        try {
           await this.getWalkingRouteFun(ori,dis); 
            uni.hideLoading();
           return Promise.resolve();
        } catch (error) {
           uni.hideLoading();
          return Promise.reject({message:"获取步行路径失败"});
        }
       
        break;
      }
    }
  },
};
</script>

<style>
.flex-style {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
}
.flex-item {
  height: 35px;
  line-height: 35px;
  text-align: center;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
}
.flex-item.active {
  color: #0091ff;
}
.map_box {
  position: absolute;
  top: 35px;
  bottom: 90px;
  left: 0px;
  right: 0px;
}
#navi_map {
  width: 100%;
  height: 100%;
}
.text_box {
  position: absolute;
  height: 90px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}
.text_box .text {
  margin: 15px;
}
.detail_button {
  position: absolute;
  bottom: 30px;
  right: 10px;
  padding: 3px 5px;
  color: #fff;
  background: #0091ff;
  width: 50px;
  text-align: center;
  border-radius: 5px;
}
</style>
