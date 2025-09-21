<template>
  <view class="orderChildCalendar">
    <block v-if="noData">
      <noData text_content="当前无订单数据"></noData>
    </block>
    <block v-if="!noData">
     <!-- <view>{{JSON.stringify(checkInOrderListFormat)}}</view>  -->
      <view class="uni-container">
        <uni-table ref="table" :loading="loading" border stripe emptyText="暂无更多数据">
          <uni-tr class="table-header">
            <!-- <uni-th width="40" align="center">房型</uni-th> -->
            <uni-th width="60" align="center">
              <view>
                房间
                <!-- <view>
                <l-icon name="material-symbols:calendar-today-rounded" size="40px" color="#42A5F5"/>
               
              </view>
              <view> <text style="color:#42A5F5">{{new Date().Format("MM-dd")}}</text></view> -->
              </view>
            </uni-th>
            <uni-th align="center" v-for="item of orderDateRangeFormat">
              <view>
                <view>{{item.de}}</view>
                <view>{{item.dy}}</view>
                <view style="color: green">剩余（{{getRemainRoomCountByDate(item.name)}}）</view>
                <!-- <view style="color:#bbb">(空4间)</view> -->
              </view>
            </uni-th>
          </uni-tr>
          <block v-for="(items, keys) of checkInOrderListFormat">
            <uni-tr v-for="(item, key) of items.resultRoomList" class="t-tr">
              <!-- <uni-td :rowspan="items.roomCount"  :style="{'background':keys%2==0?'#f1f1f1':'#fff','display':key==0?'table-cell':'none'}"> <text style="font-weight:bold">{{items.name}}</text></uni-td> -->
              <uni-td>
                <text style="font-weight: bold">{{
                  item.room_name
                }}</text></uni-td>
              <uni-td v-for="it of item.list" :style="{background: it.username? 'green':'#fff'}">
                <view class="flex-center" :style="{
                  color: '#fff',
                  'min-height': '60px',
                  background: it.username? 'green':'#fff',
                }">
                  <text>{{it.username}}</text>
                </view>
              </uni-td>
            </uni-tr>
          </block>
        </uni-table>
      </view>
    </block>
  </view>
</template>

<script>
import { OrderService } from "../../../services/OrderService";
import uniTable from "../../../uni_modules/uni-table/components/uni-table/uni-table.vue";
import { ref } from "vue";
import UniTr from "../../../uni_modules/uni-table/components/uni-tr/uni-tr.vue";
import { HotelService } from "../../../services/HotelService";
export default {
  components: { uniTable, UniTr },
  setup() {
    let columnRoom = ref([]);
  },
  options: {
    styleIsolation: "shared", // 解除样式隔离
  },
  data() {
    return {
      roomType_roomList: null,
      column: [
        { name: "roomName", fixed: true, width: 90 },
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
          roomName: "大床房",
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
  async created() {
    //console.log("房态created")
    this.initData();
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
      let arr = [];
      this.orderDateRange.map((item) => {
        arr.push({
          de: new Date(item).Format("MM-dd"),
          dy: dyStr[new Date(item).getDay()],
          name: item + "",
          label:
            new Date(item).Format("MM-dd") + dyStr[new Date(item).getDay()],
        });
      });
      return arr;
    },
    checkInOrderListFormat() {
      //console.log("sss:",this.roomType_roomList)
      if (!this.roomType_roomList) {
        return [];
      }
      if (
        this.checkInOrderList.length < 1 ||
        this.roomType_roomList.length < 1
      ) {
        return [];
      }
      let result = [];
      //console.log("orderDateRange::",this.orderDateRange)
      let or = this.orderDateRange;
      let checkInOrderList = this.checkInOrderList;
      let fillRoom = (room_id) => {
        let parseArr = [];
        let count = 0;
        let tt="";
        for (let i = 0; i < this.orderDateRange.length; i++) {
          let target = null;
          let count = 0;
          for (let item of this.checkInOrderList) {
            let s1 =
              Number(this.orderDateRange[i]) >=
                Number(item.checkInStartDateTimeStamp) &&
              Number(this.orderDateRange[i]) <
                Number(item.checkInEndDateTimeStamp);
            if (!s1) {
              continue;
            }
           
            let hasTarget =false;
            //  item.roomTypeArray.find((it) => {
            //   let f = it.roomList.includes(room_id);
            //   return f;
            // });
          //  let arr=[];
             item.roomTypeArray.map(it=>{
              if(it.roomList.includes(room_id)){
                hasTarget =true;
                count += it.roomList.length;
                target = item;
              }
             // arr.push(...it.roomList)
             })
          //  tt={rr:room_id ,arr:arr};
            
          }
          parseArr.push({
            time: this.orderDateRange[i],
          //  tt:tt,
            order_id: target ? target["_id"] : null,
            username: target ? target["userName"] : null,
            num: count,
          });
        }
        return { list: parseArr, room_id: room_id };
      };
      for (let i = 0; i < this.roomType_roomList.length; i++) {
        const roomList = this.roomType_roomList[i]._id["hm-room"];
        if (!(roomList && roomList.length)) {
          continue;
        }
        let resultRoomList = [];
        for (let j = 0; j < roomList.length; j++) {
          let room_id = roomList[j]._id,
            room_name = roomList[j].room_name;
          let obj = fillRoom(room_id);
          resultRoomList.push({
            room_id: room_id,
            room_name: room_name,
            list: obj.list,
          });
        }
        result.push({
          room_type_id: this.roomType_roomList[i]._id.value,
          roomCount: this.roomType_roomList[i]._id["hm-room"].length,
          name: this.roomType_roomList[i].name,
          resultRoomList: resultRoomList,
        });
      }
      //console.log("结果：：",result)
      return result;
    },
    roomCount() {
      let count = 0;
      if (!this.roomType_roomList) {
        return 0;
      }
      this.roomType_roomList.map((item) => {
        count += item._id["hm-room"].length;
      });
      return count;
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
        //console.log("局部刷新 orderComponent");
        await this.$store.dispatch("getOrderListTodayAfter", this.hotel_id);
        //console.log("刷新完成");
        this.$store.commit("setPartialRefreshComName", "");
        uni.hideLoading();
        uni.stopPullDownRefresh();
      }
    },
  },
  methods: {
    showDetail(arr) {},
    async initData() {
      await this.getRoomList();
      await this.getOrderList();
    },
    async getRoomList() {
      const res = await HotelService.getRoomListByHotelIdGroupByRoomType(
        this.hotel_id
      );
      this.roomType_roomList = res.result.data;
      //console.log("roomList",res);
    },
    async getOrderList() {
      //uni.showLoading();
      console.log(" calendarCOm getOrderList ")
      try {
        
        await this.$store.dispatch("getOrderListTodayAfter", this.hotel_id);
        //console.log("orderList::",this.checkInOrderList)
      } catch (error) {
        console.error("err", error);
      }
      uni.hideLoading();
    },
    getRemainRoomCountByDate(time) {
      let count = 0;
      for (let item of this.checkInOrderList) {
        let s1 =
          time >= item.checkInStartDateTimeStamp &&
          time < item.checkInEndDateTimeStamp;
        if (!s1) {
          continue;
        }
        item.roomTypeArray.map((it) => {
          count += it.roomList.length;
        });
      }
      return Math.max(this.roomCount - count, 0);
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
.orderChildCalendar {}

.uni-container {
  width: 100%;
  height: 100vh;
}

.table-header {
  position: sticky;
  left: 0;
  top: 0;
  z-index: 100;
  background-color: #fff;
}

/*冻结表头第一列*/
::v-deep .uni-table-tr .uni-table-td:first-child {
  position: sticky;
  left: 0;
  top: 0;
  background-color: #fff;
  z-index: 1000;
}

::v-deep .uni-table-tr {
  overflow: visible;
  background-color: #fff;
}

::v-deep .uni-table-tr .uni-table-th:first-child {
  position: sticky;
  left: 0;
  top: 0;
  background-color: #fff;
  z-index: 1000;
}

.roomType-dev-style {
  background-color: #c6d0e1 !important;
  padding: 5px;
  margin: 20px 0;
  border-radius: 10px;
  font-weight: 400;
}

/*
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
  font-weight: 400;
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
  font-weight: 400;
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
}*/
.uni-table-th,
.uni-table-tr .uni-table-td:first-child {
  height: 100% !important;
  vertical-align: middle !important;
}
</style>
