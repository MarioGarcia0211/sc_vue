<template>
  <Navbar />
  <div class="cont-fluid mt-4">
    <div class="contenedor-card my-4 shadow p-4 rounded">
      <h1 class="text-center">Inicio</h1>
    </div>
  </div>
  <Footer />
</template>

<script>
import Footer from "../components/Footer/Footer.vue";
import Navbar from "../components/Navbar/Navbar.vue"

export default {
  components: {
    Navbar,
    Footer
  }
}
</script>


<style></style>