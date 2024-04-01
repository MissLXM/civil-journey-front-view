<template>
    <el-dialog 
        v-model="loginOrRegisterDialog" 
        :before-close="offLoginOrRegister"
    >   
        <!-- 顶部容器 -->
        <div class="login-or-register-view-header-container">
            <div 
                tabindex="0" 
                class="login-text"
                @click="loginOrRegister(1)"
                :class="{ 'login-or-register': checkLoginOrRegister === 1}"
            >
                登录
            </div>
            <div class="line">|</div>
            <div 
                tabindex="0" 
                class="register-text"
                @click="loginOrRegister(2)"
                :class="{ 'login-or-register': checkLoginOrRegister === 2}"
            >
                注册
            </div>
        </div>

        <!-- 登录导航栏 -->
        <div 
            class="login-nav-container"
            v-if="checkLoginOrRegister === 1"
        >
            <div
                tabindex="0" 
                class="login-username"
                @click="checkUsernameOrEmail = 1"
                :class="{ 'username-or-email': checkUsernameOrEmail === 1}"
            >
                账号登录
            </div>
            <div 
                tabindex="0" 
                class="login-email"
                @click="checkUsernameOrEmail = 2"
                :class="{ 'username-or-email': checkUsernameOrEmail === 2}"
            >
                邮箱登录
            </div>
        </div>

        <!-- 主体容器  -->
        <div class="login-or-register-view-body-container">
            <!-- 账号登录 -->
            <div
                class="login-username-container"
                v-if="checkLoginOrRegister === 1 && checkUsernameOrEmail === 1"
            >
                <el-input 
                    v-model="username"
                    :prefix-icon="User"
                    placeholder="登录名称"
                />
                <el-input 
                    show-password
                    type="password"
                    v-model="password"
                    :prefix-icon="Lock"
                    placeholder="登录密码"
                />
                
            </div>

            <!-- 邮箱登录 -->
            <div
                class="login-email-container"
                v-if="checkLoginOrRegister === 1 && checkUsernameOrEmail === 2"
            >
                <el-input 
                    v-model="userEmail"
                    :prefix-icon="Message"
                    placeholder="邮箱账号"
                />
                <div class="code-container">
                    <el-input 
                        v-model="emailCode"
                        :prefix-icon="Lock"
                        placeholder="验证码"
                    />
                    <el-button 
                        type="warning"
                        @click="getLoginCode()"
                        v-loading="codeLoading"
                        v-if="timeStatus == false" 
                    >
                        <span>获取验证码</span>
                    </el-button>
                    <el-button v-else disabled type="warning">
                        {{ time }}
                    </el-button>
                </div>
            </div>

            <!-- 注册 -->
            <el-form
                status-icon
                :model="registerForm"
                ref="registerRuleFormRef"
                class="register-container"
                v-if="checkLoginOrRegister === 2"
            >
                <el-form-item
                    prop="username"
                    :rules="registerRules.username"
                >
                    <el-input 
                        :prefix-icon="User"
                        placeholder="登录名称"
                        v-model="registerForm.username"
                    />
                </el-form-item>
                
                <el-form-item
                    prop="password"
                    :rules="registerRules.password"
                >
                    <el-input 
                        show-password
                        :prefix-icon="Lock"
                        placeholder="登录密码"
                        v-model="registerForm.password"
                    />
                </el-form-item>
                
                <el-form-item
                    prop="confirmPassword"
                    :rules="registerRules.confirmPassword"
                >
                    <el-input 
                        show-password
                        :prefix-icon="Lock"
                        placeholder="确认密码"
                        v-model="registerForm.confirmPassword"
                    />
                </el-form-item>
                
                
                <el-form-item
                    prop="nickname"
                    :rules="registerRules.nickname"
                >
                    <el-input 
                        :prefix-icon="User"
                        placeholder="用户昵称"
                        v-model="registerForm.nickname"
                    />
                </el-form-item>
                
                <el-form-item
                    prop="userEmail"
                    :rules="registerRules.userEmail"
                >
                    <el-input 
                        :prefix-icon="Message"
                        placeholder="邮箱账号"
                        v-model="registerForm.userEmail"
                    />
                </el-form-item>
                
                <el-form-item
                    prop="emailCode"
                    :rules="registerRules.emailCode"
                >
                    <div class="code-container">
                        <el-input 
                            :prefix-icon="Lock"
                            placeholder="验证码"
                            v-model="registerForm.emailCode"
                        />
                        <el-button 
                            type="warning"
                            v-loading="codeLoading"
                            v-if="timeStatus == false" 
                            @click="getRegisterCode()"
                        >
                            获取验证码
                        </el-button>
                        <el-button v-else disabled type="warning">
                            {{ time }}
                        </el-button>
                    </div>
                </el-form-item>
                
                <el-form-item>
                    <!-- 按钮 -->
                    <div class="login-button">
                        <el-button 
                            type="primary"
                            v-loading="registerLoading"
                            v-if="checkLoginOrRegister === 2" 
                            @click="register(registerRuleFormRef)" 
                        >注册</el-button>
                    </div>  
                </el-form-item>
            </el-form>

        </div>

        <!-- 按钮 -->
        <div class="login-button">
            <el-button 
                type="primary"
                @click="login()" 
                v-loading="loginLoading"
                v-if="checkLoginOrRegister === 1" 
            >登录</el-button>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { userStore } from '@/stores/user';
import { ref, watch, defineEmits, withDefaults } from 'vue'
import { User, Message, Lock } from '@element-plus/icons-vue'
import { usernameLogin, getEmailCode, emailLogin, userRegister } from '@/api/user';

// 登录参数
const time = ref()
const username = ref()
const password = ref()
const userEmail = ref()
const emailCode = ref()
// 用户存储
const user = userStore()
// 注册参数
const registerForm = ref({
    username: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    userEmail: '',
    emailCode: ''
})
// 注册规则
const registerRules = ref({
    username: [
        { required: true, message: '请输入登录名称', trigger: 'blur' },
        { min: 3, max: 10, message: '长度3-10之间', trigger: ['blur', 'change']}
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 15, message: '长度6-15之间', trigger: ['blur', 'change']}
    ],
    confirmPassword: [
        { required: true, message: '请输入确认密码', trigger: 'blur' },
        { validator: checkConfirmPassword, trigger: ['blur', 'change']}
    ],
    nickname: [
        { required: true, message: '请输入用户昵称', trigger: 'blur' },
        { min: 3, max: 10, message: '长度3-10之间', trigger: ['blur', 'change']}
    ],
    userEmail: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入邮箱格式', trigger: ['blur', 'change']}
    ],
    emailCode: [
        { required: true, message: '请输入验证码', trigger: 'blur' }
    ]
})
const timeStatus = ref(false)
// 计时器变量
let codeTimer: NodeJS.Timeout
// 验证码加载
const codeLoading = ref(false)
// 用户登录加载
const loginLoading = ref(false)
// 规则校验
const registerRuleFormRef = ref()
// 用户注册加载
const registerLoading = ref(false)
// (1为账号, 2为邮箱)
const checkUsernameOrEmail = ref(1)
// (1为登录, 2为注册)
const checkLoginOrRegister = ref(1)
// 获取父组件的值(是否展示弹出框)
const props = withDefaults(
    defineProps<{
        isDialogShow: boolean;
    }>(),
    {
        isDialogShow: false,
    }
)
// 监听从父组件传递的值(是否展示弹出框)
watch(
    () => props.isDialogShow,
    () => {
        loginOrRegisterDialog.value = props.isDialogShow
    }
)
// 弹出框的值
let loginOrRegisterDialog = ref<boolean>(props.isDialogShow)


// 点击登录按钮
function login() {
    if (checkUsernameOrEmail.value == 1) {
        if (username.value == null || username.value == '') {
            ElMessage.info('登录账号不能为空')
        } else if (password.value == null || password.value == '') {
            ElMessage.info('登录密码不能为空')
        } else {
            loginLoading.value = true
            // 账号登录
            usernameLogin({
                username: username.value,
                password: password.value
            }).then(response => {
                // 登录赋值操作
                loginOperation(response)
            })
        }
        
    } else {
        // 邮箱登录
        if (userEmail.value == null || userEmail.value == '') {
            ElMessage.info('登录邮箱不能为空')
        } else if (emailCode.value == null || emailCode.value == '') {
            ElMessage.info('验证码不能为空')
        } else {
            loginLoading.value = true
            // 邮箱登录
            emailLogin({
                // 前面需和后端数据相同 userEmail和emailCode
                userEmail: userEmail.value,
                emailCode: emailCode.value
            }).then(response => {
                // 登录赋值操作
                loginOperation(response)
            })
        }
    } 

}

// 倒计时
function countDown() {
    if (!timeStatus.value) {
        timeStatus.value = true
        time.value = 60
    }

    codeTimer = setInterval(() => {
        if (time.value > 0) {
            time.value-- 
        } else {
            clearInterval(codeTimer)
            time.value = 0
            timeStatus.value = false
        }
    }, 1000)
}

// 清空输入框
function clearInput() {
    // 登录
    username.value = ''
    password.value = ''
    userEmail.value = ''
    emailCode.value = ''
    timeStatus.value = false
    
    // 注册
    registerForm.value = {
        username: '',
        password: '',
        confirmPassword: '',
        nickname: '',
        userEmail: '',
        emailCode: ''
    }

    // 加载
    codeLoading.value = false
}

// 获取登录验证码
function getLoginCode() {
    if (userEmail.value == null || userEmail.value == '') {
        ElMessage.info('邮箱不能为空')
    } else {
        codeLoading.value = true
        getEmailCode(userEmail.value).then(response => {
            if (response.data.code == 200) {
                ElMessage.success('验证码发送成功')
                // 结束载入
                codeLoading.value = false
                // 开始倒计时
                countDown()
            } else {
                ElMessage.error(response.data.message)
                // 结束载入
                codeLoading.value = false
            }
        })
    }
}

// 获取注册验证码
function getRegisterCode() {
    // 邮箱校验
    const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.(com))+/;

    if (registerForm.value.userEmail != null && 
        registerForm.value.userEmail != '' &&
        regEmail.test(registerForm.value.userEmail)
    ) {
        // 校验通过
        codeLoading.value = true
        getEmailCode(registerForm.value.userEmail).then(response => {
            if (response.data.code == 200) {
                ElMessage.success('验证码发送成功')
                // 结束载入
                codeLoading.value = false
                // 开始倒计时
                countDown()
            } else {
                ElMessage.error(response.data.message)
                // 结束载入
                codeLoading.value = false
            }
        })
    } else {
        ElMessage.error('邮箱格式无效')
    }
}

// 关闭登录注册弹出框
function offLoginOrRegister() {
    // 设置默认值
    codeLoading.value = false
    loginLoading.value = false
    registerLoading.value = false
    checkLoginOrRegister.value = 1;
    checkUsernameOrEmail.value = 1;

    // 清空输入框
    clearInput()

    // 关闭
    offLoginOrRegisterEmits('update:isDialogShow', false)
}

// 点击注册按钮
function register(formEl: any) {
    if (!formEl) return
    
    formEl.validate((valid: any) => {
        if (valid) {
            // 校验通过
            registerLoading.value = true
            userRegister(registerForm.value).then(response => {
                if (response.data.code === 200) {
                    registerLoading.value = false
                    // 关闭弹出框
                    offLoginOrRegister()
                    ElMessage.success('注册成功')
                } else {
                    ElMessage.error(response.data.message)
                }
            })
        } else {
            // 校验不通过
            ElMessage.error('请填写完表单')
        }
    })
}

// 切换登录或注册
function loginOrRegister(id: any) {
    clearInput()
    checkLoginOrRegister.value = id

    if (id == 1) {
        checkUsernameOrEmail.value = 1
    }
}

// 登录操作
function loginOperation(response: any) {
    if (response.data.code === 200) {
        // 存储Token信息
        user.tokenName = response.data.data.tokenName
        user.tokenValue = response.data.data.tokenValue

        // 用户信息
        user.userId = response.data.data.loginId
        user.username = response.data.data.username
        user.nickname = response.data.data.nickname
        user.userAvatar = response.data.data.headPortrait
        // 登录状态
        user.isLogin = true
        // 是否为讲师
        if (response.data.data.isTeacher) {
            user.isTeacher = true
        } else {
            user.isTeacher = false
        }

        // 关闭弹出框
        offLoginOrRegister()
        loginLoading.value = false
        ElMessage.success('登录成功')
    } else {
        loginLoading.value = false
        ElMessage.error(response.data.message)
    }
    // 清空输入框
    clearInput()
}

// 关闭登录注册弹出框事件
const offLoginOrRegisterEmits = defineEmits<{
    (e: 'update:isDialogShow', val: boolean): void;
}>();

// 确认密码校验
function checkConfirmPassword(rule: any, value: any, callback: any) {
    if (registerForm.value.password != registerForm.value.confirmPassword) {
        callback(new Error('两次输入的密码不一致'))
    }
    return callback()
} 
</script>

<style lang="less" scoped>
// 顶部容器
.login-or-register-view-header-container {
    width: 100%;
    display: flex;
    align-items: center;
    padding-bottom: 0.5rem;
    justify-content: center;
    border-bottom: 1px solid #eee;
    
    font-size: 20px;
    font-weight: 500;

    .login-text {
        width: 3.5rem;
        cursor: pointer;
        text-align: center;
    }

    .line {
        margin-left: 2.5rem;
        margin-right: 2.5rem;
    }

    .register-text {
        width: 3.5rem;
        cursor: pointer;
        text-align: center;
    }

    .login-or-register {
        color: #f58d23;
        border-bottom: 2.5px solid #f58d23;
    }
}

// 登录导航栏
.login-nav-container {
    display: flex;
    font-size: 13px;
    margin-top: 1rem;
    align-items: center;
    margin-bottom: 1.5rem;
    justify-content: center;

    .login-username {
        cursor: pointer;
        margin-right: 1rem;
        border-radius: 0.3rem;
        padding: 0.3rem 0.6rem;
    }

    .login-email {
        cursor: pointer;
        border-radius: 0.3rem;
        padding: 0.3rem 0.6rem;
    }

    .username-or-email {
        color: #fff;
        background-color: #999;
    }
}

// 主体容器
.login-or-register-view-body-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    // 输入框
    .el-input {
        font-size: 12px;
    }

    // 所有输入容器
    .login-username-container, .login-email-container {
        width: 50%;

        // 输入框
        .el-input {
            margin-bottom: 1.5rem;
        }
    }
    
    // 登录邮箱容器
    .login-email-container {
        
        // 验证码容器
        .code-container {
            display: flex;
            
            .el-button {
                width: 5rem;
                font-size: 12px;
                margin-left: 0.5rem;
            }
        }
    }

    // 注册容器
    .register-container {
        margin-top: 2rem;

        // 验证码容器
        .code-container {
            display: flex;
            
            .el-button {
                width: 5rem;
                font-size: 12px;
                margin-left: 0.5rem;
            }
        }
    }
}

// 按钮
.login-button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .el-button {
        width: 7rem;
        border-radius: 1rem;
    }
}

// 加载动画大小
:deep(.el-loading-spinner .circular) {
    width: 1.3rem;
    height: 1.3rem;
    margin-top: 0.7rem;
}
</style>