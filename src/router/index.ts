import { userStore } from '@/stores/user';
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: () => import('@/views/LayoutView.vue'),
      redirect: () => {
        return { 
          path: '/home' 
        }
      },
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('@/views/home/HomeView.vue')
        },
        {
          path: '/course',
          name: 'course',
          component: () => import('@/views/course/CourseView.vue')
        },
        {
          path: '/article',
          name: 'article',
          component: () => import('@/views/article/ArticleView.vue')
        },
        {
          path: '/message',
          name: 'message',
          component: () => import('@/views/message/MessageView.vue')
        },
        {
          path: '/feedback',
          name: 'feedback',
          component: () => import('@/views/feedback/FeedbackView.vue'),
          redirect: () => {
            return { 
              path: '/noticeCenter' 
            }
          },
          children: [
            {
              path: '/noticeCenter',
              name: 'noticeCenter',
              component: () => import('@/views/feedback/NoticeCenter.vue')
            },
            {
              path: '/opinionFeedback',
              name: 'opinionFeedback',
              component: () => import('@/views/feedback/OpinionFeedback.vue')
            },
            {
              path: '/onlineCustomer',
              name: 'onlineCustomer',
              component: () => import('@/views/feedback/OnlineCustomer.vue')
            },
          ]
        },
        {
          path: '/courseVideoPlay/:courseId',
          name: 'courseVideoPlay',
          component: () => import('@/views/course/CourseVideoPlayView.vue')
        },
        {
          path: '/courseVideoPlayVideoId/:videoId/:courseId',
          name: 'courseVideoPlayVideoId',
          component: () => import('@/views/course/CourseVideoPlayView.vue')
        },
        {
          path: '/courseVideoPlayByVideoId/:videoId',
          name: 'courseVideoPlayByVideoId',
          component: () => import('@/views/course/CourseVideoPlayView.vue')
        },
        {
          path: '/articleInfo/:articleId',
          name: 'articleInfo',
          component: () => import('@/views/article/ArticleInfoView.vue')
        },
        {
          path: '/articleRelease',
          name: 'articleRelease',
          component: () => import('@/views/article/ArticleReleaseView.vue')
        },
        {
          path: '/messageInfo/:technicalId',
          name: 'messageInfo',
          component: () => import('@/views/message/MessageInfoView.vue')
        },
        {
          path: '/userCenterParams/:navId',
          name: 'userCenterParams',
          component: () => import('@/views/user/UserCenterView.vue'),
          children: [
            {
              path: '/userInfo',
              name: 'userInfo',
              component: () => import('@/views/user/UserInfoView.vue')
            },
            {
              path: '/userArticleInfoParams/:childrenNavId',
              name: 'userArticleInfoParams',
              component: () => import('@/views/user/UserArticleInfoView.vue'),
              children: [
                {
                  path: '/userArticleCollection',
                  name: 'userArticleCollection',
                  component: () => import('@/components/user/article/UserArticleCollection.vue')
                },
                {
                  path: '/userArticleHistory',
                  name: 'userArticleHistory',
                  component: () => import('@/components/user/article/UserArticleHistory.vue')
                },
                {
                  path: '/userArticleRelease',
                  name: 'userArticleRelease',
                  component: () => import('@/components/user/article/UserArticleRelease.vue')
                }
              ]
            },
            {
              path: '/userCourseInfo',
              name: 'userCourseInfo',
              component: () => import('@/views/user/UserCourseInfoView.vue'),
              children: [
                {
                  path: '/userCourseCollection',
                  name: 'userCourseCollection',
                  component: () => import('@/components/user/course/UserCourseCollection.vue')
                },
                {
                  path: '/userVideoHistory',
                  name: 'userVideoHistory',
                  component: () => import('@/components/user/course/UserVideoHistory.vue')
                }
              ]
            },
          ]
        },
        {
          path: '/userCenter',
          name: 'userCenter',
          component: () => import('@/views/user/UserCenterView.vue'),
          children: [
            {
              path: '/userInfo',
              name: 'userInfo',
              component: () => import('@/views/user/UserInfoView.vue')
            },
            {
              path: '/userArticleInfo',
              name: 'userArticleInfo',
              component: () => import('@/views/user/UserArticleInfoView.vue'),
              children: [
                {
                  path: '/userArticleCollection',
                  name: 'userArticleCollection',
                  component: () => import('@/components/user/article/UserArticleCollection.vue')
                },
                {
                  path: '/userArticleHistory',
                  name: 'userArticleHistory',
                  component: () => import('@/components/user/article/UserArticleHistory.vue')
                },
                {
                  path: '/userArticleRelease',
                  name: 'userArticleRelease',
                  component: () => import('@/components/user/article/UserArticleRelease.vue')
                }
              ]
            },
            {
              path: '/userCourseInfo',
              name: 'userCourseInfo',
              component: () => import('@/views/user/UserCourseInfoView.vue'),
              children: [
                {
                  path: '/userCourseCollection',
                  name: 'userCourseCollection',
                  component: () => import('@/components/user/course/UserCourseCollection.vue')
                },
                {
                  path: '/userVideoHistory',
                  name: 'userVideoHistory',
                  component: () => import('@/components/user/course/UserVideoHistory.vue')
                }
              ]
            },
            {
              path: '/userOrderInfo',
              name: 'userOrderInfo',
              component: () => import('@/views/user/UserOrderInfoView.vue')
            },
            {
              path: '/userApplyTeacher',
              name: 'userApplyTeacher',
              component: () => import('@/views/user/UserApplyTeacherView.vue')
            },
            {
              path: '/userReleaseCourse',
              name: 'userReleaseCourse',
              component: () => import('@/views/user/UserReleaseCourse.vue')
            },
          ]
        },
      ],
    },
  ]
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  const user = userStore()
  if (!user.isLogin && to.path !== '/home') {
    ElMessage.info('请先登录')
    next({ path: '/home', replace: true, force: true})
  } else {
    next()
  }
})

export default router
