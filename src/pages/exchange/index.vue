<template>
  <div class="info-table">
    <div class="fx align-items justify-between mt-15 mb-15 ml-10 mr-10">
      <div class="fs-18 fw-600">信号源配置</div>
      <div class="fx align-items">
        <div class="mr-10"><el-button type="primary" :disabled="disabled" @click="add" size="small" icon="el-icon-plus">批量生成兑换码</el-button></div>
        <div><el-input
          placeholder="输入兑换码进行搜索"
          size="small"
          v-model="search">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input></div>
        <div class="ml-10">
          <el-date-picker
            size="small"
            v-model="date"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd" style="width: 250px">
          </el-date-picker>
        </div>
        <div class="ml-10 mr-10">
          <el-select v-model="status" placeholder="请选择" size="small" style="width: 100px">
            <el-option :value='0' label="未兑换"></el-option>
            <el-option :value='1' label="已兑换"></el-option>
          </el-select></div>
        <el-button type="primary"  size="small" icon="el-icon-search" @click="getInfo(date[1],date[0])">查询</el-button>
        <el-button type="success" size="small" class="ml-10"  icon="el-icon-folder-checked" @click="getExp(date[1],date[0])" style="margin-right: 10px">导出所查询的数据</el-button>
      </div>
    </div>
    <el-table
      :data="tableData.filter(data => !search || data.exchangeCode.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%;"
      header-cell-class-name="bg-f5">
      <el-table-column
        fixed
        type="index"
        label="序号"
        align="center"
        width="200">
      </el-table-column>
      <el-table-column
        prop="exchangeCode"
        label="生成的兑换码">
      </el-table-column>
      <el-table-column
        label="兑换状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0">未兑换</span>
          <span v-if="scope.row.status === 1">已兑换</span>
        </template>
      </el-table-column>
      <el-table-column
        width="300"
        align="center"
        label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      background
      :hide-on-single-page="true"
      @current-change="handleCurrentChange"
      :current-page="currents.currentPage"
      :page-sizes="[15, 20, 30]"
      :page-size="15"
      layout="total, prev, pager, next, jumper"
      :total="currents.currentTotal">
    </el-pagination>
    <el-dialog title="批量生成兑换码" :visible.sync="dialogFormVisible"  width="420px">
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="生成数量" :label-width="formLabelWidth" prop="codeNums">
          <el-input type="age" v-model.number="form.codeNums" autocomplete="off" style="width: 238px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clear">取 消</el-button>
        <el-button type="primary" @click="addSumbit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'index',
    data () {
      var checSort = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('栏目序号不能为空'))
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'))
          } else {
            if (value < 0) {
              callback(new Error('序号必须大于0'))
            } else if (value >= 1000) {
              callback(new Error('序号必须小于1000'))
            } else {
              callback()
            }
          }
        }, 1000)
      }
      return {
        date: '',
        status: 0,
        form: {
          codeNums: 0
        },
        disabled: false,
        currents: {
          currentPage: 1,
          currentTotal: 0
        },
        ps: {
          pageNo: 1,
          pageSize: 15
        },
        search: '',
        tableData: [],
        expData: [],
        formLabelWidth: '125px',
        dialogFormVisible: false,
        expList: [],
        rules: {
          codeNums: [
            { validator: checSort, trigger: 'blur' }
          ]
        },
        tableTitleData: [
          {
            label: 'ID',
            prop: 'id'
          },
          {
            label: '生成的兑换码',
            prop: 'exchangeCode'
          },
          {
            label: '兑换码状态',
            prop: 'status'
          },
          {
            label: '创建时间',
            prop: 'createTime'
          }
        ]
      }
    },
    mounted () {
      this.getInfo()
    },
    methods: {
      clear () {
        this.erro = false
        this.checkId = []
        let param = {
          codeNums: 0
        }
        this.form = Object.assign(this.form, param)
        this.dialogFormVisible = false
      },
      add () {
        this.clear()
        this.dialogFormVisible = true
      },
      getInfo (end, start) {
        if (end && start) {
          end = end + ' 23:59:59'
          start = start + ' 00:00:00'
        } else {
          end = ''
          start = ''
        }
        this.$axios('post', '/user/exchangeCodeList?pageNo=' + this.ps.pageNo + '&pageSize=' + this.ps.pageSize + '&status=' + this.status + '&start=' + start + '&end=' + end).then((res) => {
          if (res.code === '0') {
            this.tableData = res.data.list
            this.currents.currentTotal = res.data.total
          }
        })
      },
      getExp (end, start) {
        if (end && start) {
          end = end + ' 23:59:59'
          start = start + ' 00:00:00'
        } else {
          end = ''
          start = ''
        }
        this.$axios('post', '/user/exp?&status=' + this.status + '&start=' + start + '&end=' + end).then((res) => {
          if (res.code === '0') {
            this.expList = res.data
            if (this.expList.length !== 0) {
              this.handleDownloadData()
            }
          }
        })
      },
      handleCurrentChange (val) {
        this.ps.pageNo = val
        this.getInfo()
      },
      handleDownloadData () {
        // 导出表格的表头设置
        let allColumns = this.tableTitleData
        var columnNames = []
        var columnValues = []
        for (var i = 0; i < allColumns.length; i++) {
          columnNames[i] = allColumns[i].label
          columnValues[i] = allColumns[i].prop
        }
        require.ensure([], () => {
          const { export_json_to_excel } = require('../../vendor/Export2Excel')
          const tHeader = columnNames
          const filterVal = columnValues

          const list = this.expList
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '导出excel列表demo')
        })
      },
      formatJson (filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      addSumbit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.disabled = true
            this.$axios('post', '/user/bacthExchangeCode?codeNums=' + this.form.codeNums).then((res) => {
              if (res.code === '0') {
                this.disabled = false
                this.getInfo()
              }
            })
          } else {
            return false
          }
        })
      },
      fromDate (date) {
        var d = new Date(date)
        var datetime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
        return datetime
      }
    }
  }
</script>

<style scoped>

</style>
