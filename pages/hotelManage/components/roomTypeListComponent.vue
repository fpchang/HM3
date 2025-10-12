<template>
	<view class="roomType-component">
		<view class="add-content-style">
			<view class="control-panal">
				<view class="control-item-group" @click="addRoomType">
					<view><l-icon name="solar:add-circle-bold" size="22px" color="#fff" /></view>
					<view><text style="color:#fff">添加房型</text></view>
				</view>

			</view>
		</view>
		<block v-if="noData">
			<noData text_content="没有数据" :showControl="true" text_control_add="添加房型" @Event_one="addRoomType"></noData>
		</block>
		<block v-if="!noData">
			<view class="content">
				<view class="mobile-show-style">
					<xt-panal-list :count="roomType.length" shadow="none">
						<!-- #ifdef MP -->
						<view v-for="(item, index) of roomType" slot="card{{index}}">
							<view class="card-content">
								<view class="left-area">
									<view>
										<view class="title"><text>{{item.name}}</text> </view>
									<view class="subtitle">
										
													<navigator
											:url="`/pages/hotelManage/roomList/roomList?room_type_id=${item._id._value}`">
											<view class="btn">
												<view><text>{{item._id['hm-room'].length}}间</text></view>
												<view>
													<l-icon name="material-symbols-light:arrow-forward-ios-rounded" size="20px"
														color="#0765ae"></l-icon>
												</view>
											</view>
										</navigator>
												
											
										</view>
									</view>
									<view class="avator">
										<image style="width:100%;height:100%" mode="aspectFill"
											:src="transformImageUrl(item.firstImages)" />
									</view>


								</view>

								<view class="control">

									<view class="control-item" @click="editRoomType(item)"><l-icon
											name="pepicons-pop:pen-circle-filled" color="#39AFF8" size="30px"></l-icon>
									</view>
									<view class="control-item" @click="deleteRoomType(item)"><l-icon
											name="clarity:remove-solid" color="#FF4654" size="30px"></l-icon></view>
									<view class="control-item" @click="viewDetail(item)"><l-icon
											name="fluent:more-circle-24-filled" color="#36D399" size="30px"></l-icon>
									</view>
								</view>
								<!-- <view style="display:flex"><l-icon name="material-symbols-light:arrow-forward-ios" size="22px" color="#bbb"></l-icon> </view>
							 -->
							</view>
						</view>
						<!-- #endif -->
						<!-- #ifdef H5 || APP-PLUS -->
						 
						<template v-for="(item, index) of roomType" v-slot:[`card${index}`]>
							<view class="card-content">
								<view class="left-area">
									<view>
										<view class="title"><text>{{item.name}}</text> </view>
										<view class="subtitle">
										
													<navigator
											:url="`/pages/hotelManage/roomList/roomList?room_type_id=${item._id._value}`">
											<view class="btn">
												<view><text>{{item._id['hm-room'].length}}间</text></view>
												<view>
													<l-icon name="material-symbols-light:arrow-forward-ios-rounded" size="20px"
														color="#0765ae"></l-icon>
												</view>
											</view>
										</navigator>
											
										</view>
									</view>
									<view class="avator">
										<image style="width:100%;height:100%" mode="aspectFill"
											:src="transformImageUrl(item.firstImages)" />
									</view>


								</view>

								<view class="control">

									<view class="control-item" @click="editRoomType(item)"><l-icon
											name="pepicons-pop:pen-circle-filled" color="#39AFF8" size="30px"></l-icon>
									</view>
									<view class="control-item" @click="deleteRoomType(item)"><l-icon
											name="clarity:remove-solid" color="#FF4654" size="30px"></l-icon></view>
									<view class="control-item" @click="viewDetail(item)"><l-icon
											name="fluent:more-circle-24-filled" color="#36D399" size="30px"></l-icon>
									</view>			
								</view>
								<!-- <view style="display:flex"><l-icon name="material-symbols-light:arrow-forward-ios" size="22px" color="#bbb"></l-icon> </view>
							 -->
							</view>

						</template>
						<!-- #endif -->
					</xt-panal-list>
					<!-- <uni-collapse v-model="accordionVal" accordion>
				<uni-collapse-item v-for="item of roomType">
					<template v-slot:title>
						<uni-section class="mb-10" :title=" item.name " type="circle">
							<template v-slot:right>
								<text style="font-weight: 400;">{{item.count}}间</text>
								
							</template>
						</uni-section>
					</template>
					 <view class="col-content">
						<view class="list">
							<view class="list-item">
								<view class="list-item-c">
									<view style="width:80px;"><text class="stitle">房间号：</text></view>
									<view style="flex:1"><text v-for="i of sortRoomList(item.roomList)">【{{i}}】</text></view>
								
								</view>
								
							</view>
							<view class="list-item">
								<view class="list-item-c"><text class="stitle">数量：</text><text>{{item.count}}</text></view>
							</view>
							<view class="list-item" style="justify-content: flex-end;">

								<view class="list-item-c" style="width: 150px;">
									<button class="uni-button" size="mini" type="primary"
										@click="editRoomType(item)">修改</button>
									<button class="uni-button" size="mini" type="warn"
										@click="deleteRoomType(item)" :loading="submitLoading">删除</button>
								</view>
							</view>
							<view  class="list-item">								
								<xt-file-picker  :disabled="true" :key="new Date().getTime()"  :imagesList="item.imagesList"></xt-file-picker>
							</view>
						</view>

					</view>
				</uni-collapse-item>

			</uni-collapse> -->
				</view>
			</view>
		</block>
		<!-- <uni-popup ref="popupCreateRoomType" background-color="transprant">
			<view class="popup-content">
				<view class="create-order-title-style">{{
					type==1? "修改房型":"创建房型"
				}}</view>
				<view class="comContent">
					<createRoomTypeComponent @closePopup="closePopup" :type="type" :rt="rt"></createRoomTypeComponent>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="popupRoomTypeImages" background-color="transprant">
			<view class="popup-content">
				<view class="create-order-title-style">房型图片</view>
				<view class="comContent">
					<roomTypeImagesComponent @closePopup="closePopup" :type="type" :rt="rt"></roomTypeImagesComponent>
				</view>
			</view>
		</uni-popup> -->
	</view>
</template>

<script>
import createRoomTypeComponent from "./createRoomTypeComponent";
import { alert } from "@/alert";
import { DB } from "../../../api/DB";
import LIcon from '../../../uni_modules/lime-icon/components/l-icon/l-icon.vue';
import gatherComponent from '@/pages/gather/components/gatherComponent';
export default {
  components: {
    createRoomTypeComponent,
    LIcon,
  },
  data() {
    return {
      type: 0,
      rt: {},
      submitLoading: false,
      accordionVal: null,
    };
  },
  computed: {
    isPcShow() {
      return this.$store.state.isPcShow;
    },
    hotel_id() {
      return this.$store.state.hotel_id;
    },
    partialRefreshComName() {
      return this.$store.state.partialRefreshComName;
    },
    roomType() {
      return this.$store.state.roomType;
    },
    showAddBtn() {
      return this.$store.state.permissionStore.permissionList.includes(
        "ROOMTYPE_CREATE"
      );
    },
    noData() {
      return !this.roomType || this.roomType.length < 1;
    },
  },
  async created() {
    await this.$store.dispatch("getRoomType");
    uni.hideLoading();
  },
  watch: {
    hotel_id(val, oldVal) {
      if (val != oldVal) {
        this.$store.dispatch("getRoomType");
      }
    },
    async partialRefreshComName(val) {
      //下拉刷新
      //console.log(val);
      if (val == "roomTypeListComponent") {
        //console.log("局部刷新 roomTypeListComponent");
        await this.$store.dispatch("getRoomType");
        //console.log("刷新完成");
        this.$store.commit("setPartialRefreshComName", "");
        uni.hideLoading();
        uni.stopPullDownRefresh();
      }
    },
  },
  
  methods: {
	  transformImageUrl(url){
		  return url.replace("https://env-00jxhfhjd231.normal.cloudstatic.cn","https://cdn.hotelsys.fun");
	  },
    getSubtitle(item) {
      let bedList = item.bedList;
      let str = "";
      bedList &&
        bedList.map((item) => {
          let s = item.count > 1 ? `*${item.count}` : "";
          str += `${item.name}床${s}、`;
        });
      str = str.substring(0, str.length - 1);
      return `【${str}】【${item.guestNumber || 2}人】【${
        item.area || "--"
      }㎡】`;
    },
    sortRoomList(list) {
      let newList = list.filter((item) => {
        return item;
      });
      return newList.sort();
    },
    editRoomType(rt) {
      if (
        !this.$store.state.permissionStore.permissionList.includes(
          "ROOMTYPE_UPDATE"
        )
      ) {
        alert.alertNoPermisson();
        return;
      }
      this.type = 1;
      this.rt = rt;
    //   if (this.$store.state.isPcShow) {
    //     this.$refs.popupCreateRoomType.open();
    //     return;
    //   }
      uni.navigateTo({
        url: `/pages/hotelManage/createRoomType/createRoomType?type=${
          this.type
        }&&rt=${encodeURIComponent(JSON.stringify(this.rt))}`,
      });
    },
    addRoomType() {
      //console.log(this.$store.state.permissionStore.permissionList);
      if (
        !this.$store.state.permissionStore.permissionList.includes(
          "ROOMTYPE_CREATE"
        )
      ) {
        alert.alertNoPermisson();
        return;
      }
      this.type = 0;
    //   if (this.$store.state.isPcShow) {
    //     this.$refs.popupCreateRoomType.open();
    //     return;
    //   }

      uni.navigateTo({
        url: "/pages/hotelManage/createRoomType/createRoomType",
      });
    },
    async deleteRoomType(rt) {
      if (this.submitLoading) {
        return;
      }
      if (
        !this.$store.state.permissionStore.permissionList.includes(
          "ROOMTYPE_DELETE"
        )
      ) {
        alert.alertNoPermisson();
        return;
      }
      const conf = await uni.showModal({
        title: "确认删除房型",
        content: "删除后将无法恢复,确认删除吗?",
        cancelText: "取消",
        confirmText: "确认",
      });
      if (conf["cancel"]) {
        return;
      }
      this.submitLoading = true;
      //uni.showLoading();
      DB.callFunction("hm_deleteRoomType", {
        _id: rt._id,
      })
        .then(async (res) => {
          //console.log("删除成功");
          await this.$store.dispatch("getRoomType");
          this.submitLoading = false;
          uni.hideLoading();
        })
        .catch((er) => {
          //console.log("删除失败", er);
          this.submitLoading = false;
          uni.hideLoading();
          uni.showModal({
            content: "系统异常，请稍候再试！",
            confirmText: "确认",
          });
        });
    },
    viewDetail(rt) {
      this.type = 2;
      this.rt = rt;
    //   if (this.$store.state.isPcShow) {
    //     this.$refs.popupCreateRoomType.open();
    //     return;
    //   }
      uni.navigateTo({
        url: `/pages/hotelManage/createRoomType/createRoomType?type=${
          this.type
        }&&rt=${encodeURIComponent(JSON.stringify(this.rt))}`,
      });
    },
    showRoomTypeImages() {
      this.$refs.popupRoomTypeImages.open();
    },
    closePopup() {
      this.$refs.popupCreateRoomType.close();
      this.$refs.popupRoomTypeImages.close();
    },
    // getRoomTypeList(){
    // 	return uniCloud.callFunction({
    // 		name:"hm_getRoomType",
    // 		data:{hotel_id:this.hotel_id}
    // 	}).then(res=>{

    // 		if(res.result.data.length){
    // 			this.$store.commit("updateRoomTypeList",res.result.data[0].roomTypeList);
    // 		}
    // 	})
    // }
  },
};
</script>

<style lang="scss" scoped>
.divider {
	height: 1px;
	background: #ebeef5;

}

.room-style {
	color: #0765ae;
}

.roomType-component {
	height: 100%;
	min-height: 100vh;
	background-color: #0765ae;
	display: flex;
	flex-direction: column;

	.content {
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
		background: #e7eaef;
		flex: 1;
		
		box-sizing: border-box;

	}
}

.room-list-content {

	.room-list {
		display: flex;
		gap: 10px;
		padding: 15px;
		box-sizing: border-box;
		overflow: hidden;

		.room-item {
			height: 60px;
			width: 60px;
			background: #0765ae;
			border-radius: 8px;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
		}
	}

}

.add-content-style {
	display: flex;
	justify-content: flex-end;
	padding: 0 20px;
	box-sizing: border-box;
	background-color: #0765ae;
}

.uni-group {
	display: flex;
	justify-content: space-between;
}

.card-content {
	display: flex;
	padding: 15px;
	box-sizing: border-box;
	justify-content: space-between;

	/*background: linear-gradient(135deg, #D67AD2 0%, #4AA5E6 100%);*/
	.left-area {

		.title {
			color: #1F2937;
			font-weight: 400;
			font-size: 16px;
			letter-spacing: 2px;
		}

		.subtitle {
			color: #8C8C8C;
			font-size: 12px;
		}

		.avator {
			margin-top: 8px;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 8px;
			overflow: hidden;
			width: 160px;
			height: 100px;
		}
			.btn {
			color: #0765ae;
			padding:5px 0;
			border-radius: 10px;
			font-size: 12px;
			display: flex;
			text-decoration: underline;
			justify-content: space-between;
			gap: 5px;

		}
	}


	.info {
		flex: 1;
		display: flex;
		justify-content: center;
		flex-direction: column;
		padding-left: 10px;
		box-sizing: border-box;
		gap: 4px;

		.n {
			color: #1F2937;
			font-weight: 400;
			font-size: 16px;
		}

		.r {
			color: #8C8C8C;
			font-size: 12px;
		}
	}

	.control {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: flex-end;

		.control-item {
			display: flex;
		}

		.btn {
			color: #0765ae;

			border-radius: 10px;
			font-size: 12px;
			display: flex;
			text-decoration: underline;
			justify-content: flex-start;
			gap: 5px;

		}
	}
}

.col-content {
	/* background: linear-gradient(to bottom, #FFF, #EEF); */
	border-radius: 4px;
	padding: 0 20px;

	.list {
		display: flex;
		flex-direction: column;

		.list-item {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			padding: 10px 0;

			.list-item-c {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.stitle {
					font-weight: 400;
					font-size: $uni-font-size-base;
				}
			}
		}
	}
}
</style>
