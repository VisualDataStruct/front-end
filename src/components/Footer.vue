<template>
  <div class="Footer">
    <el-row :gutter="20" type="flex" justify="end">
      <el-col v-for="(item, index) in List" :key="index" :span=3>
        <a :href="item.link">
          {{ item.title }}
        </a>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  components: {
  },
  data () {
    return {
      List: [
        {
          title: 'Home',
          link: '/',
        },
        {
          title: 'About',
          link: 'javascript:void(0);',
        },
        {
          title: 'Admin',
          link: '/admin',
        },
      ],
    }
  }
}
</script>

<style scoped>
  .Footer {
    text-align: center;
    background-color: #000000;
    height: 50px;
    width: 100%;
    font-size: 150%;
    z-index: -1;
  }
  a {
    margin-top: 10px;
    display: block;
    font-size: 18px;
    height: 24px;
    color: #ffffff;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
</style>