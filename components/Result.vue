<template>
  <div
    class="container mx-auto mt-[40px] bg-white rounded-lg text-center py-40"
  >
    <div v-if="order.status === 'SUCCEED'" class="text-center">
      <img
        src="~/assets/images/front/success.svg"
        class="block w-[50px] mx-auto"
      />
      <div class="text-base font-bold mt-5 mb-2 text-[#32BEA6]">
        Giao dịch Thành công
      </div>
      <div>Giao dịch đã thành công. Vui lòng kiểm tra tài khoản của bạn</div>
    </div>
    <div v-else class="text-center">
      <base-failed />
      <div class="font-bold mt-5 mb-2 text-[#E21B1B]">Giao dịch bị huỷ</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    order: {
      type: Object,
      default: null,
    },
  },
};
</script>
