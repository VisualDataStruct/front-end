<template>
  <div>
    <el-collapse v-model="activeName" accordion id="comments">
      <el-collapse-item title="        伪代码" name="1" class="collapse-item">
        <div
          v-for="(item, index) in comments"
          :key="index"
          :class="'comment-line ' + (commentId === item.id ? 'comment-now' : '')"
        >    {{ item.comment }}    </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  name: 'CommentShow',
  props: {
    comments: {
      type: Array,
      default: () => {
        return [];
      },
    },
    commentId: {
      type: String,
      default: () => {
        return '-1';
      }
    }
  },
  computed: {
  },
  data() {
    return {
      activeName: '',
    };
  },
  watch: {
    comments: {
      handler (newVar, oldVar) {
        console.log(newVar, oldVar);
      },
      deep: true,
    },
    commentId: {
      handler (newVar) {
        console.log(newVar);
      }
    }
  },
  methods: {
  },
}
</script>

<style scoped>
  .collapse-item {
    padding: 0;
    min-width: 100px;
    text-align: left;
    white-space: pre-wrap;
  }
  .comment-line {
    height: 25px;
  }
  .comment-now {
    background-color: black;
    color: white;
  }
</style>
