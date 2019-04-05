<template>
  <div id="dashboard">
    <div>
      Welcome, {{ user.realName }}
    </div>
    <div>
      当前系统共有用户 {{ userCount }} 人
    </div>
    <div>
      当前系统共存在分类 {{ classificationCount }} 种 <span v-if="isAdmin">，其中 {{ classificationDeletedCount }} 种被删除</span>
    </div>
    <div>
      当前系统共存在算法 {{ algorithmCount }} 种，其中 {{ algorithmNotPassedCount }} 种正在审核，{{ algorithmDeletedCount }} 种被删除
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      user: {},
      userCount: 0,
      classificationCount: 0,
      classificationDeletedCount: 0,
      algorithmCount: 0,
      algorithmNotPassedCount: 0,
      algorithmDeletedCount: 0,
    }
  },
  computed: {
    isAdmin: function() {
      return String(this.$store.state.authUser) === '1';
    }
  },
  created: function() {
    this.$http.get('user/' + this.$store.state.authUser, this.$store.state.getConfig)
    .then(r => {
      console.log(r.data);
      this.user = r.data
    })
    .catch(e => {
      console.error(e)
    })
    this.getData();
  },
  methods: {
    getData: function() {
      this.userCount = this.classificationCount = this.classificationDeletedCount
      = this.algorithmCount = this.algorithmNotPassedCount = this.algorithmDeletedCount = 0;
      this.$http.get('user')
      .then(r => {
        this.userCount = r.data.length;
      })
      .catch(e => {
        console.error(e);
      })
      this.$http.get('classification', this.$store.state.getConfig)
      .then(r => {
        const classificationList = r.data;
        this.classificationCount = classificationList.length
        classificationList.forEach(classification => {
          if (classification['deleted_at']) {
            ++this.classificationDeletedCount;
          }
          this.$http.get('classification/' + classification.id + '/algorithm', this.$store.state.getConfig)
          .then(res => {
            const algorithmList = res.data.algorithms;
            this.algorithmCount += algorithmList.length;
            algorithmList.forEach(algorithm => {
              console.log(algorithm.passed)
              if (classification['deleted_at'] || algorithm['deleted_at']) {
                ++this.algorithmDeletedCount;
              }
              if (String(algorithm.passed) !== '1') {
                ++this.algorithmNotPassedCount;
              }
            });
          })
          .catch(err => {
            console.error(err);
          })
        });
      })
      .catch(e => {
        console.error(e);
      })
    }
  },
}
</script>

<style scoped>
  #dashboard {
    font-size: 24px;
    line-height: 50px;
  }
</style>

