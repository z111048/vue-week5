const apiUrl = "https://vue3-course-api.hexschool.io/v2/";
const apiPath = "james9527";

const userModal = {
  props: ["tempProduct", "addToCard"],
  data() {
    return {
      productModal: null,
      qty: 1,
    };
  },
  methods: {
    open() {
      this.productModal.show();
    },
    close() {
      this.productModal.hide();
    },
  },
  watch: {
    tempProduct() {
      this.qty = 1;
    },
  },
  template: "#userProductModal",
  mounted() {
    this.productModal = new bootstrap.Modal(this.$refs.modal);
  },
};

const app = Vue.createApp({
  data() {
    return {
      products: [],
      cart: {},
      tempProduct: {},
      status: {
        addCartLoding: "",
        cartQtyLoding: "",
        cartDelLoding: "",
      },
      carts: {},
      form: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: "",
        },
        message: "",
      },
    };
  },
  methods: {
    getProducts() {
      const api = `${apiUrl}api/${apiPath}/products/all`;
      axios
        .get(api)
        .then((res) => {
          // console.log(res);
          this.products = res.data.products;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    addToCard(product_id, qty = 1) {
      const api = `${apiUrl}api/${apiPath}/cart`;
      const order = {
        product_id,
        qty,
      };
      this.status.addCartLoding = product_id;
      console.log(order);
      axios
        .post(api, { data: order })
        .then((res) => {
          this.status.addCartLoding = "";
          this.getCart();
          this.$refs.userModal.close();
          console.log(res);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    openModal(product) {
      this.tempProduct = product;
      this.$refs.userModal.open();
    },
    changeCartQty(item, qty = 1) {
      const api = `${apiUrl}api/${apiPath}/cart/${item.id}`;
      const order = {
        product_id: item.product_id,
        qty,
      };
      this.status.cartQtyLoding = item.id;
      console.log(order);
      axios
        .put(api, { data: order })
        .then((res) => {
          // console.log(res);
          this.status.cartQtyLoding = "";
          this.getCart();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    removeCarItem(id) {
      const api = `${apiUrl}api/${apiPath}/cart/${id}`;
      this.status.cartQtyLoding = id;
      axios
        .delete(api)
        .then((res) => {
          // console.log(res);
          this.status.cartQtyLoding = "";
          this.getCart();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    removeCarAll() {
      const api = `${apiUrl}api/${apiPath}/carts`;
      this.status.cartDelLoding = "true";
      axios
        .delete(api)
        .then((res) => {
          // console.log(res);
          this.status.cartDelLoding = "";
          this.getCart();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    getCart() {
      const api = `${apiUrl}api/${apiPath}/cart`;
      axios
        .get(api)
        .then((res) => {
          // console.log(res);
          this.carts = res.data.data;
          // console.log(this.carts);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    createOrder() {
      const url = `${apiUrl}/api/${apiPath}/order`;
      const order = this.form;
      console.log(order);
      axios
        .post(url, { data: order })
        .then((res) => {
          alert(res.data.message);
          this.$refs.form.resetForm();
          this.form.message = "";
          this.getCart();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
  },
  components: {
    userModal,
  },
  mounted() {
    this.getProducts();
    this.getCart();
  },
});

// 表單驗證元件
app.component("VForm", VeeValidate.Form);
app.component("VField", VeeValidate.Field);
app.component("ErrorMessage", VeeValidate.ErrorMessage);

VeeValidate.defineRule("email", VeeValidateRules["email"]);
VeeValidate.defineRule("required", VeeValidateRules["required"]);

// 全部加入
Object.keys(VeeValidateRules).forEach((rule) => {
  if (rule !== "default") {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});

// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL("./zh_TW.json");

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize("zh_TW"),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

app.mount("#app");
