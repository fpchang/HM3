<template>
  <view class="rec">
    <block v-for="item of servicesFacilities_data">
      <view class="rec-item">
        <view class="rec-item-lab">
          <image
            :src="`https://env-00jxh1m2dpmq.normal.cloudstatic.cn/HM/images/miniprogram/${item.icon}`"
            style="width: 60px; height: 60px"
          ></image>
          <view>{{ item.name }}</view>
        </view>
        <view class="right-area">
          <view class="rec-item-list">
            <view class="rec-item-list-item" v-for="it of item.support">
            
              <unicloud-db
                v-slot:default="{ data, loading, error, options }"
                collection="hm-facilityConfig"
                field="name"
                :where="`type=='${item.type}'`"
              >
              <block  v-if="data&&data.length"> 
                <uni-icons
                type="checkbox-filled"
                size="20px"
                color="green"
              ></uni-icons>
                  <text>{{ parseStr(data, it) || it }}</text>
              </block>
            
              </unicloud-db>
            </view>
            <view class="rec-item-list-item" v-for="it in 3" style="height:0;"></view>
          </view>
          <view class="dev"></view>
        </view>
      </view>
      <!-- <van-divider textColor="#1989fa" style="width: 70%;"></van-divider> -->
    </block>
  </view>
</template>

<script>
import uniIcons from "@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue";
import { HotelServiceClient } from "@/services/HotelServiceClient";
export default {
  components: { uniIcons },
  name: "servicesFacilities",
  props: {
    hotel: {
      type: Object,
    },
  },
  setup(props) {

  },
  data() {
    return {
      roomTypeList:null,
      servicesFacilities_data:null

    };
  },
  created(){
    this.getRoomType();
  },
  computed: {
   servicesFacilities_data(){
    let arr = [];
    let roomTypeList = this.roomTypeList||[];
      roomTypeList.map((item) => {
        let facility = item["facility"] || [];
        arr = arr.concat(facility);
      });
      arr = Array.from(new Set(arr));
      console.log("arr", arr);
    return [
        {
        name: "房型设施",
        icon: "home.svg",
        type: "roomType",
        support: Array.from(new Set(arr))
      },
 
      {
        name: "餐饮设施",
        icon: "canying.svg",
        type: "catering",
        support: this.hotel.cateringServices,
      },
      {
        name: "休闲设施",
        icon: "yule.svg",
        type: "recreation",
        support: this.hotel.recreationFacility,
      },
      {
        name: "运动",
        icon: "sport.svg",
        type: "athleticFacility",
        support: this.hotel.athleticFacility,
      },
    ];
   }
  },
  methods: {
    async getRoomType(){
      const res = await HotelServiceClient.getRoomType(this.hotel._id);
      this.roomTypeList = res.result.data;
      console.log("roomtype", this.roomTypeList);
    
    },
    parseStr(data, it) {
      let obj = data.find((item) => item._id == it) || {};
      return obj && obj["name"];
    },
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
};
</script>

<style scoped lang="scss">
.rec {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.rec .rec-item {
  display: flex;
  width: 100%;
  margin-bottom: 15rpx;
}
.rec .rec-item-lab {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.right-area {
  display: flex;
  flex-direction: column;
  padding-left:20px;
  flex: 1;
  gap:10px;
  .rec-item-list {
    flex: 1;
    gap:8px;
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    justify-content: space-between;
    .rec-item-list-item {
      display: flex;
      align-items: center;
      justify-content: left;
      min-width: 120px;
    }
  }
  .dev {
    height: 2px;
    background: #eee;
  }
}
</style>
