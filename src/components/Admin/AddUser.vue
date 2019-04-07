<template>
  <div id="user-add">
    <div>
      <el-card
        shadow="always"
        id="user-add-card"
      >
        <div slot="header">
          <span id="card-title">添加用户</span>
        </div>
        <el-form
          :model="ruleForm"
          status-icon
          label-position="right"
          :rules="rules"
          ref="addUserForm"
          label-width="100px"
        >
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input v-model="ruleForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="真实姓名" prop="realName">
            <el-input v-model="ruleForm.realName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="Github" prop="github">
            <el-input v-model="ruleForm.github" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="ruleForm.phone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item style="text-align: center;">
            <el-button style="width: 150px;" round type="primary" @click="submitForm()">提 交</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminAddUser',
  data: function() {
    const validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'));
      } else {
        callback();
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback();
      } else {
        const exp = /^[0-9]{11}$/
        if (exp.test(value)) {
          callback();
        } else {
          callback(new Error('只能使用 11 位格式的电话'));
        }
      }
    }
    return {
      ruleForm: {
        username: '',
        email: '',
        realName: '',
        github: '',
        phone: '',
      },
      rules: {
        username: [
          { required: true, validator: validateUsername, trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '不合法的邮箱格式', trigger: 'blur' },
        ],
        realName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
        ],
        github: [
          { required: false, trigger: 'blur' },
        ],
        phone: [
          { validator: validatePhone, trigger: 'blur' },
        ],
      },
      isEmail: false,
    };
  },
  methods: {
    submitForm: function() {
      this.$refs.addUserForm.validate((valid, notValid) => {
        if (valid) {
          const formData = new FormData();
          formData.append('email', this.ruleForm.email);
          formData.append('username', this.ruleForm.username);
          formData.append('realName', this.ruleForm.realName);
          formData.append('github', this.ruleForm.github || '');
          formData.append('phone', this.ruleForm.phone || '');
          this.$http.post('user/add', formData, this.$store.state.postConfig)
          .then(() => {
            this.$notify.success({
              title: '添加成功',
            });
            this.ruleForm = {
              username: '',
              email: '',
              realName: '',
              github: '',
              phone: '',
            };
          })
          .catch(e => {
            console.error(e)
            let errorMsg = '';
            switch(e.response.status) {
              case 422:
                errorMsg = '';
                for (const key in e.response.data) {
                  if (e.response.data.hasOwnProperty(key)) {
                    errorMsg += e.response.data[key][0];
                  }
                }
                this.$notify.error({ title: errorMsg });
                break;
              case 401:
                this.$notify.error({
                  title: '请先登录',
                });
                break;
              case 403:
                this.$notify.error({
                  title: '您没有权限',
                });
                break;
            }
          })
        } else {
          console.error(notValid);
          return false;
        }
      });
    },
  }
}
</script>

<style scoped>
  #user-add {
    margin-top: -60px;
    min-width: 800px;
    height: 100vh;
    position: relative;
  }
  #user-add-card {
    width: 800px;
    left: calc(50% - 400px);
    top: 100px;
    position: relative;
  }
  #card-title {
    font-size: 26px;
  }
</style>
