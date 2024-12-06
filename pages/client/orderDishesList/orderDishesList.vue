<template>
  <view>
    <block v-if="orderList && orderList.length < 1">
      <noData text_content="没有订单数据"></noData>
    </block>
    <block v-if="orderList.length">
      <scroll-view
        style="height: calc(100vh - 84px)"
        scroll-x="false"
        scroll-y="true"
      >
        <xt-panal-list :dataList="orderList">
          <!-- #ifdef MP -->
          <view v-for="(item, index) of orderList" slot="card{{index}}">
			<view class="cart-area">
				<view class="card-nav">
				  <view class="card-nav-item">
					<view class="tit"><text>就餐日期:</text></view>
					<view style="flex: 1" class="text-overflow-ellipsis"
					  ><text class="add-text-style">{{
						item.mealDate
					  }}</text></view
					>
				  </view>
				</view>
  
				<view class="menu-detail-content">
				  <view
					class="menu-detail-content-item"
					v-for="it of item.checkMenuList"
				  >
					<text class="itx-n"
					  >{{ it.name
					  }}<text v-if="it.checkCount > 1"
						>（{{ it.checkCount }}）</text
					  ></text
					>
					<view style="display: flex">
					  <text class="itx-p">￥{{ it.price * it.checkCount }} </text>
  
					  <view class="icon-area"> </view>
					</view>
				  </view>
				</view>
				<view class="card-bottom">
				  <view class="priceTotal">
					<text style="font-weight: bold">总价:</text>
					<text style="color: #ff0000; padding: 0 8px"
					  >￥{{ totalPrice(item.checkMenuList) }}</text
					></view
				  >
				</view>
				<view class="actions">
				  <view class="action-list"> 
					  <view class="actions-item"> 
						  <uni-icons type="plus-filled" size="13px"></uni-icons><text>加菜</text>
					  </view>
					  <view class="actions-item"> 
						  <uni-icons type="trash-filled" size="13px"></uni-icons><text>撤销</text>
					  </view>
				  </view>
				  
				</view>
			  </view>
          </view>
          <!--#endif-->
          <!-- #ifdef H5 || APP-PLUS -->
          <template v-for="(item, index) of orderList" v-slot:[`card${index}`]>
            <view class="cart-area">
              <view class="card-nav">
                <view class="card-nav-item">
                  <view class="tit"><text>就餐日期:</text></view>
                  <view style="flex: 1" class="text-overflow-ellipsis"
                    ><text class="add-text-style">{{
                      item.mealDate
                    }}</text></view
                  >
                </view>
              </view>

              <view class="menu-detail-content">
                <view
                  class="menu-detail-content-item"
                  v-for="it of item.checkMenuList"
                >
                  <text class="itx-n"
                    >{{ it.name
                    }}<text v-if="it.checkCount > 1"
                      >（{{ it.checkCount }}）</text
                    ></text
                  >
                  <view style="display: flex">
                    <text class="itx-p">￥{{ it.price * it.checkCount }} </text>

                    <view class="icon-area"> </view>
                  </view>
                </view>
              </view>
              <view class="card-bottom">
                <view class="priceTotal">
                  <text style="font-weight: bold">总价:</text>
                  <text style="color: #ff0000; padding: 0 8px"
                    >￥{{ totalPrice(item.checkMenuList) }}</text
                  ></view
                >
              </view>
			  <view class="actions">
				<view class="action-list"> 
					<view class="actions-item"> 
						<uni-icons type="plus-filled" size="13px"></uni-icons><text>加菜</text>
					</view>
					<view class="actions-item"> 
						<uni-icons type="trash-filled" size="13px"></uni-icons><text>撤销</text>
					</view>
				</view>
				
			  </view>
            </view>

			
          </template>
          <!--#endif-->
        </xt-panal-list>
      </scroll-view>
    </block>
  </view>
</template>

<script>
import { MenuService } from "../../../services/MenuService";
import uniIcons from '../../../uni_modules/uni-icons/components/uni-icons/uni-icons.vue';
export default {
  components: { uniIcons },
  data() {
    return {
      orderList: null,
      hotel_id: "",
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  watch: {
    user(obj) {
      this.getOrderDishesList();
    },
  },
  async onLoad(params) {
    console.log("参数", params);
    this.hotel_id = params.hotel_id;
    if (this.hotel_id) {
      await this.getOrderDishesList();
    }
  },
  mounted() {},
  methods: {
    totalPrice(list) {
      let totalprice = 0;
      try {
        list.map((item) => {
          totalprice += item.price * item.checkCount;
        });
        return totalprice;
      } catch (error) {
        return 0;
      }
    },
    async getOrderDishesList() {
      console.log("参数", this.hotel_id, this.user.phone);
      const res = await MenuService.getOrderDishesListByCondition({
        hotel_id: this.hotel_id,
        phone: this.user.phone,
      });
      console.log("请求orderdishes", res);
      this.orderList = res.result.data;
    },
  },
};
</script>

<style lang="scss" scoped>
.cart-area {
  padding: 15px 15px 0 15px;
  color: #a1a1a1;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
.actions{
	display: flex;
	align-items: flex-end;
	.action-list{
		border-top:2px solid #f7f7f7;
		display: flex;
		justify-content: space-around;
		align-items: center;
		font-size: 13px;
		padding:15px;
		.actions-item{
			padding:0 20px;
		}
	}

}

}

.card-nav {
  .card-nav-item {
    height: 30px;
    display: flex;
    align-items: center;
    font-size: $uni-font-size-base;

    .tit {
      min-width: 60px;
      padding-right: 12px;
    }

    .add-text-style {
      color: $font-color-control;

      &:hover {
        color: $font-color-control-hover;
      }
    }

    .phone-style {
      color: $font-color-control;

      &:hover {
        color: $font-color-control-hover;
      }
    }
  }
}

.menu-detail-content {
  .menu-detail-content-item {
    padding: 8px 0;
    display: flex;
    justify-content: space-between;
    color: #a1a1a1;
    align-items: center;
    min-height: 35px;
    font-size: $uni-font-size-base;
    box-sizing: border-box;
    border-bottom: 1px dotted #bbbbbb47;

    .edit-style {
      color: $font-color-control;
      font-size: $uni-font-size-sm;
    }

    .itx-p {
      color: #ff0000;
    }

    /**&:nth-child(odd){
		
		  padding-right: 20px;
		
	  };
	  &:nth-child(even){
		
		  padding-left: 20px;
		
	  };**/
  }
}

.card-bottom {
  flex: 1;
  display: flex;
  align-items: end;

  .priceTotal {
    flex: 1;
    padding: 10px 0;
    display: flex;
    justify-content: end;
  }
}
</style>
