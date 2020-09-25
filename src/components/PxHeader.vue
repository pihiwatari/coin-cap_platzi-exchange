<template>
  <header class="shadow">
    <nav>
      <nav class="flex items-center justify-between bg-green-400 p-6">
        <div class="flex items-center flex-shrink-0 text-white mr-6">
          <!-- lo implementeamos en html usando kebab-case -->
          <px-icon class="mr-2"></px-icon>
          <router-link
            :to="{ name: 'home' }"
            class="font-semibold text-xl tracking-tight"
            >PlatziExchange</router-link
          >
        </div>
        <div
          class="hidden sm:block w-full blok flex-grow lg:flex lg:items-center lg:wauto"
        >
          <div class="text-sm lg:flex-grow">
            <router-link
              v-for="l in links"
              :key="l.name"
              :to="l.url"
              class="sm:inline-block md:inline-block lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
            >
              {{ l.name }}
            </router-link>
          </div>
        </div>
      </nav>
    </nav>
  </header>
</template>

<script>
//Si necesitamos incluir componentes dentro de otro componente, lo importamos dentro del script usando
//PascalCase
import PxIcon from "@/components/PxIcon";

export default {
  name: "PxHeader",

  //Lo declaramos dentro del objeto components.
  components: { PxIcon },
  props: {
    links: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
