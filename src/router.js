//importamos Vue y Router para poder hacer uso de las funcionalidades del framework

import Vue from "vue";
import Router from "vue-router";

//importamos la vista Home de la carpeta views
import Home from "@/views/Home";
import About from "@/views/About";
import Error from "@/views/Error";
import CoinDetail from "@/views/CoinDetail";

//Vue.use permite incorporar plugins dentro de la instancia de vue, para poder agregar funcionalidades.
Vue.use(Router);

//exportamos una instancia del router
export default new Router({
  //usamos el modo historia de HTML
  mode: "history",
  //las rutas se pasan en un array de objetos
  routes: [
    //cada ruta se compone como minimo de una ubicacion, el nombre de esa ubicación y
    //del componente que carga
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/about",
      name: "about",
      component: About,
    },
    {
      path: "/coin/:id",
      name: "coin-detail",
      component: CoinDetail,
    },
    {
      path: "*",
      name: "error",
      component: Error,
    },
  ],
});
