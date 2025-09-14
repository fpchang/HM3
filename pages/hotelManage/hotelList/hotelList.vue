<template>

	<view class="hotel-component">
		<view class="add-content-style">
			<view class="control-panal">
				<view class="control-item-group" @click="addHotel">
					<view><l-icon name="solar:add-circle-bold" size="22px" color="#fff" /></view>
					<view><text style="color:#fff">添加酒店</text></view>
				</view>
			</view>
		</view>
		<view v-if="false&&isPcShow">
			<uni-table border stripe emptyText="暂无更多数据">
				<!-- 表头行 -->
				<uni-tr>
					<uni-th align="center" width="120px">酒店名称</uni-th>
					<uni-th align="center">地址</uni-th>
					<uni-th align="center" width="120px">店主</uni-th>
					<uni-th align="center" width="120px">角色</uni-th>
					<uni-th align="center" width="180px">操作</uni-th>
				</uni-tr>
				<!-- 表格数据行 -->
				<uni-tr v-for="item of hotelList">
					<uni-td>{{item.hotelName}}</uni-td>
					<uni-td>{{item.hotelAddress}}</uni-td>
					<uni-td>{{item.belong}}</uni-td>
					<uni-td>{{roleFormat(item.curRole)}}</uni-td>
					<uni-td align="center">
						<view class="uni-group" style="justify-content:space-around">
							<text v-if="item.curRole=='administrator'" class="edit-text-btn-style"
								@click="editHotel(item)">修改</text>
							<text v-if="item.curRole=='administrator'" class="edit-text-btn-style"
								@click="deleteHotel(item)">删除</text>
						</view>
					</uni-td>
				</uni-tr>


			</uni-table>
		</view>
		<block v-if="noData">
			<noData text_content="您还没有酒店" :showControl="true" text_control_add="创建一个" @Event_one="addNewHotel"></noData>
		</block>
		<block v-if="!noData">
			<view class="content">

				<view class="mobile-show-style">
					<xt-panal-list :count="hotelList.length">

						<!-- #ifdef MP -->
						<view v-for="(item, index) of hotelList" slot="card{{index}}">
						<view class="card-content">
								<view class="avator">
						
									<image style="width:100%;height:100%" mode="aspectFill" :src="item.firstImages||'https://env-00jxhfhjd231.normal.cloudstatic.cn/HM/images/app.png'" />
						
								</view>
						
								<view class="info">
									<view class="title">{{item.hotelName}} </view>
									<view class="n"><text>{{`店主：${item.belong}`}}</text> </view>
									<view class="r"><text style="padding-right:6px">{{
										`角色：${this.roleFormat(item.curRole)}` }}</text></view>
						
						
								</view>
								<view class="control">
						
							
									<view class="control-item" @click="editHotel(item)"
										v-if="item.curRole=='administrator'"><l-icon
											name="pepicons-pop:pen-circle-filled" color="#39AFF8" size="30px"></l-icon>
									</view>
									<view class="control-item" @click="deleteHotel(item)"
										v-if="item.curRole=='administrator'"><l-icon name="clarity:remove-solid"
											color="#FF4654" size="30px"></l-icon></view>
									<view class="control-item" @click="viewDetail(item)"><l-icon
											name="fluent:more-circle-24-filled" color="#36D399" size="30px"></l-icon>
									</view>
								</view>
							</view>
						
						</view>
						<!-- #endif -->
						<!-- #ifdef H5 || APP-PLUS -->
						<template v-for="(item, index) of hotelList" v-slot:[`card${index}`]>
							<view class="card-content">
								<view class="avator">

									<image style="width:100%;height:100%" mode="aspectFill" :src="item.firstImages||'https://env-00jxhfhjd231.normal.cloudstatic.cn/HM/images/app.png'" />

								</view>

								<view class="info">
									<view class="title">{{item.hotelName}} </view>
									<view class="n"><text>{{`店主：${item.belong}`}}</text> </view>
									<view class="r"><text style="padding-right:6px">{{
										`角色：${this.roleFormat(item.curRole)}` }}</text></view>


								</view>
								<view class="control">

									<!-- <view @click="editHotel(item)" v-if="item.curRole=='administrator'"><l-icon name="mingcute:pencil-fill" color="#3885fc"
										size="18px"></l-icon>
								</view>
								<view @click="deleteHotel(item)" v-if="item.curRole=='administrator'"><l-icon name="garden:x-fill-16" color="#3885fc"
										size="18px"></l-icon></view>
								<view @click="viewDetail(item)"><l-icon name="ic:round-more-vert" color="#3885fc"
										size="18px"></l-icon></view> -->
									<view class="control-item" @click="editHotel(item)"
										v-if="item.curRole=='administrator'"><l-icon
											name="pepicons-pop:pen-circle-filled" color="#39AFF8" size="30px"></l-icon>
									</view>
									<view class="control-item" @click="deleteHotel(item)"
										v-if="item.curRole=='administrator'"><l-icon name="clarity:remove-solid"
											color="#FF4654" size="30px"></l-icon></view>
									<view class="control-item" @click="viewDetail(item)"><l-icon
											name="fluent:more-circle-24-filled" color="#36D399" size="30px"></l-icon>
									</view>
								</view>
							</view>
						</template>
						<!-- #endif -->


					</xt-panal-list>
					<!-- <uni-collapse v-model="accordionVal">
				<uni-collapse-item v-for="item of hotelList">
					<template v-slot:title>
						<uni-section class="mb-10" :title=" item.hotelName " type="circle">
				
						</uni-section>
					</template>
					<view class="col-content">
						<view class="list">
							<view class="list-item">
								<view class="list-item-c"><text class="stitle">地址：</text><text>{{item.hotelAddress}}</text></view>
							</view>
							<view class="list-item">
								<view class="list-item-c"><text class="stitle">店主：</text><text>{{item.belong}}</text></view>
							</view>
							<view class="list-item">
								<view class="list-item-c"><text class="stitle">角色：</text><text>{{roleFormat(item.curRole)}}</text></view>
							</view>
							<view class="list-item" style="justify-content: flex-end;">

								<view class="list-item-c" style="width: 150px;">
							<button
							v-if="item.curRole=='administrator'"
                    class="uni-button"
                    size="mini"
                    type="primary"
                    @click="editHotel(item)"
                  >
                    修改
                  </button>
                  <button
				  v-if="item.curRole=='administrator'"
                    class="uni-button"
                    size="mini"
                    type="warn"
                    @click="deleteHotel(item)"
                    :loading="submitLoading"
                  >
                    删除
                  </button>
								</view>
							</view>
						</view>

					</view>
				</uni-collapse-item>

			</uni-collapse> -->
				</view>
			</view>
		</block>
		<uni-popup ref="popupaddHotel" background-color="transprant" @change="popupChange">
			<view class="popup-content">
				<view class="create-order-title-style">{{["新增酒店", "修改酒店信息", "酒店详情"][type]}}</view>
				<view class="comContent">
					<createHotelComponent @closePopup="closePopup" :type="type" :targetObj="targetObj">
					</createHotelComponent>
				</view>

			</view>
		</uni-popup>
	</view>
</template>

<script>
import createHotelComponent from '../components/createHotelComponent';
import  {HotelService} from "../../../services/HotelService";
import  {DB} from '../../../api/DB';
import {alert} from "@/alert";
	export default {
		components:{
			createHotelComponent
		},
		data() {
			return {
				type:0,
				targetObj:{},
				submitLoading: false,
				accordionVal: '0',
				showPopup:false,
				
			}
		},
		computed: {
			isPcShow(){
				return this.$store.state.isPcShow;
			},
			partialRefreshComName(){
				return this.$store.state.partialRefreshComName;
			},
			hotel_id(){
				return this.$store.state.hotel_id
			},
			hotelList() {
				return this.$store.state.hotelList;
			},
			partialRefreshComName(){
				return this.$store.state.partialRefreshComName;
			},
			noData(){
				return !this.hotelList||this.hotelList.length<1;
			}
		},
		async created() {
			console.log("hotellist is created");
			uni.hideLoading();
		},
		watch:{
			hotel_id(){
				// this.$store.dispatch("getRoomType");
			},
			  async partialRefreshComName(val){
				//下拉刷新
				if(val=='hotelList'){
					console.log("局部刷新 employeeComponent")
					await this.$store.dispatch("getHotelList");
        			console.log("刷新完成");
					this.$store.commit("setPartialRefreshComName","");
					uni.hideLoading();
					uni.stopPullDownRefresh();
				}				
			}
  
		},
			  async onPullDownRefresh() {
     await this.$store.dispatch("getHotelList");
    uni.stopPullDownRefresh();
  },
		methods:{
			getSubtitle(item){
				let str="";
				return `【店主：${item.belong}】【角色：${this.roleFormat(item.curRole)}】`
			
			},
			roleFormat(val){
				const p= {
					administrator:"超级管理员",
					manager:"管理员",
					normal:"员工"
				}
				return p[val]
			},
			editHotel(targetObj){
				if(targetObj.curRole!="administrator"){
					alert.alertNoPermisson();
					return;
				}
				// if(!this.$store.state.permissionStore.permissionList.includes('HOTEL_UPDATE')){
				// 	 alert.alertNoPermisson();
				// 	return;
				// }
				this.type=1;
				this.targetObj =JSON.parse(JSON.stringify(targetObj));
				if(this.$store.state.isPcShow){
					this.$refs.popupaddHotel.open();
					return;
				}
					
				
				uni.navigateTo({
					url:`/pages/hotelManage/createHotel/createHotel?type=${this.type}&&targetObj=${encodeURIComponent(JSON.stringify(this.targetObj))}`
				})
			},
			addHotel(){
				// if(!this.$store.state.permissionStore.permissionList.includes('HOTEL_CREATE')){
				// 	 alert.alertNoPermisson();
				// 	return;
				// }
				this.type=0;
				if(this.$store.state.isPcShow){
					this.$refs.popupaddHotel.open();
					return;
				}									
				uni.navigateTo({
					url:'/pages/hotelManage/createHotel/createHotel'
				})
			},
			async deleteHotel(targetObj){
				if(targetObj.curRole!="administrator"){
					alert.alertNoPermisson();
					return;
				}
				// if(!this.$store.state.permissionStore.permissionList.includes('HOTEL_DELETE')){
				// 	 alert.alertNoPermisson();
				// 	return;
				// }
				const conf = await uni.showModal({
					title: '确认删除此酒店',
					content: '删除后将无法恢复,确认删除吗?',
					cancelText: '取消',
					confirmText: '确认'
				})
				if (conf['cancel']) {
					return;
				}
				this.submitLoading = true;
				HotelService.deleteHotel(targetObj._id).then(async res=>{
                            console.log("删除成功");
						await this.$store.dispatch("getHotelList");
						this.submitLoading = false;
						uni.hideLoading();
						if(!this.hotelList||this.hotelList.length<1){
							  uni.reLaunch({url: "/pages/index/index"});
						}
							
				}).catch(er => {
						console.log("删除失败",er);
						this.submitLoading = false;
						uni.hideLoading();
						uni.showModal({
							content:"系统异常，请稍候再试！",
							confirmText:"确认"
						});
					})
				
			},
			viewDetail(targetObj){
				this.type=2;
				this.targetObj =JSON.parse(JSON.stringify(targetObj));
				console.log(this.targetObj)
				if(this.$store.state.isPcShow){
					this.$refs.popupaddHotel.open();
					return;
				}
					
				
				uni.navigateTo({
					url:`/pages/hotelManage/createHotel/createHotel?type=${this.type}&&targetObj=${encodeURIComponent(JSON.stringify(this.targetObj))}`
				})
			},
			popupChange(e){
				this.showPopup=e.show;
			},
			closePopup(){
				this.$refs.popupaddHotel.close();
			}
		}
	}
</script>

<style lang="scss">
.hotel-component {
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
		padding: 15px;
		box-sizing: border-box;

	}
}

.add-content-style {
	display: flex;
	justify-content: flex-end;
	padding: 0 20px;
	box-sizing: border-box;
	background-color: #0765ae;

	.left-panal {
		.title {
			color: #fff;
			font-weight: 400;
			font-size: 18px;
			letter-spacing: 2px;
		}
	}
}

.uni-group {
	display: flex;
	justify-content: space-between;
}

.card-content {
	display: flex;
	padding: 15px;
	box-sizing: border-box;

	.avator {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 8px;
		width: 100px;
		overflow: hidden;
	
	}

	.info {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding-left: 10px;
		box-sizing: border-box;
		gap: 5px;

		.title {
			font-weight: 400;
		}

		.n {
			color: #8C8C8C;
			font-weight: 400;
			font-size: 15px;
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
	}
}

.titleContent {
	font-size: 13px;

	.titleContent-item {
		padding: 3px 0;
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
			font-size: $uni-font-size-base ;

			.list-item-c {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.stitle {
					font-weight: 400;

				}
			}
		}
	}
}
</style>