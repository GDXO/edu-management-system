import type { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const routes: RouteConfig = {
  path: '/',
  component: Layout,
  meta: {
    title: '课程管理',
    requiresAuth: true
  },
  children: [
    {
      path: '/course',
      name: 'course',
      component: () =>
        import(/* webpackChunkName: 'course' */ '@/views/course/index.vue')
    },
    {
      path: '/course/create',
      name: 'course-create',
      component: () =>
        import(
          /* webpackChunkName: 'course-create' */ '@/views/course/createCourse.vue'
        ),
      meta: {
        title: '创建课程'
      }
    },
    {
      path: '/course/:courseId/edit',
      name: 'course-edit',
      component: () =>
        import(
          /* webpackChunkName: 'course-edit' */ '@/views/course/updateCourse.vue'
        ),
      props: true,
      meta: {
        title: '编辑课程'
      }
    },
    {
      path: '/course/:courseId/section',
      name: 'course-section',
      component: () =>
        import(
          /* webpackChunkName: 'course-section' */ '@/views/course/section.vue'
        ),
      props: true,
      meta: {
        title: '课时管理'
      }
    },
    {
      path: '/course/:courseId/video',
      name: 'course-video',
      component: () =>
        import(
          /* webpackChunkName: 'course-video' */ '@/views/course/video.vue'
        ),
      props: true,
      meta: {
        title: '视频上传'
      }
    }
  ]
}

export default routes
