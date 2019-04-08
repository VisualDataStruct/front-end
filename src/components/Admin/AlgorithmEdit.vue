<template>
  <div>
    <div v-show="preView">
      <Show
        :runCode="blocksJsonString"
        :initVarString="initVarString"
        :height="600"
        :width="1000"
      ></Show>
      <el-button type="primary" @click="toEdit()">编 辑</el-button>
      <el-button type="primary" @click="runAlgo()">开始运行</el-button>
      <div id="input-div">
        <el-row v-for="(Var, k) in algorithm.initVar" :key="'algoInput' + k" class="input-div">
          <el-col :span=6>{{ Var.showName }}:</el-col>
          <el-col :span=18>
            <el-input
              v-model="preViewShowInitVar[Var.varName]"
              :placeholder="getPlaceHolder(Var.type)"
              class="var-input"
              size="mini"
              v-on:blur="changeType(Var.varName, Var.type)"
            ></el-input>
          </el-col>
        </el-row>
      </div>
    </div>
    <div v-show="!preView">
      <Blockly
        ref="blocks"
        height="600px"
        width="1000px"
      ></Blockly>
      <el-button type="primary" @click="toPreView()">预 览</el-button>
      <el-button type="primary" @click="showEditInitVar()">编辑初始变量</el-button>
      <el-button type="primary" @click="showEditInfo()">编辑算法信息</el-button>
      <el-button type="primary" @click="save()">保存算法</el-button>
      <el-dialog
        title="编辑算法基础信息"
        :visible.sync="showInfo"
        width="600px"
        :before-close="handleClose"
      >
        <el-form
          :model="algorithm"
          status-icon
          label-position="right"
          ref="editForm"
          label-width="100px"
        >
          <el-form-item label="算法名称" prop="name">
            <el-input v-model="algorithm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="算法标签" prop="tagName">
            <el-input v-model="algorithm.tagName" autocomplete="off"></el-input>
          </el-form-item>
          <!-- <el-form-item label="算法分类" prop="classification">
            <el-select v-model="algorithm.classification_id" placeholder="请选择分类">
              <el-option v-for="item in classifications"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item> -->
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="clickClose()">取 消</el-button>
          <el-button type="primary" @click="editInfo()">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="修改初始值"
        :visible.sync="showInitVar"
        width="600px"
        :before-close="handleClose"
      >
        <el-table
          class="sub-table"
          :data="algorithm.initVar"
          stripe
          :border="true"
          :max-height=400
        >
          <el-table-column
            label="显示名字"
          >
            <template slot-scope="scope">
              <el-input v-model="scope.row.showName" autocomplete="off"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="变量名字"
          >
            <template slot-scope="scope">
              <el-input v-model="scope.row.varName" autocomplete="off"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="变量类型"
          >
            <template slot-scope="scope">
              <el-select v-model="scope.row.type" placeholder="请选择变量类型">
                <el-option v-for="item in initVarType"
                  :key="item.type"
                  :label="item.name"
                  :value="item.type">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="primary" @click="removeInitVar(scope.$index)">移 除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addNewInitVar()">添加变量</el-button>
        <span slot="footer" class="dialog-footer">
          <el-button @click="clickClose()">取 消</el-button>
          <el-button type="primary" @click="editInitVar()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Show from '../Blocks/Show';
import Blockly from '../Blocks/Blockly'
export default {
  name: 'AlgorithmEdit',
  components: {
    Show,
    Blockly,
  },
  beforeRouteLeave: function(to, from, next) {
    this.$confirm('离开页面您所做的修改将不会被保存', '提示', {
      confirmButtonText: '确认离开',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(() => {
      next();
    })
    .catch(() => {
      next(false)
    })
  },
  data: function() {
    return {
      // classifications: [],
      initVarType: [
        {
          type: 'Number',
          name: '数字',
        },
        {
          type: 'Array',
          name: '数组',
        },
        {
          type: 'String',
          name: '字符串',
        },
      ],
      preViewShowInitVar: {},
      processInitVar: {},
      initVarString: '{}',
      blocksJsonString: '{"code":[],"_var":{},"_sp_var":{}}',
      preView: false,
      showInitVar: false,
      showInfo: false,
      algorithmId: -1,
      classificationId: -1,
      algorithm: {
        blocksJson: '{"code":[],"_var":{},"_sp_var":{}}',
        blocksXml: '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>',
        classification_id: -1,
        initVar: [],
        name: '',
        problems: [],
        tagName: '',
      },
    }
  },
  mounted: function() {
    this.algorithmId = this.$route.params.algorithmId || -1;
    this.classificationId = this.$route.params.classificationId;
    this.algorithm.classification_id = this.$route.params.classificationId;
    // this.$http.get('classification', this.$store.state.getConfig)
    // .then(r => {
    //   this.classifications = r.data
    // })
    // .catch(e => {
    //   console.error(e);
    // })
    if (this.algorithmId !== -1) {
      this.$http.get(
        'classification/' + this.$route.params.classificationId + '/algorithm/' + this.algorithmId,
        this.$store.state.getConfig,
      )
      .then(r => {
        this.algorithm = r.data
        this.algorithm.initVar = this.algorithm.initVar;
        this.inputXml();
      })
      .catch(e => {
        console.error(e);
      })
    } else {
      this.inputXml();
    }
  },
  methods: {
    runAlgo: function() {
      this.getCode();
      this.initVarString = JSON.stringify(this.processInitVar)
      this.blocksJsonString = this.algorithm.blocksJson;
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
      switch (type) {
        case 'Number':
          this.processInitVar[varName] = this.changeToNumber(this.preViewShowInitVar[varName]);
          this.preViewShowInitVar[varName] = String(this.processInitVar[varName])
          break;
        case 'String':
          this.processInitVar[varName] = this.changeToString(this.preViewShowInitVar[varName]);
          this.preViewShowInitVar[varName] = this.processInitVar[varName];
          break;
        case 'Array':
          this.processInitVar[varName] = this.changeToArray(this.preViewShowInitVar[varName]);
          this.preViewShowInitVar[varName] = this.processInitVar[varName].join(',');
          break;
      }
    },
    changeToNumber: function(value) {
      return Number(value) || 0;
    },
    changeToString: function(value) {
      return String(value) || '';
    },
    changeToArray: function(value) {
      return String(value).split(',').filter(item => item !== '') || [];
    },
    addNewInitVar: function() {
      this.algorithm.initVar.push({
        showName: '新建变量',
        varName: 'newVar',
        type: 'String',
      });
    },
    removeInitVar: function(index) {
      this.algorithm.initVar.splice(index, 1);
    },
    toPreView: function() {
      this.preView = true;
    },
    toEdit: function() {
      this.preView = false;
    },
    getCode: function() {
      this.algorithm.blocksJson = this.$refs.blocks.blocksToJson();
    },
    getXml: function() {
      this.algorithm.blocksXml = this.$refs.blocks.blocksToXml();
    },
    inputXml: function() {
      this.$refs.blocks.xmlToBlocks(this.algorithm.blocksXml);
    },
    showEditInitVar: function() {
      this.showInitVar = true;
    },
    showEditInfo: function() {
      this.showInfo = true;
    },
    editInfo: function() {
      this.showInfo = false;
    },
    editInitVar: function() {
      this.initVarString = JSON.stringify(this.initVar)
      this.showInitVar = false;
    },
    handleClose: function(done) {
      this.$confirm('确认关闭？')
      .then(() => {
        done();
      })
      .catch(() => {});
    },
    clickClose: function() {
      this.$confirm('确认关闭？')
      .then(() => {
        this.showInitVar = false;
        this.showInfo = false;
      })
      .catch(() => {});
    },
    save: function() {
      this.$confirm('是否保存算法？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        this.getXml();
        this.getCode();
        if (this.algorithmId === -1) {
          this.trueAdd();
        } else {
          this.trueEdit();
        }
      })
      .catch(() => {});
    },
    trueEdit: function() {
      this.$http.put('classification/' + this.classificationId + '/algorithm/' + this.algorithm.id, {
        token: this.$store.state.token,
        blocksJson: this.algorithm.blocksJson,
        blocksXml: this.algorithm.blocksXml,
        initVar: this.algorithm.initVar,
        name: this.algorithm.name,
        tagName: this.algorithm.tagName,
      })
      .then(() => {
        this.$notify.success({ title: '修改成功' })
      })
      .catch(e => {
        console.error(e);
      })
    },
    trueAdd: function() {
      const formData = new FormData();
      formData.append('blocksJson', this.algorithm.blocksJson)
      formData.append('blocksXml', this.algorithm.blocksXml)
      formData.append('initVar', JSON.stringify(this.algorithm.initVar));
      formData.append('name', this.algorithm.name)
      formData.append('tagName', this.algorithm.tagName)
      this.$http.post('classification/' + this.classificationId + '/algorithm', formData, this.$store.state.postConfig)
      .then(r => {
        this.$router.replace({name: 'AlgorithmEdit', params: {
          classificationId: this.algorithm.classification_id,
          algorithmId: r.data.id,
        }})
      })
      .catch(e => {
        if (e.response && e.response.status) {
          if (e.response.status === 422) {
            let errorMsg = '';
            if (e.response.data.name) {
              errorMsg += e.response.data.name[0];
            }
            if (e.response.data.tagName) {
              errorMsg += e.response.data.tagName[0];
            }
            this.$notify.error({ title: errorMsg });
          }
        }
        console.error(e);
      })
    },
  },
}
</script>

<style scoped>
  .var-input {
    width: 200px;
  }
  .input-div {
    margin: 10px;
  }
</style>
