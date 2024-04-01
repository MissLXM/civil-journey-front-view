import axios from 'axios';
import { computed } from 'vue'
import { userStore } from '@/stores/user';

const request = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

const user = userStore()
const tokenName = computed(() => user.tokenName)
const tokenValue = computed(() => user.tokenValue)

request.interceptors.request.use(config => {
        // 动态添加请求头
        config.headers[tokenName.value] = tokenValue.value
        return config
    }, error => {
        return Promise.resolve(error)
    }
);

request.interceptors.response.use((response: any) => {
        if (response.data.code === 401) {
            ElMessage.error('账号状态异常或未登录')
            user.resetParams()
            user.routerHome()
        } else {
            return response
        }
    }, error => {
        switch (error.response.status) {
            case 400:
                ElMessage.error("错误请求")
                break;
            case 401:
                ElMessage.error("登录失效，请重新登录")
                user.resetParams()
                user.routerHome()
                break;
            case 403:
                ElMessage.error("无权限访问")
                break;
            case 404:
                ElMessage.error("请求路径不存在")
                break;
            case 500:
                ElMessage.error("服务器内部错误")
                break;
        }
        return Promise.resolve(error)
    }
);

export default request