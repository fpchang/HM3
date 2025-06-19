<template>
  <view class="content">
    <scroll-view overflow-x="false" overflow-y="true">
      <xt-panal-list :count="menuList.length">
        <!-- #ifdef MP -->
        <view v-for="(item, index) of menuList" slot="card{{index}}">
                <view class="h">{{ item.title }}</view>
                    <view class="li">
                      <view class="menu-list">
                        <view v-for="it of item.list">
                          <navigator :url="it.href" hover-class="navigator-hover">
                            <view class="menu-item">
                                <view class="flex-center"><l-icon :name="it.icon" size="30px" :color="it.iconColor"></l-icon></view>
                   
                              <text class="tx">{{ it.title }}</text>
                            </view>
                          </navigator>
                        </view>
                      </view>
                    </view>
        </view>
        <!-- #endif -->
        <!-- #ifdef H5 || APP-PLUS -->
        <template v-for="(item, index) of menuList" v-slot:[`card${index}`]>
          <view class="h">{{ item.title }}</view>
          <view class="li">
            <view class="menu-list">
              <view v-for="it of item.list">
                <navigator :url="it.href" hover-class="navigator-hover">
                  <view class="menu-item">
                    <view class="flex-center"><l-icon :name="it.icon" size="30px" :color="it.iconColor"></l-icon></view>
                    <text class="tx">{{ it.title }}</text>
                  </view>
                </navigator>
              </view>
            </view>
          </view>
        </template>
        <!-- #endif -->
      </xt-panal-list>
    </scroll-view>
  </view>
</template>

<script lang="ts">
import { ref,computed } from "vue";
import {useStore} from "vuex";
export default {
  setup() {
    const store = new useStore();
    let hotel_id = computed(()=>{
      return store.state.hotel_id;
    });
    console.log("88888",hotel_id.value)
    let menuList = computed(()=>{
      return [
      {
        title: "业务",
        list: [
          {
            title: "房型管理",
            icon: "material-symbols:nest-multi-room",
            href: "/pages/hotelManage/roomType/roomType",
            iconColor:"#8166fe"
          },
          {
            title: "员工管理",
            icon: "clarity:employee-solid",
            href: "/pages/hotelManage/employee/employee",
            iconColor:"#88d188"
          }
		  // {
		  //   title: "餐饮管理",
		  //   icon: "bx:bxs-food-menu",
		  //   href: "/pages/doubleColorBall/doubleColorBall",
      //   iconColor:"#0765ae"
		  // }
        ],
      },
       {
        title: "推广",
        list: [
          {
            title: "酒店展示",
            icon: "ri:hotel-fill",
            href: `/pages_client/hotelHome/hotelHome?hotel_id=${hotel_id.value}`,
            iconColor:"#ff4534"
          }
        ],
      },
      {
        title: "财务",
        list: [
          {
            title: "收入管理",
            icon: "healthicons:low-income-level",
            href: "/pages/financialManagement/income/income",
            iconColor:"gold"
          },
           {
            title: "支出管理",
            icon: "icon-park:expenses-one",
            href: "/pages/financialManagement/expenses/expenses",
            iconColor:"#000"
          }
        ],
      }
    ]
    })
    
    
      let hotelList = computed(()=>{
        return store.state.hotelList;
      });
    

    return {hotelList,hotel_id, menuList };
  },
  data() {
    return {
      title: "Hello",
    };
  },
  created(){
    // let hotel = this.hotelList.find(item=>{return item._id = this.hotel_id});
				//this.$store.commit("hotelClientStore/updateHotel", hotel);
       // console.log(hotel);
  },
  onLoad() {
 
		
  },
  methods: {
    openHotel() {
			//	this.isLoading = true;
        let hotel = this.hotelList.find(item=>{item._id = this.hotel_id});
				//this.$store.commit("hotelClientStore/updateHotel", hotel);
				//this.$store.commit("hotelClientStore/updateSearchCondition",this.conditionForm);				
				let href = `#/pages_client/hotelHome/hotelHome`;
        console.log(hotel);
				uni.navigateTo({
					url: `/pages_client/hotelHome/hotelHome`,
					complete: () => {
						this.isLoading = false;
					}
				})
			}
  },
};
</script>

<style lang="scss">
.h {
  font-size: 25px;
  padding: 10px 20px;
}

.menu-list {
  display: flex;
  gap: 10px;

  .menu-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 10px 10px;

    .tx {
      text-align: center;
      font-size: 14px;
      color: #a1a1a1;
      padding-top:10px;
    }
  }
}
</style>
