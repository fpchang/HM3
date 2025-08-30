<template>
  <view class="createRoomComponent">
    <!-- <uni-forms ref="roomTypeRef" :modelValue="roomForm" :rules="roomTypeRules" label-width="90px">
            <uni-forms-item label="房型名称" required name="name">
                <uni-easyinput v-model="roomForm.name" placeholder="请输入房间名称" />
            </uni-forms-item>
		<view>
			<uv-button type="success" text="保存" color="#007aff" @click="submitForm()" :disabled="submitDisabled"
            :loading="submitLoading"></uv-button>
		</view>
        </uni-forms> -->
		<view class="createRoomComponent-container"> 
    <view class="filter-area">
      <view class="filter-item">
        <uni-data-select
          v-model="room_type_id"
          placeholder="房型选择"
          collection="hm-roomType"
          :where="`hotel_id=='${hotel_id}'`"
          field="name as text, _id as value"
          orderby="name  asc"
        ></uni-data-select>
      </view>
    </view>
    <uni-list v-if="roomList.length">
      <uni-list-item v-for="(item, index) of roomList">
        <template v-slot:header>
          <view style="width: 200px">
            <uni-easyinput
              v-model="item.room_name"
              trim="all"
              :disabled="type == 2"
              :clean="false"
            />
          </view>
        </template>
        <template v-slot:footer>
          <view @click="deleteRoomEvent(index)">
            <l-icon name="iconamoon:trash" size="22px" color="#007aff"></l-icon>
          </view>
        </template>
      </uni-list-item>
    </uni-list>
    <view class="addRoomControl">
      <view @click="addRoomItemEvent" class="btn">
        <view><l-icon name="material-symbols-light:add-circle-outline" size="18px" color="#666"></l-icon></view>
        <view>{{roomList.length?'继续添加':'添加一个'}}</view>
      </view>
    </view>
		<view class="submit-btn-style">
			<uv-button type="success" text="保存" color="#007aff" @click="submit()" :disabled="submitDisabled"
            :loading="submitLoading"  class="submit-btn"></uv-button>
		</view>
		</view>

  </view>
</template>

<script>
import { computed, ref, watch, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import { DB } from "../../../api/DB.js";
import LIcon from '../../../uni_modules/lime-icon/components/l-icon/l-icon.vue';
export default {
  components: {LIcon},
  props:{
	room_type_id:String
  },
  setup(props) {
    const store = useStore();
    let hotel_id = computed(() => {
      return store.state.hotel_id;
    });
    let room_type_id = ref(props.room_type_id);
		const roomType=computed(()=>{		
      return store.state.roomType;   
	});
	const range=computed(()=>{		
        let arr=[{text:"全部",value:""}];
		roomType.value.map(item=>{
			arr.push({text:item.name,value:item._id})
		})
		return arr;
	});
	let roomList=ref([]);
    let where_str = computed(() => {
      if (room_type_id.value == "all") {
        return `hotel_id =='${hotel_id.value}'`;
      }
      return `hotel_id =='${hotel_id.value}'&&_id=='${room_type_id.value}'`;
    });

	let submitLoading=ref(false);
	return{room_type_id,hotel_id,roomType,range,roomList,submitLoading}
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
  mounted(){
	 
  },
   onUnload() {
        console.log("createRoomComponent onulload")
    },
    watch:{
      room_type_id(val,oval){
        if(val&&!oval){
           this.addRoomItemEvent();
        }
      }
    },
  methods: {
    addRoomItemEvent() {
      if(!this.room_type_id){
          return;
      }
      let arr = this.roomList || [];
      arr.push({ hotel_id:this.hotel_id,room_type_id:this.room_type_id, room_name: this.getRoomName(arr) });
    },
    deleteRoomEvent(index) {
      this.roomList.splice(index, 1);
    },
    getRoomName(arr) {
      let targetArr = [...arr];
      let newName = `房间${arr.length + 1}`;
      let ob = arr.find((item) => item.room_name == newName);
      if (!ob) {
        return newName;
      } else {
        targetArr.push("");
        return this.getRoomName(targetArr);
      }
    },
    getRoomList() {},
    async submit() {
      //this.$refs.roomTypeRef.validate().then((res) => {
        this.submitLoading = true;
        
        console.log(this.room_type_id);
      if(!this.room_type_id){
        uni.showToast({
          title: '请选择房型',
          icon: 'none'
        })
        return;
      }
        if(this.roomList.length<1){
        uni.showToast({
          title: '请添加房间',
          icon: 'none'
        })
        return;
      }
     try {
      await DB.callFunction("hm_addRoom",{roomList:this.roomList});
      uni.navigateBack({
            delta: 1, // 返回层数，2则上上页
    success() {
        uni.$emit('update',{msg:'页面更新'})
    }
      });
     } catch (error) {
		 console.error(error)
      uni.showModal({
							content:"系统异常，请稍候再试！",
							confirmText:"确认"
						});
     }
     
    }
  },
};
</script>

<style lang="scss" scoped>
.createRoomComponent{

	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
	.createRoomComponent-container{
	padding:15px;
	box-sizing: border-box;
	min-width: 375px;
	max-width: 450px;
	}
}
.disabled-style {
  color: #a1a1a1;
}

.priceContainer {
  border: 1px solid #eee;
  padding: 8px;
  font-size: 14px;

  .price-list {
    .price-list-item {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;

      .group {
        min-width: 350px;
        display: flex;
        align-items: center;
      }

      .in {
        flex: 1;
        border: 1px solid #eee;
        padding: 4px 8px;
        font-size: 14px;
        color: #777777;
      }
    }
  }
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
    gap:2px;
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
