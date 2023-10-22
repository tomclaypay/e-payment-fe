<template>
  <div class="pt-10">
    <div v-if="!error">
      <base-loading />
      <div class="text-center text-base font-medium">
        Đang xử lý giao dịch, vui vòng chờ trong giây lát
      </div>
    </div>
    <div v-else class="text-center">
      <base-failed />
      <div class="font-bold text-base mt-5 mb-2">Giao dịch lỗi</div>
      <div>{{ error }}</div>
    </div>
  </div>
</template>

<script>
import { rsaEncrypt } from "~/utils/crypto";
export default {
  name: "Step2",
  data() {
    return {
      error: null,
    };
  },
  mounted() {
    this.processing();
  },

  methods: {
    async processing() {
      try {
        const params = {
          data: rsaEncrypt(process.env.publicKey, {
            orderId: this.$route.query.order,
          }),
        };
        const res = await this.$axios.post("internals/process", params);
        if (res.data && res.data.otpProcessType) {
          this.$emit("onSuccess", res.data);
          this.$nuxt.$emit("change-active-tab", 2);
        }
      } catch (e) {
        if (e.response?.data?.message) {
          this.error = e.response.data.message;
        }
      }
    },
  },
};
</script>
