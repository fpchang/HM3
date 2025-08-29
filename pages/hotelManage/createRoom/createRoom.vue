<template>
  <view>
    <createRoomComponent v-if="room_type_id!=null" :room_type_id="room_type_id"></createRoomComponent>
  </view>
</template>

<script>
import { computed, ref, watch, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import createRoomComponent from "../components/createRoomComponent";
export default {
  components: { createRoomComponent },

  data() {
    return {
      room_type_id: null,
    };
  },
  onLoad(obj) {
    console.log("参数传递", obj);
    try {
      this.room_type_id = obj.room_type_id;
    } catch (error) {
      this.room_type_id = "";
    }
  },
  methods: {},
};
</script>

<style></style>
