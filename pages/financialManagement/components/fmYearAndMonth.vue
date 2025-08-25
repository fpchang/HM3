<template>
  <view class="fmYearAndMonth">
    <view class="chart-list">
      <view :class="item.class" :style="{background: item.backgroundColor}" v-for="item of chartItemList">
        <view class="more">
          <navigator :url="item.href" hover-class="none">
            <l-icon name="icon-park-solid:more-app" size="24px" :color="item.iconColor"></l-icon>
          </navigator>
        </view>
        <view class="item-title"><text>{{item.title}}</text></view>
        <view class="item-con"><text>￥{{item.value}}</text></view>
      </view>
      <!-- <view class="chart-item" style="background:#3698fc">
				<view class="more"><l-icon name="icon-park-solid:more-app" size="24px" color="#fff"></l-icon></view>				
				<view class="item-title"><text>本月支出</text></view>
				<view class="item-con"><text>￥{{currentMonthExpensesAmount}}</text></view>
			</view>
			<view class="chart-item" style="background:#3698fc">
				<view class="more"><l-icon name="icon-park-solid:more-app" size="24px" color="#fff"></l-icon></view>				
				<view class="item-title"><text>本年收入</text></view>
				<view class="item-con"><text>￥{{currentYearIncome.total}}</text></view>
			</view>
			<view class="chart-item item-white" style="background:#ffffff">
				<view class="more"><l-icon name="icon-park-solid:more-app" size="24px" color="#666"></l-icon></view>				
				<view class="item-title"><text>本年支出</text></view>
				<view class="item-con"><text>￥{{currentYearExpenses.total}}</text></view>
			</view> -->
    </view>

    <view class="chart-view">
      <view class="chart-area">
        <view class="chart-title"><text>年度统计（{{new Date().getFullYear()}}）</text></view>
        <view class="chart">
          <qiun-data-charts type="mix" :opts="mixConfig.opts" :chartData="currentYearGroup.data" />
        </view>
        <!-- <view class="control">
					<view class="btn">月</view>
					<view class="btn">年</view>
				</view> -->
      </view>
    </view>
  </view>
</template>

<script>
import { FMService } from "../../../services/FMService";
import lIcon from '../../../uni_modules/lime-icon/components/l-icon/l-icon.vue';
export default {
  components: { lIcon },
  setup() {
    let monthFirst = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    ).getTime();
    let monthLast =
      new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        1
      ).getTime() - 1;
    let yearFirst = new Date(new Date().getFullYear(), 0, 1).getTime();
    let yearLast = new Date(new Date().getFullYear(), 12, 1).getTime() - 1;
    return {
      monthFirst,
      monthLast,
      yearFirst,
      yearLast,
    };
  },
  data() {
    return {
      mixConfig:{
		opts:{
			 color: ["#FAC858","#1890FF","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
        padding: [15,15,0,15],
        enableScroll: false,
        legend: {},
        dataLabel:false,
        animation:false,
        update:true,
        duration:0,
        xAxis: {
          disableGrid: true,
          title: "月"
        },
        yAxis: {
          disabled: false,
          disableGrid: false,
          splitNumber: 5,
          gridType: "dash",
          dashLength: 4,
          gridColor: "#CCCCCC",
          padding: 10,
          showTitle: false,
          data: [
          ]
        },
        extra: {
          mix: {
            column: {
              width: 20
            }
          }
        }


	  }},
      //当月收入 饼图
      currentMonthIncome: {
        series: [
          {
            data: [],
          },
        ],
      },
      //当月支出 饼图
      currentMonthExpenses: {
        series: [
          {
            data: [],
          },
        ],
      },
      //当年收入 柱状图
      currentYearIncome: {
        total: 0,
        data: {
          categories: [],
          series: [
            {
              name: "总计",
              data: [],
            },
          ],
        },
      },
      //当年支出 柱状图
      currentYearExpenses: {
        total: 0,
        data: {
          categories: [],
          series: [
            {
              name: "总计",
              data: [],
            },
          ],
        },
      },
	   //当年收入与支出线图
      currentYearGroup:{}
    }
  },
   created() {
    console.warn("create>>>>>>")
     this.refrushData();
  },

  computed: {
    hotel_id() {
      return this.$store.state.hotel_id;
    },
    partialRefreshComName() {
      return this.$store.state.partialRefreshComName;
    },
    //当月总计
    currentMonthIncomeAmount() {
      let count = 0;
      this.currentMonthIncome.series[0].data.map((item) => {
        count += item.value;
      });
      return count;
    },
    currentMonthExpensesAmount() {
      let count = 0;
      this.currentMonthExpenses.series[0].data.map((item) => {
        count += item.value;
      });
      return count;
    },
	chartItemList(){
		return [
			{title:"本月收入",value:this.currentMonthIncomeAmount,href:"/pages/financialManagement/income/income",class:"chart-item",backgroundColor:"#0c37aa",iconColor:"#fff"},
			{title:"本月支出",value:this.currentMonthExpensesAmount,href:"/pages/financialManagement/expenses/expenses",class:"chart-item",backgroundColor:"#3698fc",iconColor:"#fff"},
			{title:"本年收入",value:this.currentYearIncome.total,href:"/pages/financialManagement/income/income",class:"chart-item",backgroundColor:"#3698fc",iconColor:"#fff"},
			{title:"本年支出",value:this.currentYearExpenses.total,href:"/pages/financialManagement/expenses/expenses",class:"chart-item item-white",backgroundColor:"#fff",iconColor:"#666"}
		]
	}
  },
  watch: {
    async partialRefreshComName(val) {
      //下拉刷新
      if (val == "fm") {
        console.log("局部刷新 gather");
        this.getIncomeMonth();
        this.getExpensesMonth();
        this.getIncomeCurrentYear();
        this.getExpensesCurrentYear();
        this.$store.commit("setPartialRefreshComName", "");
        console.log("局部刷新完成");
        uni.hideLoading();
        uni.stopPullDownRefresh();
      }
    },
    hotel_id() {
      //this.refrushData();

    },
  },
  methods: {
    async refrushData() {
      let task = [
        this.getIncomeMonth(),
        this.getExpensesMonth(),
        this.getIncomeCurrentYear(),
        this.getExpensesCurrentYear(),
      ];
      const res = await Promise.all(task);
      this.setCurrentYearGroup(res[2].simpleXLabel,res[2].xValue,res[3].xValue);
      console.log("res====",res);
    },
    addNewHotel() {
      uni.navigateTo({
        url: "/pages/hotelManage/createHotel/createHotel",
      });
    },
    getServerData() {

    },
    //获取收入 月
    async getIncomeMonth() {
      const data = await FMService.getIncomeCurrentMonth(
        this.$store.state.hotel_id
      );
      this.currentMonthIncome.series[0].data = data;
      console.log("当月统计", data);
      return data;
    },
    //获取支出月
    async getExpensesMonth() {
      const data = await FMService.getExpensesCurrentMonth(
        this.$store.state.hotel_id
      );
      this.currentMonthExpenses.series[0].data = data;
      console.log("当月统计支出", data);
      return data;
    },
    //获取收入 当年
    async getIncomeCurrentYear() {
      const res = await FMService.getIncomeCurrentYear(
        this.$store.state.hotel_id
      );
      console.log("当年收入", res);
      this.currentYearIncome = {
        total: res.total,
        data: {
          categories: res.xlable,
          series: [
            {
              name: "总计",

              data: res.xValue,
            },
          ],
        },
      };
      return res;
    },
    //获取支出 当年
    async getExpensesCurrentYear() {
      const res = await FMService.getExpensesCurrentYear(
        this.$store.state.hotel_id
      );
      console.log("当年支出", res);
      this.currentYearExpenses = {
        total: res.total,
        data: {
          categories: res.simpleXLabel,
          series: [
            {
              name: "总计",
              data: res.xValue,
            },
          ],
        },
      };
      return res;
    },
    setCurrentYearGroup(xlabel=[],incomeValueArr=[],expensesValurArr=[]){
      console.log("arguments::",arguments)
       let chartObj={
        total: 0,
        data: {
          categories: xlabel,
          series: [
            {
              name: "收入",
			        type:"line",
			        style: "curve",
              data: incomeValueArr
            },
            {
              name: "支出",
			        type:"column",
              data: expensesValurArr
            }
          ],
        },
      };
      this.currentYearGroup=JSON.parse(JSON.stringify(chartObj))
    }
  },
};
</script>

<style lang="scss" scoped>
.fmYearAndMonth {
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .chart-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
    padding: 15px;
    box-sizing: border-box;

    .chart-item {
      min-height: 150px;
      width: 160px;

      border-radius: 8px;
      box-sizing: border-box;
      padding: 15px;
      color: #fff;
      overflow: hidden;
      position: relative;

      .more {
        text-align: right;
        position: absolute;
        right: 10px;
        top: 10px;
      }

      .item-title {
        font-size: 15px;
        padding-top: 8px;
      }

      .item-con {
        font-size: 24px;
        font-weight: bold;
        padding: 15px 0;
        overflow: hidden;
        word-wrap: break-word;
        word-break: break-all;
      }
    }

    .item-white {
      .item-title {
        color: #666;
      }

      .item-con {
        color: #333;
      }
    }
  }

  .chart-view {
    padding: 20px 15px;
    display: flex;
    box-sizing: border-box;
    justify-content: center;

    .chart-area {
      flex: 1;
      border-radius: 8px;
      background-color: #fff;
      overflow: hidden;

      .chart-title {
        font-size: 18px;
        color: #2c405a;
        font-weight: 400;
        padding: 15px;
      }

      .chart {
        min-height: 240px;
      }

      .control {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 8px;
        padding: 10px;

        .btn {
          width: 40px;
          height: 30px;
          background: #0765ae;
          text-align: center;
          color: #fff;
          border-radius: 4px;
        }
      }
    }
  }
}
</style>
