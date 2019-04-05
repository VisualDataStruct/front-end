<template>
  <div id="show-animation-canvas-view" :style="size">
    <div id="show-animation-canvas">
      <ShowData name="全局变量" :showdata="globalData" v-show="showGlobal"></ShowData>
      <ShowData name="结点" :showdata="nodeData" v-show="showNode" style="top: 300px;"></ShowData>
    </div>
    <CommentShow
      id="comment-show"
      :comments="commentList"
      :commentId="nowCommentId"
    ></CommentShow>
    <div id="playing-bar">
      <PlayBar id="play"
        :height="20"
        :width="200"
        v-on:playEvent="playEvent"
        :status="playStatus"
      ></PlayBar>
      <ProcessBar id="process"
        :stepCount="stepSum"
        :nowStep="nowStep"
        v-on:change-position="jump"
      ></ProcessBar>
    </div>
  </div>
</template>

<script>
import ShowData from '../widget/showData';
import Bus from '../../Core/bus.js';
import InitShow from '../../Core/initShow.js';
import ProcessBar from '../widget/processBar';
import PlayBar from '../widget/PlayerBar';
import Run from '../../Core/Explain/run.js';
import CommentShow from '../widget/CommentShow'
export default {
  name: 'Show',
  props: {
    height: {
      type: Number,
      default: function() {
        return 800;
      }
    },
    width: {
      type: Number,
      default: function() {
        return 1000;
      }
    },
    runCode: {
      type: String,
      default: function() {
        return '{"code":[{}],"_var":{},"_sp_var":{}}';
      }
    },
    initVarString: {
      type: String,
      default: function() {
        return '{}';
      }
    }
  },
  components: {
    ShowData,
    ProcessBar,
    PlayBar,
    CommentShow,
  },
  data () {
    return {
      showGlobal: false,
      showNode: false,
      globalData: [{}],
      nodeData: [{}],
      nodeId: -1,
      stepSum: 100,
      playStatus: 'pause',
      run: new Run(this.runCode),
      commentList: [],
      nowCommentId: '-1',
    }
  },
  computed: {
    initVar: function() {
      return JSON.parse(this.initVarString)
    },
    nowStep: function() {
      return this.run.step;
    },
    size: function() {
      return {
        height: (this.height + 2) + 'px',
        width: (this.width + 2) + 'px',
      };
    }
  },
  created() {
  },
  watch: {
    runCode: {
      handler(newVal) {
        this.run.clear();
        this.run = new Run(newVal);
        this.initRun();
      },
    },
    nowStep: {
      handler(newVal) {
        if (newVal === this.run.allStep) {
          this.playStatus = 'end';
        }
      }
    },
    initVarString: {
      handler(newVal) {
        this.run.clear();
        this.run = new Run(this.runCode);
        this.initRun();
      },
    },
  },
  mounted() {
    InitShow.initAll(this.height, this.width);
    this.initRun();
    Bus.on('changeComment', (commentId) => {
      this.nowCommentId = commentId[0];
    });
  },
  methods: {
    initRun: function() {
      this.playStatus = 'begin';
      this.run.setInitVar(this.initVar);
      this.run.compile();
      this.stepSum = this.run.allStep;
      this.commentList = this.run.getComment();
    },
    jump: function(step) {
      this.playStatus = 'pause';
      this.run.jumpTo(step);
    },
    playEvent: function(eventName) {
      switch(eventName) {
        case 'play':
          if (this.playStatus !== 'end') {
            this.playStatus = 'play';
          }
          this.run.start();
          break;
        case 'pause':
          this.playStatus = 'pause';
          this.run.pause();
          break;
        case 'goToEnd':
          this.playStatus = 'end';
          this.run.jumpTo(this.run.allStep);
          break;
        case 'replay':
          this.playStatus = 'play';
          this.run.stop();
          this.run.start();
          break;
        case 'goToBegin':
          this.playStatus = 'begin';
          this.run.stop();
          break;
        case 'preStep':
          this.playStatus = 'pause';
          this.run.pause();
          this.run.preStep();
          break;
        case 'nxtStep':
          if (this.playStatus !== 'end') {
            this.playStatus = 'pause';
          }
          this.run.pause();
          this.run.nxtStep();
          break;
        default:
          break;
      }
    }
  },
}
</script>

<style scoped>
  #show-animation-canvas-view {
    position: relative;
  }
  #show-animation-canvas {
    position: relative;
  }
  #process {
    width: 400px;
    height: 10px;
    bottom: 25px;
    left: calc(10% + 200px);
    position: absolute;
  }
  #play {
    left: 5%;
    position: absolute;
    bottom: 20px;
  }
  #playing-bar {
    position: relative;
    bottom: 0;
  }
  #comment-show {
    position: absolute;
    right: 10px;
    bottom: 50px;
  }
</style>