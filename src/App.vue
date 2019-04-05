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
    this.$store.commit('SET_API_TOKEN', localStorage.token === undefined ? '' : localStorage.token)
    this.$store.commit('SET_AUTH_USER', localStorage.authUser === undefined ? '' : localStorage.authUser)
    this.$store.commit('SET_GET_CONFIG', { params: { token: this.$store.state.token } })
    this.$store.commit('SET_POST_CONFIG', {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Api-Token': this.$store.state.token
      }
    })
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
