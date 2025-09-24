<template>
  <view class="orderIndex">
    <!-- <scroll-view
      :scroll-x="false"
      :scroll-y="true"
      style="height: 100vh"
      @refresherrefresh="refrush"
      :refresher-enabled="false"
      refresher-default-style="white"
      :refresher-triggered="refresher_triggered"
    > -->
      <orderComponent :disHeightVal="0" ref="orderRef"></orderComponent>
    <!-- </scroll-view> -->
  
  </view>
</template>

<script>
import orderComponent from "@/pages/order/components/orderComponent";
import { ref, onMounted } from 'vue';
export default {
  components: {
    orderComponent,
  },
  setup() {
    // let refresher_triggered = ref(false);
    //    const orderRef = ref(null);
    // const refrush = async (e) => {
    //   console.log("orderIndex refrush",orderRef,orderRef.value);
    //   console.log("1111",this.$refs.orderRef)
    //   refresher_triggered.value = true;  
    //   await orderRef.refrush();
    //   refresher_triggered.value = false;
    // };
    // return {refresher_triggered}
  },
  data() {
    return {};
  },
  mounted(){
   
  },
  computed: {},
  async onPullDownRefresh() {
    try {
      await this.$refs.orderRef.refrush();
    uni.stopPullDownRefresh();
    } catch (error) {
      uni.showToast({
        title: '请求失败',
        icon: 'none'
      });
       uni.stopPullDownRefresh();
    }
    
  },
  onShow() {
    //this.$refs.order.refrush();
  },
  onReachBottom() {
    this.$refs.orderRef.loadMore();
  },
  methods: {
    refrush() {
      //console.log("orderindex refrush")
      this.$refs.orderRef.refrush();
    }
  },
};
</script>

<style></style>
