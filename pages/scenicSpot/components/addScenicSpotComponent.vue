<template>
  <view>
    <uni-forms ref="scenicSpotRef" :modelValue="scenicSpotForm" :rules="scenicSpotRules" label-width="120px">
      <uni-forms-item label="景点名称" required name="scenicSport_name">
        <uni-easyinput v-model="scenicSpotForm.scenicSport_name" placeholder="景点名称" />
      </uni-forms-item>
      <!-- <uni-forms-item label="景点地址" name="scenicSport_address">
        <uni-easyinput v-model="scenicSpotForm.scenicSport_address" placeholder="景点地址" />
      </uni-forms-item> -->
			<uni-forms-item label="景点地址" name="scenicSport_addressArea">
				<view style="display:flex;flex-direction: column;gap:5px">

					<view style="display:flex;align-items:center;justify-content:space-between">
						<view style="min-width:260px">
							<uni-easyinput v-model="scenicSpotForm.scenicSport_addressArea" disabled v-if="type==2" />
							<uni-data-picker v-if="type!=2" :readonly="type==2" placeholder="请选择区域地址" self-field="code"
								v-model="scenicSpotForm.scenicSport_addressCode" parent-field="parent_code"
								collection="opendb-city-china" orderby="value asc"
								field="code as value, name as text, eq(type, 2) as isleaf"
								@change="onchange"></uni-data-picker>
						</view>
					</view>
					<view>

						<uni-easyinput type="textarea" v-model="scenicSpotForm.scenicSport_address" placeholder="请输入景点详细地址"
							:disabled="type==2" />
					</view>

				</view>


			</uni-forms-item>
      <uni-forms-item label="景点联系人" name="scenicSport_user">
        <uni-easyinput v-model="scenicSpotForm.scenicSport_user" placeholder="景点联系人" />
      </uni-forms-item>
      <uni-forms-item label="景点联系电话" name="scenicSport_phone">
        <uni-easyinput  maxlength="11" type="number" v-model="scenicSpotForm.scenicSport_phone" placeholder="景点联系电话" />
      </uni-forms-item>
      <uni-forms-item label="备注" name="scenicSport_mark">
        <uni-easyinput v-model="scenicSpotForm.scenicSport_mark" type="textarea"  />
      </uni-forms-item>
      <uni-forms-item>
        <uv-button type="success" text="保存" color="#007aff" @click="submitForm()" :disabled="submitDisabled"
        :loading="submitLoading"></uv-button>
      </uni-forms-item>

    </uni-forms>
   
  </view>
</template>

<script>
import  {DB} from "../../../api/DB.js";
import amap from "../../../common/amap-wx.130";
export default{
  name: "addScenicSport",
  //inject:['getSS'],
  props: {
    type:0,
    targetObj:{}
  },
  data() {
    return {
      submitLoading: false,
      scenicSpotList:[],
      scenicSpotForm:this.type==1?{
        "scenicSport_name": this.targetObj.scenicSport_name,
        "scenicSport_address": this.targetObj.scenicSport_address,
        "scenicSport_user":this.targetObj.scenicSport_user,
        "scenicSport_phone":this.targetObj.scenicSport_phone,
        "scenicSport_addressArea":this.targetObj.scenicSport_addressArea,
        "scenicSport_addressCode":this.targetObj.scenicSport_addressCode,
        "location":this.targetObj.location,
        "scenicSport_mark":this.targetObj.scenicSport_mark
      }:{
        "scenicSport_name": "",
        "scenicSport_address": "",
        "scenicSport_user":"",
        "scenicSport_phone":"",
        "scenicSport_addressArea":"",
        "location":[],
        "scenicSport_mark":""
      },
      scenicSpotRules:{
        // 对name字段进行必填验证
        scenicSport_name: {
          rules: [
            {
              required: true,
              errorMessage: "请输入景点名称",
            }
            
          ]
        }
      }
    }
   
  },
  computed: {
    hotel_id(){
				return this.$store.state.hotel_id;
			},
			hotelList(){
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
  created(){
   
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
    onchange(e) {
				console.log("onchang", e)

				let list = e.detail.value;
				let adstr = "";
				list.map(item => {
					adstr += (item.text + "/")
				});
				this.scenicSpotForm.scenicSport_addressArea = adstr
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

			},
     submitForm(){
      this.$refs.scenicSpotRef.validate().then(async (res) => {
        //uni.showLoading();
        this.submitLoading = true;
        this.scenicSpotForm.hotel_id = this.hotel_id;
        
        let addressStr = this.scenicSpotForm.scenicSport_addressArea + this.scenicSpotForm.scenicSport_address
					const location = await this.searchAddress(addressStr);
					console.log("获取的坐标", location);
					this.scenicSpotForm.location = location;
       
        if(this.type==1){
          this.editScenicSpot();
          return;
        }
       this.addScenicSpot();
      });
    },
    addScenicSpot(){
      DB.callFunction("hm_addScenicSpot", {
        scenicSpotObj: this.scenicSpotForm,
        })
          .then(async (res) => {
            console.log("添加成功");
            this.$emit("closePopup");
            await this.$store.dispatch("getScenicSpotList",this.hotel_id);
            this.submitLoading = false;
            uni.hideLoading();
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
    editScenicSpot(){
      DB.callFunction("hm_editScenicSpot", {
          _id:this.targetObj._id._value,
          scenicSpotObj: this.scenicSpotForm
        })
          .then(async (res) => {
            console.log("修改成功");
            await this.$store.dispatch("getScenicSpotList",this.hotel_id);
            this.submitLoading = false;
            uni.hideLoading();
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