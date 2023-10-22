<template>
  <div v-if="order" class="mx-auto max-w-[1000px] w-full pb-20">
    <div v-if="order.status === 'PENDING'">
      <div class="px-5 pb-10 bg-white mt-5 rounded-lg">
        <div
          class="border-b border-solid border-[#005030]/20 flex h-16 items-center justify-between mb-5"
        >
          <div class="text-black text-xl font-bold flex-1">
            Thanh toán bằng quét Mã QR/Chuyển khoản
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <div class="font-bold text-base text-center">Quét mã QR</div>
            <div
              class="border-b border-solid border-black w-16 mx-auto mb-10 mt-1"
            ></div>

            <div class="w-[300px] mx-auto p-5 bg-[#F2F0F0] rounded-[5px]">
              <img
                :src="`https://img.vietqr.io/image/${order.bank.shortName}-${order.bank.accountNumber}-qr_only.jpg?addInfo=${order.orderCode}&amount=${order.amount}`"
                class="w-full rounded-[5px]"
              />
            </div>
          </div>
          <div>
            <div class="font-bold text-base text-center">
              Chuyển khoản nhanh 24/7
            </div>
            <div
              class="border-b border-solid border-black w-[200px] mx-auto mb-10 mt-1"
            ></div>
            <label class="text-xs font-medium text-[#7C7C87] mt-5 block">
              Ngân hàng:
            </label>
            <div
              class="flex justify-between border-0 border-b border-solid border-[#F2F2F2] pb-1 items-center"
            >
              <div>
                {{ order.bank.name + " - " + order.bank.shortName }}
              </div>
            </div>
            <label class="text-xs font-medium text-[#7C7C87] mt-5 block">
              Người nhận:
            </label>
            <div
              class="flex justify-between border-0 border-b border-solid border-[#F2F2F2] pb-1 items-center"
            >
              <div>
                {{ order.bank.accountName }}
              </div>
              <div
                class="bg-[#F5F8FA] text-[#3554D1] cursor-pointer px-5 py-2 text-xs rounded"
                @click="copyText(order.bank.accountName)"
                variant="outline-primary"
              >
                Sao chép
              </div>
            </div>

            <label class="text-xs font-medium text-[#7C7C87] mt-5 block">
              Số tài khoản:
            </label>
            <div
              class="flex justify-between border-0 border-b border-solid border-[#F2F2F2] pb-1 items-center"
            >
              <div>
                {{ order.bank.accountNumber }}
              </div>
              <div
                class="bg-[#F5F8FA] text-[#3554D1] cursor-pointer px-5 py-2 text-xs rounded"
                @click="copyText(order.bank.accountNumber)"
                variant="outline-primary"
              >
                Sao chép
              </div>
            </div>

            <label class="text-xs font-medium text-[#7C7C87] mt-5 block">
              Số tiền:
            </label>
            <div
              class="flex justify-between border-0 border-b border-solid border-[#F2F2F2] pb-1 items-center"
            >
              <div>
                {{ order.amount | formatPrice }}
              </div>
              <div
                class="bg-[#F5F8FA] text-[#3554D1] cursor-pointer px-5 py-2 text-xs rounded"
                @click="copyText(order.amount)"
                variant="outline-primary"
              >
                Sao chép
              </div>
            </div>

            <label class="text-xs font-medium text-[#7C7C87] mt-5 block">
              Nội dung chuyển khoản:
            </label>
            <div
              class="flex text-[#D0600F] justify-between border-0 border-b border-solid border-[#F2F2F2] pb-1 items-center font-bold"
            >
              <div>
                {{ order.orderCode }}
              </div>
              <div
                class="bg-[#F5F8FA] text-[#3554D1] cursor-pointer px-5 py-2 text-xs rounded"
                @click="copyText(order.orderCode)"
                variant="outline-primary"
              >
                Sao chép
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
        <div class="bg-white drop-shadow-md p-5 rounded-md">
          <div
            class="flex items-center text-[20px] font-bold mb-5 text-[#192760]"
          >
            <img src="~/assets/images/front/list-alt.svg" class="mr-3 h-6" />
            Hướng dẫn quét QR
          </div>
          <ul class="list-decimal pl-6">
            <li>Mở ứng dụng ngân hàng hỗ trợ quét QR trên điện thoại.</li>
            <li>Chọn tính năng quét mã QR.</li>
            <li>Quét mã QR trên để thanh toán.</li>
          </ul>
        </div>
        <div class="bg-white drop-shadow-md p-5 text-[#D0600F] rounded-md">
          <div class="flex items-center text-[20px] font-bold mb-5">
            <img src="~/assets/images/front/warning-2.svg" class="mr-3 h-6" />
            Chú ý khi chuyển khoản
          </div>
          <ul class="pl-6 list-decimal">
            <li>Ghi đúng nội dung chuyển khoản</li>
            <li>Không ghi thêm các nội dung khác</li>
            <li>
              Hệ thống sẽ không chịu trách nhiệm nếu có sự sai sót từ phía người
              gửi, như: Sai số tài khoản, Nội dung chuyển khoản không đúng.
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-5 gap-5">
      <div class="md:col-span-3 order-2 md:order-1">
        <div
          class="bg-white rounded-[10px] min-h-[500px] pb-5 px-5 md:px-8 lg:px-10"
        >
          <Step4 :result="order" />
        </div>
      </div>
      <div class="md:col-span-2 order-1 md:order-2">
        <OrderInfo :order="order" />
      </div>
    </div>
  </div>
</template>

<script>
import find from "lodash/find";
import { formatPrice } from "~/utils/format";
import Step4 from "../components/Step4.vue";
import { rsaEncrypt } from "~/utils/crypto";

export default {
  components: { Step4 },
  filters: { formatPrice },
  data() {
    return {
      order: null,
    };
  },
  mounted() {
    this.loadOrder();
  },
  methods: {
    async loadOrder() {
      const params = {
        data: rsaEncrypt(process.env.publicKey, {
          orderId: this.$route.query.order,
        }),
      };
      try {
        const { data } = await this.$axios.post(
          "internals/bank/deposit/order-info/",
          params
        );
        if (data) {
          this.order = data;
        }
        this.isReady = true;
      } catch (e) {
        console.log(e);
      }
    },
    copyText(text) {
      navigator.clipboard.writeText(text);
      this.$notify({
        message: "Copied!",
        type: "success",
        duration: 3000,
        customClass: "qr-notification",
      });
    },
    goHome() {
      this.$router.push("/?order=" + this.$route.query.order);
    },
  },
};
</script>

<style lang="scss">
.qr-notification {
  .el-notification__content {
    margin-top: 0px;
  }
}
</style>
