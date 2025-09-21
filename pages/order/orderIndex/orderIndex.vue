<template>
  <view class="orderIndex">
    <scroll-view
      :scroll-x="false"
      :scroll-y="true"
      style="height: 100vh"
      @refresherrefresh="refrush"
      :refresher-enabled="false"
      refresher-default-style="white"
      :refresher-triggered="refresher_triggered"
    >
      <orderComponent :disHeightVal="disHeightVal" ref="orderRef"></orderComponent>
    </scroll-view>
  
  </view>
</template>

<script>
import orderComponent from "@/pages/order/components/orderComponent";
import {ref} from "vue";
export default {
  components: {
    orderComponent,
  },
  setup() {
    let refresher_triggered = ref(false);
       const orderRef = ref(null);
    const refrush = async (e) => {
      console.log("orderIndex refrush");
      refresher_triggered.value = true;  
      await orderRef.value.refrush();
      refresher_triggered.value = false;
    };
    return {refrush,refresher_triggered}
  },
  data() {
    return {};
  },
  computed: {},
  async onPullDownRefresh() {
    await this.$refs.order.refrush();
    uni.stopPullDownRefresh();
  },
  onShow() {
    //this.$refs.order.refrush();
  },
  onReachBottom() {
    this.$refs.order.loadMore();
  },
  methods: {
    refrush() {
      //console.log("orderindex refrush")
      this.$refs.order.refrush();
    },
  },
};
</script>

<style></style>
