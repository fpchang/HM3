<template>
	<view>
		<uni-forms ref="scenicSpotRef" :modelValue="menuTypeForm" :rules="scenicSpotRules" label-width="120px">
			<uni-forms-item label="分类名称" required name="name">
				<uni-easyinput v-model="menuTypeForm.name" placeholder="菜单分类，如 “特色菜”，“私房菜" />
			</uni-forms-item>
			<view class="tips-area" style="padding-bottom:12px">注意：”分类名称“ 为菜单分类名称，如【<text class="ct">
					“特色菜”，“私房菜”</text>】等，详细菜名请在创建好菜单分类后点击【<text class="ct">编辑模式</text>】后再点击【<text
					class="ct">添加</text>】操作</view>
			<uni-forms-item label="备注" name="mark">
				<uni-easyinput v-model="menuTypeForm.mark" type="textarea" />
			</uni-forms-item>
			<uni-forms-item>
						<view class="flex-end" >
					<view style="width:130px">
						<button type="primary"  @click="submitForm()":disabled="submitDisabled" :loading="submitLoading">保存</button>
					</view> 
					
				</view>

			
			</uni-forms-item>

		</uni-forms>
		
	</view>
</template>

<script>
	import  {MenuService} from "../../../services/MenuService.js"
	export default {
		name: "addMenuType",
		//inject:['getSS'],
		props: {
			type: 0,
			targetObj: {}
		},
		data() {
			return {
				submitLoading: false,
				scenicSpotList: [],
				menuTypeForm: this.type == 1 ? {
					"name": this.targetObj.name,
					"mark": this.targetObj.mark,
				} : {
					"name": ""
				},
				scenicSpotRules: {
					// 对name字段进行必填验证
					name: {
						rules: [{
								required: true,
								errorMessage: "请输入分类名称",
							}

						]
					}
				}
			}

		},
		computed: {
			hotel_id() {
				return this.$store.state.hotel_id;
			},
			hotelList() {
				return this.$store.state.hotelList;
			},
			roomType() {
				return this.$store.state.roomType;
			},
			submitDisabled() {
				return false
			}

		},

		watch: {},
		created() {
			// console.log("111111",this.targetObj)
		},
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
		methods: {
			submitForm() {
				this.$refs.scenicSpotRef.validate().then((res) => {
					console.log(this.menuTypeForm);
					//uni.showLoading();
					this.submitLoading = true;
					this.menuTypeForm.hotel_id = this.hotel_id;
					if (this.type == 1) {
						this.editMenuType();
						return;
					}
					this.addMenuType();
				});
			},
			addMenuType() {
				MenuService.addMenuType(this.menuTypeForm)
					.then(async (res) => {
						console.log("添加成功");
						this.$emit("closePopup");
						await this.$store.dispatch("getMenuList", this.hotel_id);
					})
					.catch((er) => {
						console.log("添加失败", er);
						this.submitLoading = false;
						uni.hideLoading();
						uni.showModal({
							content: "系统异常，请稍候再试！",
							confirmText: "确认",
						});
					});
			},
			editMenuType() {
				MenuService.editMenuType(this.targetObj._id._value, this.menuTypeForm)
					.then((res) => {
						console.log("修改成功");
						this.$store.dispatch("getMenuList", this.hotel_id);
						this.$emit("closePopup");
					})
					.catch((er) => {
						console.log("修改失败", er);
						this.submitLoading = false;
						uni.hideLoading();
						uni.showModal({
							content: "系统异常，请稍候再试！",
							confirmText: "确认",
						});
					});
			}
		}

	}
</script>

<style scoped></style>