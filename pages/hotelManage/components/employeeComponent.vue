<template>
  <view class="employee-component">
    <view class="add-content-style">
			<view class="control-panal">
			<uv-icon
			   name="plus-circle-fill"
			   color="#000"
			   size="22"
			   label="添加员工"
			   labelPos="bottom"
			   labelSize="12px"
			   @click="addEmployee"
			 ></uv-icon>
		   </view>
		   </view>

    <view class="phone-show-style" style="max-width: 450px" v-if="!isPcShow">
      <uni-collapse v-model="accordionVal">
        <uni-collapse-item v-for="item of employeeList">
          <template v-slot:title>
            <uni-section
              class="mb-10"
              :title="item.employee_name"
              type="circle"
              :sub-title="item.phone"
            >
              <template v-slot:right>
                <text style="font-weight: bold">{{
                  roleFormat(item.role)
                }}</text>
              </template>
            </uni-section>
          </template>
          <view class="col-content">
            <view class="list">
              <view class="list-item">
                <view class="list-item-c"
                  ><text>员工姓名：</text><text>{{ item.employee_name }}</text></view
                >
              </view>
              <view class="list-item">
                <view class="list-item-c"
                  ><text>角色：</text
                  ><text style="font-weight: bold">{{
                    roleFormat(item.role)
                  }}</text></view
                >
              </view>
              <view class="list-item" style="justify-content: flex-end">
                <view class="list-item-c" style="width: 150px">
                  <button
                    class="uni-button edit-text-btn-style"
                    size="mini"
                    type="primary"
                    @click="editEmployee(item)"
                  >
                    修改
                  </button>
                  <button
                    v-if="item.role!='administrator'"
                    class="uni-button"
                    size="mini"
                    type="warn"
                    @click="deleteEmployee(item)"
                    :loading="submitLoading"
                  >
                    删除
                  </button>
                </view>
              </view>
            </view>
          </view>
        </uni-collapse-item>
      </uni-collapse>
    </view>
    <uni-popup ref="popupCreateRoomType" background-color="transprant">
      <view class="popup-content">
        <view class="create-order-title-style">{{
          type == 1 ? "修改员工信息" : "新增员工"
        }}</view>
        <view class="comContent">
          <addEmployeeComponent
            @closePopup="closePopup"
            :type="type"
            :em="emObj"
          ></addEmployeeComponent>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import addEmployeeComponent from "./addEmployeeComponent";
import  {DB} from "../../../api/DB";
import  {HotelService} from "../../../services/HotelService";
import {alert} from "@/alert";
export default {
  components: {
    addEmployeeComponent,
  },
  data() {
    return {
      submitLoading: false,
      accordionVal: "0",
      type: 0,
      emObj: {}
    };
  },
  computed: {
    isPcShow() {
      return this.$store.state.isPcShow;
    },
    hotel_id() {
      return this.$store.state.hotel_id;
    },
    partialRefreshComName(){
				return this.$store.state.partialRefreshComName;
			},
    hotel() {
      return this.$store.state.hotelList.find(
        (item) => item._id == this.hotel_id
      );
    },
    employeeList() {
      return this.$store.state.employeeList;
    },
  },
  created() {
    console.log("employeeComponent>>>>>");

    this.getEmployeeList();
  },
  watch: {
    hotel_id() {
      this.getEmployeeList();
    },
    async partialRefreshComName(val){
				//下拉刷新
				if(val=='employeeComponent'){
					console.log("局部刷新 employeeComponent")
				await this.getEmployeeList();
        console.log("刷新完成");
        this.$store.commit("setPartialRefreshComName","");
					uni.hideLoading();
					uni.stopPullDownRefresh();
				}				
			}
  },
  methods: {
    roleFormat(key){
      const m={
        "administrator":"超级管理员",
        "manager":"管理员",
        "normal":"员工"
      }
     return  m[key]
    },
    sortRoomList(list) {},
    async getEmployeeList() {
      //uni.showLoading();
      try {
          const res =  await  HotelService.getEmployeeList(this.hotel_id);
          console.log("员工列表",res)
          this.$store.commit("updateEmployeeList", res.result.data);
      } catch (error) {
        console.error(error)
        uni.hideLoading();
      }
          
          
         
    },
    editEmployee(em) {
      if(!this.$store.state.permissionStore.permissionList.includes('EMPLOYEE_UPDATE')){
					 alert.alertNoPermisson();
					return;
				}
      this.emObj = em;
      this.type = 1;
      if (this.$store.state.isPcShow) {
        this.$refs.popupCreateRoomType.open();
        return;
      }

      uni.navigateTo({
        url: `/pages/hotelManage/addEmployee/addEmployee?type=${
          this.type
        }&&em=${JSON.stringify(this.emObj)}`,
      });
    },
    addEmployee() {
      if(!this.$store.state.permissionStore.permissionList.includes('EMPLOYEE_CREATE')){
					 alert.alertNoPermisson();
					return;
				}
      this.type = 0;
      if (this.$store.state.isPcShow) {
        this.$refs.popupCreateRoomType.open();
        return;
      }

      uni.navigateTo({
        url: `/pages/hotelManage/addEmployee/addEmployee`,
      });
    },
    async deleteEmployee(em) {
      if(!this.$store.state.permissionStore.permissionList.includes('EMPLOYEE_DELETE')){
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
      DB.callFunction("hm_deleteEmployee", {
        _id: em._id,
        employee: em,
      })
        .then((res) => {
          console.log("删除成功");
          this.$store.dispatch("getHotelList");
          this.submitLoading = false;
          this.getEmployeeList();
          
        })
        .catch((er) => {
          console.log("删除失败", er);
          this.submitLoading = false;
          uni.hideLoading();
          uni.showModal({
            content: "系统异常，请稍候再试！",
            confirmText: "确认",
          });
        });
    },
    closePopup() {
      this.$refs.popupCreateRoomType.close();
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

<style lang="scss">
.add-content-style {
  display: flex;
  justify-content: flex-end;
  padding: 0 20px;
  box-sizing: border-box;
}

.uni-group {
  display: flex;
  justify-content: space-between;
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
        font-size:$uni-font-size-base ;
      }
    }
  }
}
</style>
