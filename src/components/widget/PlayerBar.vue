<template>
  <div>
    <div id="play-bar" :style="divStyle">
      <el-row type="flex" justify="space-between">
        <el-col :span="4">
          <img name="goToBegin" src="../../assets/img/goToBeginning.png" :style="imgStyle" v-on:click="clickImg">
        </el-col>
        <el-col :span="4">
          <img name="preStep" src="../../assets/img/prevFrame.png" :style="imgStyle" v-on:click="clickImg">
        </el-col>
        <el-col :span="4">
          <img name="pause" v-show="showPause" src="../../assets/img/pause.png" :style="imgStyle" v-on:click="clickImg">
          <img name="play" v-show="showPlay" src="../../assets/img/play.png" :style="imgStyle" v-on:click="clickImg">
          <img name="replay" v-show="showReplay" src="../../assets/img/replay.png" :style="imgStyle" v-on:click="clickImg">
        </el-col>
        <el-col :span="4">
          <img name="nxtStep" src="../../assets/img/nextFrame.png" :style="imgStyle" v-on:click="clickImg">
        </el-col>
        <el-col :span="4">
          <img name="goToEnd" src="../../assets/img/goToEnd.png" :style="imgStyle" v-on:click="clickImg">
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlayBar',
  props: ['height', 'width', 'status'],
  data () {
    return {
    }
  },
  computed: {
    showPause: function() {
      return this.status === 'play';
    },
    showPlay: function() {
      return this.status !== 'play' && this.status !== 'end';
    },
    showReplay: function() {
      return this.status === 'end';
    },
    imgStyle: function() {
      return {
        height: this.height + 'px',
        width: this.height + 'px',
      }
    },
    divStyle: function() {
      return {
        height: this.height + 'px',
        width: this.width + 'px',
      }
    },
  },
  created() {
  },
  mounted() {
  },
  methods: {
    clickImg: function(event) {
      this.$emit('playEvent', event.srcElement.name);
    },
  },
}
</script>

<style scoped>
  #play-bar {
    /* position: relative; */
    padding: 0;
    margin: 0;
    background-color: black;
    text-align: center;
  }
  img {
    max-height: 20px;
    padding: 0;
    margin: 0;
    display: inline-block;
    cursor: pointer;
  }
</style>