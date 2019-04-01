<template>
  <div id="drop-list">
    <el-collapse v-model="activeName" accordion class="collapse">
      <el-collapse-item
        v-for="(item, index) in items"
        :key="'collapse' + index"
        :title="item.tag"
        :name="index"
        class="collapse-item"
      >
        <el-button v-for="(algo, j) in item.algorithms" :key="'button' + j" v-on:click="show(index, j)">
          {{ algo.name }}
        </el-button>
        <div v-for="(algo, j) in visible(item.algorithms)" :key="'algoVar' + j">
          <el-row v-for="(Var, k) in algo.initVar" :key="'algoInput' + k" class="input-div">
            <el-col :span=6>{{ Var.showName }}:</el-col>
            <el-col :span=18>
              <el-input
                v-model="initVar[Var.varName]"
                :placeholder="getPlaceHolder(Var.type)"
                class="var-input"
                size="mini"
                v-on:blur="changeType(Var.varName, Var.type)"
              ></el-input>
            </el-col>
          </el-row>
          <el-button type="primary" v-on:click="runAlgo">GO</el-button>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  name: 'DropList',
  components: {
  },
  props: {
    initHeight: {
      type: Number,
    },
    initWidth: {
      type: Number,
    },
    items: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  data () {
    return {
      activeName: '',
      initVar: [],
      height: this.initHeight,
      width: this.initWidth,
      activeId: -1,
      activeIndex: [-1, -1],
    }
  },
  computed: {
  },
  beforeMount () {
  },
  methods: {
    visible: function(items) {
      return items.filter(item => item.show)
    },
    show: function(i, j) {
      if (this.activeId !== -1) {
        this.items[this.activeIndex[0]]['algorithms'][this.activeIndex[1]]['show'] = false;
      }
      this.items[i]['algorithms'][j]['show'] = true;
      this.activeId = this.items[i]['algorithms'][j].id;
      this.activeIndex = [i, j];
    },
    runAlgo: function() {
      const e = {
        algorithm_id: this.activeId,
        initVar: this.initVar,
      };
      this.items[this.activeIndex[0]]['algorithms'][this.activeIndex[1]].initVar.forEach(element => {
        switch (element.type) {
          case 'Number':
            '请输入一个数字...';
            break;
          case 'String':
            '请输入一串字符...';
            break;
          case 'Array':
            '请输入一个数组，用英文逗号隔开...';
            break;
          default:
            break;
        }
      });
      this.$emit('run-algo', e);
      this.activeId = -1;
      this.items[this.activeIndex[0]]['algorithms'][this.activeIndex[1]]['show'] = false;
      this.activeName = '';
    },
    getPlaceHolder: function(type) {
      switch (type) {
        case 'Number':
          return '请输入一个数字...';
        case 'String':
          return '请输入一串字符...';
        case 'Array':
          return '请输入一个数组，用英文逗号隔开...';
        default:
          return '';
      }
    },
    changeType: function(varName, type) {
      console.log(this.initVar[varName], type);
      this.initVar[varName] = this.changeToNumber(this.initVar[varName]);
      console.log(this.initVar[varName]);
    },
    changeToNumber: function(value) {
      return Number(value) || 0;
    },
    changeToString: function(value) {
      console.log(value);
    },
    changeToArray: function(value) {
      console.log(value);
    },
  },
}
</script>

<style scoped>
  #title {
    padding-top: 20px;
    font-size: 30px;
    font-family: Georgia, 'Times New Roman', Times, serif;
    letter-spacing: 8px;
  }
  .collapse {
    background-color: white;
  }
  .collapse-item {
    padding-left: 20px;
    min-width: 300px;
    text-align: left;
  }
  .var-input {
    width: 200px;
  }
  .input-div {
    margin: 10px;
  }
</style>