<template>
  <view>
    <uni-forms
      ref="employeeRef"
      :modelValue="employeeForm"
      :rules="employeeFormRules"
      label-width="130px"
    >
      <uni-forms-item label="用户名"  name="employee_name">
        <uni-easyinput
          v-model="employeeForm.employee_name"
          placeholder="请输入员工名"
        />
      </uni-forms-item>
      <uni-forms-item required label="手机号(登录账号)" name="phone">
        <uv-input
          maxlength="11"
          type="number"
          placeholder="请输入手机号"
          border="surround"
          v-model="employeeForm.phone"
          clearable
          :disabled="isAdministrator"
          class="inputStyle"
        >
        </uv-input>
      </uni-forms-item>
      <uni-forms-item label="角色" v-if="!isAdministrator">
        <uni-data-checkbox
          v-model="employeeForm.role"
          :localdata="roleItems"
        ></uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item>
        <uv-button
        type="success"
        text="保存"
        color="#007aff"
        @click="submitForm()"
        :disabled="submitDisabled"
        :loading="submitLoading"
      ></uv-button>
      </uni-forms-item>
    </uni-forms>
   
  </view>
</template>

<script>
import  {DB} from "../../../api/DB.js";
export default {
  name: "addEmployeeComponent",
  props: {
    em: Object,
    type: Number, // 0 新增，1编辑
  },
  data() {
    return {
      submitLoading: false,
      //hotelList:getApp().globalData.hotelList,
      employeeForm:
        this.type == 1
          ? {
              hotel_id: "",
              employee_name: this.em.employee_name,
              phone: this.em.phone,
              role: this.em.role,
            }
          : {
              hotel_id: "",
              employee_name: "",
              phone: "",
              role: "normal",
            },
      roleItems: [
        {
          value: "manager",
          text: "管理员",
        },
        {
          value: "normal",
          text: "员工",
        }
      ],
      employeeFormRules: {
        // 对name字段进行必填验证
        phone: {
          rules: [
            {
              required: true,
              errorMessage: "请输入手机号",
            },
            {
              pattern: "^[1][3,4,5,6,7,8,9][0-9]{9}$",
              errorMessage: "手机号不正确",
            },
            {
              validateFunction: (rule, value, data, callback) => {
                let obj= this.employeeList.find((item) => {
                  return item.phone == value;
                });
                // if(this.type==1){
                //   obj = this.employeeList.find((item) => {
                //   return item.phone == value&&item._id !=this.em._id;
                // });
                // }

                if (obj&&this.type==0) {
                  callback("已存在相同手机号");
                }
                // if (value == this.hotel.belong) {
                //   callback("此用户为超级管理员");
                // }
                return true;
              },
            },
          ],
        },
      },
    };
  },
  created() {
    // if(this.type==1){
    // 	this.employeeForm={
    //     employee_name: this.em.employee_name,
    //     phone: this.em.phone,
    //     role: this.em.role
    //   }
    // }
  },
  computed: {
    hotel_id() {
      return this.$store.state.hotel_id;
    },

    hotel() {
      return this.$store.state.hotelList.find(
        (item) => item._id == this.hotel_id
      );
    },
    isAdministrator(){
      return this.employeeForm.role=="administrator"&&this.type==1;
    },
    employeeList() {
      return this.$store.state.employeeList;
    },
    submitDisabled() {
      return !this.employeeForm.phone;
    },
  },
  methods: {
    getEmployeeList() {
      DB.getCollection("hm-employee", {
        hotel_id: this.hotel_id,
      })
        .then((res) => {
          console.log("ree>>>>", res);
          this.$store.commit("updateEmployeeList", res.result.data);
          uni.hideLoading();
          this.$emit("closePopup");
        })
        .catch((err) => {
          console.error(err);
          uni.hideLoading();
          uni.showModal({
            content: "系统异常，请稍候再试！",
            confirmText: "确认",
          });
        });
    },
    submitForm() {
      this.$refs.employeeRef.validate().then((res) => {
        console.log(this.employeeForm);
        //uni.showLoading();
        this.submitLoading = true;
        this.employeeForm.hotel_id = this.hotel_id;
        if(this.type==1){
          this.editEmployee();
          return;
        }
       this.addEmployee();
      });
    },
    addEmployee() {
      DB.callFunction("hm_addEmployee", {
          employeeObj: this.employeeForm,
        })
          .then((res) => {
            console.log("添加成功");
            this.getEmployeeList();
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
    editEmployee() {
      DB.callFunction("hm_editEmployee", {
          _id:this.em._id,
          employeeObj: this.employeeForm,
        })
          .then((res) => {
            console.log("修改成功");
            this.getEmployeeList();
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
    },
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
};
</script>

<style></style>
