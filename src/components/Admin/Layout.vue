<template>
  <el-container id="container">
    <el-aside id="aside" width="200px">
      <el-menu
        :default-active="$route.name"
        background-color="#efefef"
        active-text-color="#4d9aff"
        :router="true"
      >
        <el-menu-item
          v-for="(item, index) in computedAsideMenu"
          :key="index"
          :index="item.index"
          :route="item.routerName"
          :disabled="item.disabled"
        >
          {{ item.title }}
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <el-container>
      <el-header id="header" height="80px">
        <el-dropdown @command="dropDownClickHandle">
          <el-button type="primary" id="drop-button">
            <img :src="getHash(user.email)" id="user-avatar">
            <span style="padding-left: 10px;">{{ user.username }}</span>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(action, index) in dropDownAction"
              :key="index"
              :command="action.action"
              style="width: 180px;"
            >
              {{ action.title }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      
      <el-main id="main-container">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import moment from 'moment';
export default {
  name: 'AdminLayout',
  data: function() {
    return {
      dropDownAction: [
        {
          title: '用户信息',
          action: this.userProfile,
        },
        {
          title: '设置',
          action: this.userSetting,
        },
        {
          title: '退出登录',
          action: this.logOut,
        }
      ],
      asideMenu: [
        {
          title: '首页',
          index: 'AdminDashboard',
          needAdmin: false,
          disabled: false,
          routerName: { name: 'AdminDashboard' },
        },
        {
          title: '算法列表',
          index: 'AdminClassificationList',
          needAdmin: false,
          disabled: false,
          routerName: { name: 'AdminClassificationList' },
        },
        {
          needAdmin: true,
          title: '用户管理',
          index: 'tmpAdminUserManager',
          disabled: true,
          routerName: { name: 'tmpAdminUserManager' },
        }
      ],
      user: {},
    }
  },
  computed: {
    isAdmin: function() {
      return String(this.user.id) === "1";
    },
    computedAsideMenu: function() {
      if (this.isAdmin) {
        return this.asideMenu;
      } else {
        return this.asideMenu.filter(item => item.needAdmin === false)
      }
    }
  },
  beforeCreate: function() {
    if (this.$store.state.authUser === undefined || this.$store.state.authUser === '') {
      this.$notify.error({title: '暂未登录'})
      this.$router.push({ name: 'AdminLogin' })
      return;
    }
    this.$http.get('user/' + this.$store.state.authUser, this.$store.state.getConfig)
    .then(r => {
      this.user = r.data
      this.user.createTime = moment.unix(+r.data.created_at).format('YYYY-MM-DD HH:mm:ss')
    })
    .catch(e => {
      this.$notify.error({title: '暂未登录'})
      this.$router.push({ name: 'AdminLogin' })
      console.error(e.response)
    })
    if (this.$route.name === 'AdminLayout') {
      this.$router.push({ name: 'AdminDashboard' })
    }
  },
  methods: {
    getHash: function(email) {
      let hashCode = '' + email
      hashCode = hashCode.replace(/^\s+|\s+$/g, '').toLowerCase()
      let createHash = require('create-hash')
      let hash = createHash('md5')
      hash.update(hashCode)
      hashCode = hash.digest('HEX')
      return 'http://www.gravatar.com/avatar/' + hashCode + '?d=retro'
    },
    logOut: function() {
      this.$store.commit('SET_API_TOKEN', '')
      this.$store.commit('SET_AUTH_USER', '')
      this.$store.commit('SET_GET_CONFIG', {})
      this.$store.commit('SET_POST_CONFIG', {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
      localStorage.clear()
      this.$notify.success({
        title: '退出成功',
      })
      this.$router.push({ name: 'Index' })
    },
    dropDownClickHandle: function(command) {
      command();
    },
    userProfile: function() {
      // TODO:
      console.log('profile')
    },
    userSetting: function() {
      // TODO:
      console.log('setting')
    }
  },
}
</script>

<style scoped>
  #container {
    min-height: 100vh;
  }
  #aside {
    font-size: 24px;
    top: 80px;
    height: calc(100vh - 130px);
    position: fixed;
    color: #333;
    border-left: blue 1px;
  }
  #main-container {
    text-align: left;
    margin-left: 200px;
    margin-top: 80px;
  }
  #header {
    width: 100%;
    position: fixed;
    text-align: right;
    font-size: 18px;
    background-color: rgb(77, 154, 255);
    color: #fff;
    line-height: 80px;
    z-index: 100;
  }
  #drop-button {
    height: 80px;
    width: 250px;
  }
  #user-avatar {
    height: 50px;
    align-items: center;
    border-radius: 50%;
    display: inline-flex;
    justify-content: center;
    position: relative;
    vertical-align: middle;
    text-align: center;
  }
</style>

