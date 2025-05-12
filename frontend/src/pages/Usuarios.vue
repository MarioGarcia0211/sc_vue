<template>
  <Navbar />
  <div class="cont-fluid mt-3">
    <div class="contenedor-card my-4 shadow p-4 rounded">
      <ListadoUsuarios />
    </div>
  </div>
  <Footer />
</template>
<script>
import Footer from "../components/Footer/Footer.vue";
import Navbar from "../components/Navbar/Navbar.vue"
import ListadoUsuarios from "../components/Usuarios/ListadoUsuarios.vue"

export default {
  components: {
    Navbar,
    Footer,
    ListadoUsuarios
  }
}
</script>
<style lang="">

</style>