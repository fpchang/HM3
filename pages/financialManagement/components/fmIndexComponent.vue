<template>
  <view>
    <view class="order-component">
      <!-- <view class="add-content-style">
        <view class="left-panal">
          <uni-data-checkbox
            v-model="tabRadioVal"
            :localdata="tabitems"
          ></uni-data-checkbox>
        </view>
        <view class="control-panal">
          <uv-icon
            name="plus-circle-fill"
            color="#000"
            size="22"
            label="创建单据"
            labelPos="bottom"
            labelSize="12px"
            @click="createIOE"
          ></uv-icon>
        </view>
      </view> -->
    </view>

    <view> 
      <xt-panal-list :count="5">
        <template v-slot:["card0"]>
          <view class="menu-list">
            <navigator url="/pages/financialManagement/income/income" hover-class="navigator-hover">
            <uv-icon
            name="https://env-00jxhfhjd231.normal.cloudstatic.cn/HM/images/miniprogram/shouru.png"
            color="#000"
            size="30"
            label="收入"
            labelPos="bottom"
            labelSize="14px"
            space="12px"
            @click="createIOE"
          ></uv-icon>
        </navigator> 
          <navigator url="/pages/financialManagement/expenses/expenses" hover-class="navigator-hover">
            
          
          <uv-icon
          name="https://env-00jxhfhjd231.normal.cloudstatic.cn/HM/images/miniprogram/zhichu.png"
          color="#000"
          size="30"
          label="支出"
          labelPos="bottom"
          labelSize="14px"
          space="12px"
          @click="createIOE"
        ></uv-icon>
      </navigator>
          </view>
        </template>
        <template v-slot:["card1"]>
          <view><text>当月收入</text></view>
          <view class="charts-box">
            <qiun-data-charts 
              type="pie"
              :opts="currentMonthIncome.opts"
              :chartData="currentMonthIncome.data"
            />
          </view>
        </template>
        <template v-slot:["card2"]>
          <view><text>当月支出</text></view>
          <view class="charts-box">
            <qiun-data-charts 
              type="pie"
              :opts="currentMonthIncome.opts"
              :chartData="currentMonthIncome.data"
            />
          </view>
        </template>
        <template v-slot:["card3"]>
          <view><text>当年收入</text></view>
          <view> 
            <qiun-data-charts 
            type="bar"
            :opts="currentYearIncome.opts"
            :chartData="currentYearIncome.data"
          />
          </view>
         
        </template>
        <template v-slot:["card4"]>
          <view><text>当年支出</text></view>
          <view> 
            <qiun-data-charts 
            type="bar"
            :opts="currentYearExpenses.opts"
            :chartData="currentYearExpenses.data"
          />
          </view>
        </template>
      </xt-panal-list>
    </view>
  </view>
</template>

<script>
export default {
  setup(){
    let monthFirst =new Date(new Date().getFullYear(),new Date().getMonth(),1).getTime();
		let monthLast =new Date(new Date().getFullYear(),new Date().getMonth()+1,1).getTime()-1;
		let yearFirst = 	new Date().getFullYear()
  },
  data(){
    return {
      //当月收入 饼图
      currentMonthIncome:{
        data:{
            series: [
              {
                data: [{"name":"一班","value":50},{"name":"二班","value":30},{"name":"三班","value":20},{"name":"四班","value":18},{"name":"五班","value":8}]
              }
            ]
          },
        opts: {
        color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
        padding: [5,5,5,5],
        enableScroll: false,
        extra: {
          pie: {
            activeOpacity: 0.5,
            activeRadius: 10,
            offsetAngle: 0,
            labelWidth: 15,
            border: false,
            borderWidth: 3,
            borderColor: "#FFFFFF"
          }
        }
      }
      },
      //当月支出 饼图
      currentMonthExpenses:{
        data:{},
        opts: {
        color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
        padding: [5,5,5,5],
        enableScroll: false,
        extra: {
          pie: {
            activeOpacity: 0.5,
            activeRadius: 10,
            offsetAngle: 0,
            labelWidth: 15,
            border: false,
            borderWidth: 3,
            borderColor: "#FFFFFF"
          }
        }
      }
      },
      //当年收入 柱状图
      currentYearIncome:{
        data: {
            categories: ["2018","2019","2020","2021","2022","2023"],
            series: [
              {
                name: "目标值",
                data: [35,36,31,33,13,34]
              }
            ]
          },
          opts: {
        color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
        padding: [15,30,0,5],
        enableScroll: false,
        legend: {},
        xAxis: {
          boundaryGap: "justify",
          disableGrid: false,
          min: 0,
          axisLine: false,
          max: 70
        },
        yAxis: {},
        extra: {
          bar: {
            type: "stack",
            width: 30,
            meterBorde: 1,
            meterFillColor: "#FFFFFF",
            activeBgColor: "#000000",
            activeBgOpacity: 0.08,
            categoryGap: 2
          }
        }
      }
    },
    //当年支出 柱状图
    currentYearExpenses:{
      data: {
            categories: ["2018","2019","2020","2021","2022","2023"],
            series: [
              {
                name: "目标值",
                data: [35,36,31,33,13,34]
              }
            ]
          },
          opts: {
        color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
        padding: [15,30,0,5],
        enableScroll: false,
        legend: {},
        xAxis: {
          boundaryGap: "justify",
          disableGrid: false,
          min: 0,
          axisLine: false,
          max: 70
        },
        yAxis: {},
        extra: {
          bar: {
            type: "stack",
            width: 30,
            meterBorde: 1,
            meterFillColor: "#FFFFFF",
            activeBgColor: "#000000",
            activeBgOpacity: 0.08,
            categoryGap: 2
          }
        }
      }
      
    }
  }
  },
  created(){
    this.getServerData();
  },
  methods:{
    getServerData() {
      //模拟从服务器获取数据时的延时
      setTimeout(() => {
        //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
        let res = {
            series: [
              {
                data: [{"name":"一班","value":50},{"name":"二班","value":30},{"name":"三班","value":20},{"name":"四班","value":18},{"name":"五班","value":8}]
              }
            ]
          };
        this.chartData = JSON.parse(JSON.stringify(res));
      }, 500);
    }
  }
};
</script>

<style lang="scss" scoped>
.menu-list{
  padding:15px;
  display: flex;
  align-items: center;
 
  gap:20px;
}
</style>
