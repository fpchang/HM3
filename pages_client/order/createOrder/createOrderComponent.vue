<template>
  <view>
    <!-- <uni-forms ref="baseForm" :modelValue="orderForm" label-width="80px">
			<uni-forms-item label="客户名" required>
				<uni-easyinput v-model="orderForm.userName" trim="all" placeholder="请输入用户名" />
			</uni-forms-item>
			<uni-forms-item label="手机号">
				<uni-easyinput v-model="orderForm.phone" type="number" placeholder="请输入手机号" />
			</uni-forms-item>
			<uni-forms-item label="备注">
				<uni-easyinput type="textarea" v-model="orderForm.mark" placeholder="备注内容"></uni-easyinput>
			</uni-forms-item>
		
		</uni-forms> -->
    <xt-panal-list :count="1" :maxWidth="Number(1200)">
      <!-- #ifdef MP -->
      <view  slot="card0">
        <view style="padding: 20px">
          <view class="formitem">
            <view class="title"><text>订房信息</text></view>
            <view>
              <view class="ad-lose-num flex-center">
                <uni-icons
                  type="minus-filled"
                  size="24"
                  color="#ED9121"
                  @click="loseCount()"
                ></uni-icons>
                <text style="padding: 0 8px">{{ selectCount }}</text>
                <uni-icons
                  type="plus-filled"
                  size="24"
                  color="#ED9121"
                  @click="addCount()"
                ></uni-icons>
              </view>
            </view>
          </view>
          <uni-forms ref="baseForm" :modelValue="orderForm" label-width="80px">
            <uni-forms-item label="日期" required>
              <view class="form-content">
                <text>{{ formatDate(formData.dateRange).dt }}</text>
                <text style="font-weight: bold">{{
                  formatDate(formData.dateRange).dy
                }}</text>
              </view>
            </uni-forms-item>
            <uni-forms-item label="住客名" required>
              <view
                style="display: flex; height: 100%; flex-direction: column"
                class="input-area"
              >
                <input
                  v-model="orderForm.userName"
                  trim="all"
                  placeholder="住客名"
                  class="in"
                />
              </view>
            </uni-forms-item>
            <uni-forms-item label="联系人" required>
              <view
                style="display: flex; height: 100%; flex-direction: column"
                class="input-area"
              >
                <input
                  v-model="orderForm.phone"
                  trim="all"
                  placeholder="联系电话"
                  class="in"
                />
              </view>
            </uni-forms-item>
            <uni-forms-item label="房型" required>
              <view class="form-content">
                <text>{{ formData.roomType.name }}</text>
                <text>{{
                  formData.roomType[`${formData.priceField}_name`]
                }}</text>
              </view>
            </uni-forms-item>
            <uni-forms-item label="价格" required>
              <view class="form-content">
                <text>￥{{ priceTotal }}</text>
              </view>
            </uni-forms-item>
            <!-- <uni-forms-item label="议价" required>
							<view class="flex-center" style="flex:1;color:#a1a1a1">
									<text>￥{{minPrice}}</text>
									<view style="flex:1"> 
										<slider  activeColor="#ED9121" :value="bargainPrice" @change="bargainPriceChange" :min="minPrice" :max="priceTotal" block-color="#ED9121" /> 
									</view>
									<text>￥{{priceTotal}}</text>
							</view>	
						</uni-forms-item> -->
            <uni-forms-item>
              <view class="pay-area" v-if="isBargainOrder">
                <view style="flex: 1"
                  ><text>议价</text
                  ><text class="rmb">￥{{ bargainPrice }}</text></view
                >
                <view>
                  <button
                    size="default"
                    type="default"
                    class="btn"
                    @click="bargainEvent"
                  >
                    发起议价
                  </button>
                </view>
              </view>
              <view class="pay-area" v-if="!isBargainOrder">
                <view style="flex: 1"
                  ><text>在线支付</text
                  ><text class="rmb">￥{{ priceTotal }}</text></view
                >
                <view v-if="hotel.payType != 'online'">
                  <button
                    size="default"
                    type="default"
                    class="btn"
                    @click="reserve"
                  >
                    预定
                  </button>
                </view>
                <view v-if="hotel.payType == 'online'">
                  <button
                    size="default"
                    type="default"
                    class="btn"
                    @click="payEvent"
                  >
                    立即支付
                  </button>
                </view>
              </view>
            </uni-forms-item>
          </uni-forms>
        </view>
      </view>
      <!-- #endif -->
      <!-- #ifdef H5 || APP-PLUS -->
      <template v-for="(item, index) of [1]" v-slot:[`card${index}`]="data">
        <view style="padding: 20px">
          <view class="formitem">
            <view class="title"><text>订房信息</text></view>
            <view>
              <view class="ad-lose-num flex-center">
                <uni-icons
                  type="minus-filled"
                  size="24"
                  color="#ED9121"
                  @click="loseCount()"
                ></uni-icons>
                <text style="padding: 0 8px">{{ selectCount }}</text>
                <uni-icons
                  type="plus-filled"
                  size="24"
                  color="#ED9121"
                  @click="addCount()"
                ></uni-icons>
              </view>
            </view>
          </view>
          <uni-forms ref="baseForm" :modelValue="orderForm" label-width="80px">
            <uni-forms-item label="日期" required>
              <view class="form-content">
                <text>{{ formatDate(formData.dateRange).dt }}</text>
                <text style="font-weight: bold">{{
                  formatDate(formData.dateRange).dy
                }}</text>
              </view>
            </uni-forms-item>
            <uni-forms-item label="住客名" required>
              <view
                style="display: flex; height: 100%; flex-direction: column"
                class="input-area"
              >
                <input
                  v-model="orderForm.userName"
                  trim="all"
                  placeholder="住客名"
                  class="in"
                />
              </view>
            </uni-forms-item>
            <uni-forms-item label="联系人" required>
              <view
                style="display: flex; height: 100%; flex-direction: column"
                class="input-area"
              >
                <input
                  v-model="orderForm.phone"
                  trim="all"
                  placeholder="联系电话"
                  class="in"
                />
              </view>
            </uni-forms-item>
            <uni-forms-item label="房型" required>
              <view class="form-content">
                <text>{{ formData.roomType.name }}</text>
                <text>{{
                  formData.roomType[`${formData.priceField}_name`]
                }}</text>
              </view>
            </uni-forms-item>
            <uni-forms-item label="价格" required>
              <view class="form-content">
                <text>￥{{ priceTotal }}</text>
              </view>
            </uni-forms-item>
            <!-- <uni-forms-item label="议价" required>
							<view class="flex-center" style="flex:1;color:#a1a1a1">
									<text>￥{{minPrice}}</text>
									<view style="flex:1"> 
										<slider  activeColor="#ED9121" :value="bargainPrice" @change="bargainPriceChange" :min="minPrice" :max="priceTotal" block-color="#ED9121" /> 
									</view>
									<text>￥{{priceTotal}}</text>
							</view>	
						</uni-forms-item> -->
            <uni-forms-item>
              <view class="pay-area" v-if="isBargainOrder">
                <view style="flex: 1"
                  ><text>议价</text
                  ><text class="rmb">￥{{ bargainPrice }}</text></view
                >
                <view>
                  <button
                    size="default"
                    type="default"
                    class="btn"
                    @click="bargainEvent"
                  >
                    发起议价
                  </button>
                </view>
              </view>
              <view class="pay-area" v-if="!isBargainOrder">
                <view style="flex: 1"
                  ><text>在线支付</text
                  ><text class="rmb">￥{{ priceTotal }}</text></view
                >
                <view v-if="hotel.payType != 'online'">
                  <button
                    size="default"
                    type="default"
                    class="btn"
                    @click="reserve"
                  >
                    预定
                  </button>
                </view>
                <view v-if="hotel.payType == 'online'">
                  <button
                    size="default"
                    type="default"
                    class="btn"
                    @click="payEvent"
                  >
                    立即支付
                  </button>
                </view>
              </view>
            </uni-forms-item>
          </uni-forms>
        </view>
      </template>
      <!-- #endif -->
    </xt-panal-list>
  </view>
</template>

<script>
import { OrderService } from "@/services/OrderService";
export default {
  components: {},
  props: {
    formData: {
      type: Object,
    },
  },
  setup(props) {},
  data() {
    return {
      submitLoading: false,
      dateSelectShow: false,
      //priceTotal:0,
      bargainPrice: null,
      source: [
        {
          name: "xiechen",
          name_Zn: "携程",
          value: 1,
        },
        {
          name: "meituan",
          name_Zn: "美团",
          value: 2,
        },
        {
          name: "meituanminsu",
          name_Zn: "美团民宿",
          value: 3,
        },
        {
          name: "ticktok",
          name_Zn: "抖音",
          value: 4,
        },
        {
          name: "tujia",
          name_Zn: "途家",
          value: 5,
        },
        {
          name: "downline",
          name_Zn: "线下",
          value: 0,
        },
        {
          name: "yisu",
          name_Zn: "议宿",
          value: 8,
        },
        {
          name: "ohters",
          name_Zn: "其它",
          value: 6,
        },
      ],
      selectCount: 1,
      orderForm: {
        orderSource: 8,
        dateRangeArray: [],
        userName: "",
        phone: "",
        orderType: "normal",
        orderStatus: 0,
        bargainStatus: 0,
        payStatus: 0,
      },
    };
  },
  created() {
    this.orderForm.userName = this.user.userName;
    this.orderForm.phone = this.user.phone;
    this.bargainPrice = this.formData.roomType[this.formData.priceField];
  },
  computed: {
    bargainMinPercent() {
      return this.formData.roomType["bargainMinPercent"] || 85; //最小议价百分比
    },
    minPrice() {
      return (
        (this.bargainMinPercent / 100) *
        this.formData.roomType[this.formData.priceField]
      );
    },
    signPrice() {
      return this.formData.roomType[this.formData.priceField];
    },
    priceTotal() {
      return this.selectCount * this.signPrice;
    },
    hotel() {
      return this.$store.state.hotelClientStore.hotel;
    },
    isPcShow() {
      return this.$store.state.isPcShow;
    },
    isIOS() {
      return (
        uni.getSystemInfoSync().osName == "ios" ||
        uni.getDeviceInfo().platform == "ios"
      );
    },
    isH5() {
      // #ifdef  H5
      return true;
      //#endif
      return false;
    },
    // hotel_id() {
    // 	return this.$store.state.hotel_id;
    // },
    user() {
      return this.$store.state.user;
    },
    sourceFormat() {
      return this.source.map((item) => {
        return {
          text: item.name_Zn,
          value: item.value,
        };
      });
    },
    isBargainOrder() {
      return this.priceTotal > this.bargainPrice;
    },
  },
  methods: {
    loseCount() {
      if (this.selectCount == 1) {
        uni.showToast({ title: "最少选择一间", icon: "none" });
        return;
      }
      this.selectCount = this.selectCount - 1;
    },
    addCount() {
      if (this.selectCount + 1 > this.formData.roomType.count) {
        uni.showToast({ title: "没有多余房间", icon: "none" });
        return;
      }
      this.selectCount = this.selectCount + 1;
    },
    bargainPriceChange(e) {
      console.log(e);
      this.bargainPrice = e.detail.value;
    },
    formatDate(range) {
      let st = range[0],
        et = range[1];
      let day = Math.floor((et - st) / (1000 * 60 * 60 * 24));
      return {
        dt: `${new Date(st).Format("MM-dd")} 至 ${new Date(et).Format(
          "MM-dd"
        )}`,
        dy: `${day}晚`,
      };
    },
    dateRangeArrayFormat() {
      let startTime = new Date(
        new Date(this.formData.dateRange[0]).Format("yyyy/MM/dd") + " 14:00:00"
      ).getTime();
      let endTime = new Date(
        new Date(this.formData.dateRange[1]).Format("yyyy/MM/dd") + " 12:00:00"
      ).getTime();
      return [startTime, endTime];
    },
    //发起议价单
    async bargainEvent() {
      console.log(this.formData.orderType);
      //this.orderForm.bargainStatus=0;
      await this.submitForm();
      const eventChannel = this.getOpenerEventChannel();
      eventChannel.emit('updateData');
      uni.redirectTo({ url: "/pages_client/order/orderList/orderList" });
    },
    //发起支付
    async payEvent() {
      return;
      this.orderForm.payType = "online";
      await this.submitForm();
      const eventChannel = this.getOpenerEventChannel();
      eventChannel.emit('updateData');
    },
    //线下预定
    async reserve() {
      console.log("预定");
      const conf = await uni.showModal({
        title: "确认提交订单",
        content: "确认订单信息",
        cancelText: "取消",
        confirmText: "确认",
      });
      if (conf["cancel"]) {
        return;
      }
      this.orderForm.payType = "offline";
      await this.submitForm();
      const eventChannel = this.getOpenerEventChannel();
      eventChannel.emit('updateData');
      uni.redirectTo({ url: "/pages_client/order/orderList/orderList" });
      // const db = uniCloud.database();
      // db.collection('hm-order').remove()
    },
    async submitForm() {
      this.submitLoading = true;
      let dateRange = this.dateRangeArrayFormat();
      let sourceObj = this.source.find(
        (item) => item.value == this.orderForm.orderSource
      );
      let obj = {
        hotel_id: this.formData.roomType.hotel_id, //--
        roomTypeArray: [
          {
            roomType_id: this.formData.roomType._id,
            count: this.selectCount,
            name: this.formData.roomType.name,
          },
        ], //---
        userName: this.orderForm.userName,
        checkInStartDateTimeStamp: dateRange[0],
        checkInEndDateTimeStamp: dateRange[1],
        checkInStartDate: new Date(dateRange[0]).Format("yyyy/MM/dd HH:mm:ss"), //--
        checkInEndDate: new Date(dateRange[1]).Format("yyyy/MM/dd HH:mm:ss"),
        phone: this.orderForm.phone, //-
        createrPhone: this.user.phone, //--
        createrName: this.user.userName, //--
        fromClient: true,
        bargainStatus: this.orderForm.bargainStatus,
        payStatus: this.orderForm.payStatus,
        orderStatus: this.orderForm.orderStatus,
        orderSource: Number(this.orderForm.orderSource),
        orderSouce_Zn: sourceObj.name_Zn,
        orderType: this.isBargainOrder ? "bargain" : "normal",
        totalAmount: this.isBargainOrder ? this.bargainPrice : this.priceTotal,
        payType: this.hotel.onlinePayment ? "online" : "offline", //--
      };
      console.log(obj);
      await OrderService.addOrder(obj);
      console.log("添加成功");
      this.submitLoading = false;
      uni.hideLoading();
    },
  },
};
</script>

<style lang="scss">
.form-item-content-container {
  display: flex;
  align-items: center;
}
::v-deep.uni-forms-item {
  margin-bottom: 0 !important;
}
.calendar-container {
  flex: 1;
  border: 1px solid #dcdfe6;
  color: #606266;
  border-radius: 4px;
  padding: 0 12px;
  height: 35px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.uni-list-cell {
  justify-content: flex-start;
}

.disabled-style {
  color: #bbb;
}
.input-area {
  display: flex;
  flex-direction: column;
  height: 100%;
  .in {
    flex: 1;
    color: #7c7c7c;
  }
}
.formitem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .title {
    font-size: 18px;
    font-weight: bold;
    padding: 10px 0;
  }
}
.form-content {
  display: flex;
  align-items: center;
  height: 100%;
  gap: 10px;
  color: #a1a1a1;
  font-size: 16px;
}
.pay-area {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  .rmb {
    color: #ed9121;
    font-weight: bold;
    font-size: 20px;
    padding: 0 10px;
  }
  .btn {
    background-color: #ed9121;
    color: #fff;
    width: 86px;
    height: 40px;
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom-right-radius: 37%;
    text-overflow: clip;
  }
}
</style>
