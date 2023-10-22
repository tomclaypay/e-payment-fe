<template>
  <div v-if="order">
    <div class="bg-white rounded-[10px] p-5">
      <div
        class="text-center border-b border-solid border-[#005030]/20 font-bold text-base pb-5"
      >
        Thông tin giao dịch
      </div>
      <div class="flex justify-between mt-5">
        <div class="font-medium">Số tiền:</div>
        <div class="text-base font-bold">{{ order.amount | formatPrice }}</div>
      </div>
      <div class="flex justify-between mt-3">
        <div class="font-medium">Mã giao dịch:</div>
        <div class="text-base font-bold">{{ order.orderRef }}</div>
      </div>
      <div class="flex justify-between mt-3">
        <div class="font-medium">Nội dung:</div>
        <div class="text-base font-bold">{{ order.orderCode }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatPrice } from "~/utils/format";
export default {
  filters: { formatPrice },
  props: {
    order: {
      type: Object,
      default: () => {},
    },
  },
};
</script>
