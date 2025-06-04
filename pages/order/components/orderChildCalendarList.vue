<template>
  <view>
    <block v-if="noData">
      <noData text_content="当前无订单数据"></noData>
    </block>
    <block v-if="!noData">
<view> 
  {{ console.log("1211",checkInOrderListFormat,orderDateRangeFormat) }}
  <uni-table ref="table" :loading="loading" border stripe  emptyText="暂无更多数据">
				<uni-tr>
          <uni-th width="100px" align="center" class="fixed" >日历图标</uni-th>				
					<uni-th align="center" v-for="item of orderDateRangeFormat">
            <view> 
              <view>{{item.de}}</view>
              <view>{{item.dy}}</view>
              <view style="color:#bbb">(空4间)</view>
            </view>
            
          </uni-th>
				</uni-tr>
        <uni-tr v-for="(item,key) of checkInOrderListFormat"> 
          <uni-td class="fixed">{{ roomType[key].name }}
          </uni-td>
          <un-td v-for="it of item">
            <view class="inner-table"> 
                 <view class="inner-table-tr" v-for="i of it.orderList"> {{i.userName}}</view>
            </view>
              
           </un-td>
        </uni-tr>
        </uni-table>
</view>
      <!-- <view>
        <zb-table
          :show-header="true"
          :columns="orderDateRangeFormat"
          :stripe="true"
          :fit="false"
          :show-summary="false"
          sum-text="合计"
          :border="true"
          :data="checkInOrderListFormat2"
        ></zb-table>
      </view> -->

      <view style="display: none">
        <view class="left-table-style">
          <view class="th-style"><text>房间号</text></view>
          <view class="td-style" v-for="item in roomType">
            <text>
              {{ item.name }}
            </text>
          </view>
        </view>
        <view class="checkInTable-style" style="flex: 1">
          <scroll-view
            class="checkIntable-content-scroll"
            :scroll-y="false"
            :scroll-x="true"
          >
            <view class="checkIntable-content">
              <view class="checkIntable-h-list">
                <view
                  class="th-style checkIntable-h-list-h"
                  style="background-color: #f4f4f4"
                  v-for="item in orderDateRangeFormat"
                >
                  <view style="display: flex; flex-direction: column">
                    <text>{{ item.de }}</text>
                    <text>{{ item.dy }}</text>
                  </view>
                </view>
              </view>
              <view
                class="checkIntable-h-list"
                v-for="it in checkInOrderListFormat"
              >
                <view
                  class="checkIntable-h-list-h td-style"
                  v-for="i in it"
                  @click="showDetail(i)"
                >
                  <view v-for="is in i.orderList" class="tx-content">
                    <text class="tx">{{ is.userName ? is.userName : "" }}</text>
                  </view>
                  <view v-if="i.orderList.length > 4">
                    <text class="tx">...</text>
                  </view>
                  <uni-badge
                    :text="i.count"
                    style="position: absolute; top: 2px; right: 2px"
                  />
                </view>
              </view>
            </view>
          </scroll-view>
          <view class="checkIntable-h-head" style="flex-direction: column">
          </view>
        </view>
      </view>
    </block>
  </view>
</template>

<script>
import { OrderService } from "../../../services/OrderService";
import uniTable from "../../../uni_modules/uni-table/components/uni-table/uni-table.vue";
import {ref} from "vue";
import UniTr from '../../../uni_modules/uni-table/components/uni-tr/uni-tr.vue';
export default {
  components: { uniTable, UniTr },
  setup(){
    let columnRoom=ref([]);

  },
  data() {
    return {

      column: [
        {name:"roomName",  fixed: true, width: 90 },
        {
          name: "name",
          label: "姓名",
          fixed: false,
          width: 80,
          emptyString: "--",
        },
        { name: "age", label: "年纪", sorter: false, align: "right" },
        { name: "sex", label: "性别", filters: { 0: "男", 1: "女" } },
        { name: "img", label: "图片", type: "img" },
        { name: "address", label: "地址" },
        { name: "date", label: "日期", sorter: true },
        { name: "province", label: "省份" },
        { name: "city", label: "城市" },
        { name: "zip", label: "邮编" },
        {
          name: "operation",
          type: "operation",
          label: "操作",
          renders: [
            {
              name: "编辑",
              func: "edit", // func 代表子元素点击的事件 父元素接收的事件 父元素 @edit
            },
            {
              name: "删除",
              type: "warn",
              func: "dele",
            },
          ],
        },
      ],
      data: [
        {
          roomName:"大床房",
          date: "2016-05-02",
          name: "王小虎1",
          province: "上海",
          sex: "男",
          age: "18",
          img: "https://img1.baidu.com/it/u=300787145,1214060415&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500",
          city: "普陀区",
          address: "上海市普",
          zip: 200333,
        },
        {
          date: "2016-05-02",
          name: "王小虎2",
          province: "上海",
          sex: "男",
          age: "18",
          city: "普陀区",
          address: "上海市普",
          zip: 200333,
        },
        {
          date: "2016-05-02",
          name: "王小虎3",
          province: "上海",
          sex: "男",
          age: "18",
          city: "普陀区",
          address: "上海市普",
          zip: 200333,
        },
        {
          date: "2016-05-02",
          name: "王小虎4",
          province: "上海",
          sex: "男",
          age: "18",
          city: "普陀区",
          address: "上海市普",
          zip: 200333,
        },
        {
          date: "2016-05-02",
          name: "王小虎5",
          province: "上海",
          sex: "男",
          age: "18",
          city: "普陀区",
          address: "上海市普",
          zip: 200333,
        },
        
      ],
    };
  },
  created() {
    this.getOrderList();
  },
  activated() {},
  mounted() {},
  computed: {
    hotel_id() {
      return this.$store.state.hotel_id;
    },
    roomType() {
      return this.$store.state.roomType || {};
    },
    checkInOrderList() {
      return this.$store.state.orderStore.orderListTodayAfter || [];
    },
    partialRefreshComName() {
      return this.$store.state.partialRefreshComName;
    },
    noData() {
      return this.checkInOrderList.length < 1;
    },
    dateTabList() {
      let curDateTimeStamp = new Date().getTime();
      let dateList = [];
      for (let i = 0; i < 100; i++) {
        dateList.push(curDateTimeStamp + i * 1000 * 60 * 60 * 24);
      }
      return dateList;
    },

    orderDateRange() {
      let rangeDate = [];
      let minTime = Math.min(
        ...this.checkInOrderList.map((item) => item.checkInStartDateTimeStamp)
      );
      let maxTime = Math.max(
        ...this.checkInOrderList.map((item) => item.checkInEndDateTimeStamp)
      );
      for (let i = minTime; i <= maxTime; i = i + 1000 * 60 * 60 * 24) {
        rangeDate.push(i);
      }
      return rangeDate;
    },
    orderDateRangeFormat() {
      let dyStr = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ];
     // let arr=[{name:"roomName",  fixed: true, width: 90 }];
       let arr=[]
       this.orderDateRange.map((item) => {
        arr.push({
          de: new Date(item).Format("MM-dd"),
          dy: dyStr[new Date(item).getDay()],
          name:item+"",
          label: new Date(item).Format("MM-dd")+dyStr[new Date(item).getDay()]
        });
      });
      return arr;
    },
    checkInOrderListFormat() {
      if (this.checkInOrderList.length < 1 || this.roomType.length < 1) {
        return [];
      }
      let result = [];
      let or = this.orderDateRange;
      let checkInOrderList = this.checkInOrderList;
      for (let i = 0; i < this.roomType.length; i++) {
        let roomType_id = this.roomType[i]._id;
        result.push(fillRoomType(roomType_id));
      }

      function fillRoomType(roomType_id) {
        let fillArray = [];
        //let fillObj ={orderList:[],count:0}
        for (let j = 0; j < or.length; j++) {
          let countT = 0;
          let objArray = checkInOrderList.filter((item) => {
            let o = item.roomTypeArray.find(
              (is) => is.roomType_id == roomType_id
            );
            let flag =
              o &&
              or[j] >= item.checkInStartDateTimeStamp &&
              or[j] < item.checkInEndDateTimeStamp;
            if (flag) {
              countT += o.count;
            }
            return flag;
          });
          let obt = { orderList: objArray, count: countT };
         obt[or[j]+""]=countT;
          fillArray.push(obt);
          //fillObj.orderList.push(objArray || []);
        }
        //fillObj.orderList=fillArray;
        return fillArray;
      }

      return result;
    },
    checkInOrderListFormat2() {
      if (this.checkInOrderList.length < 1 || this.roomType.length < 1) {
        return [];
      }
      let that =this;
      let result = [];
      let or = this.orderDateRange;
      let checkInOrderList = this.checkInOrderList;
      for (let i = 0; i < this.roomType.length; i++) {
        let roomType_id = this.roomType[i]._id;
        result.push(fillRoomType(roomType_id));
      };
    
      function fillRoomType(roomType_id) {
        let fillArray = [];
        let fillObj ={}
        for (let j = 0; j < or.length; j++) {
          let countT = 0;
          let objArray = checkInOrderList.filter((item) => {
            let o = item.roomTypeArray.find(
              (is) => is.roomType_id == roomType_id
            );
            let flag =
              o &&
              or[j] >= item.checkInStartDateTimeStamp &&
              or[j] < item.checkInEndDateTimeStamp;
            if (flag) {
              countT += o.count;
            }
            return flag;
          });
          let obt = { orderList: objArray, count: countT };
          fillObj['roomName']=that.roomType.find(item=>item._id==roomType_id)['name'];
          fillObj[or[j]+""]=countT;
          fillArray.push(obt);
         
        }
        
       // return fillArray;
       return fillObj;
      }

      return result;
    },
  },
  watch: {
    hotel_id(val, oldVal) {
      if (val != oldVal) {
        this.$store.dispatch("getOrderListTodayAfter", this.hotel_id);
      }
    },
    async partialRefreshComName(val) {
      //下拉刷新
      if (val == "orderComponent") {
        console.log("局部刷新 orderComponent");
        await this.$store.dispatch("getOrderListTodayAfter", this.hotel_id);
        console.log("刷新完成");
        this.$store.commit("setPartialRefreshComName", "");
        uni.hideLoading();
        uni.stopPullDownRefresh();
      }
    },
  },
  methods: {
    showDetail(arr) {},
    async getOrderList() {
      //uni.showLoading();
      try {
        await this.$store.dispatch("getOrderListTodayAfter", this.hotel_id);
      } catch (error) {}
      uni.hideLoading();
    },
    numRoom(arr = []) {
      if (!arr.length) {
        return 0;
      }

      return 33;
    },
  },
};
</script>

<style lang="scss">
/* pages/management/checkIn/checkIn.wxss */
.checkIntable-content-scroll {
  width: calc(100vw - 100px);
  height: 100%;
}
.checkIntable-content {
  width: fit-content;
  font-size: $uni-font-size-lg;
}

.left-table-style {
  width: 100px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border-right: 1px solid #eee;
  color: $label-normal;
}

.th-style {
  height: 75px;
  text-align: center;
  font-weight: bold;
  display: flex;
  align-items: center;
  font-size: $uni-font-size-base;
  justify-content: center;
  letter-spacing: 2px;
  border-right: 1px solid #eee;
  box-sizing: border-box;
}

.td-style {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80px;
  text-align: center;
  font-size: $uni-font-size-base;
  position: relative;
  box-sizing: border-box;
  border: 1px solid #b3b3b338;
  border-left-width: 0;
  border-top-width: 0;
}

.isContinueCheckIn {
  font-weight: bold;
}

.left-table-style .td-style {
  font-weight: 500;
}

.checkIntable-h-list {
  display: flex;
  flex-flow: row;
  white-space: nowrap;
}

.checkIntable-h-list .checkIntable-h-list-h {
  width: 80px;
  overflow: hidden;
  vertical-align: center;
  justify-content: center;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  /**&:nth-child(even){
			background-color: #f0efef
		};*/
  .tx-content {
    &:nth-child(n + 4) {
      display: none;
    }
    .tx {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0 4px;
    }
  }
}
.fixed {
  position: sticky;
  left: 0;
  z-index: 1;
  background-color: #ffffff;
}
.inner-table{
  .inner-table-tr{
    
    
    padding:5px;
    box-sizing: border-box;
    color: #666;
    font-size: 13px;
  }
}
</style>
