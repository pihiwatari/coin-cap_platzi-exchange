<template>
  <main>
    <!--3.- Lo agregamos a nuestro html. Vue importa los componentes en el html usando kebab-case, asi completa las etiquetas -->
    <px-header :links="links" />
    <!-- router-view, nos permite reemplazar el html segun cambia la url -->
    <router-view
      class="container px-5 sm:px-20 py-20 flex justify-center flex-wrap"
    />
  </main>
</template>

<script>
//1.- Importamos el componente dentro de nuestro script
import PxHeader from "@/components/PxHeader";

export default {
  name: "App",
  //2.- Asignarlo dentro de components.
  components: { PxHeader },

  data() {
    return {
      links: [
        {
          name: "BTC",
          url: { name: "coin-detail", params: { id: "bitcoin" } },
        },
        {
          name: "ETH",
          url: { name: "coin-detail", params: { id: "ethereum" } },
        },
        {
          name: "XRP",
          url: { name: "coin-detail", params: { id: "ripple" } },
        },
      ],
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
