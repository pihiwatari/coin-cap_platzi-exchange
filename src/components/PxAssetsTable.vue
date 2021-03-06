<template>
  <table>
    <thead>
      <tr class="bg-gray-100 border-b-2 border-gray-400">
        <th></th>
        <th :class="{ up: this.sortOrder === 1, down: this.sortOrder === -1 }">
          <span @click="changeSortOrder" class="underline cursor-pointer"
            >Ranking</span
          >
        </th>
        <th>Nombre</th>
        <th>Precio</th>
        <th>Cap. de Mercado</th>
        <th>Variación 24hs</th>
        <td class="hidden md:block">
          <input
            class="bg-gray-100 focus:outline-none border-b border-gray-400 py-2 px-4 block w-full appearance-none leading-normal"
            id="filter"
            placeholder="Buscar..."
            type="text"
            v-model="filter"
          />
        </td>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="a in filteredAssets"
        :key="a.id"
        class="border-b border-gray-200 hover:bg-orange-100"
      >
        <td>
          <!-- Si queremos utilizar atributos dinámicos, debemos utilziar template literals dentro de comillas. -->
          <img
            :src="
              `https://static.coincap.io/assets/icons/${a.symbol.toLowerCase()}@2x.png`
            "
            :alt="a.name"
            class="w-6 h-6"
          />
        </td>
        <td>
          <b>#{{ a.rank }}</b>
        </td>
        <td>
          <!-- Utilizamos router-link para enlazar el nombre de la moneda con la 
          vista detallada. Para hacer dinámico al enlace, usamos v-bind para asignarle
          la vista y la ruta, obtenida de las propiedades del objeto-->
          <router-link
            class="hover:underline text-green-600"
            :to="{ name: 'coin-detail', params: { id: a.id } }"
            >{{ a.name }}</router-link
          >
          <small class="ml-1 text-gray-500">{{ a.symbol }}</small>
        </td>
        <!-- Para usar el filtro, usamos | [nombreDelFiltro] dentro de la expresión del componente -->
        <td>{{ a.priceUsd | dollar }}</td>
        <td>{{ a.marketCapUsd | dollar }}</td>

        <!-- Utilizamos la funcion .includes() para validar que un string contenga cierto caracter,
        y cambiar el color segun corresponda-->

        <!-- prettier-ignore-attribute -->
        <td
          :class="a.changePercent24Hr.includes('-') ? 
          'text-red-600' : 
          'text-green-600'"
        >
          {{ a.changePercent24Hr | percent }}
        </td>
        <td class="hidden md:block">
          <px-button @custom-click="goToCoin(a.id)">
            <span>Detalles</span>
          </px-button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import PxButton from "@/components/PxButton";
export default {
  name: "PxAssetsTable",

  components: { PxButton },

  props: {
    assets: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      filter: "",
      sortOrder: 1,
    };
  },

  computed: {
    filteredAssets() {
      return this.assets
        .filter(
          (a) =>
            a.symbol.toLowerCase().includes(this.filter.toLowerCase()) ||
            a.name.toLowerCase().includes(this.filter.toLowerCase())
        )
        .sort((a, b) => {
          if (parseInt(a.rank) > parseInt(b.rank)) {
            return this.sortOrder;
          }
          return this.sortOrder * -1;
        });
    },
  },

  methods: {
    //Este metodo nos permite cambar la vista que se muestra, en base al objeto ruta dentro de
    //router.js y del id de la moneda dentro de la respuesta de api.js
    goToCoin(id) {
      this.$router.push({ name: "coin-detail", params: { id } });
    },

    changeSortOrder() {
      this.sortOrder = this.sortOrder === 1 ? -1 : 1;
    },
  },
};
</script>

//style scoped nos permite generar estilos aislados a un componente.
<style scoped>
.up::before {
  content: "👆";
}

.down::before {
  content: "👇";
}

td {
  padding: 20px 0px;
  font-size: 0.6rem;
  text-align: center;
}

th {
  padding: 5px;
  font-size: 0.6rem;
}

@media (min-width: 640px) {
  td,
  th {
    padding: 20px;
    font-size: 1rem;
  }

  th {
    padding: 12px;
  }
}
</style>
