<template>
    <!-- 用户文章收藏夹视图 -->
    <div class="user-article-collection-view">
        <!-- 用户文章收藏夹容器 -->
        <div class="user-article-collection-container">
            <!-- 用户文章元素容器 -->
            <div class="user-article-collection-item-container" v-loading="articleLoading">
                <el-empty v-if="articleInfo.records.length === 0" />
                <!-- 用户文章元素 -->
                <div 
                    v-else
                    :key="index"
                    v-for="(item, index) in articleInfo.records"
                    class="user-article-collection-item"
                >
                    <div class="left-container" @click="routerArticleInfo(item.articleId)">
                        <el-image :src="item.articleImage" />
                    </div>
                    <div class="middle-container" @click="routerArticleInfo(item.articleId)">
                        <div class="middle-title">{{ item.articleTitle }}</div>
                        <div class="middle-creator">作者: {{ item.creatorName }} </div>
                        <div class="middle-info-container">
                            <div class="praise-container">
                                <svg-icon icon-class="praise"/>
                                <span class="span-one">{{ item.likeNumber }}</span>
                            </div>
                            <div class="collection-container">
                                <svg-icon icon-class="article-collection" class="sundry-number-icon"/> 
                                <span class="sundry-number-text"> {{ item.collectionNumber }} </span>
                            </div>
                        </div>
                    </div>
                    <div class="right-container" v-if="item.isCollection == 1">
                        <el-button type="primary" @click="cancelCollection(item.articleId)">取消收藏</el-button>
                    </div>
                </div>

            </div>

            <!-- 分页 -->
            <div class="article-page-container">
                    <el-config-provider :locale="zhCn">
                        <el-pagination
                            background
                            :total="articleInfo.total"
                            style="float: right;"
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
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { showCollectionArticle, collectionArticleEvent } from '@/api/article';

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
            likeNumber: '',
            creatorName: '',
            isCollection: 1,
            articleTitle: '',
            articleImage: '',
            collectionNumber: 1
        }
    ]
})
// 加载状态
const articleLoading = ref(false)


// 挂载函数
onMounted(() => {
    // 加载文章收藏信息
    loadCollectionArticle()
})

// 加载文章收藏信息
function loadCollectionArticle() {
    showCollectionArticle(pageParams.value).then(response => {
        if (response.data.code === 200) {
            articleInfo.value = response.data.data
        } else {
            articleInfo.value.records = []
        }
    })
}

// 跳转文章详细界面 
function routerArticleInfo(id: any) {
    router.push({
        name: 'articleInfo',
        params: {
            articleId: id
        }
    })
}

// 分页事件
function handleCurrentChange(val: any) {
    articleLoading.value = true

    // 分页参数调整
    pageParams.value.currentPage = val

    // 发送请求
    loadCollectionArticle()
    setTimeout(() => {
        articleLoading.value = false
    }, 1000)
}

// 取消收藏 
function cancelCollection(articleId: any) {
    ElMessageBox.confirm('确定取消收藏吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        // 发送取消收藏请求
        collectionArticleEvent(articleId).then(response => {
            if (response.data.code === 200) {
                ElMessage.success('取消收藏成功')
                pageParams.value.currentPage = 1
                loadCollectionArticle()
            } else {
                ElMessage.error('取消收藏失败')
            }
        })
    })
}

</script>

<style lang="less" scoped>
// 用户文章收藏夹视图
.user-article-collection-view {
    margin-top: 2rem;
    margin-left: 2rem;
    // 用户文章收藏夹容器   
    .user-article-collection-container {
        
        // 用户文章元素容器
        .user-article-collection-item-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            
            // 用户文章元素
            .user-article-collection-item {
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

                // 居中容器
                .middle-container {
                    font-size: 14px;
                    margin-top: 0.8rem;
                    margin-left: 1rem;
                    margin-right: 1rem;

                    // 标题
                    .middle-title {
                        margin-bottom: 2.3rem;

                        overflow: hidden;
                        display: -webkit-box;
                        -webkit-line-clamp: 1;
                        text-overflow: ellipsis;
                        -webkit-box-orient: vertical;
                    }

                    // 作者
                    .middle-creator {
                        margin-bottom: 0.4rem;
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
                            vertical-align: 0.2rem;
                        }

                        .span-one {
                            margin-right: 1.3rem;
                        }
                    }
                }

                // 右侧容器
                .right-container {
                    .el-button {
                        width: 1rem;
                        height: 100%;
                    }
                    :deep(.el-button>span) {
                        writing-mode: vertical-rl;
                    }
                }
            }            
        }

        // 分页容器
        .article-page-container {
            width: 100%;
            display: flex;
            margin-top: 1rem;
            padding-bottom: 2.5rem;
            justify-content: center;
        }
    }
}
</style>