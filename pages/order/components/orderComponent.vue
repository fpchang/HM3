<template>
	<view class="order-component">
		<view class="add-content-style">
			<view class="left-panal" v-if="false"> </view>
			<view class="control-panal">
				<view class="control-item-group" @click="createOrderEvent">
					<view><l-icon name="solar:add-circle-bold" size="22px" color="#fff" /></view>
					<view><text style="color: #fff">添加订单</text></view>
				</view>
			</view>
		</view>
		<view class="content">
			<view v-if="tabRadioVal===1">
				<orderChildList ref="orderChildListRef"></orderChildList>
			</view>
		</view>
		<uni-popup ref="popup" background-color="transprant">
			<view class="popup-content">
				<view class="create-order-title-style">创建订单</view>
				<view class="comContent">
					<createOrderComponent @closePopup="closePopup"></createOrderComponent>
					
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import CreateOrder from "../createOrder/createOrder";
import orderChildCalendarList from "./orderChildCalendarList";
import orderChildTableList from "./orderChildTableList";
import createOrderComponent from "./createOrderComponent";
import orderChildList from "./orderChildList.vue";
import { alert } from "@/alert";
import LIcon from "../../../uni_modules/lime-icon/components/l-icon/l-icon.vue";
export default {
  components: {
    CreateOrder,
    createOrderComponent,
    orderChildCalendarList,
    orderChildTableList,
    orderChildList,
    LIcon,
  },
  props: {
    disHeightVal: 0,
    createTime: 0,
  },
  data() {
    return {
      ss: 15868865907,
      current: 2,
      tabRadioVal: 1,

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
    //console.log("orderComponent create");
  },
  onLoad: function () {
    //console.log("orderComponent Show");
  },
  mounted() {},
  methods: {
    async refrush() {
      //console.log("ordercomponent refrush");
      await this.$refs.orderChildListRef.refrush();
      return;
    },
    loadMore() {
      this.$refs.orderChildListRef.clickLoadMore();
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

<style lang="scss">
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
  min-height: 100vh;
	box-sizing: border-box;
	background-color: #0765ae;
  display: flex;
  flex-direction: column;

	.content {
		flex: 1;
		background: #eaebee;
		border-top-right-radius: 20px;
		border-top-left-radius: 20px;

		.filter-area {
			max-width: 600px;
			display: flex;
			align-items: center;
			gap: 12px;
			padding: 20px 15px;

			.filter-item {
				border-radius: 8px;
				background: #fff;
				flex: 1;
			}
		}
	}
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
