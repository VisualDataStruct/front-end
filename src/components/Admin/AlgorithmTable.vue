<template>
  <div>
    <el-table
      class="sub-table"
      :data="algorithms"
      stripe
      :border="true"
      :max-height=400
      :row-key="getSubRowKey"
    >
      <el-table-column
        prop="id"
        label="ID"
      ></el-table-column>
      <el-table-column
        prop="tagName"
        label="算法标签"
      ></el-table-column>
      <el-table-column
        prop="name"
        label="算法名字"
      ></el-table-column>
      <el-table-column
        label="操作"
        width="300px"
      >
        <template slot-scope="scope">
          <el-button type="primary" @click="showEditAlgorithm(scope.row.id)">修 改</el-button>
          <el-button v-if="scope.row.deleted_at === null" type="danger" @click="deleteAlgorithm(scope.row.id, scope.$index)">删 除</el-button>
          <el-button v-else type="warning" @click="restoreAlgorithm(scope.row.id, scope.$index)">恢 复</el-button>
          <el-button v-if="isAdmin && !scope.row.passed" type="success" @click="passAlgorithm(scope.row.id, scope.$index)">通过审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button id="add-algorithm" v-if="isAdmin" type="primary" @click="addAlgorithm()">添加算法</el-button>
  </div>
</template>

<script>
export default {
  name: 'AlgorithmTable',
  props: ['algorithms', 'classificationId'],
  data: function() {
    return {
      getSubRowKey: function(row) {
        return "subtable-" + row.id
      },
    }
  },
  computed: {
    isAdmin: function() {
      return String(this.$store.state.authUser) === "1";
    }
  },
  methods: {
    showEditAlgorithm: function(id) {
      this.$router.push({name: 'AlgorithmEdit', params: {
        classificationId: this.classificationId,
        algorithmId: id,
      }})
    },
    deleteAlgorithm: function(id, index) {
      this.$confirm('是否要删除算法？', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        this.$http.delete('classification/' + this.classificationId + '/algorithm/' + id, this.$store.state.getConfig)
        .then(() => {
          this.algorithms[index].deleted_at = +new Date();
          this.$notify.success({ title: '删除成功' })
        })
        .catch(e => {
          console.err(e)
        })
      })
      .catch(() => {});
    },
    restoreAlgorithm: function(id, index) {
      this.$confirm('是否要恢复算法？', '提示', {
        confirmButtonText: '确定恢复',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        this.$http.post('classification/' + this.classificationId + '/algorithm/' + id, '', this.$store.state.postConfig)
        .then(() => {
          this.algorithms[index].deleted_at = null;
          this.$notify.success({ title: '恢复成功' })
        })
        .catch(e => {
          console.error(e);
        })
      })
      .catch(() => {});
    },
    passAlgorithm: function(id, index) {
      this.$confirm('是否审核通过算法？', '提示', {
        confirmButtonText: '确定通过',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        this.$http.put('classification/' + this.classificationId + '/algorithm/' + id + '/verify', {
        'token': this.$store.state.token
      })
        .then(() => {
          this.algorithms[index].passed = 1;
          this.$notify.success({ title: '审核通过' })
        })
        .catch(e => {
          console.error(e);
        })
      })
      .catch(() => {});
    },
    addAlgorithm: function() {
      this.$router.push({name: 'AlgorithmEdit', params: {
        classificationId: this.classificationId,
      }})
    },
  }
}
</script>

<style scoped>
  .sub-table {
    width: 700px;
  }
  #add-algorithm {
    margin-top: 25px;
    margin-bottom: 25px;
  }
</style>
