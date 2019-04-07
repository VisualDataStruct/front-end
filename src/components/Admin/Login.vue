<template>
  <div id="login">
    <div>
      <el-card
        shadow="always"
        id="login-card"
      >
        <div slot="header">
          <span id="card-title">登录</span>
        </div>
        <el-form
          :model="ruleForm"
          status-icon
          label-position="right"
          :rules="rules"
          ref="loginForm"
          label-width="100px"
        >
          <el-form-item v-if="isEmail" label="邮箱" prop="email">
            <el-input v-model="ruleForm.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item v-else label="用户名" prop="username">
            <el-input v-model="ruleForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="ruleForm.checked" label="保持登录状态30天"></el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button round type="primary" @click="submitForm()">提交</el-button>
            <el-button round @click="switchLogin()">切换登录方式</el-button>
            <el-button round @click="showForgotPassword()">忘记密码</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <el-dialog
      title="忘记密码"
      :visible.sync="showForgot"
      width="600px"
      :before-close="handleClose">
        <el-form
          :model="forgotForm"
          status-icon
          label-position="right"
          :rules="forgotRoles"
          ref="forgotForm"
          label-width="100px"
        >
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="forgotForm.email" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clickClose()">取 消</el-button>
        <el-button type="primary" @click="forgotPassword()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'AdminLogin',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (String(value).length < 5) {
        callback(new Error('密码必须大于5位'));
      } else if (String(value).length > 30) {
        callback(new Error('密码超过30位'));
      } else {
        callback();
      }
    };
    const validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'));
      } else {
        callback();
      }
    }
    return {
      ruleForm: {
        username: '',
        email: '',
        password: '',
        checked: false,
      },
      rules: {
        password: [
          { required: true, validator: validatePassword, trigger: 'blur' }
        ],
        username: [
          { required: true, validator: validateUsername, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '不合法的邮箱格式', trigger: 'blur' }
        ],
      },
      isEmail: false,
      showForgot: false,
      forgotForm: {
        email: '',
      },
      forgotRoles: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '不合法的邮箱格式', trigger: 'blur' },
        ]
      },
    };
  },
  beforeCreate: function() {
    this.$http.get('auth', this.$store.state.getConfig)
    .then(res => {
      this.$store.commit('SET_AUTH_USER', res.data.id);
      localStorage.authUser = res.data.id;
      this.$router.push({ name: 'AdminLayout' });
    })
    .catch(err => {
      console.error(err);
    });
  },
  methods: {
    submitForm: function() {
      this.$refs.loginForm.validate((valid, notValid) => {
        if (valid) {
          const formData = new FormData();
          if (this.isEmail) {
            formData.append('email', this.ruleForm.email);
          } else {
            formData.append('username', this.ruleForm.username);
          }
          formData.append('remember', Number(this.ruleForm.checked));
          const createHash = require('create-hash');
          const hash = createHash('sha256');
          hash.update(this.ruleForm.password);
          formData.append('password', hash.digest('HEX'));
          this.$http.post('auth/login', formData, this.$store.state.postConfig)
          .then(r => {
            this.$notify.success({
              title: '登录成功',
            });
            localStorage.clear()
            localStorage.token = r.data.token;
            this.$store.commit('SET_GET_CONFIG', { params: { token: r.data.token } })
            this.$store.commit('SET_POST_CONFIG', {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Api-Token': r.data.token
              }
            })
            this.$store.commit('SET_API_TOKEN', r.data.token)
            this.$http.get('auth', { params: { token: r.data.token } })
            .then(res => {
              this.$store.commit('SET_AUTH_USER', res.data.id);
              localStorage.authUser = res.data.id;
              this.$router.push({ name: 'AdminDashboard' });
            })
            .catch(err => {
              console.error(err);
            });
          })
          .catch(e => {
            console.error(e)
            switch(e.response.status) {
              case 401:
                this.$notify.error({
                  title: '错误',
                  message: '密码不正确',
                });
                break;
              case 404:
                this.$notify.error({
                  title: '错误',
                  message: '用户未注册',
                });
            }
          })
        } else {
          console.error(notValid);
          return false;
        }
      });
    },
    switchLogin: function() {
      this.isEmail = !this.isEmail;
    },
    showForgotPassword: function() {
      this.showForgot = true;
    },
    forgotPassword: function() {
      console.log(this.forgotForm.email)
      this.$refs.forgotForm.validate((valid, notValid) => {
        if (valid) {
          const formData = new FormData();
          formData.append('email', this.forgotForm.email);
          this.$http.post('auth/forget', formData, this.$store.state.postConfig)
          .then(() => {
            this.$notify.success({
              title: '重置成功',
              message: '请查看邮件获取验证码'
            });
            this.$router.push({ name: 'AdminResetPassword' })
          })
          .catch(e => {
            console.error(e)
            switch(e.response.status) {
              case 404:
                this.$notify.error({
                  title: '错误',
                  message: '用户未注册',
                });
            }
          })
        } else {
          console.error(notValid);
          return false;
        }
      });
    },
    handleClose: function(done) {
      done();
    },
    clickClose: function() {
      this.showForgot = false
    },
  },
}
</script>

<style scoped>
  #login {
    min-width: 600px;
    height: 100vh;
    position: relative;
  }
  #login-card {
    width: 600px;
    left: calc(50% - 300px);
    top: 100px;
    position: relative;
  }
  #card-title {
    font-size: 26px;
  }
</style>
