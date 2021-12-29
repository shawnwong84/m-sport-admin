<template>
  <div class="info-table">
    <div class="fx align-items justify-between mt-15 mb-15 ml-10 mr-10">
      <div class="fs-18 fw-600">广告管理</div>
      <div class="fx align-items">
        <div><el-input
          placeholder="输入广告标题进行搜索"
          size="small"
          v-model="search">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input></div>
        <div class="ml-10"><el-button type="primary"  size="small" icon="el-icon-plus" @click="add">增加</el-button></div>
      </div>
    </div>
    <el-table
        :data="tableData.filter(data => !search || data.adTitle.toLowerCase().includes(search.toLowerCase()))"
        style="width: 100%;"
        header-cell-class-name="bg-f5"
    >
      <el-table-column
          fixed
          type="index"
          label="序号"
          align="center"
          width="200">
      </el-table-column>
      <el-table-column
          label="广告图片">
        <template slot-scope="scope">
          <img :src="scope.row.picPath" width="100px" height="55px"/>
        </template>
      </el-table-column>
      <el-table-column
          prop="adTitle"
          label="广告标题">
      </el-table-column>
      <el-table-column
          label="广告类型"
          align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.adType === 1">APP顶部广告</span>
          <span v-if="scope.row.adType === 2">资讯广告</span>
          <span v-if="scope.row.adType === 3">pc首页广告</span>
          <span v-if="scope.row.adType === 4">官方活动</span>
          <span v-if="scope.row.adType === 5">红榜广告</span>
        </template>
      </el-table-column>
      <el-table-column
          prop="adDesc"
          label="广告描述">
      </el-table-column>
      <el-table-column
          prop="adUrl"
          label="跳转路径">
      </el-table-column>
      <el-table-column
          label="修改时间">
        <template slot-scope="scope">
          <span>{{scope.row.updateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column
          fixed="right">
        <template slot-scope="scope">
          <div class="fx cursor">
            <div class="update w-32 bg-f2" @click="update(scope.row)"><img src="../../assets/image/update-q.png"></div>
            <div class="ml-10" @click="deleteSumbit(scope.row)"><img src="../../assets/image/delete-q.png"></div>
          </div>
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
    <el-dialog :title="isCopy ? '复制到所选渠道':'广告管理'" :visible.sync="dialogFormVisible"  width="550px">
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="广告图片" :label-width="formLabelWidth">
          <div style="color: red;font-size: 12px;">{{desc}}</div>
          <div>
            <el-upload
                class="upload-demo"
                :action="'http://hszhibo.live/sequoiaBack/file/fileUpload'"
                :on-remove="handleRemove"
                :on-change="handleChange"
                :file-list="fileList"
                :headers='headers'
                list-type="picture">
              <el-button size="small" type="primary" >点击上传</el-button>
              <span class="fs-12 c-red" v-if="erroImg">请上传图片</span>
            </el-upload>
          </div>
          <img :src="form.picPath" width="200px" v-if="form.picPath !== ''">
        </el-form-item>
        <el-form-item label="广告标题" :label-width="formLabelWidth"  prop="adTitle">
          <el-input v-model="form.adTitle" autocomplete="off" style="width: 217px;"></el-input>
        </el-form-item>
        <el-form-item label="广告类型" :label-width="formLabelWidth"  prop="adType">
          <el-radio v-model="form.adType" :label="1" @change="checkDesc(1)">APP顶部广告</el-radio>
          <el-radio v-model="form.adType" :label="2" @change="checkDesc(2)">资讯广告</el-radio>
          <el-radio v-model="form.adType" :label="3" @change="checkDesc(3)">pc首页广告</el-radio>
          <el-radio v-model="form.adType" :label="4" @change="checkDesc(4)">官方活动</el-radio>
          <el-radio v-model="form.adType" :label="5" @change="checkDesc(5)">红榜广告</el-radio>
        </el-form-item>
        <el-form-item label="广告描述" :label-width="formLabelWidth" prop="adDesc">
          <el-input v-model="form.adDesc" autocomplete="off" style="width: 217px;"></el-input>
        </el-form-item>
        <el-form-item label="跳转路径" :label-width="formLabelWidth" prop="sysUrl">
          <el-input  v-model="form.adUrl"  autocomplete="off" style="width: 217px;"></el-input>
        </el-form-item>
<!--        <el-form-item label="创建时间" :label-width="formLabelWidth" prop="updateTime">-->
<!--          <el-date-picker-->
<!--              v-model="form.updateTime"-->
<!--              type="datetime"-->
<!--              placeholder="选择日期时间">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clear">取 消</el-button>
        <el-button type="primary" v-if="isAdd" @click="addSumbit">确 定</el-button>
        <el-button type="primary" v-else @click="updateSumbit">确 定</el-button>
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
      isSysUrl: '1',
      isPicPath: '2',
      erroImg: false,
      erro: false,
      checkAll: false,
      dqChannel: 0,
      imgUrl: '',
      fillUrl: '',
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
      fileList: [],
      checkId: [],
      channelDate: [],
      form: {
        adDesc: '',
        adTitle: '',
        adType: 1,
        adUrl: '',
        id: 0,
        picPath: ''
      },
      formLabelWidth: '100px',
      dialogFormVisible: false,
      isAdd: false,
      isCopy: false,
      desc: '*图片最大尺寸为宽873px，高373px(否则C端展示可能会变形)',
      isDelete: false,
      multipleSelection: [],
      rules: {
        adTitle: [
          { required: true, message: '请输入广告名称', trigger: 'blur' }
        ],
        adType: [
          { required: true, message: '请选择广告类型', trigger: 'change' }
        ],
        adUrl: [
          { required: true, message: '请输入广告路径', trigger: 'blur' }
        ]
      },
      headers: {
        'token': Cookie.get('token')
      }
    }
  },
  mounted () {
    this.imgUrl = sessionStorage.getItem('domain')
    this.fillUrl = sessionStorage.getItem('fillDomain')
    this.getInfo()
    this.dqChannel = sessionStorage.getItem('channel')
    let data = []
    data = JSON.parse(sessionStorage.getItem('channelList'))
    for (let key in data) {
      this.channelDate.push(data[key])
    }
  },
  methods: {
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleCheckAllChange (val) {
      this.checkId = val ? this.channelDate : []
    },
    handleCheckedCitiesChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.channelDate.length
    },
    clear () {
      this.checkId = []
      this.checkAll = false
      this.erroImg = false
      this.erro = false
      this.isAdd = false
      this.isCopy = false
      this.isDelete = false
      let param = {
        adDesc: '',
        adTitle: '',
        updateTime: '',
        adType: 1,
        adUrl: '',
        id: 0
      }
      this.isSysUrl = '1'
      this.isPicPath = '2'
      this.form = Object.assign(param)
      this.dialogFormVisible = false
      this.fileList = []
    },
    checkDesc (num) {
      if (num === 3) {
        this.desc = '*图片尺寸为宽1360px，高120px(否则C端展示可能会变形)'
      } else if (num === 4) {
        this.desc = '*图片尺寸为宽325px，高180px(否则C端展示可能会变形)'
      } else {
        this.desc = '*图片最大尺寸为宽873px，高373px(否则C端展示可能会变形)'
      }
    },
    handleChange (file, fileList) {
      this.fileList = fileList.slice(-1)
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    picPathBtn (value) {
      if (value === '1') {
        this.fileList = []
      }
      if (value === '2') {
        this.$set(this.form, `picPath`, '')
      }
    },
    select (value) {
      if (value === '4') {
        this.$set(this.form, `sysUrl`, '')
      }
    },
    copy () {
      this.clear()
      this.isCopy = true
      this.isAdd = false
      this.isDelete = false
      this.dialogFormVisible = true
    },
    add () {
      this.clear()
      this.isAdd = true
      this.isCopy = false
      this.isDelete = false
      this.dialogFormVisible = true
    },
    update (data) {
      this.isAdd = false
      this.form = Object.assign({}, data)
      this.checkDesc(data.adType)
      this.dialogFormVisible = true
    },
    deleteSumbit (data) {
      this.form = Object.assign({}, data)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$set(this.form, `deleted`, 1)
        this.addImg()
        this.updateInfo()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 查询广告列表
    getInfo () {
      let param = {
        pageNum: this.ps.pageNo,
        pageSize: this.ps.pageSize
      }
      this.$axios('post', '/ad/getAdList', param).then((res) => {
        if (res.code === 200) {
          this.tableData = res.data.dataList
          this.currents.currentTotal = res.data.countSize
          // for (var i = 0; i < this.tableData.length; i++) {
          //   if (this.tableData[i].picPath.substr(-3, 3) === '.en') {
          //     this.decryptImage(this.tableData[i].picPath, this.tableData[i])
          //   }
          // }
        }
      })
    },
    handleCurrentChange (val) {
      this.ps.pageNo = val
      this.getInfo()
    },
    decryptImage (url_, list) {
      let _this = this
      let xhr = new XMLHttpRequest()
      let url = url_
      xhr.open('GET', url)
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8')
      xhr.responseType = 'arraybuffer'
      xhr.send()
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          var response = xhr.response
          let url = _this.arrayBufferToBase64(response)
          _this.$set(list, 'base64List', 'data:image/jpeg;base64,' + url)
        }
      }
    },
    arrayBufferToBase64 (buffer) {
      var binary = ''
      var bytes = new Uint8Array(buffer)
      var len = bytes.byteLength
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i] ^ 1)
      }
      return window.btoa(binary)
    },
    addImg () {
      if (this.fileList.length !== 0) {
        let imgList = []
        for (var i = 0; i < this.fileList.length; i++) {
          imgList.push(this.fileList[i].response.data)
        }
        this.$set(this.form, `picPath`, imgList.join(','))
      } else {
        this.erroImg = true
      }
      // this.$set(this.form, `updateTime`, this.fromDate(this.form.updateTime))
    },
    // 新增广告
    addSumbit () {
      this.addImg()
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.picPath !== '') {
            this.erroImg = false
            this.$delete(this.form, 'id')
            let param = this.form
            this.$axios('post', '/ad/addAdInfo', param).then((res) => {
              if (res.code === 200) {
                this.$message({
                  type: 'success',
                  message: '新增成功!'
                })
                this.getInfo()
                this.clear()
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updateInfo () {
      let param = this.form
      this.$axios('post', '/ad/editAdInfo', param).then((res) => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.getInfo()
          this.clear()
        }
      })
    },
    // 修改广告
    updateSumbit () {
      this.addImg()
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.picPath !== '') {
            this.erroImg = false
            this.updateInfo()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    fromDate (date) {
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? '0' + d : d
      var h = date.getHours()
      h = h < 10 ? '0' + h : h
      var minute = date.getMinutes()
      minute = minute < 10 ? '0' + minute : minute
      var second = date.getSeconds()
      second = second < 10 ? '0' + second : second
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
    }
  }
}
</script>

<style scoped>

</style>
