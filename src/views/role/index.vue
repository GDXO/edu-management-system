<template>
  <div>
    <el-card class="box-card roleFilterBox">
      <span>筛选搜索</span>
      <el-button type="primary" class="roleFilterBtn" size="small"
        >查询搜索</el-button
      >
      <el-button class="roleFilterBtn" size="small">重置</el-button>
      <el-form
        class="roleFilterForm"
        :model="roleFilterForm"
        ref="roleFilterForm"
      >
        <el-form-item label="搜索条件" prop="filterWords">
          <el-input
            v-model.number="roleFilterForm.filterWords"
            autocomplete="off"
            placeholder="请输入搜索条件"
          ></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button size="small" @click="addRoleFn">添加角色</el-button>
      </div>
      <el-table :data="roleTableData" stripe border style="width: 100%">
        <el-table-column
          label="编号"
          type="index"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="角色名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="description"
          label="描述"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="createdTime"
          label="添加时间"
          align="center"
          :formatter="formateDate"
        ></el-table-column>
        <el-table-column
          label="操作"
          width="160"
          align="center"
          class="roleTableHandleBox"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="allocMenuFn(scope.row)"
              style="margin-left: 10px"
              >分配菜单</el-button
            >
            <el-button type="text" size="small">分配资源</el-button>
            <el-button type="text" size="small" @click="editRoleFn(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="deleteRoleFn(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="roleFilterForm.current"
        :page-sizes="[8, 15, 30, 50]"
        :page-size="8"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      >
      </el-pagination>
    </el-card>

    <el-dialog
      :title="isEdit ? '编辑角色' : '添加角色'"
      :visible.sync="dialogVisible"
      width="30%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <create-or-edit
        v-if="dialogVisible"
        :roleId="roleId"
        :isEdit="isEdit"
        @createOrEditSuccess="createOrEditSuccessFn"
        @cancelHandle="cancelHandleRoleFn"
      />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { getRoles, deleteRole } from '@/API/role'
import { tableFormateDate } from '@/utils/tools'
import CreateOrEdit from './components/createOrEdit.vue'

export default Vue.extend({
  name: 'RoleIndex',
  components: {
    CreateOrEdit
  },
  created () {
    this.loadRoles()
  },
  data () {
    return {
      roleFilterForm: {
        filterWords: '',
        size: 8,
        current: 1
      },
      roleTableData: [],
      totalCount: 0,
      roleId: null,
      dialogVisible: false,
      isEdit: false
    }
  },
  methods: {
    // 获取角色列表事件
    async loadRoles () {
      const { data } = await getRoles(this.roleFilterForm)

      if (data.code === '000000') {
        this.roleTableData = data.data.records
        // 分页总条数
        this.totalCount = data.data.total
      }
    },
    // 添加角色事件
    addRoleFn () {
      this.isEdit = false
      this.dialogVisible = true
    },
    // 编辑角色事件
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    editRoleFn (row: any) {
      this.dialogVisible = true
      this.isEdit = true
      this.roleId = row.id
    },
    // 添加和编辑成功事件
    createOrEditSuccessFn () {
      this.dialogVisible = false
      // 重新获取数据
      this.loadRoles()
    },
    // 删除角色事件
    deleteRoleFn (id: string | number) {
      console.log(id)

      this.$confirm('该操作会永久删除该角色, 请确认操作是否继续?', '删除提示', {
        type: 'warning'
      })
        .then(async () => {
          const { data } = await deleteRole(id)

          if (data.code === '000000') {
            this.$message.success('删除角色成功!')
            this.loadRoles()
          }
        })
        .catch(err => {
          if (err === 'cancel') {
            return this.$message.info('已取消删除!')
          }
          this.$message.error('删除角色出错了!')
          console.log(err)
        })
    },
    // 取消创建或编辑角色事件
    cancelHandleRoleFn () {
      this.dialogVisible = false
    },
    // 分配菜单事件
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    allocMenuFn (row: any) {
      this.$router.push({
        name: 'alloc-menu',
        params: {
          roleId: row.id
        }
      })
    },
    // 分页处理事件
    handleCurrentChange (val: number) {
      this.roleFilterForm.current = val
      this.loadRoles()
    },
    handleSizeChange (val: number) {
      this.roleFilterForm.size = val
      this.roleFilterForm.current = 1
      this.loadRoles()
    },
    // 时间 format
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formateDate (row: any, column: any, cellValue: any) {
      return tableFormateDate(row, column, cellValue)
    }
  }
})
</script>

<style lang="scss" scoped>
.roleFilterBox {
  margin-bottom: 10px;

  .roleFilterBtn {
    float: right;
    margin-bottom: 10px;

    &.el-button--primary {
      margin-left: 10px;
    }
  }

  .roleFilterForm {
    margin-top: 15px;
    margin-left: 80px;

    .el-form-item {
      display: flex;
      margin: 0;
    }
  }
}
</style>
