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
      <div>
        Để biết thêm chi tiết, quý khách vui lòng liên hệ với trung tâm hỗ trợ
      </div>
    </div>
    <div v-if="result?.status === 'ERROR'" class="text-center">
      <base-failed />
      <div class="font-bold mt-5 mb-2">Giao dịch không thành công</div>
      <div>{{ result?.error }}</div>

      <ButtonReload />
    </div>
    <div class="mt-20" v-if="redirectUrl">
      <a
        :href="redirectUrl"
        class="bg-[#1e427e] block rounded w-80 mx-auto py-2 text-white uppercase text-center"
      >
        Chuyển hướng ngay
      </a>
      <div class="text-center italic text-xs mt-2">
        Hệ thống sẽ tự động chuyển hướng sau {{ timer }}s!
      </div>
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
  data() {
    return {
      timer: 10,
    };
  },
  mounted() {
    if (this.redirectUrl) {
      const interval = setInterval(() => {
        if (this.timer === 0) window.location.href = this.redirectUrl;
        else this.timer -= 1;
      }, 1000);
    }
  },
  computed: {
    redirectUrl() {
      let redirectUrl = null;
      if (this.result?.status === "SUCCEED" && this.result?.returnUrl) {
        redirectUrl = this.result?.returnUrl;
      }
      if (
        ["CANCELED", "FAILED"].includes(this.result?.status) &&
        this.result?.cancelUrl
      ) {
        redirectUrl = this.result?.cancelUrl;
      }

      return redirectUrl;
    },
  },
};
</script>
