<template>
  <div>
    <el-table
      :data="tableData"
      stripe
      :border="true"
      :max-height=500
      :row-key="getRowKey"
      :expand-row-keys="expandRow"
      @expand-change="rowChange"
      @row-click="clickRow"
    >
      <el-table-column
        type="expand"
        width="60px"
      >
        <template slot-scope="scope">
          <AlgorithmTable
            :classificationId="scope.row.id"
            :algorithms="scope.row.algorithms"
          ></AlgorithmTable>
        </template>
      </el-table-column>
      <el-table-column
        prop="id"
        label="ID"
        width="60px"
      ></el-table-column>
      <el-table-column
        prop="name"
        label="分类名字"
        width="200px"
      ></el-table-column>
      <el-table-column
        prop="description"
        label="描述"
        width="350px"
      ></el-table-column>
      <el-table-column
        label="封面图"
        width="120px"
      >
      <template slot-scope="scope">
        <span v-if="scope.row.cover === null">暂无封面图</span>
        <img class="cover" v-else :src="'/api/' + scope.row.cover">
        </template>
      </el-table-column>
      <el-table-column
        prop="sum"
        label="包含算法数"
        width="100px"
      ></el-table-column>
      <el-table-column
        label="操作"
        width="180px"
        v-if="isAdmin"
      >
        <template slot-scope="scope">
          <el-button type="primary" @click="showEditClassification(scope.row)">修 改</el-button>
          <el-button v-if="scope.row.deleted_at === null" type="danger" @click="deleteClassification(scope.row.id, scope.$index)">删 除</el-button>
          <el-button v-else type="warning" @click="restoreClassification(scope.row.id, scope.$index)">恢 复</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button id="add-classification" v-if="isAdmin" type="primary" @click="showAddClassification()">添加分类</el-button>
    <el-dialog
      title="修改分类"
      :visible.sync="showEdit"
      width="600px"
      :before-close="handleClose">
      <el-form
        :model="toEditClassification"
        status-icon
        label-position="right"
        ref="editForm"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="toEditClassification.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类简介" prop="description">
          <el-input type="textarea" v-model="toEditClassification.description" autocomplete="off"></el-input>
        </el-form-item>
        <div>
          <span v-if="toEditClassification.cover === null || toEditClassification.cover === ''">暂无封面图</span>
          <img v-else class="edit-cover" :src="'/api/' + toEditClassification.cover">
        </div>
        <el-upload
          name="file"
          :multiple="false"
          :show-file-list="false"
          action="/api/file/upload"
          :data="token"
          :on-success="afterUploadCover"
          :on-error="errorUploadCover"
        >
          <el-button size="small" type="primary">点击上传修改封面图</el-button>
        </el-upload>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clickClose()">取 消</el-button>
        <el-button type="primary" @click="editClassification()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="添加分类"
      :visible.sync="showAdd"
      width="600px"
      :before-close="handleClose">
      <el-form
        :model="toAddClassification"
        status-icon
        label-position="right"
        ref="editForm"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="toAddClassification.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类简介" prop="description">
          <el-input type="textarea" v-model="toAddClassification.description" autocomplete="off"></el-input>
        </el-form-item>
        <div>
          <span v-if="toAddClassification.cover === null || toAddClassification.cover === ''">暂无封面图</span>
          <img v-else class="edit-cover" :src="'/api/' + toAddClassification.cover">
        </div>
        <el-upload
          name="file"
          :multiple="false"
          :show-file-list="false"
          action="/api/file/upload"
          :data="token"
          :on-success="afterUploadCover"
          :on-error="errorUploadCover"
        >
          <el-button size="small" type="primary">点击上传修改封面图</el-button>
        </el-upload>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clickClose()">取 消</el-button>
        <el-button type="primary" @click="addClassification()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import AlgorithmTable from './AlgorithmTable'
export default {
  components: {
    AlgorithmTable,
  },
  data: function() {
    return {
      tableData: [],
      showEdit: false,
      showAdd: false,
      toEditClassification: {
        cover: '',
        name: '',
        description: '',
      },
      toAddClassification: {
        cover: '',
        name: '',
        description: '',
      },
      expandRow: [],
      getRowKey: function(row) {
        return row.id;
      },
    }
  },
  computed: {
    token: function() {
      return {token: this.$store.state.token}
    },
    isAdmin: function() {
      return String(this.$store.state.authUser) === "1";
    }
  },
  created: function() {
    this.getClassificationList();
  },
  methods: {
    clickRow: function(row, col) {
      if (col.label !== '操作') {
        this.rowChange(row);
      }
    },
    rowChange: function(row) {
      if (this.expandRow.length === 1 && this.expandRow[0] === row.id) {
        this.expandRow = [];
        return;
      } else {
        this.expandRow = [row.id]
      }
      if (row.algorithms === undefined || row.algorithms === null) {
        this.getAlgorithmList(row);
      }
    },
    errorUploadCover: function(e) {
      console.error(e)
      this.$notify.error({ title: '上传失败' })
    },
    afterUploadCover: function(r) {
      this.$notify.success({ title: '上传成功' })
      this.toAddClassification.cover = r.filename
      this.toEditClassification.cover = r.filename
    },
    getAlgorithmList: function(row) {
      this.$http.get('classification/' + row.id + '/algorithm', this.$store.state.getConfig)
      .then(r => {
        row.algorithms = r.data.algorithms
      })
      .catch(e => {
        console.error(e)
      })
    },
    getClassificationList: function() {
      this.$http.get('classification', this.$store.state.getConfig)
      .then((r) => {
        this.tableData = r.data;
      })
      .catch((e) => {
        console.error(e);
      })
    },
    showEditClassification: function(classification) {
      this.toEditClassification = classification;
      this.showEdit = true;
      this.showAdd = false;
    },
    editClassification: function() {
      this.$confirm('确认修改？')
      .then(() => {
        if (this.toEditClassification.name === '') {
          this.$notify.error({ title: '分类名称不能为空' })
          return;
        }
        this.$http.put('classification/' + this.toEditClassification.id, {
          'token': this.$store.state.token,
          'cover': this.toEditClassification.cover,
          'name': this.toEditClassification.name,
          'description': this.toEditClassification.description,
        })
        .then(() => {
          this.$notify.success({ title: '修改成功' })
          this.showEdit = false;
        })
        .catch(e => {
          if (e.response) {
            switch (e.response.status) {
              case 422:
                this.$notify.error({ title: '分类名称不能重复' })
                break;
            }
          }
          console.error(e)
        })
      })
      .catch(() => {});
    },
    deleteClassification: function(id, index) {
      this.$confirm('是否要删除分类？', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        this.$http.delete('classification/' + id, this.$store.state.getConfig)
        .then(() => {
          this.tableData[index].deleted_at = +new Date();
          this.$notify.success({ title: '删除成功' })
        })
        .catch(e => {
          console.err(e)
        })
      })
      .catch(() => {});
    },
    restoreClassification: function(id, index) {
      this.$confirm('是否要恢复分类？', '提示', {
        confirmButtonText: '确定恢复',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        this.$http.post('classification/' + id, '', this.$store.state.postConfig)
        .then(() => {
          this.tableData[index].deleted_at = null;
          this.$notify.success({ title: '恢复成功' })
        })
        .catch(e => {
          console.error(e);
        })
      })
      .catch(() => {});
    },
    showAddClassification: function() {
      this.toAddClassification = {
        cover: '',
        name: '',
        description: '',
      };
      this.showEdit = false;
      this.showAdd = true;
    },
    addClassification: function() {
      this.$confirm('确认添加？')
      .then(() => {
        if (this.toAddClassification.name === '') {
          this.$notify.error({ title: '分类名称不能为空' })
          return;
        }
        const formData = new FormData();
        formData.append('cover', this.toAddClassification.cover);
        formData.append('name', this.toAddClassification.name);
        formData.append('description', this.toAddClassification.description);
        this.$http.post('classification', formData, this.$store.state.postConfig)
        .then(() => {
          this.getClassificationList();
          this.showAdd = false;
        })
        .catch(e => {
          console.error(e);
          if (e.response) {
            switch (e.response.status) {
              case 422:
                this.$notify.error({ title: '分类名称不能重复' })
                break;
            }
            return;
          }
          this.showAdd = false;
        })
      })
      .catch(() => {});
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
        this.showEdit = false;
        this.showAdd = false;
      })
      .catch(() => {});
    },
  },
}
</script>

<style scoped>
  .inside-table {
    margin-left: 120px;
  }
  .cover {
    max-width: 100px;
    max-height: 100px;
  }
  #add-classification {
    margin-top: 50px;
  }
  .edit-cover {
    max-height: 200px;
    max-width: 200px;
  }
</style>

