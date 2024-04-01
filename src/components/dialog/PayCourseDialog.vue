<template>
        <!-- @open="openPayCourse" -->
    <el-dialog
        v-model="payCourseDialog"
        @open="openPayCourse"
        :before-close="payCourseInfo"
    >
        <div class="title-text">购买课程</div>
        <hr />
        <div class="pay-text">
            <span>当前课程并未购买,需要支付</span>
            <span class="red-text">{{ payMoney }}</span>
            <span>元才可以观看,是否支付?</span>
        </div>
        <div>
            <span>您当前免费观看课程的次数有: </span>
            <span class="red-text">{{ viewVideoNumber }}</span>
        </div>
        <div style="display: flex; align-items: center; margin-top: 2rem;">
            <div style=" display: flex; align-items: center; width: 15rem; margin-right: 1rem;">
                <span style="width: 7rem; margin-right: 0.5rem;">抵扣次数: </span>
                <el-select
                    size="large"
                    v-model="checkNumber"
                    placeholder="抵扣次数" 
                >
                    <el-option
                        :key="item"
                        :label="item"
                        :value="item"
                        v-for="item in freeNumber"
                    />
                </el-select>
            </div>
            <div style=" display: flex; align-items: center; margin-right: 1rem;">
                <span style="width: 4rem; margin-right: 0.5rem;">收货人: </span>
                <el-input v-model="consignee"/>
            </div>
            <div style="display: flex; align-items: center;">
                <span style="width: 6rem; margin-right: 0.5rem;">联系方式: </span>
                <el-input v-model="phone"/>
            </div>
        </div>
        <div class="warning-text">注意事项</div>
        <div class="red-text">由于课程是知识付费,并不支持退款操作,付款前注意看清楚条款,再进行付费</div>
        <div class="red-text">免费观看次数抵扣条款: 0-100元需使用1次抵扣, 100-200元需使用2次抵扣, 200-300元以上需使用3次抵扣, 以此类推</div>
        <el-popconfirm 
            @confirm="confirmEvent"
            cancel-button-text="取消"
            confirm-button-text="确认"
            title="是否确认支付,不支持退款哦"
        >
            <template #reference>
                <el-button type="warning">确定支付</el-button>
            </template>
        </el-popconfirm>
    </el-dialog>
</template>

<script setup lang="ts">
import { userInfo } from '@/api/user';
import { userStore } from '@/stores/user';
import { ref, watch, onMounted, defineProps, withDefaults } from 'vue'


// 联系方式
const phone = ref()
// 收货人
const consignee = ref()
// 用户信息
const user = userStore()
// 免费次数
const freeNumber = ref()
// 抵扣次数
const checkNumber = ref()
// 获取父组件的值
const props = withDefaults(
    defineProps<{
        payCourseId: any;
        payMoney: boolean;
        isDialogShow: boolean;
    }>(),
    {
        isDialogShow: false,
    }
)
// 免费观看次数
const viewVideoNumber = ref() 
// 监听从父组件传递的值
watch(() => props.isDialogShow,
    () => {
        payCourseDialog.value = props.isDialogShow
    }
) 
// 关闭讲师信息弹出框事件
const offPayCourseEmits = defineEmits<{
    (e: 'update:isDialogShow', val: boolean): void;
}>();
// 弹出框的值
let payCourseDialog = ref<boolean>(props.isDialogShow)



// 挂载函数
onMounted(() => {
    // 加载免费观看次数
    loadFreeLookNumber()
}) 

// 确认支付事件 
function confirmEvent() { 
    if (props.payCourseId != undefined && props.payMoney != undefined) {
        if (phone.value != undefined && phone.value != null && phone.value != '' &&
        consignee.value != undefined && consignee.value != null && consignee.value != '' ) {
            if (checkNumber.value == undefined || checkNumber.value == null || checkNumber.value == '') {
                checkNumber.value = 0
            }
            // 判断是否为手机号
            if (isPhone(phone.value)) {
                // 关闭弹出框
                offPayCourseEmits('update:isDialogShow', false)

                const tradeMoney = ref();

                if (checkNumber.value == 1) {
                    tradeMoney.value = Number(props.payMoney) - 100
                } else if (checkNumber.value == 2) {
                    tradeMoney.value = Number(props.payMoney) - 200
                } else if (checkNumber.value == 3) {
                    tradeMoney.value = Number(props.payMoney) - 300
                } else if (checkNumber.value == 4) {
                    tradeMoney.value = Number(props.payMoney) - 400
                } else if (checkNumber.value == 5){
                    tradeMoney.value = Number(props.payMoney) - 500 
                }  else {
                    tradeMoney.value = Number(props.payMoney)
                }

                if (tradeMoney.value <= 0) {
                    tradeMoney.value = 0.01
                }

                console.log(user.userId)

                // 支付操作
                window.open(
                    import.meta.env.VITE_BASE_URL
                    + '/payment-center-service/alipay/pay?'
                    + 'subject=课程购买订单' + Math.floor(Math.random() * 1000000 + 1)
                    + '&userId=' + user.userId
                    + '&courseId=' + props.payCourseId
                    + '&phone=' + phone.value
                    + '&consignee=' + consignee.value
                    + '&tradeAmount=' + tradeMoney.value
                    + '&useFreeNumber=' + checkNumber.value
                , '_self', '')
            } else {
                ElMessage.info('手机号格式错误')
            }
        } else {
            ElMessage.info('请填写完整信息')
        }
    } else {
        ElMessage.info('加载失败')
    }
}

// 打开弹出框事件
function openPayCourse() {
    loadFreeNumber(props.payMoney)
}

// 关闭弹出框事件
function payCourseInfo() {
    // 清空
    phone.value = null
    consignee.value = null
    checkNumber.value = null
    // 关闭
    offPayCourseEmits('update:isDialogShow', false)
}

// 判断手机号
function isPhone(number: any){
    var reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
    if(number.length ==11){
        if(!reg.test(number)){
            return false;
        }else {
            return true;
        }
    }else {
        return false;
    }
}

// 加载免费观看次数
function loadFreeLookNumber() {
    if (user.isLogin) {
        userInfo().then(response => {
            if (response.data.code === 200) { 
                if (response.data.data.viewVideoNumber == null) {
                    viewVideoNumber.value = 0
                } else {
                    viewVideoNumber.value = response.data.data.viewVideoNumber
                }
            }
        })
    }
    
}

// 加载抵扣次数可使用的次数
function loadFreeNumber(tradeMoney: any) {
    if (tradeMoney <= 100) {
        freeNumber.value = 1
    } else if (tradeMoney > 100 && tradeMoney <= 200) {
        freeNumber.value = 2
    } else if (tradeMoney > 200 && tradeMoney <= 300) {
        freeNumber.value = 3
    } else if (tradeMoney > 300 && tradeMoney <= 400) {
        freeNumber.value = 4
    } else if (tradeMoney > 400 && tradeMoney <= 500) {
        freeNumber.value = 5
    } else {
        freeNumber.value = 5 
    }

    if (freeNumber.value > viewVideoNumber.value) {
        freeNumber.value = viewVideoNumber.value
    }
}

</script>

<style lang="less" scoped>

// 字体红色
.red-text {
    color: red;
}

// 按钮样式
.el-button {
    width: 10rem;
    margin-top: 1rem;
    margin-left: 36%;
    border-radius: 1rem;
}

// 标题文本
.title-text {
    font-size: 24px; 
    font-weight: bolder; 
    margin-top: -1.5rem;
}

// 购买文本
.pay-text {
    font-size: 18px; 
    margin-top: 1rem; 
    margin-bottom: 1rem;
}

// 注意文本
.warning-text {
    margin-top: 2rem;
    font-weight: bolder;
    margin-bottom: 0.5rem; 
}


</style>