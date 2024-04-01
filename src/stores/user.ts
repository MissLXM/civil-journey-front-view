import { ref } from 'vue'
import router from '@/router';
import { defineStore } from "pinia";

export const userStore = defineStore('user', 
    () => {
        const userId = ref()
        const username = ref()
        const nickname = ref()
        const userAvatar = ref()
        const isLogin = ref(false)
        const isTeacher = ref(false)

        const tokenName = ref()
        const tokenValue = ref()

        function routerHome() {
            router.push({
                path: '/home'
            })
        }

        // 重置参数
        function resetParams() {
            isLogin.value = false
            isTeacher.value = false
            userId.value = undefined
            username.value = undefined
            nickname.value = undefined
            tokenName.value = undefined
            userAvatar.value = undefined
            tokenValue.value = undefined
        }

        return { 
            userId,
            isLogin,
            username,
            nickname,
            isTeacher,
            userAvatar,
            
            tokenName,
            tokenValue,

            routerHome,
            resetParams
        }
    },
    {
        persist: {
            storage: sessionStorage
        }
    }
)
