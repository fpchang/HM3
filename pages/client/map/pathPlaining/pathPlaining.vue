<template>
  <view>
    <view class="flex-style">
      <view class="flex-item active" @touchstart="goToCar">驾车</view>
      <view class="flex-item" @touchstart="goToWalk">步行</view>
      <view class="flex-item" @touchstart="goToBus">公交</view>
      <view class="flex-item" @touchstart="goToRide">骑行</view>
    </view>
    <view class="map_box" >
      <map
        id="navi_map"
        longitude="116.451028"
        latitude="39.949643"
        scale="12"
        :markers="markers"
        :polyline="polyline"
      ></map>
    </view>

    <view class="text_box">
      <view class="text">{{ distance }}</view>
      <view class="text">{{ cost }}</view>
      <view class="detail_button" @touchstart="goDetail">详情</view>
    </view>
  </view>
</template>

<script>
import amap from "../../../../common/amap-wx.130";
import {  computed, ref,getCurrentInstance  } from 'vue';
export default {
   setup() {
    const key = "a69cc73276ceb1a813f3be0d5d42c2aa";
	
    let amapPlugin = new amap.AMapWX({ key });
	let polyline =ref([]);
	let distance=ref(""),cost=ref("");
	// let getcar =()=>{
	// 	return new Promise((resolve,reject)=>{
			amapPlugin.getDrivingRoute({
      origin: "116.481028,39.989643",
      destination: "116.434446,39.90816",
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
        
          polyline.value= [
            {
              points: points,
              color: "#0091ff",
              width: 6,
            },
          ];
       
        if (data.paths[0] && data.paths[0].distance) {
          
            distance.value= data.paths[0].distance + "米";
          
        }
        if (data.taxi_cost) {
         
            cost.value= "打车约" + parseInt(data.taxi_cost) + "元";
          
        }
	
		console.log("00000",polyline,distance,cost)
		//resolve();
      },
      fail: function (info) {
		//reject()
	  }
    });
	// 	})
		
	// }
   // await getcar();
console.log("11111111",polyline,distance,cost)
	return {
		polyline,distance,cost

	}
},
  data() {
    return {
      markers: [
        {
          iconPath: "../../img/mapicon_navi_s.png",
          id: 0,
          latitude: 39.989643,
          longitude: 116.481028,
          width: 23,
          height: 33,
        },
        {
          iconPath: "../../img/mapicon_navi_e.png",
          id: 0,
          latitude: 39.90816,
          longitude: 116.434446,
          width: 24,
          height: 34,
        },
      ]
     
     
    };
  },
onLoad(){
	console.log("onload");
	 //this.getcar();
},
  methods: {},
};
</script>

<style>
.flex-style{
	display: -webkit-box;
	display: -webkit-flex;
	display: flex;
  }
  .flex-item{
	height: 35px; 
	line-height: 35px;
	text-align: center;
	-webkit-box-flex: 1;
	-webkit-flex: 1;
	flex: 1
  }
  .flex-item.active{
	color:#0091ff;
  }
  .map_box{
	position:absolute;
	top: 35px;
	bottom: 90px;
	left: 0px;
	right: 0px;
  }
  #navi_map{
	width: 100%;
	height: 100%;
  }
  .text_box{
	position:absolute;
	height: 90px;
	bottom: 0px;
	left: 0px;
	right: 0px;
  }
  .text_box .text{
	margin: 15px;
  }
  .detail_button{
	position:absolute;
	bottom: 30px;
	right: 10px;
	padding: 3px 5px;
	color: #fff;
	background: #0091ff;
	width:50px;
	text-align:center;
	border-radius:5px;
  }
</style>
