import { createApp } from "vue";
import "./style.css";
import router from "./router";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "sweetalert2/dist/sweetalert2.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

createApp(App).use(router).mount("#app");
