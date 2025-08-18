<template>
  <view class="employee-component">
    <view class="add-content-style">
      <view class="left-panal">
        <text class="title">员工管理</text>
      </view>
      <view class="control-panal">
        <view class="control-item-group" @click="addEmployee">
          <view><l-icon name="solar:add-circle-bold" size="22px" color="#fff" /></view>
          <view><text style="color:#fff">添加员工</text></view>
        </view>
      </view>
    </view>
    <view class="content">
      <view>
        <xt-panal-list :count="employeeList.length">

          <!-- #ifdef MP -->
          <view v-for="(item, index) in employeeList" slot="card{{index}}">
           <view class="card-content">
              <view class="avator">
                <l-icon v-if="item.role=='administrator'" name="emojione-monotone:letter-a" color="#3885fc" size="80px"></l-icon>
                <l-icon v-if="item.role=='manager'" name="emojione-monotone:letter-m" color="green" size="80px"></l-icon>
                <l-icon v-if="item.role=='normal'" name="emojione-monotone:letter-n" color="#999" size="80px"></l-icon>
              </view>
              <view class="info">
                <view class="n"><text>{{ item.employee_name }}</text></view>
                <view class="r"><text>角色：{{roleFormat(item.role)}}</text></view>
              </view>
              <view class="control">
                <view @click="editEmployee(item)"><l-icon name="mingcute:pencil-fill" color="#3885fc" size="18px"></l-icon></view>
                <view v-if="item.role!='administrator'"  @click="deleteEmployee(item)"><l-icon name="garden:x-fill-16" color="#3885fc" size="18px"></l-icon></view>
                
              </view>
            </view>
          </view>
          <!-- #endif -->
          <!-- #ifdef H5 || APP-PLUS -->
          <template v-for="(item, index) in employeeList" v-slot:[`card${index}`]>
            <view class="card-content">
              <view class="avator">
                <l-icon v-if="item.role=='administrator'" name="emojione-monotone:letter-a" color="#3885fc" size="80px"></l-icon>
                <l-icon v-if="item.role=='manager'" name="emojione-monotone:letter-m" color="green" size="80px"></l-icon>
                <l-icon v-if="item.role=='normal'" name="emojione-monotone:letter-n" color="#999" size="80px"></l-icon>
              </view>
              <view class="info">
                <view class="n"><text>{{ item.employee_name }}</text></view>
                <view class="r"><text>角色：{{roleFormat(item.role)}}</text></view>
              </view>
              <view class="control">
                <view @click="editEmployee(item)"><l-icon name="mingcute:pencil-fill" color="#3885fc" size="18px"></l-icon></view>
                <view v-if="item.role!='administrator'"  @click="deleteEmployee(item)"><l-icon name="garden:x-fill-16" color="#3885fc" size="18px"></l-icon></view>
                
              </view>
            </view>
          </template>
          <!-- #endif -->
        </xt-panal-list>
      </view>
      <!-- <view class="phone-show-style" style="max-width: 450px">
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
    </view> -->
      <uni-popup ref="popupCreateRoomType" background-color="transprant">
        <view class="popup-content">
          <view class="create-order-title-style">{{
            type==1? "修改员工信息":"新增员工"
            }}</view>
          <view class="comContent">
            <addEmployeeComponent @closePopup="closePopup" :type="type" :em="emObj"></addEmployeeComponent>
          </view>
        </view>
      </uni-popup>
    </view>

  </view>
</template>

<script>
import addEmployeeComponent from "./addEmployeeComponent";
import  {DB} from "../../../api/DB";
import  {HotelService} from "../../../services/HotelService";
import {alert} from "@/alert";
import LIcon from '../../../uni_modules/lime-icon/components/l-icon/l-icon.vue';
import { colorGradient } from '@/uni_modules/uv-ui-tools/libs/function/colorGradient.js';
export default {
  components: {
    addEmployeeComponent,
    LIcon,
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
      // if (this.$store.state.isPcShow) {
      //   this.$refs.popupCreateRoomType.open();
      //   return;
      // }

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
      // if (this.$store.state.isPcShow) {
      //   this.$refs.popupCreateRoomType.open();
      //   return;
      // }

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
        title: "确认删除员工",
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
.employee-component {
  min-height: 100vh;
  background-color: #0765ae;
  display: flex;
  flex-direction: column;
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

.content {
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background: #e7eaef;
  flex: 1;
  padding:15px;
  box-sizing: border-box;

}
.card-content{
  display: flex;
  padding:15px;
  box-sizing: border-box;
  .avator{
    display: flex;
    align-items: center;
    justify-content: center;
    padding:10px;
  }
  .info{
    flex: 1;
        display: flex;
    justify-content: center;
    flex-direction: column;
    padding-left: 10px;
    box-sizing: border-box;
    gap: 4px;
    .n{
    color: #1F2937;
    font-weight: 400;
    font-size: 16px;
    }
    .r{
      color: #8C8C8C;
      font-size: 12px;
    }
  }
  .control{
    display: flex;
    flex-direction: column;
       justify-content: space-around;
  }
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
        font-size: $uni-font-size-base ;
      }
    }
  }
}
</style>
