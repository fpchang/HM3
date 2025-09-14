<template>
	<view class="mine">
		<view :style="{'height':topHeight}"></view>
		<view>
			<view style="display: flex; justify-content: flex-end; padding: 10px">
				<navigator url="/pages/set/set" hover-class="none">
					<l-icon name="mingcute:settings-5-fill" size="40px" color="#fff"></l-icon>

				</navigator>
			</view>
		</view>
		<view class="avator-style">
			<view class="avator-card">

				<view class="flex-center">
					<l-icon name="carbon:user-avatar-filled" size="100px" color="#fff"></l-icon>
				</view>
				<view class="flx-column name-style">
					<view class="flex-center" style="gap:20px"  @click="openNameUpdate">
						<view>
							<text>{{
								user.userName||"--"}} 【{{geTel(user.phone)}}】</text>
						</view>
						<view>
							<l-icon name="material-symbols:edit-square-outline-rounded" size="22px"
								color="#fff"></l-icon>

						</view>


					</view>

					<view v-if="false"><text style="padding: 4px 8px" class="sub-name">{{geTel(user.phone)}}</text>
					</view>
					<view v-if="false" class="flex-between vip-style" style="padding: 12px 8px 0 0"
						@click="menuEvent('recharge')">
						<view style="display: flex;align-items:center">
							<view class="flex-center" style="padding-right:8px">
								<l-icon name="pepicons-pencil:crown-circle-filled" size="25px" color="#cdad00"></l-icon>

							</view>
							<view>
								<text style="color:#f1f1f1;font-weight:normal">订阅期：<text style="color: #cdad00">{{
									vipDate(user.vipEndDateStamp)
								}}</text></text>
							</view>

						</view>

						<view class="flex-center">
							<!-- <l-icon name="material-symbols:arrow-forward-ios" size="18px" color="#d4d1d1"></l-icon> -->

						</view>
					</view>
				</view>

			</view>
		</view>
		<view class="card-list">

			<view class="bottom-card">
				<view class="card jd" style="background:#0765ae">
					<view class="jd-item" style="font-weight: 400; font-size: 20px">{{
						hotel['hotelName']
					}}</view>
					<view class="jd-item">
						<navigator url="/pages/hotelManage/hotelList/hotelList" hover-class="none">
							<view class="flex-between">
								<view>
									<!-- <l-icon name="ri:hotel-fill" color="#000" size="22px"></l-icon> -->
									<text style="padding-right: 20px">门店管理</text>
								</view>
								<view>
									<l-icon name="material-symbols:arrow-forward-ios" size="22px" color="#fff"></l-icon>
								</view>

							</view>
						</navigator>
					</view>
				</view>
				<view class="card card-normal">
					<view class="menu-list">
						<view class="menu-list-item" v-for="item in menuList" @click="menuEvent(item.key)">
							<view class="icon-area flex-center">
								<l-icon :name="item.imgName" size="20px" color="#666"></l-icon>
							</view>
							<view class="content-area">
								<view>{{item.title}}</view>
								<view>
									<l-icon v-if="item.showArrow" name="material-symbols:arrow-forward-ios" size="18px"
										color="#999"></l-icon>

								</view>

							</view>
						</view>
					</view>
				</view>
			</view>

		</view>
		<view class="flex-center"> </view>

		<uni-popup ref="nameDialog" type="dialog">
			<uni-popup-dialog ref="inputClose" before-close mode="input" title="更改名称" value="" placeholder="请输入名称"
				@close="closeNameUpdate" @confirm="submitNameUpdate"></uni-popup-dialog>
		</uni-popup>
		<!-- <uni-pay ref="pay"></uni-pay> -->
		<uni-popup ref="popupRecharge" background-color="#fff" type="bottom">
			<view class="popup-content">
				<view class="create-order-title-style">充值中心</view>
				<view class="comContent">
					<recharge></recharge>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import recharge from "@/pages/mine/recharge/rechargeComponent";
import feedback from "./feedback/feedback";
import { AccountService } from "../../services/AccountService";
import LIcon from '../../uni_modules/lime-icon/components/l-icon/l-icon.vue';
export default {
  components: {
    feedback,
    recharge,
    LIcon
  },
  data() {
    return {
      avatar:
        "https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png",
      menuList: [
        // {
        // 	key: "instructions",
        // 	unicode: "\ue8cc",
        // 	title: "使用说明",
        // 	showArrow: true
        // },

        {
          key: "feedback",
          unicode: "\ue6c0",
		  imgName:"fluent:mail-32-filled",
          title: "意见反馈",
          showArrow: true,
        },
        // {
        // 	key: "loginOut",
        // 	unicode: "\ue625",
        // 	title: "退出登录",
        // 	showArrow: true
        // }
      ],
    };
  },
  computed: {

			topHeight(){
				return this.$store.state.topHeight;
			},
    isPcShow() {
      return this.$store.state.isPcShow;
    },
    hotel_id() {
      return this.$store.state.hotel_id;
    },
    hotel() {
		const hotelList = this.$store.state.hotelList||[];
      return hotelList.length?(hotelList.find(
        (item) => item._id == this.hotel_id
      )):{}
    },
    user() {
      return this.$store.state.user || uni.getStorageSync("user");
    },
  },
  onShow() {},
  created() {},
  async onPullDownRefresh() {
    console.log("mine  refrush");
    await this.$store.dispatch("getUser");
    uni.stopPullDownRefresh();
  },
  methods: {
			 geTel(tel) {
			tel=""+tel;
			var reg=/(\d{3})\d{4}(\d{4})/;
			var result = tel.replace(reg, "$1****$2")
			return result;
		},
    login() {
      uni.navigateTo({
        url: "/uni_modules/uni-id-pages/pages/login/login-smscode?phoneNumber=19083441181",
      });
    },
    vipDate(d) {
      if (!d) {
        return "--";
      }
      return new Date(Number(d)).Format("yyyy-MM-dd");
    },
    closeNameUpdate() {
      this.$refs.nameDialog.close();
    },
    openNameUpdate() {
      this.$refs.nameDialog.open();
    },
    async submitNameUpdate(val) {
      console.log(val);
      if (!val) {
        return;
      }
      uni.showLoading();
      try {
        const res = await AccountService.updateUserName(this.user._id, val);

        console.log("修改成功");
        this.closeNameUpdate();
        uni.hideLoading();
        uni.showToast({ title: "修改成功", icon: "success" });
      } catch (error) {
        console.log("修改失败", error);
        uni.hideLoading();
        uni.showToast({ title: "修改失败", icon: "error" });
      }
      await this.$store.dispatch("getUser");
    },
    menuEvent(key) {
      switch (key) {
        case "instructions":
          if (this.isPcShow) {
            uni.$emit("closeRightDrawer");
            uni.$emit("showPopupPivot", "popupInstructions", 1);
            break;
          }
          uni.navigateTo({
            url: `/pages/mine/instructions/instructions`,
          });
          break;
        case "loginOut":
          this.loginOut();
          break;
        case "feedback":
			//if (this.isPcShow) {
			//	uni.$emit("closeRightDrawer");
			//	uni.$emit("showPopupPivot", "popupFeedback", 1);
			//	break;
			//}
          uni.navigateTo({
            url: `/pages/mine/feedback/feedback`,
          });
          break;
        case "recharge":
          if (this.isPcShow) {
            //uni.$emit("closeRightDrawer");
            //uni.$emit("showPopupPivot","popupRecharge",1);
            break;
          }
          // uni.navigateTo({
          // 	url: `/pages/mine/recharge/recharge`
          // });
          //this.$refs.popupRecharge.open();
          break;
      }
    },
    async loginOut() {
      console.log("loginout");
      const conf = await uni.showModal({
        title: "确认登出",
        content: "是否确认退出登录",
        showCancel: true,
        cancelText: "取消",
        confirmText: "确认",
      });
      if (conf["cancel"]) {
        return;
      }
      this.$store.dispatch("loginOut");
    },
  },
};
</script>

<style lang="scss">
.mine {
	height: 100vh;
	display: flex;
	flex-direction: column;
	background: #0765ae;

	.avator-style {
		padding-bottom: 25px;

		.avator-card {
			display: flex;
			flex-direction: column;
			gap: 15px;

			.name-style {
				color: #fff;
				font-size: 18px;
				font-weight: 400;

				.sub-name {
					font-size: 15px;
					color: #f1f1f1;
					font-weight: normal;
				}
			}
		}
	}
}

.card-list {
	flex: 1;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	background: #F5F7FA;
	border-top-left-radius: 20px;
		border-top-right-radius: 20px;
	.bottom-card {
		
		flex: 1;
		box-sizing: border-box;
		padding: 15px;
		
	}

	.card {
		box-sizing: border-box;

		padding: 0 15px;
		/*box-shadow: 0 0 6px 0px #e4e0e0;*/
		border-radius: 8px;
		margin-bottom: 15px;
		display: flex;
		flex-direction: column;


	}

	.jd {
		background-color: #eee;
		color: #fff;
		padding: 10px;

		.jd-item {
			padding: 8px 0;

		}
	}

	.card-normal {
		/*background-image: linear-gradient(165deg, #0765ae, #fff);*/
		background-color: #fff;
		color: #333;
		padding: 10px;

		.jd-item {
			padding: 8px 0;

		}

	}
}

.menu-list {
	.menu-list-item {
		min-height: 44px;
		display: flex;
		justify-content: space-between;

		.icon-area {
			padding-right: 8px;
		}

		.content-area {
			display: flex;
			flex: 1;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1px solid #d5d4d4;
			box-sizing: border-box;
			font-size: 14px;
			color: #666;
		}

		&:last-child {
			.content-area {
				border-width: 0;
			}
		}
	}
}

.vip-style {
	font-size: 13px;
}

@font-face {
	font-family: "iconfont";
	/* Project id 4630870 */
	src: url("../../static/iconfont.ttf");
}
</style>
