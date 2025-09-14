<template>
  <view class="income">
    <view class="add-content-style">
      <view class="left-panal"> </view>
      <view class="control-panal">
        <view class="control-item-group" @click="createIncome">
          <view><l-icon name="solar:add-circle-bold" size="22px" color="#fff" /></view>
          <view><text style="color: #fff">创建单据</text></view>
        </view>
      </view>
    </view>
    <view class="content">
      <view class="filter-area">
        <view class="filter-item" style="flex: 1">
          <uni-datetime-picker v-model="filter.dateRangeArray" rangeSeparator="/" type="daterange"
            return-type="timestamp" :clear-icon="false" style="z-index: 9999" />
        </view>
        <view class="filter-item" style="width: 120px">
          <uni-data-select v-model="filter.type" placeholder="收入类型" collection="hm-incomeAndExpensesConfig"
            where="billType=='income'" field="text , name as value" orderby="name asc"></uni-data-select>
        </view>
      </view>
      <unicloud-db ref="udb" v-slot:default="{data, loading, error, options}" :collection="colList" :getone="false"
        :options="options" :where="where_str" orderby="ioeTime asc">
        <view class="info-area">
          <view class="item">
            <view><text>总计</text></view>
            <view class="num-area"><text class="num">￥{{order_amount+amountSum(data)}}</text></view>
          </view>
          <view class="item">
            <view><text>房费</text></view>
            <view class="num-area"><text class="num">￥{{order_amount}}</text></view>
          </view>
          <view class="item">
            <view><text>其它</text></view>
            <view class="num-area"><text class="num">￥{{amountSum(data)}}</text></view>
          </view>
        </view>
        <block v-if="!data||!data.length">
          <noData text_content="当前无收入数据"></noData>
        </block>
        <block v-if="data&&data.length">
          <!-- <uni-section class="mb-10" title="其它收入明细" sub-title="" type="line"></uni-section> -->
          <view class="detail-title">
            <text>收入明细</text>
          </view>
          <!-- <scroll-view
        scroll-x="false"
        scroll-y="true"
        style="height: calc(100vh - 232px)"
      > -->

          <xt-panal-list :count="data.length">
            <!-- #ifdef MP -->
            <view v-for="(item, index) in data" slot="card{{index}}">
              <view class="list">
                <view class="list-item"><text  class="ti">时间：</text><text>{{
                  new Date(item.ioeTime).Format("yyyy/MM/dd")
                }}</text></view>
                <view class="list-item"><text class="ti">类型：</text><text>{{item.type[0].text}}</text></view>
                <view class="list-item"><text class="ti">金额：</text><text>{{item.amount}}</text></view>
                <view class="list-item"><text class="ti">备注：</text><text>{{item.mark}}</text></view>
              </view>
            </view>
            <!-- #endif -->
            <!-- #ifdef H5 || APP-PLUS -->
            <template v-for="(item, index) in data" v-slot:[`card${index}`]>
              <view class="list">
                <view class="list-item"><text  class="ti">时间：</text><text>{{
                  new Date(item.ioeTime).Format("yyyy/MM/dd")
                }}</text></view>
                <view class="list-item"><text class="ti">类型：</text><text>{{item.type[0].text}}</text></view>
                <view class="list-item"><text class="ti">金额：</text><text>{{item.amount}}</text></view>
                <view class="list-item"><text class="ti">备注：</text><text>{{item.mark}}</text></view>
              </view>
            </template>
            <!-- #endif -->
          </xt-panal-list>

          <!-- </scroll-view> -->
        </block>
      </unicloud-db>
    </view>
  </view>
</template>

<script>
import { computed, ref, watch, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import { FMService } from "../../../services/FMService";
export default {
  setup() {
    const store = useStore();
   	let hotel_id = computed(()=>{
    			return store.state.hotel_id;
    		})
    let first = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    ).getTime();
    let last =
      new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        1
      ).getTime() - 1;

    let filter = ref({
      type: "",
      dateRangeArray: [first, last],
    });
    let where_str = computed(() => {
      const s1 = `billType=='income'&&data_status==1`;
      const s2 = `ioeTime>=${filter.value.dateRangeArray[0]}&&ioeTime<=${filter.value.dateRangeArray[1]}`;
      const s3=`hotel_id=="${hotel_id.value}"`;
				return `${s1}&&${s2}&&${s3}`
    });
    let where_order = computed(() => {
      const s1 = `hotel_id=='${store.state.hotel_id}'&&orderStatus==5`;
      const s2 = `checkInStartDateTimeStamp>=${filter.value.dateRangeArray[0]}&&checkInStartDateTimeStamp<${filter.value.dateRangeArray[1]}`;
      return `${s1}&&${s2}`;
    });
    let colList = computed(() => {
      let w = filter.value.type
        ? { type: filter.value.type, hotel_id: store.state.hotel_id }
        : { hotel_id: store.state.hotel_id };
      const db = uniCloud.database();
      return [
        db.collection("hm-incomeAndExpenses").where(w).getTemp(),
        db.collection("hm-incomeAndExpensesConfig").getTemp(),
      ];
    });
    let order_amount = ref(0);
    watch(
      filter,
      async (newValue, oldValue) => {
        console.log("watch....");
        const res = await FMService.getRoomOrder(
          store.state.hotel_id,
          filter.value.dateRangeArray[0],
          filter.value.dateRangeArray[1]
        );
        console.log("res", res);
        order_amount.value = res.result.data[0].amount;
      },
      { deep: true, immediate: true }
    );
    return {
      filter,
      colList,
      where_str,
      where_order,
      order_amount,
    };
  },
  data() {
    return {};
  },

  onShow() {
    //this.$refs.udb.refresh();
  },
  created() {

  },
      async onPullDownRefresh() {
      await this.$refs.udb.refresh();
    uni.stopPullDownRefresh();
  },
  methods: {
    amountSum(list) {
      let sum = 0;
      list.map((item) => {
        sum += item.amount;
      });
      return sum;
    },
    async getOrder() {
      console.log(this.filter);
    },
    createIncome() {
      uni.navigateTo({
        url: "/pages/financialManagement/income/createIncome/createIncome",
        events: {
          updateData: () => {
            console.log("刷新数据");
            this.$refs.udb.refresh();
          },
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.income {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-image: linear-gradient(162deg, #0765ae, #0765ae, #0765ae7a);
}

.add-content-style {
  height: 60px;
  display: flex;
  justify-content: flex-end;
  padding: 0 20px;
  box-sizing: border-box;
  background: #0765ae;

  .left-panal {
    flex: 1;
    display: flex;
    align-items: center;
  }

  .control-panal {
    display: flex;
    padding: 10px 0px;
    border-radius: 8px;
    gap: 20px;
  }
}

.content {
  flex: 1;
  background: #eaebee;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
}

.filter-area {
  max-width: 600px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 15px;

  .filter-item {
    border-radius: 8px;
    background: #fff;
  }
}

.info-area {
  padding: 15px;
  color: #6a6a6a;
  font-size: 12px;
  display: flex;
  align-items: center;
  display: flex;
  box-sizing: border-box;
  justify-content: space-between;
  max-width: 600px;

  .item {
    background-color: rgb(12, 55, 170);
    border-radius: 8px;
    width: 110px;
    height: 70px;
    box-sizing: border-box;
    padding: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: #fff;

    .num-area {
      text-align: center;

      .num {
        color: #fff;
        padding: 0 4px;
        font-weight: 400;
        font-size: 20px;
      }
    }
  }
}

.detail-title {
  font-size: 20px;
  color: #666;
  padding: 10px 15px;
  font-weight: 400;
}

.list {
  color: #6a6a6a;
  font-size: 13px;
  padding: 4px;

  .list-item {
    box-sizing: border-box;
    padding: 6px 15px;
    display: flex;
    align-items: center;
    .ti {
		font-weight: 400;
	}
  }
}
</style>
