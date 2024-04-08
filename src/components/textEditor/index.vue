<template>
  <div class="editorContainer">
    <div>
      <Toolbar
        class="editorToolbar"
        :editor="editor"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <Editor
        class="editorMainBox"
        v-model="html"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="onCreated"
        @onChange="onChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

import { uploadCourseImg } from '@/API/course'

export default Vue.extend({
  name: 'TextEditor',
  components: { Editor, Toolbar },
  props: {
    value: {
      type: String
    }
  },
  data () {
    return {
      editor: null,
      html: '',
      toolbarConfig: {},
      editorConfig: {
        placeholder: '请输入内容...',
        MENU_CONF: {
          uploadImage: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            async customUpload (file: File, insertFn: any) {
              const fd = new FormData()
              fd.append('file', file)

              const { data } = await uploadCourseImg(fd)

              if (data.code === '000000') {
                const { name: url } = data.data

                insertFn(url)
              }
            }
          }
        }
      },
      mode: 'default' // or 'simple'
    }
  },
  mounted () {
    setTimeout(() => {
      this.html = this.value
    }, 1500)
  },
  methods: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onCreated (editor: any) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange (editor: any) {
      this.$emit('input', editor.getHtml())
    }
  },
  beforeDestroy () {
    const editor = this.editor
    if (editor == null) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (editor as any).destroy() // 组件销毁时，及时销毁编辑器
  }
})
</script>

<style lang="scss" scoped>
.editorContainer,
.editorToolbar {
  border: 1px solid #ccc;
}

.editorMainBox {
  height: 560px;
  overflow-y: hidden;
}
</style>
