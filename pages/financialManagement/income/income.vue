<template>
  <view>
    <view class="add-content-style">
      <view class="left-panal">
      
      </view>
      <view class="control-panal">
        <!-- <navigator url="/pages/financialManagement/income/createIncome/createIncome" hover-class="navigator-hover">
					 -->
        <uv-icon
          name="plus-circle-fill"
          color="#000"
          size="22"
          label="创建单据"
          labelPos="bottom"
          labelSize="12px"
          @click="createIncome"
        ></uv-icon>
        <!-- </navigator> -->
      </view>
    </view>
    <view class="filter-area">
      <view style="flex: 1">
        <uni-datetime-picker
          v-model="filter.dateRangeArray"
          rangeSeparator="/"
          type="daterange"
          return-type="timestamp"
        
          :clear-icon="false"
          style="z-index: 9999"
        />
      </view>
      <view style="width: 120px">
          <uni-data-select
            v-model="filter.type"
            placeholder="收入类型"
            collection="hm-incomeAndExpensesConfig"
            where="billType=='income'"
            field="text , name as value"
            orderby="name asc"
            
          ></uni-data-select>
      </view>
    </view>
    <unicloud-db
      ref="udb"
      v-slot:default="{ data, loading, error, options }"
      :collection="colList"
      :getone="false"
	   :options="options"
      :where="where_str"
      orderby="ioeTime asc"
    >
	<view class="info-area">
		<view class="item"> 
			<view><text>总计(元)</text></view>
			<view class="num-area"><text class="num">{{ order_amount + amountSum(data) }}</text></view>
		</view>
		<view class="item"> 
			<view><text>房费(元)</text></view>
			<view class="num-area"><text class="num">{{ order_amount}}</text></view>
		</view>
		<view class="item"> 
			<view><text>其它小计：(元)</text></view>
			<view class="num-area"><text class="num">{{ amountSum(data) }}</text></view>
		</view>
      </view>
      <block v-if="!data||!data.length">
        <noData  text_content="当前无收入数据"></noData>
      </block>
      <block v-if="data&&data.length">
	  <uni-section class="mb-10" title="其它收入明细" sub-title="" type="line"></uni-section>
      <scroll-view
        scroll-x="false"
        scroll-y="true"
        style="height: calc(100vh - 232px)"
      >
    
     
        <xt-panal-list :count="data.length">
        
          <!-- #ifdef MP -->
				<view  v-for="(item, index) in data" slot="card{{index}}"> 
          <view class="list">
            <view class="list-item"
              ><text>时间：</text
              ><text>{{
                new Date(item.ioeTime).Format("yyyy/MM/dd")
              }}</text></view
            >
            <view class="list-item"
              ><text>类型：</text><text>{{ item.type[0].text }}</text></view
            >
            <view class="list-item"
              ><text>金额：</text><text>{{ item.amount }}</text></view
            >
            <view class="list-item"
              ><text>备注：</text><text>{{ item.mark }}</text></view
            >
          </view>
        </view>
        <!-- #endif -->
				  <!-- #ifdef H5 || APP-PLUS -->
          <template v-for="(item, index) in data" v-slot:[`card${index}`]>
            <view class="list">
              <view class="list-item"
                ><text>时间：</text
                ><text>{{
                  new Date(item.ioeTime).Format("yyyy/MM/dd")
                }}</text></view
              >
              <view class="list-item"
                ><text>类型：</text><text>{{ item.type[0].text }}</text></view
              >
              <view class="list-item"
                ><text>金额：</text><text>{{ item.amount }}</text></view
              >
              <view class="list-item"
                ><text>备注：</text><text>{{ item.mark }}</text></view
              >
            </view>
          </template>
           <!-- #endif -->
        </xt-panal-list>
    
      </scroll-view>
    </block>
    </unicloud-db>
  </view>
</template>

<script>
import { computed, ref, watch, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import {FMService} from "../../../services/FMService";
export default {
  setup() {
    const store = useStore();
	// const hotel_id = computed(()=>{
	// 	return store.state.hotel_id;
	// })
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
      const s1 = `billType=='income'`;
      const s2 = `ioeTime>=${filter.value.dateRangeArray[0]}&&ioeTime<=${filter.value.dateRangeArray[1]}`;
      //const s3=filter.value.type?`type=='${filter.value.type}'`:"type!=''";
      return `${s1}&&${s2}`;
    });
	let where_order=computed(() => {
		
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
	let order_amount=ref(0);
     watch(filter, async (newValue, oldValue) => {
		console.log("watch....")
		const res = await FMService.getRoomOrder(store.state.hotel_id,filter.value.dateRangeArray[0],filter.value.dateRangeArray[1]);
		console.log("res",res)
		order_amount.value=res.result.data[0].amount;
    },{deep:true,immediate:true});
    return {
      filter,
      colList,
      where_str,
	  where_order,
	  order_amount
	  
    };
  },
  data() {
    return {};
  },

  onShow() {
    //this.$refs.udb.refresh();
  },
  created() {
    // uniCloud.callFunction({name:"hm_fm_task",data:{hotel_id:this.$store.state.hotel_id}}).then(re=>{
    // 	console.log("222",re)
    // })
  },
  methods: {
    amountSum(list) {
      let sum = 0;
      list.map((item) => {
        sum += item.amount;
      });
      return sum;
    },
	async getOrder(){
		console.log(this.filter)
		
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

<style lang="scss">
.add-content-style {
  height: 60px;
  display: flex;
  justify-content: flex-end;
  padding: 0 20px;
  box-sizing: border-box;
  background: #f7f7f7;
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
.filter-area {
  max-width: 600px;
  height: 60px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 15px;
}
.info-area {
  color: #6a6a6a;
  font-size: 12px;
  display: flex;
  align-items: center;
  display: flex;
  padding:0 15px;
  box-sizing: border-box;
  justify-content: space-between;
  max-width: 600px;
  .item{
	border:1px solid #e0e0e0;
	border-radius: 10px;
	width: 110px;
	height: 70px;
	box-sizing: border-box;
	padding:8px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	.num-area{
		text-align: center;
		.num{
			color:#0765ae;
			padding:0 4px;
			font-weight: bold;
			font-size: 20px;
		  }
	}
  }
  
}
.list {
  color: #6a6a6a;
  font-size: 13px;
  .list-item {
    box-sizing: border-box;
    padding: 4px 15px;
    display: flex;
    align-items: center;
  }
}
</style>
