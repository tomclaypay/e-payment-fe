<template>
  <div class="mx-auto max-w-[1000px] w-full" v-if="isReady">
    <div class="grid grid-cols-1 md:grid-cols-5 gap-5">
      <div class="md:col-span-3 order-2 md:order-1">
        <div class="rounded-[10px] bg-white p-16">
          <div class="text-xl font-bold mb-6">Chọn hình thức thanh toán:</div>
          <div
            v-for="method in methods"
            :key="method.name"
            class="rounded flex items-center justify-between bg-[#ECF1FF] py-4 px-5 gap-3 mb-4 cursor-pointer"
            @click="onRedirect(method.router)"
          >
            <img :src="method.icon" class="w-8" />
            <div class="flex-1">
              <div class="text-base font-semibold">
                {{ method.title }}
              </div>
              <div class="text-xs leading-7">
                {{ method.subtitle }}
              </div>
            </div>
            <i class="el el-icon-arrow-right"></i>
          </div>
        </div>
        <div
          class="bg-[#FFE5CD] rounded-[10px] p-5 mt-[10px] flex items-center"
        >
          <img src="~/assets/images/front/warning.svg" class="w-6" />
          <div class="text-sm pl-5">
            Không thoát hoặc làm mới trình duyệt trong quá trình thực hiện giao
            dịch
          </div>
        </div>
      </div>
      <div class="md:col-span-2 order-1 md:order-2">
        <OrderInfo :order="order" />
      </div>
    </div>
  </div>
</template>

<script>
import { rsaEncrypt } from "~/utils/crypto";
export default {
  data() {
    return {
      isReady: false,
      order: null,
      methods: [
        {
          name: "qr",
          title: "Quét Mã QR/Chuyển khoản ngân hàng",
          subtitle: "Quét Mã QR trên điện thoại di động",
          router: "qr",
          icon: require("~/assets/images/front/qr.svg"),
        },
        {
          name: "internet-banking",
          title: "Internet Banking",
          subtitle: "Chuyển khoản qua tài khoản internet banking",
          router: "internet-banking",
          icon: require("~/assets/images/front/internet-banking.svg"),
        },
        {
          name: "visa",
          title: "Thẻ quốc tế Visa, Master, JCB",
          subtitle: "Coming soon",
          icon: require("~/assets/images/front/visa.svg"),
        },
      ],
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
          "internals/order-info/",
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
    async onRedirect(router) {
      if (router) {
        this.$router.push({
          name: router,
          query: { order: this.$route.query.order },
        });
      }
    },
  },
};
</script>
