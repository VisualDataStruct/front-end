<template>
  <div id="app">
    <router-view :key="key"/>
    <i-footer></i-footer>
  </div>
</template>

<script>
import iFooter from '../src/components/Footer.vue';

export default {
  name: 'App',
  components: {
    iFooter,
  },
  beforeMount: function () {
    this.$store.commit('SET_API_TOKEN', localStorage.token === undefined ? '' : JSON.parse(localStorage.token))
    this.$store.commit('SET_AUTH_USER', localStorage.authUser === undefined ? '' : JSON.parse(localStorage.authUser))
  },
  data () {
    return {
    }
  },
  computed: {
    key () {
      // add key to <router-view> to avoid re-use component
      console.log('re-generate key')
      return this.$route.name !== undefined
        ? this.$route.name + +new Date()
        : this.$route + +new Date()
    }
  }
}
</script>

<style>
#app {
  background-color: #efefef;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
