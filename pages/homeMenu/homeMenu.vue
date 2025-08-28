<template>
  <view class="content">
    <!-- <scroll-view overflow-x="false" overflow-y="true" style="height:100vh"> -->

    <view class="menu-one">
      <view :style="{'height':topHeight}"></view>
      <view class="subtitle">店铺管理</view>
      <view class="item-list">
        <view class="item">
          <navigator url="/pages/hotelManage/roomType/roomType" hover-class="none">
            <view>
              <l-icon name="material-symbols:house-rounded" size="80px" color="#722ED1" />
              <view style="text-align: center">房型管理</view>
            </view>
          </navigator>
        </view>
        <view class="item">
          <navigator url="/pages/hotelManage/employee/employee" hover-class="none">
            <view>
              <l-icon name="ic:baseline-man" size="80px" color="#00B42A" />
              <view style="text-align: center">员工管理</view>
            </view>
          </navigator>
        </view>
        <view class="item item_">
          <navigator :url="`/pages_client/hotelHome/hotelHome?hotel_id=${hotel_id}`" hover-class="none">
            <view>
              <l-icon name="carbon:logo-linkedin" size="110px" color="#f64653" />
              <view style="text-align: center">酒店展示</view>
            </view>
          </navigator>
        </view>
      </view>
    </view>
    <view class="menu-two" v-for="item of menuList">
      <view class="subtitle">{{item.title}}</view>
      <view class="item-list">
        <view class="item" v-for="ite of item.list">
          <navigator :url="ite.href" hover-class="none">
            <view class="item-group">
              <view><l-icon :name="ite.icon" size="50px" :color="ite.iconColor" /></view>
              <view style="text-align: center">{{ite.title}}</view>
            </view>
          </navigator>

        </view>

        <!-- <view class="item">
            <view class="item-group">
              <l-icon name="material-symbols:house-rounded" size="40px" color="#722ED1"/>
              <view style="text-align:center">房型管理</view>
            </view>
          </view> -->
      </view>
    </view>
    <!-- </scroll-view> -->
    <view style="height:30px"></view>
  </view>
</template>

<script lang="ts">
import {ref, computed} from "vue";
import {useStore} from "vuex";
import lIcon from "../../uni_modules/lime-icon/components/l-icon/l-icon.vue";
export default {
  components: {lIcon},
  setup() {
    const store=new useStore();
    let hotel_id=computed(() => {
      return store.state.hotel_id;
    });
    let menuList=computed(() => {
      return [
        // {
        //   title: "业务",
        //   list: [
        //     {
        //       title: "房型管理",
        //       icon: "material-symbols:nest-multi-room",
        //       href: "/pages/hotelManage/roomType/roomType",
        //       iconColor: "#8166fe",
        //     },
        //     {
        //       title: "员工管理",
        //       icon: "clarity:employee-solid",
        //       href: "/pages/hotelManage/employee/employee",
        //       iconColor: "#88d188",
        //     },
        //     // {
        //     //   title: "餐饮管理",
        //     //   icon: "bx:bxs-food-menu",
        //     //   href: "/pages/doubleColorBall/doubleColorBall",
        //     //   iconColor:"#0765ae"
        //     // }
        //   ],
        // },
        // {
        //   title: "推广",
        //   list: [
        //     {
        //       title: "酒店展示",
        //       icon: "ri:hotel-fill",
        //       href: `/pages_client/hotelHome/hotelHome?hotel_id=${hotel_id.value}`,
        //       iconColor: "#ff4534",
        //     },
        //   ],
        // },
        {
          title: "财务",
          list: [
            {
              title: "收入管理",
              icon: "ri:money-cny-circle-fill",
              href: "/pages/financialManagement/income/income",
              iconColor: "gold",
            },
            {
              title: "支出管理",
              icon: "material-symbols:finance-chip",
              href: "/pages/financialManagement/expenses/expenses",
              iconColor: "#165DFF",
            },
            {
              title: "财务统计",
              icon: "material-symbols:bar-chart-4-bars-rounded",
              href: "/pages/financialManagement/fmChart/fmChart",
              iconColor: "#f64653",
            }
          ],
        }, {
          title: "订单",
          list: [
            {
              title: "订单管理",
              icon: "solar:reorder-bold",
              href: "/pages/order/orderIndex/orderIndex",
              iconColor: "gold",
            },
            {
              title: "添加订单",
              icon: "solar:add-circle-bold",
              href: "/pages/order/createOrder/createOrder",
              iconColor: "#165DFF",
            }
          ],
        }
      ];
    });

    let hotelList=computed(() => {
      return store.state.hotelList;
    });

			let topHeight=computed(()=>{
				return store.state.topHeight;
			});
    return {hotelList, hotel_id, menuList,topHeight};
  },
  data() {
    return {
      title: "Hello",
    };
  },
  created() {
    // let hotel = this.hotelList.find(item=>{return item._id = this.hotel_id});
    //this.$store.commit("hotelClientStore/updateHotel", hotel);
    // console.log(hotel);
  },
  onLoad() {},
  methods: {
    openHotel() {
      //	this.isLoading = true;
      let hotel=this.hotelList.find((item) => {
        item._id=this.hotel_id;
      });
      //this.$store.commit("hotelClientStore/updateHotel", hotel);
      //this.$store.commit("hotelClientStore/updateSearchCondition",this.conditionForm);
      let href=`#/pages_client/hotelHome/hotelHome`;
      console.log(hotel);
      uni.navigateTo({
        url: `/pages_client/hotelHome/hotelHome`,
        complete: () => {
          this.isLoading=false;
        },
      });
    },
  },
};
</script>

<style lang="scss">
.menu-one {
  /*background: linear-gradient(to bottom, #0765ae, #9ec3fa);*/
  background-image: linear-gradient(162deg, #0765ae, #0765ae, #0765ae7a);
  border-bottom-left-radius: 18px;
  border-bottom-right-radius: 18px;
  padding-bottom: 40px;

  .subtitle {
    color: #fff;
    padding: 25px;
    font-weight: bold;
  }

  .item-list {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 30px;

    .item {
      /* width: 150px;
    height: 175px;*/
      padding: 20px 30px;
      background: #e1eafd;
      border-radius: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #1d2129;
      font-weight: 500;
    }

    .item_ {
      /*width: 205px;
    height: 225px;*/
    }
  }
}

.menu-two {
  overflow: hidden;

  .subtitle {
    color: #1d2129;
    padding: 25px;
    font-weight: bold;
  }

  .item-list {
    display: flex;
    /* justify-content: space-around;*/
    flex-wrap: wrap;
    gap: 10px;
    padding: 0 30px;

    .item {
      width: 98px;
      height: 120px;
      background-color: #fffffd;
      border-radius: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #1d2129;
      font-weight: 500;

      .item-group {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }
  }
}

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
      padding-top: 10px;
    }
  }
}
</style>
