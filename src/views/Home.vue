// Dentro de template colocamos la tabla de assets

<template>
  <div>
    <!-- Basado en libreria VueSpinners -->
    <bounce-loader :loading="isLoading" color="#68D391" :size="100" />
    <!--  -->
    <px-assets-table v-if="!isLoading" :assets="assets" />
  </div>
</template>

<script>
import api from "@/api";
import PxAssetsTable from "@/components/PxAssetsTable";

export default {
  name: "Home",
  components: {
    PxAssetsTable,
  },

  data() {
    return {
      isLoading: false,
      assets: [],
    };
  },

  //Asociamos la ejecución de la API usando el estado 'created', que
  //cuando se crea un componente
  created() {
    this.isLoading = true;
    api
      .getAssets()
      .then((assets) => (this.assets = assets))
      .finally(() => (this.isLoading = false));
  },
};
</script>
