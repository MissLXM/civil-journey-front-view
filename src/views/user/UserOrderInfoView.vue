<template>
    <!-- 用户订单视图 -->
    <div class="user-order-info-view">
        <div class="user-order-text">我的订单</div>
        <!-- 用户订单容器 -->
        <div class="user-order-info-container">
            <el-empty v-if="order == undefined"/>
            <!-- 用户订单元素 -->
            <div 
                :key="index"
                v-for="(item, index) in order"
                class="user-order-info-item"
            >
                <div class="order-base-info">
                    <div class="order-number">订单编号: {{ item.orderId }}</div>
                    <div class="purchaser-info">
                        <div class="purchaser-name">收货人: {{ item.consignee }}</div>
                        <div class="purchaser-phone">手机号码: {{ item.phone }}</div>
                    </div>
                </div>
                <!-- 课程信息容器 -->
                <div class="course-info-container">
                    <div class="course-cover-info">
                        <div class="cover-text info-text">课程封面</div>
                        <el-image :src="item.courseImage"/>
                    </div>
                    <div class="course-description-info">
                        <div class="description-text info-text">课程简介</div>
                        <div class="course-description">
                            <span>
                                {{ item.courseDescription }}
                            </span>
                        </div>
                    </div>
                    <div class="course-price-info">
                        <div class="price-text info-text">课程价格</div>
                        <div class="course-price">￥{{ item.tradeAmount }}</div>
                    </div>
                    <div class="pay-status">
                        <div class="pay-status-text info-text">支付状态</div>
                        <div v-if="item.status === 0" class="no-pay">
                            <div class="no-pay-text">待支付</div>
                            <el-popconfirm 
                                @confirm="confirmEvent(item)"
                                cancel-button-text="取消"
                                confirm-button-text="确认"
                                title="是否确认支付,不支持退款哦"
                            >
                                <template #reference>
                                    <el-button type="warning">支付</el-button>
                                </template>
                            </el-popconfirm>
                        </div>
                        <div v-else-if="item.status === 1" class="yes-pay-text">已支付</div>
                        <div v-else-if="item.status === 2" class="no-pay">
                            <div class="no-pay-text">已退款</div>
                            <el-button type="danger" @click="deleteOrderEvent(item.orderId)">删除订单</el-button>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { showOrderInfo, deleteOrder } from '@/api/pay';

// 订单信息
const order = ref()

// 挂载函数
onMounted(() => {
    // 获取当前用户所有订单信息
    loadOrderInfo()
})

// 获取当前用户所有订单信息
function loadOrderInfo() {
    showOrderInfo().then(response => {
        if (response.data.code === 200) {
            order.value = response.data.data
            console.log(order.value)
        } else {
            order.value = undefined
        }
    })
} 

// 确认支付事件 
function confirmEvent(item: any) { 

    if (item.useFreeNumber == null) {
        item.useFreeNumber = 0
    }

    // 支付操作
    window.open(
        import.meta.env.VITE_BASE_URL
        + '/payment-center-service/alipay/pay?'
        + 'subject=课程购买订单' + Math.floor(Math.random() * 1000000 + 1)
        + '&orderId=' + item.orderId
        + '&userId=' + item.userId
        + '&courseId=' + item.courseId
        + '&phone=' + item.phone
        + '&consignee=' + item.consignee
        + '&tradeAmount=' + item.tradeAmount
        + '&useFreeNumber=' + item.useFreeNumber
    , '_self', '')
}

// 删除订单
function deleteOrderEvent(orderId: any) {
    deleteOrder(orderId).then(response => {
        if (response.data.code === 200) {
            loadOrderInfo()
            ElMessage.success('删除成功')
        } else {
            ElMessage.error('删除失败')
        }
    })
}

</script>

<style lang="less" scoped>
// 用户订单视图
.user-order-info-view {
    width: 70rem;
    margin-top: 2rem;
    background-color: #fff;

    // 文本
    .user-order-text {
        font-size: 18px;
        color: #9a9a9a;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #eee;
    }

    // 用户订单容器
    .user-order-info-container {
        height: 55.5rem;
        overflow-y: scroll;

        // 订单元素
        .user-order-info-item {
            margin: 1rem;
            padding: 1rem;
            border-radius: 0.5rem;
            background-color: #eee;

            // 订单编号
            .order-base-info {
                display: flex;
                justify-content: space-between;

                padding-bottom: 0.5rem;
                border-bottom: 1px solid #ccc;

                .purchaser-info {
                    display: flex;

                    .purchaser-name {
                        margin-right: 1rem;
                    }
                }
            }
            

            // 课程信息
            .course-info-container {
                display: flex;

                // 文本
                .info-text {
                    margin: 0.5rem 0;
                    padding: 0.5rem 0;
                    text-align: center;
                    border-radius: 0.5rem;
                    background-color: #ddd;
                }

                // 课程封面
                .course-cover-info {

                    .el-image {
                        width: 12rem;
                        height: 8rem;
                        border-radius: 0.3rem;
                    }
                }

                // 课程简介
                .course-description-info {
                    width: 42rem;
                    margin: 0 1rem;

                    .course-description {
                        height: 8rem;
                        display: flex;
                        align-items: center;
                        border-radius: 0.3rem;
                        justify-content: center;
                        background-color: #ddd;

                        text-indent: 1rem;
                        padding-left: 0.5rem;

                        span {
                            overflow: hidden;
                            display: -webkit-box;
                            -webkit-line-clamp: 3;
                            text-overflow: ellipsis;
                            -webkit-box-orient: vertical;
                        }
                    }
                }

                // 价格
                .course-price-info {
                    width: 8rem;
                    margin: 0 1rem 0 0;

                    .course-price {
                        height: 8rem;
                        display: flex;
                        align-items: center;
                        border-radius: 0.3rem;
                        justify-content: center;
                        background-color: #ddd;
                    }
                }

                // 支付状态
                .pay-status {
                    width: 8rem;

                    .no-pay {
                        height: 8rem;
                        text-align: center;
                        border-radius: 0.3rem;
                        background-color: #ddd;

                        .no-pay-text {
                            padding-top: 35%;
                            padding-bottom: 5%;
                        }

                        .el-button {
                            height: 1.5rem;
                            font-size: 10px;
                        }
                    }

                    .yes-pay-text {
                        height: 8rem;
                        display: flex;
                        align-items: center;
                        border-radius: 0.3rem;
                        justify-content: center;
                        background-color: #ddd;
                    }
                }
            }
        }
    }
}
</style>