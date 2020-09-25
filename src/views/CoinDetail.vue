<template>
  <div class="flex-col">
    <div class="flex justify-center">
      <bounce-loader :loading="isLoading" color="#68D391" :size="100" />
    </div>

    <template v-if="!isLoading">
      <div class="flex flex-col sm:flex-row justify-around items-center">
        <div class="flex flex-col items-center">
          <img
            :src="
              `https://static.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`
            "
            class="w-20 h-20 mr-5"
            :alt="asset.name"
          />
          <h1 class="text-5xl">
            {{ asset.name }}
            <small class="sm:mr-2 text-gray-500">{{ asset.symbol }}</small>
          </h1>
        </div>

        <div class="my-10 flex flex-col">
          <ul>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Ranking</b>
              <span>#{{ asset.rank }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio actual</b>
              <span>{{ asset.priceUsd | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio más bajo</b>
              <span>{{ min }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio más alto</b>
              <span>{{ max }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio Promedio</b>
              <span>{{ avg }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Variación 24hs</b>
              <span>{{ asset.changePercent24Hr | percent }}</span>
            </li>
          </ul>
        </div>

        <div class="my-10 sm:mt-0 flex flex-col justify-center text-center">
          <button
            @click="toggleConverter"
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            {{ fromUsd ? `USD a ${asset.symbol}` : `${asset.symbol} a USD` }}
          </button>

          <div class="flex flex-row my-5">
            <label class="w-full" for="convertValue">
              <input
                v-model="convertValue"
                :placeholder="`Valor en ${fromUsd ? 'USD' : asset.symbol}`"
                id="convertValue"
                type="number"
                class="text-center bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
              />
            </label>
          </div>

          <span class="text-xl">
            <!-- Realizamos etiquetas dinamicas en el span, basado en la propiedad fromUsd -->
            {{ convertResult }} {{ fromUsd ? asset.symbol : "USD" }}</span
          >
        </div>
      </div>
      <!-- mapeamos la fecha y parseamos el valor del precio en USD, limitando a 2
      decimales, h.date lo obtenemos de api.getAssetHistory-->
      <line-chart
        class="my-10"
        :colors="['orange']"
        :min="min"
        :max="max"
        :data="history.map((h) => [h.date, parseFloat(h.priceUsd).toFixed(2)])"
      />

      <h3 class="text-xl my-10">Mejores Ofertas de Cambio</h3>
      <table>
        <tr
          v-for="m in markets"
          :key="`${m.exchangeId} - ${m.priceUsd}`"
          class="border-b"
        >
          <td>
            <b>{{ m.exchangeId }}</b>
          </td>
          <td>{{ m.priceUsd | dollar }}</td>
          <td>{{ m.baseSymbol }} / {{ m.quoteSymbol }}</td>
          <td>
            <px-button
              :is-loading="m.isLoading || false"
              v-if="!m.url"
              @custom-click="getWebsite(m)"
            >
              <slot>Obtener Link</slot>
            </px-button>
            <a v-else class="hover:underline text-green-600" target="_blanck">{{
              m.url
            }}</a>
          </td>
        </tr>
      </table>
    </template>
  </div>
</template>

<style scoped>
td {
  padding: 10px;
}
</style>

<script>
import PxButton from "@/components/PxButton";
import api from "@/api";

export default {
  name: "CoinDetail",

  components: { PxButton },

  data() {
    return {
      isLoading: false,
      asset: {},
      history: [],
      markets: [],
      fromUsd: true,
      convertValue: null,
    };
  },

  computed: {
    convertResult() {
      if (!this.convertValue) {
        return 0;
      }
      const result = this.fromUsd
        ? this.convertValue / this.asset.priceUsd
        : this.convertValue * this.asset.priceUsd;
      return result.toFixed(4);
    },

    min() {
      return Math.min(
        ...this.history.map((h) => parseFloat(h.priceUsd).toFixed(2))
      );
    },
    max() {
      return Math.max(
        ...this.history.map((h) => parseFloat(h.priceUsd).toFixed(2))
      );
    },
    avg() {
      return Math.abs(
        ...this.history.map((h) => parseFloat(h.priceUsd).toFixed(2))
      );
    },
  },

  //Creamos un metodo que será ejecutado cada vez que un nuevo componente se cree.
  created() {
    this.getCoin();
  },

  watch: {
    $route() {
      this.getCoin();
    },
  },

  methods: {
    toggleConverter() {
      this.fromUsd = !this.fromUsd;
    },

    getWebsite(exchange) {
      this.$set(exchange, "isLoading", true);
      return api
        .getExchange(exchange.exchangeId)
        .then((res) => {
          this.$set(exchange, "url", res.exchangeUrl);
        })
        .finally(() => {
          this.$set(exchange, "isLoading", false);
        });
    },

    getCoin() {
      //$route es una propiedad que se agrega a los componentes de Vue, cuando trabajamos con el router,
      //$route: representa a la ruta y toda la informacion de esa ruta
      const id = this.$route.params.id;
      this.isLoading = true;

      //Esperamos a que se resuelvan todas las promesas de peticion a la api
      Promise.all([
        api.getAsset(id),
        api.getAssetHistory(id),
        api.getMarkets(id),
      ])
        //despues asignamos los valores de asset e history
        .then(([asset, history, markets]) => {
          this.asset = asset;
          this.history = history;
          this.markets = markets;
        })
        .finally(() => (this.isLoading = false));
    },
  },
};
</script>
