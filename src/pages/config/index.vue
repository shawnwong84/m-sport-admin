<template>
  <div class="info-table">
    <div class="fx align-items justify-between mt-15 mb-15 ml-10 mr-10">
      <div class="fs-18 fw-600">礼物管理</div>
      <div class="fx align-items">
        <div class="ml-10"><el-input
          placeholder="输入礼物名进行搜索"
          size="small"
          v-model="search">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input></div>
        <div class="ml-10" @click="add"><el-button type="primary"  size="small" icon="el-icon-plus">增加</el-button></div>
      </div>
    </div>
    <el-table
      :data="tableData.filter(data => !search || data.giftName.toLowerCase().includes(search.toLowerCase()))"
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
          label="礼物图片">
        <template slot-scope="scope">
          <div v-if="scope.row.giftIcon">
            <img  :src="scope.row.giftIcon" width="100px" height="55px"/>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="giftName"
        label="礼物名">
      </el-table-column>
      <el-table-column
        prop="giftGold"
        label="所需金币">
      </el-table-column>
      <el-table-column
          label="是否显示"
          align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isOnline === 0">不显示</span>
          <span  v-if="scope.row.isOnline === 1">显示</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right">
        <template slot-scope="scope">
          <div class="fx cursor">
            <div class="update w-32 bg-f2" @click="update(scope.row, 1)"><img src="../../assets/image/update-q.png"></div>
            <div class="ml-10"  @click="update(scope.row, 2)"><img src="../../assets/image/delete-q.png"></div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="礼物管理" :visible.sync="dialogFormVisible"  width="420px">
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="礼物名" :label-width="formLabelWidth" prop="giftName">
          <el-input v-model="form.giftName" autocomplete="off" style="width: 238px;"></el-input>
        </el-form-item>
        <el-form-item label="礼物图片" :label-width="formLabelWidth">
          <div>
            <el-upload
                class="upload-demo"
                :action="'http://hszhibo.live/sequoiaBack/file/fileUpload'"
                :on-remove="handleRemove"
                :on-change="handleChange"
                :file-list="fileList"
                :headers='headers'
                list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </div>
          <img :src="form.giftIcon" width="100px" v-if="form.giftIcon !== ''">
        </el-form-item>
        <el-form-item label="金币" :label-width="formLabelWidth" prop="giftGold">
          <el-input  v-model="form.giftGold" autocomplete="off" style="width: 238px;"></el-input>
        </el-form-item>
        <el-form-item label="是否显示" :label-width="formLabelWidth" prop="isOnline">
          <el-radio  v-model="form.isOnline" :label="0">不显示</el-radio>
          <el-radio  v-model="form.isOnline" :label="1">显示</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clear">取 消</el-button>
        <el-button type="primary" @click="addSumbit" v-if="isAdd">确 定</el-button>
        <el-button type="primary" @click="updateSumbit" v-else>确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {Cookie} from '../../api/util'
export default {
    name: 'index',
    data () {
      return {
        currents: {
          currentPage: 1,
          currentTotal: 0
        },
        ps: {
          pageNo: 1,
          pageSize: 15
        },
        isAdd: false,
        search: '',
        fileList: [],
        tableData: [],
        form: {
          deleted: 0,
          giftGold: 0,
          giftIcon: '',
          giftName: '',
          id: 0,
          isOnline: 0
        },
        formLabelWidth: '125px',
        dialogFormVisible: false,
        headers: {
          'token': Cookie.get('token')
        },
        rules: {
          giftName: [
            { required: true, message: '请输入礼物名', trigger: 'blur' }
          ]
        }
      }
    },
    mounted () {
      this.getInfo(1)
    },
    methods: {
      handleChange (file, fileList) {
        this.fileList = fileList.slice(-1)
      },
      handleRemove (file, fileList) {
        console.log(file, fileList)
      },
      clear () {
        let param = {
          deleted: 0,
          giftGold: 0,
          giftIcon: '',
          giftName: '',
          id: 0,
          isOnline: 0
        }
        this.fileList = []
        this.form = Object.assign(param)
        this.dialogFormVisible = false
      },
      add () {
        this.clear()
        this.isAdd = true
        this.dialogFormVisible = true
      },
      update (data, num) {
        if (num === 1) {
          this.form = Object.assign(data)
          this.dialogFormVisible = true
          this.isAdd = false
        }
        if (num === 2) {
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$set(data, `deleted`, 1)
            this.form = Object.assign({}, data)
            this.updateInfo()
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        }
      },
      // 查询礼物列表
      getInfo () {
        let param = {
          pageNum: this.ps.pageNo,
          pageSize: this.ps.pageSize
        }
        this.$axios('post', '/gift/getGiftList', param).then((res) => {
          if (res.code === 200) {
            this.tableData = res.data.dataList
            this.currents.currentTotal = res.data.countSize
          }
        })
      },
      updateInfo () {
        let param = this.form
        this.$axios('post', '/gift/editGift', param).then((res) => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getInfo()
            this.clear()
          } else {
            this.$message({
              type: 'warning',
              message: res.msg
            })
          }
        })
      },
      addImg () {
        console.log(this.fileList)
        if (this.fileList.length !== 0) {
          let imgList = []
          for (let i = 0; i < this.fileList.length; i++) {
            imgList.push(this.fileList[i].response.data)
          }
          this.$set(this.form, `giftIcon`, imgList.join(','))
        }
      },
      addSumbit () {
        this.addImg()
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$delete(this.form, 'id')
            let param = this.form
            this.$axios('post', '/gift/addGift', param).then((res) => {
              if (res.code === 200) {
                this.$message({
                  type: 'success',
                  message: '新增成功!'
                })
                this.getInfo(1)
                this.clear()
              } else {
                this.$message({
                  type: 'warning',
                  message: res.msg
                })
              }
            })
          } else {
            return false
          }
        })
      },
      // 修改
      updateSumbit () {
        this.addImg()
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.updateInfo()
          } else {
            return false
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
