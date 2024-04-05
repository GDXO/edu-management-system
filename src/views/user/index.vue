<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix userFilterBox">
      <el-form
        :model="userFilterForm"
        :inline="true"
        label-position="top"
        label-width="80px"
      >
        <el-form-item label="手机号">
          <el-input
            v-model="userFilterForm.phone"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="注册时间">
          <el-date-picker
            v-model="userFilterForm.rangeDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd"
            @change="registrationDataChange"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="userFilerSubmitBtn">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="users" stripe style="width: 100%">
      <el-table-column prop="id" label="用户ID"></el-table-column>
      <el-table-column label="头像">
        <template slot-scope="scope">
          <img width="30px" :src="scope.row.portrait || portrait" />
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column
        prop="createTime"
        label="注册时间"
        :formatter="formateDate"
      ></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-text="启用"
            inactive-text="禁用"
            active-value="ENABLE"
            inactive-value="DISABLE"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.status === 'ENABLE'"
            >禁用</el-button
          >
          <el-button
            type="text"
            @click="userAssignRolesFn(scope.row)"
          >分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="userFilterForm.currentPage"
      :page-sizes="[8, 15, 30, 50, 100]"
      :page-size="8"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
    >
    </el-pagination>

    <el-dialog
      title="分配角色"
      width="30%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-select
        v-model="roleIdList"
        multiple
        placeholder="请选择"
      >
        <el-option
          v-for="item in roles"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAllocRole"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </el-card>
</template>

<script lang="ts">
import Vue from 'vue'

import { tableFormateDate } from '@/utils/tools'
import { getUserPages } from '@/API/users'
import { getAllRoles, allocateUserRoles, getUserRoles } from '@/API/role'
import defaultAvatar from '@/assets/images/defaultAvatar.png'

export default Vue.extend({
  name: 'UserIndex',
  data () {
    return {
      userFilterForm: {
        phone: '',
        rangeDate: [],
        currentPage: 1,
        pageSize: 8,
        startCreateTime: '',
        endCreateTime: ''
      },
      users: [],
      portrait: defaultAvatar,
      totalCount: 0,
      dialogVisible: false,
      roles: [],
      roleIdList: [],
      currentRow: null
    }
  },
  created () {
    this.loadUsers()
  },
  methods: {
    // 时间筛选确定时间
    registrationDataChange (selectedDate) {
      if (selectedDate.length) {
        this.userFilterForm.startCreateTime = selectedDate[0]
        this.userFilterForm.endCreateTime = selectedDate[1]
      }
    },
    // 获取用户列表
    async loadUsers () {
      const { data } = await getUserPages(this.userFilterForm)

      if (data.code === '000000') {
        this.users = data.data.records

        // 总条数
        this.totalCount = data.data.total
      }
    },
    // 分页操作
    handleSizeChange (val) {
      this.userFilterForm.pageSize = val
      this.userFilterForm.currentPage = 1

      // 重新获取数据
      this.loadUsers()
    },
    handleCurrentChange (val) {
      this.userFilterForm.currentPage = val

      // 重新获取数据
      this.loadUsers()
    },
    // 分配角色点击事件
    async userAssignRolesFn (row) {
      // 当前行数据
      this.currentRow = row

      // 获取所有角色
      this.loadRoles()

      // 获取用户拥有的角色
      const { data } = await getUserRoles(this.currentRow.id)

      if (data.code === '000000') {
        this.roleIdList = data.data.map(item => item.id)
      }

      this.dialogVisible = true
    },
    // 获取所有角色
    async loadRoles () {
      const { data } = await getAllRoles()

      if (data.code === '000000') {
        this.roles = data.data
      }
    },
    // 分配角色点击事件
    async handleAllocRole () {
      const { data } = await allocateUserRoles({
        userId: this.currentRow.id,
        roleIdList: this.roleIdList
      })

      if (data.code === '000000') {
        this.$message.success('分配角色成功!')
        this.dialogVisible = false
      }
    },
    // 时间格式化
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formateDate (row: any, column: any, cellValue: any) {
      return tableFormateDate(row, column, cellValue)
    }
  }
})
</script>

<style lang="scss" scoped>
.el-card {
  background: transparent;

  .userFilterBox {
    .el-form-item {
      margin-bottom: 0;

      .userFilerSubmitBtn {
        margin-top: 50px;
      }
    }
  }

  .el-card__body {
    background: #fff;

    .el-table {
      margin-bottom: 10px;
    }
  }
}
</style>
