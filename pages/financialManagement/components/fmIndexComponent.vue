<template>
	<view>
		<block v-if="!hotel_id">
			<noData text_content="您还没有酒店" :showControl="true" text_control_add="创建一个" @Event_one="addNewHotel"></noData>
		</block>
		<block v-if="hotel_id">


			<view>
				<xt-panal-list :count="5">
					<template v-slot:["card0"]>
						<view class="menu-list">
							<navigator url="/pages/financialManagement/income/income" hover-class="navigator-hover">
								<uv-icon
									name="https://env-00jxhfhjd231.normal.cloudstatic.cn/HM/images/miniprogram/shouru.png"
									color="#000" size="30" label="收入" labelPos="bottom" labelSize="14px"
									space="12px"></uv-icon>
							</navigator>
							<navigator url="/pages/financialManagement/expenses/expenses" hover-class="navigator-hover">


								<uv-icon
									name="https://env-00jxhfhjd231.normal.cloudstatic.cn/HM/images/miniprogram/zhichu.png"
									color="#000" size="30" label="支出" labelPos="bottom" labelSize="14px"
									space="12px"></uv-icon>
							</navigator>
						</view>
					</template>
					<template v-slot:["card1"]>

						<view class="label-area"><text>当月收入：</text><text
								class="am-color">{{currentMonthIncomeAmount}}</text>(元)</view>
						<view class="charts-box">
							<qiun-data-charts type="pie" :opts="pieConfig.opts" :chartData="currentMonthIncome" />
						</view>
					</template>
					<template v-slot:["card2"]>
						<view class="label-area"><text>当月支出：</text><text
								class="am-color">{{currentMonthExpensesAmount}}</text>(元)</view>
						<view class="charts-box">
							<qiun-data-charts type="pie" :opts="pieConfig.opts" :chartData="currentMonthExpenses" />
						</view>
					</template>
					<template v-slot:["card3"]>
						<view class="label-area"><text>当年收入<text
									class="am-color">{{currentYearIncome.total}}</text>(元)</text></view>
						<view style="height:400px">
							<qiun-data-charts type="bar" :opts="barCofig.opts" :chartData="currentYearIncome.data" />
						</view>

					</template>
					<template v-slot:["card4"]>
						<view class="label-area"><text>当年支出<text
									class="am-color">{{currentYearExpenses.total}}</text>(元)</text></view>
						<view style="height:400px">
							<qiun-data-charts type="bar" :opts="barCofig.opts" :chartData="currentYearExpenses.data" />
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
	} from "../../../services/FMService";
	export default {
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
				//饼图配置
				pieConfig: {
					opts: {
						color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4",
							"#ea7ccc"
						],
						padding: [5, 5, 5, 5],
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
				barCofig: {
					opts: {
						color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4",
							"#ea7ccc"
						],
						padding: [15, 30, 0, 5],
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
				//当月收入 饼图
				currentMonthIncome: {
					series: [{
						data: []
					}]

				},
				//当月支出 饼图
				currentMonthExpenses: {
					series: [{
						data: []
					}]

				},
				//当年收入 柱状图
				currentYearIncome: {
					total: 0,
					data: {
						categories: [],
						series: [{
							name: "总计",
							data: []
						}]
					}

				},
				//当年支出 柱状图
				currentYearExpenses: {
					total: 0,
					data: {
						categories: [],
						series: [{
							name: "总计",
							data: []
						}]
					}

				}
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
			},
			partialRefreshComName() {
				return this.$store.state.partialRefreshComName;
			},
			//当月总计
			currentMonthIncomeAmount() {
				let count = 0;
				this.currentMonthIncome.series[0].data.map(item => {
					count += item.value;
				})
				return count;
			},
			currentMonthExpensesAmount() {
				let count = 0;
				this.currentMonthExpenses.series[0].data.map(item => {
					count += item.value;
				})
				return count;
			}
		},
		watch: {
			async partialRefreshComName(val) {
				//下拉刷新
				if (val == 'fm') {
					console.log("局部刷新 gather")
					this.getIncomeMonth();
					this.getExpensesMonth();
					this.getIncomeCurrentYear();
					this.getExpensesCurrentYear();
					this.$store.commit("setPartialRefreshComName", "");
					console.log("局部刷新完成")
					uni.hideLoading();
					uni.stopPullDownRefresh();
				}
			},
			hotel_id() {
				this.initData();
			}
		},
		methods: {
			addNewHotel(){
				uni.navigateTo({
				  url: "/pages/hotelManage/createHotel/createHotel",
				});
			},
			getServerData() {
				//模拟从服务器获取数据时的延时
				setTimeout(() => {
					//模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
					let res = {
						series: [{
							data: [{
								"name": "一班",
								"value": 50
							}, {
								"name": "二班",
								"value": 30
							}, {
								"name": "三班",
								"value": 20
							}, {
								"name": "四班",
								"value": 18
							}, {
								"name": "五班",
								"value": 8
							}]
						}]
					};
					this.chartData = JSON.parse(JSON.stringify(res));
				}, 500);
			},
			//获取收入 月
			async getIncomeMonth() {
				const data = await FMService.getIncomeCurrentMonth(this.$store.state.hotel_id);
				this.currentMonthIncome.series[0].data = data;
				console.log("当月统计", data)
			},
			//获取支出月
			async getExpensesMonth() {
				const data = await FMService.getExpensesCurrentMonth(this.$store.state.hotel_id);
				this.currentMonthExpenses.series[0].data = data;
				console.log("当月统计支出", data)
			},
			//获取收入 当年
			async getIncomeCurrentYear() {
				const res = await FMService.getIncomeCurrentYear(this.$store.state.hotel_id)
				console.log("当年收入", res)
				this.currentYearIncome = {
					total: res.total,
					data: {
						categories: res.xlable,
						series: [{
							name: "总计",
							data: res.xValue
						}]
					}

				}
				return res;
			},
			//获取支出 当年
			async getExpensesCurrentYear() {
				const res = await FMService.getExpensesCurrentYear(this.$store.state.hotel_id)
				console.log("当年支出", res)
				this.currentYearExpenses = {
					total: res.total,
					data: {
						categories: res.xlable,
						series: [{
							name: "总计",
							data: res.xValue
						}]
					}

				}
				return res;
			},

		}
	};
</script>

<style lang="scss" scoped>
	.menu-list {
		padding: 15px;
		display: flex;
		align-items: center;

		gap: 20px;
	}

	.label-area {
		box-sizing: border-box;
		padding: 10px;
		color: #646464;
		font-size: 13px;

		.am-color {
			color: $theam-main-color;
			padding: 0 4px;
		}
	}
</style>