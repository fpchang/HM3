<template>
  <view class="rec">
    <block v-for="item of  servicesFacilities_data">
      <view class="rec-item" >
      <view class="rec-item-lab">
        <image :src="`https://env-00jxh1m2dpmq.normal.cloudstatic.cn/HM/images/miniprogram/${item.icon}`" style="width:60px ;height: 60px;"></image>
        <view>{{item.name}}</view>
      </view>
      <view class="right-area">
        <view class="rec-item-list">
          <view class="rec-item-list-item"  v-for="it of  item.support">
            <uni-icons type="checkbox-filled"  size="20px" color="green"></uni-icons>
            {{ it }}
          </view>
       
        </view>
        <view class="dev"></view>
      </view>
      
    </view>
    <!-- <van-divider textColor="#1989fa" style="width: 70%;"></van-divider> -->
    </block>
  </view>
</template>

<script>
import uniIcons from '../../../../../uni_modules/uni-icons/components/uni-icons/uni-icons.vue'
export default{
  components: { uniIcons },
  name:"servicesFacilities",
  props: {},
  data() {
    return {
      servicesFacilities_data:[
  {
    name:"房型设施",
    icon:"home.svg",
    support:["WIFI","24小时热水","洗护用品","浴缸","巨屏电视","HIFI音箱"]
  },
  {
    name:"餐饮设施",
    icon:"canying.svg",
    support:["中餐","烧烤","咖啡"]
  },
  {
    name:"休闲设施",
    icon:"yule.svg",
    support:["草地天幕","棋牌室","KTV","电影院","XBOX游戏机"]
  },{
    name:"运动",
    icon:"sport.svg",
    support:["游泳池","蹦蹦床","自行车"]
  }
]
    }
  },
  computed: {},
  methods: {},
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
  beforeDestroy() {}
}
</script>

<style scoped lang="scss">
.rec{
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.rec .rec-item{
  display: flex;
  width: 100%;
  margin-bottom: 15rpx;
}
.rec .rec-item-lab{
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.right-area{
  display: flex;
  flex-direction: column;
  padding:0 20px;
  flex: 1;
  .rec-item-list{
    flex: 1;
    
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    box-sizing: border-box;
    .rec-item-list-item{
      padding:0 8px;
      display: flex;
      align-items: center;
      justify-content: left;
    }
  }
  .dev{
    height: 2px;
    background: #eee;
  }
 
}

</style>