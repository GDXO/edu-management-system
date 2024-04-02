<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-button @click="addMenuFn">添加菜单</el-button>
    </div>
    <el-table :data="menuTableData" stripe style="width: 100%">
      <el-table-column
        label="编号"
        type="index"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="name"
        label="菜单名称"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="level"
        label="菜单级数"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="icon"
        label="前端图标"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="orderNum"
        label="排序"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row)" type="text" size="small"
            >编辑</el-button
          >
          <el-button @click="handleDelete(scope.row)" type="text" size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { getAllMenus, deleteMenuItem } from '@/API/menu'

export default Vue.extend({
  name: 'MenuIndex',
  data () {
    return {
      menuTableData: []
    }
  },
  created () {
    this.getAllMenusFn()
  },
  methods: {
    // 添加菜单
    addMenuFn () {
      this.$router.push({
        name: 'menu-create'
      })
    },
    // 获取所有菜单列表
    async getAllMenusFn () {
      const { data } = await getAllMenus()

      if (data.code === '000000') {
        this.menuTableData = data.data
      }
    },
    // 菜单编辑
    handleEdit (menuData) {
      this.$router.push({
        name: 'menu-edit',
        params: {
          id: menuData.id
        }
      })
    },
    // 菜单删除
    handleDelete (menuData) {
      this.$confirm('该操作会永久删除该菜单, 是否确认删除?', '删除提示', {
        type: 'warning'
      })
        .then(async () => {
          console.log(menuData.id)
          const { data } = await deleteMenuItem(menuData.id)
          if (data.code === '000000') {
            this.$message.success('删除菜单成功!')
            // 更新数据
            this.getAllMenusFn()
          }
        })
        .catch(err => {
          err === 'cancel'
            ? this.$message.info('已取消删除!')
            : console.log(err)
        })
    }
  }
})
</script>

<style lang="scss" scoped></style>
