<template>
  <div class="info-table">
    <div class="fx align-items justify-between mt-15 mb-15 ml-10 mr-10">
      <div class="fs-18 fw-600">优惠活动管理</div>
      <div class="fx align-items">
<!--        <div><el-input-->
<!--          placeholder="输入活动标题进行搜索"-->
<!--          size="small"-->
<!--          v-model="search">-->
<!--          <i slot="prefix" class="el-input__icon el-icon-search"></i>-->
<!--        </el-input></div>-->
        <div class="ml-10"><el-button type="primary"  size="small" icon="el-icon-plus" @click="add">增加</el-button></div>
        <div class="ml-10"><el-button type="primary"  size="small"  @click="copy">复制</el-button></div>
        <div class="ml-10"><el-button type="primary"  size="small"  @click="deleteAll">批量删除</el-button></div>
      </div>
    </div>
    <el-table
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      header-cell-class-name="bg-f5">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        fixed
        type="index"
        label="序号"
        align="center"
        width="200">
      </el-table-column>
      <el-table-column
        label="活动图片">
        <template slot-scope="scope">
          <div v-if="scope.row.base64List">
            <img  :src="scope.row.base64List" width="100px" height="55px"/>
          </div>
          <div v-if="!scope.row.base64List">
            <img v-if="/^(https?|ftp|file):\/\/.+$/.test(scope.row.picPath)" :src="scope.row.picPath" width="100px" height="55px"/>
            <img v-else :src="imgUrl + scope.row.picPath" width="100px" height="55px"/>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="活动标题">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="活动内容">
      </el-table-column>
      <el-table-column
        prop="sysPicUrl"
        label="跳转链接">
      </el-table-column>
      <el-table-column
        fixed="right">
        <template slot-scope="scope">
          <div class="fx cursor">
            <div class="update w-32 bg-f2" @click="update(scope.row, 1)"><img src="../../assets/image/update-q.png"></div>
            <div class="ml-10" @click="update(scope.row, 2)"><img src="../../assets/image/delete-q.png"></div>
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
    <el-dialog :title="isCopy ? '复制到所选渠道':'活动管理'" :visible.sync="dialogFormVisible"  width="550px">
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="活动图片" :label-width="formLabelWidth" v-if="!isCopy && !isDelete">
          <el-radio v-if="isAdd" v-model="isPicPath" :label="'1'" @change="picPathBtn(isPicPath)">填写图片url</el-radio>
          <el-radio v-if="isAdd" v-model="isPicPath" :label="'2'" @change="picPathBtn(isPicPath)">上传图片</el-radio>
          <div v-if="isPicPath === '1' && isAdd"><el-input v-model="form.picPath" autocomplete="off" style="width: 217px;"></el-input></div>
          <div v-if="isPicPath === '2' || (!isAdd && !isCopy && !isDelete)">
            <img v-if="form.base64List" :src="form.base64List" width="100px"/>
            <div v-if="!form.base64List">
              <img v-if="/^(https?|ftp|file):\/\/.+$/.test(form.picPath)" :src="form.picPath" width="100px"/>
              <img v-else :src="imgUrl + form.picPath" width="100px"/>
            </div>
            <div v-if="form.picPath && !isAdd">
              <span v-if="/^(https?|ftp|file):\/\/.+$/.test(form.picPath)">{{form.picPath}}</span>
              <span v-else>{{imgUrl + form.picPath}}</span>
            </div>
            <el-upload
              class="upload-demo"
              :action="fillUrl+'/job/file/fileUpload'"
              :on-remove="handleRemove"
              :on-change="handleChange"
              :file-list="fileList"
              list-type="picture" v-if="isAdd">
              <el-button size="small" type="primary" v-if="isAdd">点击上传</el-button>
              <span class="fs-12 c-red" v-if="erroImg">请上传图片</span>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="活动标题" :label-width="formLabelWidth"  prop="title" v-if="!isCopy && !isDelete">
          <el-input v-model="form.title" autocomplete="off" style="width: 217px;"></el-input>
        </el-form-item>
        <el-form-item label="活动内容" :label-width="formLabelWidth" prop="remark" v-if="!isCopy && !isDelete">
          <el-input v-model="form.remark" autocomplete="off" style="width: 217px;"></el-input>
        </el-form-item>
        <el-form-item label="跳转路径" :label-width="formLabelWidth" prop="jumpUrl" v-if="!isCopy && !isDelete">
          <el-radio v-model="isSysUrl" :label="'1'" @change="select(isSysUrl)">YB下载页</el-radio>
          <el-radio v-model="isSysUrl" :label="'3'" @change="select(isSysUrl)">YBH5注册</el-radio>
          <el-radio v-model="isSysUrl" :label="'2'" @change="select(isSysUrl)">自定义</el-radio>
          <el-input v-if="isSysUrl === '2'" v-model="form.sysPicUrl"  autocomplete="off" style="width: 217px;"></el-input>
        </el-form-item>
        <el-form-item label="所属一级导航栏" :label-width="formLabelWidth" prop="topId" v-if="!isCopy && !isDelete">
          <el-radio @change="getPronavigate(topId)" v-model="topId" :label="1">优惠活动</el-radio>
        </el-form-item>
        <el-form-item label="所属二级导航栏" :label-width="formLabelWidth" prop="navigateName" v-if="(!isCopy && !isDelete) && pronavigateList.length !== 0">
          <el-radio v-for="(item,index) in pronavigateList"  :key="index" v-model="navigateName" :label="item.navigateName">{{item.navigateName}}</el-radio>
        </el-form-item>
        <el-form-item label="渠道" :label-width="formLabelWidth" prop="channelMap">
          <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="checkId">
            <el-checkbox  v-for="(item,index) in channelDate"
                          :key="index"
                          :label="item"
                          @change="handleCheckedCitiesChange">{{item}}</el-checkbox>
          </el-checkbox-group>
          <div style="color: red;" v-if="erro">*请选择渠道</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clear">取 消</el-button>
        <el-button type="primary" v-if="isAdd" @click="addSumbit">确 定</el-button>
        <el-button type="primary" v-if="!isAdd && !isCopy && !isDelete" @click="updateSumbit">确 定</el-button>
        <el-button type="primary" v-if="isCopy" @click="copySumbit">确 定</el-button>
        <el-button type="primary" v-if="isDelete" @click="deleteSumbit">确 定</el-button>
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
        topId: 1,
        navigateName: '',
        form: {
          remark: '',
          title: '',
          jumpUrl: '',
          sysPicUrl: '',
          channel: '',
          id: 0,
          picPath: '',
          channelMap: {},
          deleted: 0,
          bpromoteNavigate: {
            id: 0,
            navigateName: '',
            topId: 1,
            topName: ''
          }
        },
        formLabelWidth: '130px',
        dialogFormVisible: false,
        pronavigateList: [],
        multipleSelection: [],
        isAdd: false,
        isCopy: false,
        isDelete: false,
        rules: {
          title: [
            { required: true, message: '请输入活动名称', trigger: 'blur' }
          ],
          remark: [
            { required: true, message: '请输入活动内容', trigger: 'blur' }
          ]
        },
        headers: {
          'b-token': Cookie.get('token')
        }
      }
    },
    mounted () {
      this.imgUrl = sessionStorage.getItem('domain')
      this.fillUrl = sessionStorage.getItem('fillDomain')
      this.dqChannel = sessionStorage.getItem('channel')
      this.getInfo()
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
      select (value) {
        if (value === '1') {
          this.$set(this.form, `jumpUrl`, '')
        }
      },
      picPathBtn (value) {
        if (value === '1') {
          this.fileList = []
        }
        if (value === '2') {
          this.$set(this.form, `picPath`, '')
        }
      },
      clear () {
        this.checkId = []
        this.checkAll = false
        this.erroImg = false
        this.erro = false
        this.topId = 1
        this.isSysUrl = '1'
        this.isPicPath = '2'
        this.navigateName = ''
        this.isAdd = false
        this.isCopy = false
        this.isDelete = false
        let param = {
          remark: '',
          title: '',
          jumpUrl: '',
          sysPicUrl: '',
          channelMap: {},
          channel: '',
          id: 0,
          picPath: '',
          deleted: 0,
          bpromoteNavigate: {
            id: 0,
            navigateName: '',
            topId: 1,
            topName: ''
          }
        }
        this.form = Object.assign(this.form, param)
        this.dialogFormVisible = false
        this.fileList = []
      },
      copy () {
        this.clear()
        this.isCopy = true
        this.isAdd = false
        this.isDelete = false
        this.dialogFormVisible = true
      },
      handleChange (file, fileList) {
        this.fileList = fileList.slice(-1)
      },
      handleRemove (file, fileList) {
        console.log(file, fileList)
      },
      add () {
        this.clear()
        this.isAdd = true
        this.isCopy = false
        this.isDelete = false
        this.getPronavigate(1)
        this.dialogFormVisible = true
      },
      update (data, num) {
        this.isAdd = false
        this.isCopy = false
        this.checkId = []
        for (let key in data.channelMap) {
          this.checkId.push(data.channelMap[key])
        }
        if (data.jumpUrl === '1') {
          this.isSysUrl = '1'
        } else if (data.jumpUrl === '2') {
          this.isSysUrl = '3'
        } else {
          this.isSysUrl = '2'
        }
        this.dialogFormVisible = true
        this.form = Object.assign({}, data)
        if (num === 1) {
          this.isDelete = false
          this.getPronavigate(1)
          this.topId = this.form.bpromoteNavigate.topId
          this.navigateName = this.form.bpromoteNavigate.navigateName
        } else {
          this.isDelete = true
        }
      },
      deleteSumbit () {
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
      getPronavigate (topId) {
        this.$axios('post', '/promote/pronavigate?channel=' + sessionStorage.getItem('channel') + '&topId=' + topId).then((res) => {
          if (res.code === '0') {
            for (var i = 0; i < res.data.length; i++) {
              this.$delete(res.data[i], 'channel')
            }
            this.pronavigateList = res.data
          }
        })
      },
      // 查询活动列表
      getInfo () {
        this.$axios('post', '/promote/list?pageNo=' + this.ps.pageNo + '&pageSize=' + this.ps.pageSize + '&channel=' + sessionStorage.getItem('channel')).then((res) => {
          if (res.code === '0') {
            this.tableData = res.data.list
            this.currents.currentTotal = res.data.total
            for (var i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].picPath.substr(-3, 3) === '.en') {
                this.decryptImage(this.imgUrl + this.tableData[i].picPath, this.tableData[i])
              }
            }
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
      addChannel () {
        if (this.checkId.length !== 0) {
          let menus = {}
          let list = []
          list = JSON.parse(sessionStorage.getItem('channelList'))
          for (let i = 0; i < this.checkId.length; i++) {
            for (let k in list) {
              if (this.checkId[i] === list[k]) {
                const source = JSON.parse(`{"${k}":"${list[k]}"}`)// 利用JSON.parse将对象
                Object.assign(menus, source)
              }
            }
          }
          this.$set(this.form, `channelMap`, menus)
        } else {
          this.erro = true
        }
      },
      addImg () {
        this.addChannel()
        if (this.fileList.length !== 0) {
          let imgList = []
          for (var i = 0; i < this.fileList.length; i++) {
            imgList.push(this.fileList[i].response.data)
          }
          this.$set(this.form, `picPath`, imgList.join(','))
        } else {
          this.erroImg = true
        }
        for (let i = 0; i < this.pronavigateList.length; i++) {
          if (this.navigateName === this.pronavigateList[i].navigateName) {
            this.$set(this.form, `bpromoteNavigate`, this.pronavigateList[i])
          }
        }
        this.$set(this.form, `channel`, (sessionStorage.getItem('channel')))
        // if (this.isSysUrl === '1' || this.isSysUrl === '3') {
        //   let menus = {}
        //   let list2 = []
        //   list2 = JSON.parse(sessionStorage.getItem('channelList'))
        //   for (let k in list2) {
        //     if (this.dqChannel === k) {
        //       const source = JSON.parse(`{"${k}":"${list2[k]}"}`)// 利用JSON.parse将对象
        //       Object.assign(menus, source)
        //     }
        //   }
        //   this.$set(this.form, `channelMap`, menus)
        // }
        if (this.isSysUrl === '1') {
          this.$set(this.form, `jumpUrl`, '1')
        }
        if (this.isSysUrl === '3') {
          this.$set(this.form, `jumpUrl`, '2')
        }
        if (this.isSysUrl === '2') {
          this.$set(this.form, `jumpUrl`, this.form.sysPicUrl)
        }
      },
      // 新增活动
      addSumbit () {
        this.addImg()
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (this.form.picPath !== '') {
              this.erroImg = false
              this.$delete(this.form, 'id')
              this.$delete(this.form.bpromoteNavigate, 'channel')
              let param = this.form
              this.$axios('post', '/promote', param).then((res) => {
                if (res.code === '0') {
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
        this.$axios('post', '/promote/updatePromote', param).then((res) => {
          if (res.code === '0') {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getInfo()
            this.clear()
          }
        })
      },
      // 修改活动
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
      copySumbit () {
        this.addChannel()
        if (JSON.stringify(this.form.channelMap) !== '{}') {
          let param = {
            channelMap: this.form.channelMap,
            nowChannel: sessionStorage.getItem('channel')
          }
          this.$axios('post', '/promote/copyPronote', param).then((res) => {
            if (res.code === '0') {
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
              this.getInfo()
              this.clear()
            }
          })
        }
      },
      deleteAll () {
        if (this.multipleSelection.length !== 0) {
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$axios('post', '/promote/updateBatch', this.multipleSelection).then((res) => {
              if (res.code === '0') {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.getInfo()
                this.clear()
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        } else {
          this.$message({
            type: 'info',
            message: '请选择要删除的数据'
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>
