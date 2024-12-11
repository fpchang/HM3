<template>
	<view>
		<uni-forms ref="hotelFormRef" :modelValue="hotelForm" :rules="hotelFormRules">

			<uni-forms-item label="酒店名" required name="hotelName">
				<uni-easyinput v-model="hotelForm.hotelName" placeholder="请输入酒店名称" :disabled="type==2" />
			</uni-forms-item>
			<uni-forms-item label="酒店地址" name="hotelAddress">
				<view style="display:flex;flex-direction: column;gap:5px">

					<view style="display:flex;align-items:center;justify-content:space-between">
						<view style="min-width:260px">
							<uni-easyinput v-model="hotelForm.hotelAddressArea" disabled v-if="type==2" />
							<uni-data-picker v-if="type!=2" :readonly="type==2" placeholder="请选择区域地址" self-field="code"
								v-model="hotelForm.hotelAddressCode" parent-field="parent_code"
								collection="opendb-city-china" orderby="value asc"
								field="code as value, name as text, eq(type, 2) as isleaf"
								@change="onchange"></uni-data-picker>
						</view>

					</view>

					<!-- <uni-data-picker placeholder="请选择地址" popup-title="请选择城市" v-model="hotelForm.hotelAddress" collection="opendb-city-china" field="code as value, name as text" orderby="value asc" :step-searh="true" self-field="code" parent-field="parent_code"
 @change="onchange" @nodeclick="onnodeclick"></uni-data-picker>
 {{  hotelForm.hotelAddress}} -->
					<view>

						<uni-easyinput type="textarea" v-model="hotelForm.hotelAddress" placeholder="请输入酒店详细地址"
							:disabled="type==2" />
					</view>

				</view>


			</uni-forms-item>
			<uni-forms-item label="特点">
				<view style="display:flex;align-items:flex-end;justify-content:start;gap:10px;flex-wrap:wrap">
					<view v-for="(item,index) in hotelForm.feature">
						<uv-tags :text="item" type="warning" :closable="type!=2" :show="close2"
							@close="deleteFeature(index)"></uv-tags>
					</view>
					<view :class="['tag-xt',type==2?'tag-xt-disable':'']" @click="addFeature"><uni-icons type="plus"
							size="22px" :color="type==2?'#eee':'#a1a1a1'"></uni-icons><text>添加</text></view>
				</view>
				<view><text style="color:#a1a1a1">如：免费停车，宠物免费，户外泳池，草地烧烤等</text></view>

			</uni-forms-item>
			<uni-forms-item label="餐饮" required>
				<checkbox-group @change="cateringCheckboxChange">
					<unicloud-db v-slot:default="{data, loading, error, options}" collection="hm-facilityConfig"
						field="name" :getone="false" where="type=='catering'">

						<view :class="[this.type==2?'disabled-style':'','flex-center']"
							style="justify-content:start;flex-wrap:wrap; gap:8px">
							<view style="" v-for="(item,index) in data" :key="item.name">
								<checkbox
									:checked="hotelForm.cateringServices&&hotelForm.cateringServices.includes(item._id)"
									:disabled="type==2" :value="item._id" />{{ item.name }}
							</view>
							<view style="height:0;width:50px" v-for="item in 5">
							</view>
						</view>
					</unicloud-db>
				</checkbox-group>

			</uni-forms-item>
			<uni-forms-item label="休闲设施" required>
				<checkbox-group @change="recreationCheckboxChange">
					<unicloud-db v-slot:default="{data, loading, error, options}" collection="hm-facilityConfig"
						field="name" :getone="false" where="type=='recreation'">

						<view :class="[this.type==2?'disabled-style':'','flex-center']"
							style="justify-content:start;flex-wrap:wrap; gap:8px">
							<view style="" v-for="(item,index) in data" :key="item.name">
								<checkbox
									:checked="hotelForm.recreationFacility&&hotelForm.recreationFacility.includes(item._id)"
									:disabled="type==2" :value="item._id" />{{ item.name }}
							</view>
							<view style="height:0;width:50px" v-for="item in 5">
							</view>
						</view>
					</unicloud-db>
				</checkbox-group>
			</uni-forms-item>
			<uni-forms-item label="运动设施" required>
				<checkbox-group @change="athleticFacilityCheckboxChange">
					<unicloud-db v-slot:default="{data, loading, error, options}" collection="hm-facilityConfig"
						field="name" :getone="false" where="type=='athleticFacility'">

						<view :class="[this.type==2?'disabled-style':'','flex-center']"
							style="justify-content:start;flex-wrap:wrap; gap:8px">
							<view style="" v-for="(item,index) in data" :key="item.name">
								<checkbox
									:checked="hotelForm.athleticFacility&&hotelForm.athleticFacility.includes(item._id)"
									:disabled="type==2" :value="item._id" />{{ item.name }}
							</view>
							<view style="height:0;width:50px" v-for="item in 5">
							</view>
						</view>
					</unicloud-db>
				</checkbox-group>
			</uni-forms-item>
			<uni-forms-item label="客服电话">
				<uni-easyinput v-model="hotelForm.serviceTel" placeholder="请输入客服电话" :disabled="type==2" />
			</uni-forms-item>
			<uni-forms-item label="微信">
				<uni-easyinput v-model="hotelForm.wechat" placeholder="请输入微信号" :disabled="type==2" />
			</uni-forms-item>
			<uni-forms-item label="备注">
				<uni-easyinput type="textarea" v-model="hotelForm.hotelIntroduction" placeholder="备注内容"
					:disabled="type==2"></uni-easyinput>
			</uni-forms-item>
			<view>
				<uni-forms-item label="封面图片" style="margin-bottom:0"></uni-forms-item>
				<xt-file-picker ref="uploadImagesRef1" :cloudPath="cloudPath" @success="uploadSuccessFirst"
					:imagesList="hotelForm.firstImages?[hotelForm.firstImages]:[]" max="1"
					:disabled="type==2"></xt-file-picker>
				<uni-forms-item label="酒店图片"></uni-forms-item>
				<xt-file-picker ref="uploadImagesRef2" :cloudPath="cloudPath" @success="uploadSuccess"
					:imagesList="hotelForm.imagesList" :disabled="type==2"></xt-file-picker>

			</view>

			<uni-forms-item>
				<uv-button v-if="type!=2" type="success" text="保存" color="#007aff" @click="submitForm()"
					:disabled="submitDisabled" :loading="submitLoading"></uv-button>
			</uni-forms-item>
		</uni-forms>
		<uni-popup ref="featureDialog" type="dialog">
			<uni-popup-dialog v-if="showPopup" ref="inputClose" before-close mode="input" title="添加特色" v-model="tabval"
				placeholder="请输入特色标签名" @close="closeFeaturePopup" @confirm="submitFeature"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	//import  {DB} from "../../../api/DB";
	import {
		HotelService
	} from "../../../services/HotelService";
	import uniIcons from '../../../uni_modules/uni-icons/components/uni-icons/uni-icons.vue';
	import amap from "../../../common/amap-wx.130";
	export default {
		components: {
			uniIcons
		},
		props: {
			type: 0,
			targetObj: {}
		},
		data() {
			return {
				submitLoading: false,
				showPopup: false,
				cloudPath: `/${this.$store.state.hotel_id}/hotel/`,
				tabval: "",
				hotelForm: this.type != 0 ? {
					belong: this.targetObj.belong,
					hotelName: this.targetObj.hotelName,
					hotelAddressCode: this.targetObj.hotelAddressCode,
					hotelAddress: this.targetObj.hotelAddress,
					hotelAddressArea: this.targetObj.hotelAddressArea,
					hotelCoordinate: this.targetObj.hotelCoordinate,
					hotelIntroduction: this.targetObj.hotelIntroduction,
					"firstImages": this.targetObj.firstImages || "",
					"imagesList": this.targetObj.imagesList || [],
					"cateringServices": this.targetObj.cateringServices,
					"recreationFacility": this.targetObj.recreationFacility,
					"athleticFacility": this.targetObj.athleticFacility,
					serviceTel: this.targetObj.serviceTel,
					wechat: this.targetObj.wechat,
					feature: this.targetObj.feature
				} : {
					belong: "",
					hotelName: "",
					hotelAddress: "",
					hotelAddressCode: "",
					hotelAddressArea: "",
					hotelCoordinate: [],
					hotelIntroduction: "",
					"firstImages": "",
					"imagesList": [],
					"cateringServices": [],
					"recreationFacility": [],
					"athleticFacility": [],
					serviceTel: "",
					wechat: "",
					feature: []
				},
				hotelFormRules: {
					// 对name字段进行必填验证
					hotelName: {
						rules: [{
								required: true,
								errorMessage: '请输入酒店名',
							},
							{
								validateFunction: (rule, value, data, callback) => {
									let obj = this.hotelList.find(item => {
										return item.hotelName == value
									});
									if (obj && this.type == 0) {
										callback('已存在酒店名')
									}
									return true;
								}
							}
						],
					},
					hotelAddress: {
						rules: [{
								required: true,
								errorMessage: '请输入酒店地址',
							},
							{
								validateFunction: (rule, value, data, callback) => {

									if (!this.hotelForm.hotelAddressArea) {
										callback('请选择区域')
									}
									return true;
								}
							}
						]
					}
				}


			};
		},
		created() {
			console.log("target", this.targetObj)
		},
		computed: {
			user() {
				return this.$store.state.user
			},
			hotelList() {
				return this.$store.state.hotelList;
			},
			submitDisabled() {
				return false
			}
		},
		methods: {
			onchange(e) {
				console.log("onchang", e)

				let list = e.detail.value;
				let adstr = "";
				list.map(item => {
					adstr += (item.text + "/")
				});
				this.hotelForm.hotelAddressArea = adstr
			},
			onnodeclick(e) {
				//console.log("onnodeclick",e)
			},
			closeFeaturePopup() {

				this.$refs.featureDialog.close();
				this.showPopup = false;
			},
			submitFeature(val) {
				console.log(val)
				if (!val) {
					return;
				}
				let arr = this.hotelForm.feature || [];
				arr.push(val);
				this.hotelForm.feature = arr;
				this.tabval = "";
				this.closeFeaturePopup();
			},
			addFeature() {
				if (this.type == 2) {
					return;
				}
				this.showPopup = true;
				this.$refs.featureDialog.open()
			},
			deleteFeature(index) {
				if (this.type == 2) {
					return;
				}
				this.hotelForm.feature.splice(index, 1);
			},
			cateringCheckboxChange(e) {
				this.hotelForm.cateringServices = e.detail.value;
			},
			recreationCheckboxChange(e) {
				this.hotelForm.recreationFacility = e.detail.value;
			},
			athleticFacilityCheckboxChange(e) {
				this.hotelForm.athleticFacility = e.detail.value;
			},
			uploadSuccessFirst(list) {
				this.hotelForm.firstImages = list[0];
			},
			uploadSuccess(list) {
				console.log("list");
				this.hotelForm.imagesList = list;
			},
			async submitForm() {
				console.log(this.hotelForm);
				if (this.$refs.uploadImagesRef1.uploadingState() == 0 || this.$refs.uploadImagesRef2
				.uploadingState() ==
					0) {
					uni.showToast({
						title: "有图片正在上传中，请稍候...",
						icon: "error"
					});
					return;
				}
				if (this.$refs.uploadImagesRef1.uploadingState() == 2 || this.$refs.uploadImagesRef2
				.uploadingState() ==
					2) {
					uni.showToast({
						title: "有图片上传失败，请重新上传或取消",
						icon: "error"
					});
					return;
				}

				this.$refs.hotelFormRef.validate().then(async res => {
					//uni.showLoading();
					this.submitLoading = true;
					let addressStr = this.hotelForm.hotelAddressArea + this.hotelForm.hotelAddress
					const location = await this.searchAddress(addressStr);
					console.log("获取的坐标", location);
					this.hotelForm.hotelCoordinate = location;
					if (this.type == 1) {
						this.updateHotel();
						return;
					}
					this.addHotel();


				});


			},
			addHotel() {
				this.hotelForm.belong = this.user.phone;
				HotelService.createHotel(this.hotelForm).then(async res => {
					console.log("添加成功");
					uni.hideLoading();
					this.submitLoading = false;
					// uni.reLaunch({
					// 	url:"/pages/index/index"
					// })
					await this.$store.dispatch("getHotelList");
					this.$emit('closePopup');
				}).catch(er => {
					console.log("添加失败", er);
					uni.hideLoading();
					uni.showToast({
						title: '数据异常，请稍候再试',
						icon: 'error'
					})
					this.submitLoading = false;
				})
			},
			async updateHotel() {
				console.log(this.targetObj)
				try {
					await HotelService.updateHotel(this.targetObj._id, this.hotelForm);
					await this.$store.dispatch("getHotelList");
					this.$emit('closePopup');
				} catch (error) {
					console.error(error);
					uni.hideLoading();
					uni.showToast({
						title: '更新失败，请稍候再试',
						icon: 'error'
					})
					this.submitLoading = false;
				}

			},
			searchAddress(keywords) {
				return new Promise((relolve, reject) => {
					try {
						let amapPlugin = new amap.AMapWX({
							key: this.$store.state.config.miniProgramKey,
						});
						//let that = this;
						//let location = this.$store.state.location;
						console.log("location", location)
						amapPlugin.getInputtips({
							keywords: keywords,
							//location: location.toString(","),
							success: function(data) {
								console.log("sssss", data)
								if (data.tips.length < 1) {
									uni.showToast({
										title: '无法定位该地址',
										icon: 'none'
									})
									return;
								}
								let location = data.tips[0].location;
								let loc = location.split(",").map(Number);
								relolve(loc);

							},
							fail: function(e) {
								reject(e)
							}

						})
					} catch (error) {
						reject("未能获取地址坐标")
					}

				})

			}
		},
	};
</script>

<style lang="scss" scoped>
	.uni-list-cell {
		justify-content: flex-start
	}

	.disabled-style {
		color: #a1a1a1;
	}

	.tag-xt {
		display: flex;
		align-items: flex-end;
		padding: 2px 8px;
		border: 1px solid #a1a1a1;
		border-radius: 6px;
		gap: 4px;
		color: #a1a1a1
	}

	.tag-xt-disable {
		color: #eee;
		border: 1px solid #eee;
		color: #eee;
	}
</style>