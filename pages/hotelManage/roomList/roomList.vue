<template>
  <view class="roomList">
    <view class="add-content-style">
      <view class="left-panal"> </view>
      <view class="control-panal">
        <view class="control-item-group" @click="addRoom">
          <view><l-icon name="solar:add-circle-bold" size="22px" color="#fff" /></view>
          <view><text style="color: #fff">添加房间</text></view>
        </view>
      </view>
    </view>
    <view class="content">
      <view class="filter-area">
        <view class="filter-item">
          <uni-data-select v-model="room_type_id" :localdata="range" placeholder="选择房型"></uni-data-select>
        </view>
      </view>
        <block v-if="!filterRoomList.length">
          <noData text_content="无房间数据" bgColor="transparent"></noData>
        </block>
        <block v-if="filterRoomList.length">
          <view class="detail-title">
            <text>房间列表</text>
          </view>

          <xt-panal-list :count="filterRoomList.length">
            <!-- #ifdef MP -->
             <view v-for="(item, index) in filterRoomList" slot="card{{index}}"> 
              <view class="card-content">
                <view class="left-area">
                  <view>
                    <view class="title">
                      <!-- <view v-if="!item['isedit']">{{item.room_name}} </view>  -->
                         <view class="input-style" :style="{'border-color':item._id ==editId?'#dfdfdf':' #fff'}">
                          <input :inputBorder="item._id ==editId?true:false" v-model="item.room_name" trim="all" :disabled="item._id !=editId" :focus="item._id !=editId" :clean="false" />
                        </view>
                     
                    </view>
                    <view class="subtitle"><text>{{item.room_type_name}}</text>
                    </view>
                  </view>
              
                </view>

                <view class="control">
                  <view v-if="item._id!=editId" class="control-item" @click="editRoom(item)"><l-icon name="pepicons-pop:pen-circle-filled"
                      color="#39AFF8" size="30px"></l-icon>
                  </view>
                  <view v-if="item._id!=editId" class="control-item" @click="deleteRoom(item)"><l-icon name="clarity:remove-solid"
                      color="#FF4654" size="30px"></l-icon></view>

                      <view v-if="item._id==editId" class="control-item" @click="cancleEditRoom(item)"><l-icon name="mdi:sync-circle"
                      color="#9a9a9a" size="30px"></l-icon></view>
                      <view v-if="item._id==editId" class="control-item" @click="updateRoome(item)"><l-icon name="line-md:confirm-circle-filled"
                      color="#0765ae" size="30px"></l-icon></view>
                      
                </view>
              </view>
            </view> 
            <!-- #endif -->
            <!-- #ifdef H5 || APP-PLUS -->
              <template v-for="(item, index) in filterRoomList" v-slot:[`card${index}`]>
              <view class="card-content">
                <view class="left-area">
                  <view>
                    <view class="title">
                      <!-- <view v-if="!item['isedit']">{{item.room_name}} </view>  -->
                         <view class="input-style" :style="{'border-color':item._id ==editId?'#dfdfdf':' #fff'}">
                          <input :inputBorder="item._id ==editId?true:false" v-model="item.room_name" trim="all" :disabled="item._id !=editId" :focus="item._id !=editId" :clean="false" />
                        </view>
                     
                    </view>
                    <view class="subtitle"><text>{{item.room_type_name}}</text>
                    </view>
                  </view>
              
                </view>

                <view class="control">
                  <view v-if="item._id!=editId" class="control-item" @click="editRoom(item)"><l-icon name="pepicons-pop:pen-circle-filled"
                      color="#39AFF8" size="30px"></l-icon>
                  </view>
                  <view v-if="item._id!=editId" class="control-item" @click="deleteRoom(item)"><l-icon name="clarity:remove-solid"
                      color="#FF4654" size="30px"></l-icon></view>

                      <view v-if="item._id==editId" class="control-item" @click="cancleEditRoom(item)"><l-icon name="mdi:sync-circle"
                      color="#9a9a9a" size="30px"></l-icon></view>
                      <view v-if="item._id==editId" class="control-item" @click="updateRoome(item)"><l-icon name="line-md:confirm-circle-filled"
                      color="#0765ae" size="30px"></l-icon></view>
                      
                </view>
              </view>
            </template>
           
            <!-- #endif -->
          </xt-panal-list>

          <!-- </scroll-view> -->
        </block>
     
    </view>
  </view>
</template>

<script>
import { computed, ref, watch, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import { FMService } from "../../../services/FMService";
import { alert } from "@/alert";
import { DB } from "../../../api/DB";
export default {
  setup() {
    const store = useStore();
    const hotel_id = computed(() => {
      return store.state.hotel_id;
    });
    const roomType = computed(() => {
      return store.state.roomType;
    });
    const range = computed(() => {
      let arr = [{ text: "全部", value: "" }];
      roomType.value.map((item) => {
        arr.push({ text: item.name, value: item._id._value });
      });
      return arr;
    });
    let room_type_id = ref("");
    let filterRoomList=computed(()=>{
      let result =[];
      let roomList =[];
      roomType.value.map(item=>{
        item._id['hm-room'].map(it=>{
          roomList.push({_id:it._id, room_type_id:item._id._value, room_type_name:item.name,room_name:it.room_name})
        })
      })
      if(!room_type_id.value ){
        return roomList;
      }
      result =roomList.filter(item=>item.room_type_id ==room_type_id.value );
      return result;
    });
    let editId =ref(null);
    // let where_str = computed(() => {
    //   if (!room_type_id.value) {
    //     return `hotel_id =='${hotel_id.value}'`;
    //   }
    //   return `hotel_id =='${hotel_id.value}'&&room_type_id=='${room_type_id.value}'`;
    // });
    // watch(room_type_id, async (newValue, oldValue) => {}, {
    //   deep: true,
    //   immediate: true,
    // });
 

    return {
      hotel_id,
      room_type_id,
      roomType,
      range,
      filterRoomList,
      editId
    };
  },
  data() {
    return {};
  },

  onShow() {
    //this.$refs.udb.refresh();
    try {
      if(this.$refs.udb){
        this.$refs.udb.refresh()
      }
    } catch (error) {
      
    }
    
  },
  created() {
    // uniCloud.callFunction({name:"hm_fm_task",data:{hotel_id:this.$store.state.hotel_id}}).then(re=>{
    // 	console.log("222",re)
    // })
  },
  onLoad(obj) {
    console.log("参数传递", obj);
    try {
      this.room_type_id = obj.room_type_id;
    } catch (error) {
      this.room_type_id = "";
    }
  },
  mounted() {
  },
  onUnload() {
    
  },
    async onPullDownRefresh() {
      await this.$refs.udb.refresh();
    uni.stopPullDownRefresh();
  },
  methods: {
    amountSum(list) {
      let sum = 0;
      list.map((item) => {
        sum += item.amount;
      });
      return sum;
    },
    async getOrder() {
      console.log(this.filter);
    },
    addRoom() {
      if (
        !this.$store.state.permissionStore.permissionList.includes(
          "ROOMTYPE_CREATE"
        )
      ) {
        alert.alertNoPermisson();
        return;
      }
      uni.navigateTo({
        url: `/pages/hotelManage/createRoom/createRoom?room_type_id=${encodeURIComponent(
          this.room_type_id || ""
        )}`,
        events: {
          updateData: () => {
            console.log("刷新数据");
            this.$refs.udb.refresh();
          },
        },
      });
    },
    async deleteRoom(item) {
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
        title: "确认删除房间",
        content: "删除后将无法恢复,确认删除吗?",
        cancelText: "取消",
        confirmText: "确认",
      });
      if (conf["cancel"]) {
        return;
      }
      this.submitLoading = true;
      //uni.showLoading();
      DB.callFunction("hm_deleteRoom", {
        _id: item._id,
      })
        .then(async (res) => {
        await this.$store.dispatch("getRoomType");
          this.submitLoading = false;
          uni.hideLoading();
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
    editRoom(item){
      this.editId=item._id;
      console.log("1111",this.editId)
    },
    cancleEditRoom(item){
       this.editId=null;
    },
     updateRoome(item){
    DB.callFunction("hm_updateRoom", {
        _id: item._id,
        roomObj:{room_name:item.room_name}
      })
        .then(async (res) => {
          await this.$store.dispatch("getRoomType");
          this.editId=null;
          this.submitLoading = false;
          uni.hideLoading();
        })
        .catch((er) => {
          console.log("更新失败", er);
          this.submitLoading = false;
          uni.hideLoading();
          uni.showModal({
            content: "系统异常，请稍候再试！",
            confirmText: "确认",
          });
        });
    }
  },
};
</script>

<style lang="scss" scoped>
.roomList {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-image: linear-gradient(162deg, #0765ae, #0765ae, #0765ae7a);
}

.add-content-style {
  height: 60px;
  display: flex;
  justify-content: flex-end;
  padding: 0 20px;
  box-sizing: border-box;
  background: #0765ae;

  .left-panal {
    flex: 1;
    display: flex;
    align-items: center;
  }

  .control-panal {
    display: flex;
    padding: 10px 0px;
    border-radius: 8px;
    gap: 20px;
  }
}

.content {
  flex: 1;
  background: #eaebee;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
}

.card-content {
  display: flex;
  padding: 15px;
  box-sizing: border-box;
  justify-content: space-between;

  /*background: linear-gradient(135deg, #D67AD2 0%, #4AA5E6 100%);*/
  .left-area {
    .title {
      color: #1f2937;
      font-weight: 400;
      font-size: 18px;
      letter-spacing: 2px;

      .input-style{
        padding:5px;
        border-width: 1px;
        border-color: #fff;
        border-style: dashed;
        min-width: 200px;
        border-radius: 8px;

      }
    }

    .subtitle {
      color: #8c8c8c;
      font-size: 14px;
      padding:5px;
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
  }

  .control {
  	display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: flex-end;
    gap:8px;

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

.filter-area {
  max-width: 600px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 15px;

  .filter-item {
    border-radius: 8px;
    background: #fff;
    flex: 1;
  }
}

.info-area {
  padding: 15px;
  color: #6a6a6a;
  font-size: 12px;
  display: flex;
  align-items: center;
  display: flex;
  box-sizing: border-box;
  justify-content: space-between;
  max-width: 600px;

  .item {
    background-color: rgb(12, 55, 170);
    border-radius: 8px;
    width: 110px;
    height: 70px;
    box-sizing: border-box;
    padding: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: #fff;

    .num-area {
      text-align: center;

      .num {
        color: #fff;
        padding: 0 4px;
        font-weight: bold;
        font-size: 20px;
      }
    }
  }
}

.detail-title {
  font-size: 20px;
  color: #666;
  padding: 10px 15px;
  font-weight: bold;
}

.list {
  color: #6a6a6a;
  font-size: 13px;
  padding: 4px;

  .list-item {
    box-sizing: border-box;
    padding: 6px 15px;
    display: flex;
    align-items: center;
  }
}
</style>
