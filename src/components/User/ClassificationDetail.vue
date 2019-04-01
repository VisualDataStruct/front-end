<template>
  <div id="classification">
    <div>
      <h1 id="title">
        {{ classification.name }}
      </h1>
      <Show
        :height="600"
        :width="1200"
        :runCode="codeJson"
        :initVar="initVar"
      ></Show>
      <DropList
        class="algorithms"
        v-on:run-algo="runAlgo"
        v-bind:items="dropListData"
      ></DropList>
    </div>
  </div>
</template>

<script>
import DropList from '../widget/DropList';
import Show from '../Blocks/Show';
export default {
  name: 'ClassificationDetail',
  components: {
    DropList,
    Show,
  },
  data () {
    return {
      algorithms: [],
      classification: [],
      dropListData: [],
      initVar: {},
      codeJson: '{"code":[{}],"_var":{},"_sp_var":{}}',
    }
  },
  computed: {
  },
  beforeMount () {
    this.classification_id = this.$route.params.classification_id;
    this.getClassification();
  },
  methods: {
    runAlgo(event) {
      this.initVar = event.initVar;
      this.$http.get('classification/' + this.classification_id + '/algorithm/' + event.algorithm_id)
      .then(r => {
        console.log(r.data);
        this.codeJson = r.data.blocksJson || '{"code":[{}],"_var":{},"_sp_var":{}}';
      })
      .catch(e => {
        console.error(e)
      })
      console.log(this.initVar)
      console.log(event.initVar);
    },
    getClassification() {
      this.$http.get('classification/' + this.classification_id + '/algorithm')
      .then(r => {
        this.algorithms = r.data.algorithms;
        this.classification = {
          name: r.data.name,
          description: r.data.description,
        };
        console.log(r.data.algorithms);
        this.getShowData();
      })
      .catch(e => {
        console.error(e)
      })
    },
    getShowData() {
      const tag = {};
      const data = [];
      this.algorithms.forEach(algo => {
        if (!(tag[algo.tagName] > 0)) {
          tag[algo.tagName] = data.length;
          data.push({
            'tag': algo.tagName,
            'algorithms': [],
          });
        }
        data[tag[algo.tagName]].algorithms.push({
          'id': algo.id,
          'name': algo.name,
          'initVar': algo.initVar,
          'show': false,
        });
      });
      console.log(data);
      this.dropListData = data;
    }
  },
}
</script>

<style scoped>
  #classification {
    min-height: 100vh;
  }
  #title {
    padding-top: 20px;
    font-size: 30px;
    font-family: Georgia, 'Times New Roman', Times, serif;
    letter-spacing: 8px;
  }
  .transition-box {
    margin-bottom: 10px;
    width: 200px;
    height: 100px;
    border-radius: 4px;
    background-color: #409EFF;
    text-align: center;
    color: #fff;
    padding: 40px 20px;
    box-sizing: border-box;
    margin-right: 20px;
  }
  .algorithms {
    position: fixed;
    bottom: 50px;
    left: 20px;
    min-width: 100px;
  }
</style>