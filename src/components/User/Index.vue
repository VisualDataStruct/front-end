<template>
  <div id="index">
    <div>
      <h1 id="title">
        VISU<span style="color: rgb(255, 138, 39);">DS</span>
      </h1>
    </div>
    <div id="content">
      <el-row v-for="n in rowCount" :key="n">
        <el-col :span="12" class="card-col">
          <el-card
            :key="n * 2"
            class="box-card"
            shadow="hover"
            @click.native="showDetail((n - 1) * 2)"
          >
            <div slot="header" class="clearfix card-title">
              <span>{{ List[(n - 1) * 2].name }}</span>
            </div>
            <div class="card-body">
              <el-row :gutter="30">
                <el-col :span="12">
                  <img class="cover" :src="'/api/' + List[(n - 1) * 2].cover">
                </el-col>
                <el-col :span="12">
                  <div class="description">
                    {{ List[(n - 1) * 2].description }}
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12" class="card-col">
          <el-card
            v-if="hasCard(n)"
            :key="n * 2 + 1"
            class="box-card"
            shadow="hover"
            @click.native="showDetail((n - 1) * 2 + 1)"
          >
            <div slot="header" class="clearfix card-title">
              <span>{{ List[(n - 1) * 2 + 1].name }}</span>
            </div>
            <div class="card-body">
              <img class="cover" :src="'/api/' + List[(n - 1) * 2 + 1].cover">
              <div class="description">
                {{ List[(n - 1) * 2 + 1].description }}
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  components: {
  },
  data () {
    return {
      List: [],
    }
  },
  computed: {
    rowCount: function () {
      return Math.ceil(this.List.length / 2.0);
    }
  },
  beforeMount () {
    this.$http.get('classification')
    .then(r => {
      this.List = r.data;
    })
    .catch(e => {
      console.error(e);
    })
  },
  methods: {
    ToClassificationDetail(id) {
      event.preventDefault()
      this.$router.push({ name: 'ClassificationDetail', params: { classification_id: id } })
    },
    hasCard(n) {
      return (n - 1) * 2 + 1 < this.List.length
    },
    showDetail(n) {
      this.ToClassificationDetail(this.List[n].id)
    }
  },
}
</script>

<style scoped>
  #index {
    height: 1000px;
  }
  #title {
    padding-top: 50px;
    font-size: 50px;
    font-family: Georgia, 'Times New Roman', Times, serif;
    letter-spacing: 8px;
  }
  #content {
    margin-top: 50px;
    padding: 0 18px;
  }
  .box-card {
    width: 90%;
    margin: 20px;
    display: inline-block;
    text-align: left;
    cursor: pointer;
    /* min-height: 100px; */
    height: 100%;
  }
  .card-title {
    font-size: 32px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .cover {
    max-width: 100%;
    max-height: 240px;
    float: left;
  }
  .description {
    height: 100%;
    float: left;
    word-wrap: normal;
    word-break: break-all;
  }
  .card-body {
    height: 250px;
  }
  .card-col {
    height: 350px;
    margin-bottom: 40px;
  }
</style>