<template>
  <Navbar />
  <div class="container-fluid mt-3">
    <div class="contenedor my-4 shadow p-4 rounded">
      <ListadoUsuarios />
    </div>
  </div>
</template>
<script>
import Navbar from "../components/Navbar/Navbar.vue"
import ListadoUsuarios from "../components/Usuarios/ListadoUsuarios.vue"

export default {
  components: {
    Navbar,
    ListadoUsuarios
  }
}
</script>
<style lang="">

</style>