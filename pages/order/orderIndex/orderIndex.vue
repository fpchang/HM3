<template>
  <view>
    <orderComponent :disHeightVal="disHeightVal" ref="order"></orderComponent>
  </view>
</template>

<script>
import orderComponent from "@/pages/order/components/orderComponent";
export default {
  components: {
    orderComponent,
  },
  data() {
    return {};
  },
  computed: {},
  async onPullDownRefresh() {
    await this.$refs.order.refrush();
    uni.stopPullDownRefresh();
  },
  methods: {},
};
</script>

<style></style>
