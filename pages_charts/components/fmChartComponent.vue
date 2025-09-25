<template>
	<view class="fmChartComponent">
		<!-- <block v-if="!hotel_id">
			<noData text_content="您还没有酒店" :showControl="true" text_control_add="创建一个" @Event_one="addNewHotel"></noData>
		</block> -->
		<block v-if="hotel_id">
			<view>
				<xt-panal-list :count="5" bgColor="#0765aec7">
					<template v-slot:["card0"]>
						<view class="container-chart">
							<view class="label-area" v-if="false"><text>当月收入：</text><text
									class="am-color">{{currentMonthIncomeAmount}}</text>(元)</view>
							<view class="charts-box chart-area">
								<!-- <qiun-data-charts type="pie" :opts="pieConfig.opts"
									:chartData="currentMonthIncomeOption" /> -->
								<echartComponent ref="currentMonthIncomeOptionRef" width="100%"/>
							</view>
						</view>

					</template>
					<template v-slot:["card1"]>
						<view class="container-chart">
							<view class="label-area" v-if="false"><text>当月支出：</text><text
									class="am-color">{{currentMonthExpensesAmount}}</text>(元)</view>
							<view class="charts-box chart-area">
								<!-- <qiun-data-charts type="pie" :opts="pieConfig.opts" :chartData="currentMonthExpenses" />
							 -->
								<echartComponent ref="currentMonthExpensesRef" width="100%"/>
							</view>
						</view>

					</template>
					<template v-slot:["card2"]>
						<view class="container-chart">
							<view class="label-area" v-if="false"><text>当年收入<text
										class="am-color">{{currentYearIncomeOption.total}}</text>(元)</text></view>
							<view class="chart-area">
								<!-- <qiun-data-charts type="bar" :opts="barCofig.opts"
									:chartData="currentYearIncomeOption.data" /> -->
								<echartComponent ref="currentYearIncomeRef" width="100%" />
							</view>
						</view>


					</template>
					<template v-slot:["card3"]>
						<view class="container-chart">
							<view class="label-area" v-if="false"><text>当年支出<text
										class="am-color">{{currentYearExpensesOption.total}}</text>(元)</text></view>
							<view class="chart-area">
								<!-- <qiun-data-charts type="bar" :opts="barCofig.opts"
									:chartData="currentYearExpensesOption.data" /> -->
								<echartComponent ref="currentYearExpensesRef" width="100%"/>


							</view>
						</view>

					</template>
				</xt-panal-list>
			</view>
		</block>
	</view>
</template>

<script>
	import {
		FMService
	} from "../../services/FMService";
	import echartComponent from "./echartComponent";
	export default {
		components:{
			echartComponent
		},
		setup() {
			let monthFirst = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
			let monthLast = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).getTime() - 1;
			let yearFirst = new Date(new Date().getFullYear(), 0, 1).getTime();
			let yearLast = new Date(new Date().getFullYear(), 12, 1).getTime() - 1;
			return {
				monthFirst,
				monthLast,
				yearFirst,
				yearLast
			}
		},
		data() {
			return {


				//当月收入 饼图
				currentMonthIncomeOption: null,
				//当月支出 饼图
				currentMonthExpensesOption: null,
				//当年收入 柱状图
				currentYearIncomeOption: null,
				//当年支出 柱状图
				currentYearExpensesOption: null
			}
		},
		created() {
			//this.getServerData();
			this.getIncomeMonth();
			this.getExpensesMonth();
			this.getIncomeCurrentYear();
			this.getExpensesCurrentYear();

		},
		computed: {
			hotel_id() {
				return this.$store.state.hotel_id;
			}
		},
		watch: {

			hotel_id() {
				//this.initData();
				this.getIncomeMonth();
				this.getExpensesMonth();
				this.getIncomeCurrentYear();
				this.getExpensesCurrentYear();
			}
		},
		methods: {
			initEchart() {
				//this.$refs.currentYearIncomeRef.init(this.currentYearIncomeOption.option);
			},
			refrushData() {
				let task = [this.getIncomeMonth(),
					this.getExpensesMonth(),
					this.getIncomeCurrentYear(),
					this.getExpensesCurrentYear()
				]
				return Promise.all(task)
			},
			addNewHotel() {
				uni.navigateTo({
					url: "/pages/hotelManage/createHotel/createHotel",
				});
			},

			//获取收入 月
			async getIncomeMonth() {
				const data = await FMService.getIncomeCurrentMonth(this.$store.state.hotel_id);
				this.currentMonthIncomeOption = this.setPieIncome(data);
				this.$refs.currentMonthIncomeOptionRef.init(this.currentMonthIncomeOption);
				return data;
			},
			//获取支出月
			async getExpensesMonth() {
				const data = await FMService.getExpensesCurrentMonth(this.$store.state.hotel_id);
				this.currentMonthExpensesOption = this.setPieExpense(data);
				this.$refs.currentMonthExpensesRef.init(this.currentMonthExpensesOption);
				return data;
			},
			//获取收入 当年
			async getIncomeCurrentYear() {
				const res = await FMService.getIncomeCurrentYear(this.$store.state.hotel_id)
				//console.log("当年收入", res)

				const xAxis = {
					type: 'category',
					data: res.xlable,

				};
				const series = [{
					name: new Date().Format("yyyy"),
					type: 'bar',
					data: res.xValue
				}];
				const yAxis={
					axisLabel: {
						formatter: function (value) {
						return `${(value/1000)}w`;
						}
					}
				};
				this.currentYearIncomeOption = this.setColumnIncomeCurrentYear(res.total, series, xAxis,yAxis);
				this.$refs.currentYearIncomeRef.init(this.currentYearIncomeOption);
				return res;
			},
			//获取支出 当年
			async getExpensesCurrentYear() {
				const res = await FMService.getExpensesCurrentYear(this.$store.state.hotel_id)
				const xAxis = {
					type: 'category',
					data: res.xlable,

				};
				const series = [{
					name: new Date().Format("yyyy"),
					type: 'bar',
					data: res.xValue
				}];
					const yAxis={
					axisLabel: {
						formatter: function (value) {
						return `${(value/1000)}w`;
						}
					}
				}
				this.currentYearExpensesOption = this.setColumnExpenseCurrentYear(res.total, series, xAxis,yAxis);
				this.$refs.currentYearExpensesRef.init(this.currentYearExpensesOption);
				return res;

				return res;
			},

			setPieIncome(seriesData) {
				let count = 0;
				seriesData.map(item => {
					count += item.value;
				});

				let option = {


					title: {
						text: `当月收入`,
						subtext: `￥${count}`,
							textStyle:{
							color:'#666'
						},
						subtextStyle: {
							fontStyle: 'fontWeight',
							color: '#007aff',
							lineHeight: 26,
						}
						
					},
					grid:{top:100},
					tooltip: {
						trigger: 'item'
					},
					legend: {
						orient: 'vertical',
						left: 'left',
						bottom: 0
					},
					series: [{
						name: '当月收入',
						type: 'pie',
						radius: '50%',
						data: seriesData,
						label: {
							show: true,
							positon: 'outside',
							formatter: '{b}: {c}'

						},
						emphasis: {
							itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						}
					}]


				}
				return option;
			},
			setPieExpense(seriesData) {
				let count = 0;
				seriesData.map(item => {
					count += item.value;
				});
				let option = {


					title: {
						text: `当月支出`,
						subtext: `￥${count}`,
						textStyle:{
							color:'#666'
						},
						subtextStyle: {
							fontStyle: 'fontWeight',
							color: '#007aff',
							lineHeight: 26,
						}
					},
					grid:{top:100},
					tooltip: {
						trigger: 'item'
					},
					legend: {
						orient: 'vertical',
						left: 'left',
						bottom: 0
					},
					series: [{
						name: '当月支出',
						type: 'pie',
						radius: '50%',
						data: seriesData,
						label: {
							show: true,
							positon: 'outside',
							formatter: '{b}: {c}'

						},
						emphasis: {
							itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						}
					}]


				}
				return option;
			},
			setColumnIncomeCurrentYear(count, series = [], xAxis = {}, yAxis = {}) {

				let option = {

					title: {
						text: `当年收入`,
						subtext: `￥${count}`,
							textStyle:{
							color:'#666'
						},
						subtextStyle: {
							fontStyle: 'fontWeight',
							color: '#007aff',
							lineHeight: 26,
						}
					},
					grid: {
					x: 40, // 左侧边距
					y:100, // 上侧边距
					x2: 0, // 右侧边距
					y2: 60 // 下侧边距
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					legend: {
						bottom: 0
					},
					xAxis: xAxis,
					yAxis: yAxis,
					series: series


				}
				return option;
			},
			setColumnExpenseCurrentYear(count, series = [], xAxis = {}, yAxis = {}) {
				let option = {

					title: {
						text: `当年支出`,
						subtext: `￥${count}`,
							textStyle:{
							color:'#666'
						},
						subtextStyle: {
							fontStyle: 'fontWeight',
							color: '#007aff',
							lineHeight: 26,
						}
					},
					grid:{
						x: 40, // 左侧边距
											y:100, // 上侧边距
											x2: 0, // 右侧边距
											y2: 60 // 下侧边距
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					legend: {
						bottom: 0
					},
					xAxis: xAxis,
					yAxis: yAxis,
					series: series


				}
				return option;
			},

		}
	};
</script>

<style lang="scss">
	.fmChartComponent {
		height: 100%;
		min-height: 100vh;

	}

	.menu-list {
		padding: 15px;
		display: flex;
		align-items: center;

		gap: 20px;
	}

	.container-chart {

		.chart-area {
			
			width: 100%;
			background: #fff;
			padding: 20px;
			box-sizing: border-box;
		}

		.label-area {
			box-sizing: border-box;
			padding: 20px 15px;
			color: #fff;
			font-size: 20px;
			font-weight: 400;

			.am-color {
				color: #fff;
				padding: 0 4px;
				font-weight: bold;
			}
		}
	}
</style>