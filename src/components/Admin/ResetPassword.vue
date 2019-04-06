<template>
  <div id="reset">
    <div>
      <el-card
        shadow="always"
        id="reset-card"
      >
        <div slot="header">
          <span id="card-title">重置密码</span>
        </div>
        <el-form
          :model="ruleForm"
          status-icon
          label-position="right"
          :rules="rules"
          ref="resetForm"
          label-width="100px"
        >
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="重复密码" prop="rePassword">
            <el-input type="password" v-model="ruleForm.rePassword" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="valid">
            <el-input v-model="ruleForm.valid" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button round style="width: 150px;" type="primary" @click="submitForm()">提 交</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
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
    const validateRePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (String(value).length < 5) {
        callback(new Error('密码必须大于5位'));
      } else if (String(value).length > 30) {
        callback(new Error('密码超过30位'));
      } else if (String(value) !== String(this.ruleForm.password)) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback();
      }
    };
    const validateValid = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('必须输入验证码'));
      } else if (value.length !== 6) {
        callback(new Error('验证码为 6 位'));
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
        email: '',
        password: '',
        rePassword: '',
        valid: '',
      },
      rules: {
        password: [
          { required: true, validator: validatePassword, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '不合法的邮箱格式', trigger: 'blur' }
        ],
        rePassword: [
          { required: true, validator: validateRePassword, trigger: 'blur' }
        ],
        valid: [
          { required: true, validator: validateValid, trigger: 'blur' },
        ],
      },
      isEmail: false,
    };
  },
  beforeCreate: function() {
  },
  methods: {
    submitForm: function() {
      this.$refs.resetForm.validate((valid, notValid) => {
        if (valid) {
          const formData = new FormData();
          formData.append('email', this.ruleForm.email);
          const createHash = require('create-hash');
          const hash = createHash('sha256');
          hash.update(this.ruleForm.password);
          formData.append('new_password', hash.digest('HEX'));
          formData.append('verify', this.ruleForm.valid);
          this.$http.post('auth/reset', formData, this.$store.state.postConfig)
          .then(r => {
            this.$notify.success({
              title: '重设密码成功',
            });
            this.$router.push({ name: 'AdminLogin' })
          })
          .catch(e => {
            console.error(e)
            switch(e.response.status) {
              case 401:
                this.$notify.error({
                  title: '错误',
                  message: '验证码不正确',
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
  },
}
</script>

<style scoped>
  #reset {
    min-width: 600px;
    height: 100vh;
    position: relative;
  }
  #reset-card {
    width: 600px;
    left: calc(50% - 300px);
    top: 100px;
    position: relative;
  }
  #card-title {
    font-size: 26px;
  }
</style>
