<template>
	<view>
		<view class="tabbar-container" :style="{'width':width}">
			<view class="tab-label-area">
				<view v-for="item of dataList" class="tab-item">
					<view class="tab-item-group" @click="clickTab(item.id)">
						<image class="img"
							:src="`${item.id==active_id?item.activeIcon:item.icon}`" />
						<text style="padding:0 5px" :class="[item.id==active_id?'active_text':'']">{{item.label}}</text>

					</view>

				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import UniIcons from '../../uni_modules/uni-icons/components/uni-icons/uni-icons.vue';
	export default {
		components: {
			UniIcons
		},
		name: "xt-tabbar",
		props: {
			activeId: {
				type: String,
				default: "b1"
			},
			dataList: {
				type: Array,
				default: []
			},
			width:{
				type:String,
				default:"100vw"
			}
		},
		data() {
			return {
				showPopup: false,
				active_id: this.activeId || ""
			}
		},
		computed: {},
		methods: {
			clickTab(id) {
				this.active_id = id;
				this.$emit("clickTab", id);
			}
		},
		watch: {},

		// 组件周期函数--监听组件挂载完毕
		mounted() {},
		// 组件周期函数--监听组件数据更新之前
		beforeUpdate() {},
		// 组件周期函数--监听组件数据更新之后
		updated() {},
		// 组件周期函数--监听组件激活(显示)
		activated() {},
		// 组件周期函数--监听组件停用(隐藏)
		deactivated() {},
		// 组件周期函数--监听组件销毁之前
		beforeDestroy() {},
	}
</script>

<style scoped lang="scss">
	.tabbar-container {
		margin:auto;
		position: relative;
		max-width: 100vw;

		.tab-label-area {
			display: flex;
			align-items: center;
			justify-content: space-around;

			.tab-item {
				height: 70px;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #a1a1a1;
				cursor: pointer;

				.active_text {
					color: #06c;
				}

				.tab-item-group {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;

					.img {
						width: 25px;
						height: 25px;
					}
				}
			}
		}


	}
</style>