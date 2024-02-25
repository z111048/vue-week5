import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

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
  whtch: {
    tempProduct() {
      this.qty = 1;
    },
  },
  template: "#userProductModal",
  mounted() {
    this.productModal = new bootstrap.Modal(this.$refs.modal);
  },
};

const app = createApp({
  data() {
    return {
      products: [],
      cart: {},
      tempProduct: {},
      status: {
        addCartLoding: "",
        cartQtyLoding: "",
      },
      carts: {},
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
  },
  components: {
    userModal,
  },
  mounted() {
    this.getProducts();
    this.getCart();
  },
});

app.mount("#app");
