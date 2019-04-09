<template>
  <div>
    <div id="process-bar" :style="processBarStyle" v-on:click="jump">
      <span id="visited" :style="visitedStyle"></span>
      <span id="now" :style="nowStyle"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProcessBar',
  props: [
    'backgroundColor',
    'processedColor',
    'nowColor',
    'stepCount',
    'nowStep',
  ],
  data () {
    return {
      width: 100,
    }
  },
  computed: {
    processBarStyle: function() {
      return {
        backgroundColor: this.backgroundColor,
      }
    },
    visitedStyle: function() {
      return {
        backgroundColor: this.processedColor,
        width: 'calc(' + Math.floor(this.nowStep / this.stepCount * 100) + '% - 10px)',
      }
    },
    nowStyle: function() {
      return {
        backgroundColor: this.nowColor,
      }
    }
  },
  mounted: function() {
    const dom = document.getElementById('process-bar');
    if (dom !== undefined) {
      this.width = dom.offsetWidth;
    }
  },
  methods: {
    jump: function (event) {
      const dom = document.getElementById('process-bar');
      if (dom !== undefined) {
        this.width = dom.offsetWidth;
      }
      if (this.width === 0) {
        return;
      }
      this.$emit('change-position', Math.round(event.layerX / this.width * this.stepCount));
    }
  }
}
</script>

<style scope>
  #process-bar {
    cursor: pointer;
    background-color: #7f7f7f;
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
    text-align: left;
  }
  #visited {
    position: relative;
    background-color: green;
    height: 200%;
    width: 50%;
    display: inline-block;
  }
  #now {
    /* cursor: pointer; */
    position: relative;
    background-color: white;
    height: 200%;
    width: 10px;
    display: inline-block;
  }
</style>
