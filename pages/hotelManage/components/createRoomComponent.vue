<template>
  <view class="createRoomComponent">
    <view class="createRoomComponent-container">
      <view class="form"> 
        <view class="form-item"> 
          <view class="label">房型</view>
          <view class="content">
            <uni-data-select v-model="room_type_id" :localdata="range" placeholder="选择房型"></uni-data-select>
          </view>
        </view>
        <view class="form-item"> 
          <view class="label">房间列表</view>
          <view class="content">
              <view class="roomList-style">
             <view class="roomList-item" v-for="(item, index) of roomList"> 
               <view style="width: 150px">
                  <uni-easyinput v-model="item.room_name" trim="all" :disabled="type==2" :clean="false" />
                </view>
                 <view @click="deleteRoomEvent(index)">
                  <l-icon name="iconamoon:trash" size="22px" color="#007aff"></l-icon>
                </view>
             </view>
          </view>
          </view>
        </view>
      </view>          
        
       
        <view class="addRoomControl">
          <view @click="addRoomItemEvent" class="btn">
            <view><l-icon name="material-symbols-light:add-circle-outline" size="18px" color="#666"></l-icon></view>
            <view>{{roomList.length? "继续添加":"添加一个"}}</view>
          </view>
        </view>
        <view class="submit-btn-style">
			<view><button type="default" class="submit-btn" :disabled="submitDisabled" :loading="submitLoading" @click="submit()" >保存</button></view>			
			</view>
      
    </view>
  </view>
</template>

<script>
import { computed, ref, watch, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import { DB } from "../../../api/DB.js";
import LIcon from "../../../uni_modules/lime-icon/components/l-icon/l-icon.vue";
export default {
  components: { LIcon },
  props: {
    roomTypeId: String,
  },
  setup(props) {
    const store = useStore();
    let hotel_id = computed(() => {
      return store.state.hotel_id;
    });
 
    const roomType = computed(() => {
      return store.state.roomType;
    });
    const range = computed(() => {
      let arr=[];
      roomType.value.map((item) => {
        arr.push({ text: item.name, value: item._id._value });
      });
      return arr;
    });
    let room_type_id = ref(props.roomTypeId|| roomType.value[0]._id._value);
    let roomList = ref([]);
    let where_str = computed(() => {
      if (room_type_id.value == "all") {
        return `hotel_id =='${hotel_id.value}'`;
      }
      return `hotel_id =='${hotel_id.value}'&&_id=='${room_type_id.value}'`;
    });

    let submitLoading = ref(false);
   
    let roomForm=ref({
      room_type_id:"",
      roomList:[]
    })
     let submitDisabled=computed(()=>{
      return  roomList.value.length<1
    })
    //   watch(room_type_id, async (newValue, oldValue) => {
    //     if(newValue!=oldValue){
    //       roomList.value=[];
    //     }
        
    //   }, {
    //   deep: true,
    //   immediate: true,
    // });
    return { room_type_id, hotel_id, roomType, range, roomList,roomForm, submitLoading,submitDisabled };
  },
  data() {
    return {
      roomTypeRules: {
        // 对name字段进行必填验证
        name: {
          rules: [
            {
              required: true,
              errorMessage: "请输入房间名称",
            },
            {
              validateFunction: (rule, value, data, callback) => {
                let obj = this.roomList.find((item) => {
                  return item.name == value;
                });
                if (obj) {
                  callback("已存在相同房型名称");
                }
                return true;
              },
            },
          ],
        },
      },
    };
  },
  created() {},
  mounted() {
    this.addRoomItemEvent();
  },
  onUnload() {
    console.log("createRoomComponent onulload");
  },
  watch: {
    room_type_id(val, oval) {
      if (val !=oval) {
        this.roomList=[];
        this.addRoomItemEvent();
      }
    },
  },
  methods: {
    addRoomItemEvent() {
      if (!this.room_type_id) {
        return;
      }
      let arr = this.roomList || [];
      arr.push({
        hotel_id: this.hotel_id,
        room_type_id: this.room_type_id,
        room_name: this.getRoomName(this.room_type_id,arr),
      });
    },
    deleteRoomEvent(index) {
      this.roomList.splice(index, 1);
    },
    getRoomName(room_type_id,arr) {
      try {
      let targetArr = [...arr];
      let newName = `房间${arr.length + 1}`;
      const roomtypeObj =this.roomType.find(item=>item._id._value==room_type_id);
      const roomList_data = roomtypeObj._id["hm-room"]||[];
      const groupList=[...roomList_data,...arr]
      let ob = groupList.find((item) => item.room_name == newName);
      if (!ob) {
        return newName;
      } else {
        targetArr.push("");
        return this.getRoomName(room_type_id,targetArr);
      }
      } catch (error) {
        return `房间${Date.now().toString().substr(-4)}`
      }

    },
    getRoomList() {},
    async submit() {
      //this.$refs.roomTypeRef.validate().then((res) => {
   

      console.log(this.room_type_id);
      if (!this.room_type_id) {
        uni.showToast({
          title: "请选择房型",
          icon: "none",
        });
        return;
      }
      if (this.roomList.length < 1) {
        uni.showToast({
          title: "请添加房间",
          icon: "none",
        });
        return;
      }
         this.submitLoading = true;
      try {
        console.log(this.roomList)
       const res = await  DB.callFunction("hm_addRoom", { roomList: this.roomList });
        await this.$store.dispatch("getRoomType");
        console.log(res)
        uni.navigateBack({
          delta: 1, // 返回层数，2则上上页
          success() {
            // uni.$emit("update", { msg: "页面更新" });
          },
        });
      } catch (error) {
        console.log("error","error");
        uni.showModal({
          content: "系统异常，请稍候再试！",
          confirmText: "确认",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.createRoomComponent {
  display: flex;
  justify-content: center;
  min-height: 100vh;

  .createRoomComponent-container {
    flex: 1;
    max-width: 600px;
    padding:15px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    .form{
      .form-item{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding:15px;
        .label{
          width: 90px;
          font-size: 14px;
          color: #666;
        }
        .content{
          flex: 1;
          padding:0 10px;
          box-sizing: border-box;
        }
      }
    }
    .roomList-style{
  .roomList-item{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding:10px 0;
  }
}
  }
}

.disabled-style {
  color: #a1a1a1;
}



.addRoomControl {
  padding: 15px 0;

  .btn {
    flex: 1;
    background: #fff;
    color: #a1a1a1;
    padding: 10px 0;
    display: flex;
    align-items: flex-start;
    gap: 2px;
    justify-content: center;
    font-size: 12px;
  }
}

.note {
  font-size: 12px;
  padding: 15px;
  text-align: center;
  color: #a1a1a1;
}
</style>
