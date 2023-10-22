<template>
  <div class="pt-10">
    <div v-if="result?.status === 'SUCCEED'" class="text-center">
      <base-successful />
      <div class="font-bold text-base mt-5 mb-2">Giao dịch thành công</div>
      <div>
        Giao dịch đã được thực hiện thành công, vui lòng kiểm tra lại tài khoản
        của bạn
      </div>
    </div>
    <div v-if="result?.status === 'CANCELED'" class="text-center">
      <base-failed />
      <div class="font-bold mt-5 mb-2">Giao dịch đã bị huỷ</div>
    </div>
    <div v-if="result?.status === 'ERROR'" class="text-center">
      <base-failed />
      <div class="font-bold mt-5 mb-2">Giao dịch không thành công</div>
      <div>{{ result?.error }}</div>

      <ButtonReload />
    </div>
  </div>
</template>

<script>
export default {
  name: "Step4",
  props: {
    result: {
      type: Object,
      default: () => {},
    },
  },
};
</script>
