<template>
  <view class="order-component">
	    <scroll-view
      :scroll-x="false"
      :scroll-y="true"
      style="height: 100vh"
      @refresherrefresh="refrush"
      :refresher-enabled="false"
      refresher-default-style="white"
      :refresher-triggered="refresher_triggered"
    >
	    <view class="add-content-style">
      <view class="control-panal">
        <navigator url="/pages/order/orderIndex/orderIndex" hover-class="none">
          <view class="control-item-group">
            <view
              ><l-icon name="solar:reorder-bold" size="22px" color="#fff"
            /></view>
            <view><text style="color: #fff">订单管理</text></view>
          </view>
        </navigator>
      </view>
    </view>
    <view style="height: 15px"></view>
    <view class="content">
      <orderChildCalendarList
        :disHeightVal="disHeightVal"
        ref="orderChildCalendarListRef"
      >
      </orderChildCalendarList>
    </view>
</scroll-view>

  </view>
</template>

<script>
import orderChildCalendarList from "../components/orderChildCalendarList";
import { alert } from "@/alert";
import LIcon from "../../../uni_modules/lime-icon/components/l-icon/l-icon.vue";
import {ref} from "vue";
export default {
  components: {
    orderChildCalendarList,
    LIcon,
  },
  setup() {
    let refresher_triggered = ref(false);
    const orderChildCalendarListRef = ref(null);
    const refrush = async (e) => {
      console.log("orderIndex refrush");
      refresher_triggered.value = true;
      await orderChildCalendarListRef.value.getOrderList();
      refresher_triggered.value = false;
    };
    return { refrush, refresher_triggered };
  },
  props: {
    disHeightVal: 0,
    createTime: 0,
  },
  data() {
    return {
      ss: 15868865907,
      current: 2,
      tabRadioVal: 0,

      selectCondition: {
        dateRangeArray: [
          new Date().getTime(),
          new Date().getTime() + 1000 * 60 * 60 * 24 * 30,
        ], //默认30天
        userName: "",
      },
      pattern: {
        color: "#7A7E83",
        backgroundColor: "rgba(255,255,255,0)",
        selectedColor: "#007AFF",
        buttonColor: "rgba(41, 121, 255,1)",
        iconColor: "#fff",
      },
      //roomTypeList: dataBase.roomTypeList,
    };
  },
  computed: {
    isPcShow() {
      return this.$store.state.isPcShow;
    },
    hotel_id() {
      return this.$store.state.hotel_id;
    },
    roomTypeList() {
      return this.$store.state.roomTypeList;
    },
    tabitems() {
      //if(this.isPcShow){
      return [
        {
          value: 0,
          text: "房态",
        },
        {
          value: 1,
          text: "订单",
        },
        //  ,{
        // 	value:2,
        // 	text:'历史'
        // }
      ];
      //}
      // return [{
      // 	value:0,
      // 	text:'房态'
      // }, {
      // 	value:1,
      // 	text:'订单'
      // }]
    },
  },
  watch: {},
  created() {
    //console.log('orderComponent create');
  },
  onLoad: function () {
    //console.log('orderComponent Show')
  },
  async onPullDownRefresh() {
    await this.$refs.orderChildCalendarListRef.getOrderList();
    uni.stopPullDownRefresh();
  },
  mounted() {},
  methods: {
    async initData() {
      await this.$refs.orderChildCalendarListRef.getOrderList();
      return;
    },
    dataConfigEvent() {},
    onClickItem(e) {
      if (this.current !== e.currentIndex) {
        this.current = e.currentIndex;
      }
    },
    createOrderEvent() {
      if (
        !this.$store.state.permissionStore.permissionList.includes(
          "ORDER_CREATE"
        )
      ) {
        alert.alertNoPermisson();
        return;
      }
      if (!this.$store.state.isPcShow) {
        uni.navigateTo({
          url: "/pages/order/createOrder/createOrder",
        });
        return;
      }
      this.$refs.popup.open();
    },
    closePopup() {
      try {
        this.$refs.popup.close();
        this.$refs.orderChildTableListRef.getOrderListByCondition();
        this.$refs.orderChildCalendarList.getOrderList();
        this.$refs.orderChildListRef.getOrderList();
      } catch (e) {
        //TODO handle the exception
      }
    },
    testData(valArray) {},
  },
};
</script>

<style lang="scss" scoped>
.add-content-style {
  background: #0765ae;

  .switch-group {
    display: flex;
    gap: 4px;
    align-items: center;
    justify-content: center;
    font-size: 12px;

    padding: 5px 12px;
    border-radius: 26px;
    background: #919191;
  }
}

.order-component {
  box-sizing: border-box;
}

.uni-group {
  display: flex;
  align-items: center;
}

.uni-button {
  white-space: nowrap;
}

.tbs-style {
  display: flex;
  align-items: center;

  .tbs-c-btn {
    width: 105px;
    display: flex;
    align-items: center;
  }
}
</style>
