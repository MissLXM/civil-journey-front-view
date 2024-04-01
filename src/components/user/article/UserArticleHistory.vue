<template>
    <!-- 用户文章浏览历史视图 -->
    <div class="user-article-history-view">
        <!-- 用户文章浏览历史容器 -->
        <div class="user-article-history-container">
            <!-- 用户文章元素容器 -->
            <div class="user-article-history-item-container" v-loading="articleLoading">
                <el-empty v-if="articleInfo.records.length === 0" />
                <!-- 用户文章元素 -->
                <div 
                    v-else
                    :key="index"
                    @click="routerArticleInfo(item.articleId)"
                    v-for="(item, index) in articleInfo.records"
                    class="user-article-history-item"
                >
                    <div class="left-container">
                        <el-image :src="item.articleImage"/>
                    </div>
                    <div class="right-container">
                        <div class="middle-title">{{ item.articleTitle }}</div>
                        <div class="middle-creator">
                            <el-avatar :src="item.creatorAvatar"/>
                            {{ item.creatorName }}
                        </div>
                        <div class="middle-info-container">
                            <div class="praise-container">
                                <svg-icon icon-class="praise"/>
                                <span class="span-one">{{ item.likeNumber }}</span>
                            </div>
                            <div class="collection-container">
                                <svg-icon icon-class="article-collection"/>
                                <span>{{ item.collectionNumber }}</span>   
                            </div>
                            <div class="view-container">
                                <svg-icon icon-class="view"/>
                                <span>{{ item.browseNumber }}</span>   
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <!-- 分页 -->
            <div class="course-page-container">
                    <el-config-provider :locale="zhCn">
                        <el-pagination
                            background
                            :total="articleInfo.total"
                            style="float: right;"
                            :page-sizes="[10, 20, 30, 40]"
                            @current-change="handleCurrentChange"
                            layout="total, prev, pager, next,jumper"
                        >
                        </el-pagination>
                    </el-config-provider>
                </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { ref, onMounted } from 'vue';
import { showHistoryArticle } from '@/api/article';
import zhCn from 'element-plus/es/locale/lang/zh-cn';

// 分页参数
const pageParams = ref({
    currentPage: 1,
    pageSize: 12
})
// 文章信息
const articleInfo = ref({
    total: 0,
    records: [
        {
            articleId: 0,
            likeNumber: 1,
            browseNumber: 1,
            creatorName: '',
            articleImage: '',
            articleTitle: '',
            creatorAvatar: '',
            collectionNumber: 1
        }
    ]
})
// 加载状态
const articleLoading = ref(false)

 
// 挂载函数
onMounted(() => {
    // 加载浏览文章历史信息
    loadHistoryArticle()
})

// 加载浏览文章历史信息
function loadHistoryArticle() {
    showHistoryArticle(pageParams.value).then(response => {
        if (response.data.code === 200) {
            articleInfo.value = response.data.data
        } else {
            articleInfo.value.records = []
        }
    })
}
 
// 跳转文章详情页 
function routerArticleInfo(id: any) {
    router.push({
        name: 'articleInfo',
        params: {
            articleId: id
        }
    })
}

// 加载事件
function handleCurrentChange(val: any) {
    articleLoading.value = true
    
    // 分页参数调整
    pageParams.value.currentPage = val

    // 发送请求
    loadHistoryArticle()
    setTimeout(() => {
        articleLoading.value = false
    }, 1000)
}

</script>

<style lang="less" scoped>
// 用户文章浏览历史视图
.user-article-history-view {
    margin-top: 2rem;
    margin-left: 2rem;
    // 用户文章浏览历史容器   
    .user-article-history-container {
        
        // 用户文章元素容器
        .user-article-history-item-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            
            // 用户文章元素
            .user-article-history-item {
                width: 20rem;
                height: 7rem;
                display: flex;
                cursor: pointer;
                padding: 0.8rem;
                margin-right: 1rem;
                margin-bottom: 1.5rem;
                border-radius: 0.3rem;
                background-color: #eee;

                // 左侧容器
                .left-container {

                    .el-image {
                        height: 7rem;
                        width: 8.5rem;
                        border-radius: 0.5rem;
                    }
                }

                // 右侧容器
                .right-container {
                    font-size: 14px;
                    margin-left: 1rem;
                    margin-top: 0.8rem;

                    // 标题
                    .middle-title {
                        overflow: hidden;
                        margin-right: 0.5rem;
                        display: -webkit-box;
                        margin-bottom: 1rem;
                        -webkit-line-clamp: 1;
                        text-overflow: ellipsis;
                        -webkit-box-orient: vertical;
                    }

                    // 作者
                    .middle-creator {
                        display: flex;
                        align-items: center;
                        margin-bottom: 0.5rem;

                        .el-avatar {
                            margin-right: 0.5rem;
                        }
                    }

                    // 图标容器
                    .middle-info-container {
                        display: flex;
                        color: #666;
                        font-size: 12px;

                        .svg-icon {
                            zoom: 0.8;
                            margin-right: 0.2rem;
                        }

                        span {
                            margin-right: 2rem;
                            margin-top: 0.15rem;
                            margin-left: 0.15rem;
                            vertical-align: 0.2rem;

                            &:nth-child(3n) {
                                margin-right: 0rem;
                            }
                        }

                        .praise-container, .collection-container, .view-container {
                            display: flex;
                        }

                    }
                }
            }            
        }

        // 分页容器
        .course-page-container {
            width: 100%;
            display: flex;
            margin-top: 1rem;
            padding-bottom: 2.5rem;
            justify-content: center;
        }
    }
}
</style>