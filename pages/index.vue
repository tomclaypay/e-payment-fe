<template>
  <div v-if="isReady" class="w-full mx-auto max-w-[1000px]">
    <div class="grid grid-cols-1 md:grid-cols-5 gap-5">
      <div class="md:col-span-3 order-2 md:order-1">
        <Transaction :order="order" :bank="bank" />
        <div
          class="bg-[#FFE5CD] rounded-[10px] p-5 mt-5 flex items-center"
          v-if="order.status === 'PENDING'"
        >
          <img src="~/assets/images/front/warning.svg" class="w-6" />
          <div class="text-sm pl-5 flex-1">
            Đảm bảo rằng tài khoản ngân hàng của bạn đã kích hoạt thanh toán
            trực tuyến Internet Banking
          </div>
        </div>
        <div
          class="bg-[#FFE5CD] rounded-[10px] p-5 mt-[10px] flex items-center"
          v-if="order.status === 'PENDING'"
        >
          <img src="~/assets/images/front/warning.svg" class="w-6" />
          <div class="text-sm pl-5 flex-1">
            Không thoát hoặc làm mới trình duyệt trong quá trình thực hiện giao
            dịch
          </div>
        </div>
      </div>
      <div class="md:col-span-2 order-1 md:order-2">
        <OrderInfo :order="order" />
        <CountDown v-if="order.status === 'PENDING'" />
      </div>
    </div>
  </div>
</template>

<script>
import { banks } from "~/constants/banks";
import find from "lodash/find";
import { rsaEncrypt } from "~/utils/crypto";
export default {
  data() {
    return {
      isReady: false,
      order: null,
      bank: null,
    };
  },
  mounted() {
    this.loadOrder();
  },
  methods: {
    async loadOrder() {
      const params = {
        data: rsaEncrypt(process.env.publicKey, {
          ...this.form,
          orderId: this.$route.query.order,
        }),
      };
      try {
        const { data } = await this.$axios.post(
          "internals/h2p/deposit/order-info/",
          params
        );
        if (data) {
          this.order = data;

          this.bank = find(banks, function (bank) {
            return bank.shortName === data.bankShortName;
          });

          this.isReady = true;
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>
