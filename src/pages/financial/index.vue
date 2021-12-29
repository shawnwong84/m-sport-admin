<template>
  <div class="info-table">
    <div class="fx align-items justify-between mt-15 mb-15 ml-10 mr-10">
      <div class="fs-18 fw-600">资讯管理</div>
      <div class="fx align-items">
        <div><el-input
                placeholder="输入资讯标题进行搜索"
                size="small"
                v-model="title">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input></div>
        <div class="ml-10">类型：</div>
        <div  style="width: 100px;">
          <el-select v-model="tagId"  size="small" @change="getInfo">
            <el-option v-for="(item,index) in allTagList" :key="index"
                       :value="item.tagId" :label="item.tagName"></el-option>
          </el-select>
        </div>
        <div class="ml-10"><el-button type="primary"  size="small"  @click="getInfo">查询</el-button></div>
        <div class="ml-10"><el-button type="primary"  size="small" icon="el-icon-plus" @click="add">增加</el-button></div>
      </div>
    </div>
    <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
    >
      <el-table-column
              fixed
              type="index"
              label="序号"
              align="center"
              width="200">
      </el-table-column>
      <el-table-column
              label="资讯图片">
        <template slot-scope="scope">
          <div v-if="scope.row.coverPicture">
            <img  :src="scope.row.coverPicture" width="100px" height="55px"/>
          </div>
        </template>
      </el-table-column>
      <el-table-column
              prop="title"
              label="资讯标题">
      </el-table-column>
      <el-table-column
              prop="authorName"
              label="作者">
      </el-table-column>
      <el-table-column
              align="center"
              label="是否显示在首页">
        <template slot-scope="scope">
          <span v-if="scope.row.showHome === 0">不显示</span>
          <span v-if="scope.row.showHome === 1">显示</span>
        </template>
      </el-table-column>
      <el-table-column
              prop="fakeLike"
              label="点赞数量">
      </el-table-column>
      <el-table-column
              prop="readNum"
              label="阅读量">
      </el-table-column>
      <el-table-column
              label="标签">
        <template slot-scope="scope">
          <span v-for="(item,index) in scope.row.tags" :key="index" class="mr-10">{{item.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
              fixed="right">
        <template slot-scope="scope">
          <div class="fx cursor">
            <div class="update w-32 bg-f2" @click="update(scope.row, 1)"><img src="../../assets/image/update-q.png"></div>
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
    <el-dialog title="资讯管理" :visible.sync="dialogFormVisible"  width="80%">
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="资讯图片" :label-width="formLabelWidth">
          <div>
            <!--           http://hszhibo.live-->
            <el-upload
                    class="upload-demo"
                    :action="'/sequoiaBack/file/fileUpload'"
                    :on-remove="handleRemove"
                    :on-change="handleChange"
                    :headers='headers'
                    :file-list="fileList"
                    list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <span class="fs-12 c-red" v-if="erroImg">请上传图片</span>
            </el-upload>
          </div>
          <img :src="form.coverPicture" width="100px" v-if="!isAdd"/>
        </el-form-item>
        <el-form-item label="资讯标题" :label-width="formLabelWidth"  prop="title">
          <el-input v-model="form.title" autocomplete="off" style="width: 217px;"></el-input>
        </el-form-item>
        <el-form-item label="作者" :label-width="formLabelWidth"  prop="anchorName" >
          {{anchorName}}
          <el-button type="primary"  size="small" @click="openTab(2)">选择</el-button>
        </el-form-item>
        <el-form-item label="是否显示在首页" :label-width="formLabelWidth" prop="showHome">
          <el-radio  v-model="form.showHome" :label="0">不显示</el-radio>
          <el-radio  v-model="form.showHome" :label="1">显示</el-radio>
        </el-form-item>
        <el-form-item label="点赞数量" :label-width="formLabelWidth"  prop="fakeLike">
          <el-input v-model.number="form.fakeLike" autocomplete="off" style="width: 217px;"></el-input>
        </el-form-item>
        <el-form-item label="阅读量" :label-width="formLabelWidth"  prop="readNum">
          <el-input v-model.number="form.readNum" autocomplete="off" style="width: 217px;"></el-input>
        </el-form-item>
        <el-form-item label="资讯标签" :label-width="formLabelWidth"  prop="tabName" >
          {{tabName}}
          <el-button type="primary"  size="small" @click="openTab(1)">选择</el-button>
        </el-form-item>
        <el-form-item label="资讯内容" :label-width="formLabelWidth" prop="content">
          <quill-editor ref="text" v-model="form.content"  class="myQuillEditor" :options="editorOption" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clear">取 消</el-button>
        <el-button type="primary" v-if="isAdd" @click="addSumbit">确 定</el-button>
        <el-button type="primary" v-else @click="updateSumbit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="标签列表" :visible.sync="dialogFormVisible1"  width="80%">
      <div class="check-star" v-if="tabSelection.length !== 0">
        <div>已选标签：</div>
        <div class="fx flex-wrap mt-10">
          <el-tag v-for="(item,index) in tabSelection" :key="index"
                  closable type="" class="mr-10 mt-10" @close="handleClose(item)">
            {{item.tagName}}
          </el-tag>
        </div>
        <div  class="fx" style="justify-content: flex-end;" @click="getSignList">
          <el-button type="primary"  size="small">确定选择</el-button>
        </div>
      </div>
      <el-table
              :data="tagList"
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
                prop="tagName"
                label="标签">
        </el-table-column>
        <el-table-column
                label="类型">
          <template slot-scope="scope">
            <span v-if="scope.row.tagType === 1">文章</span>
          </template>
        </el-table-column>
        <el-table-column
                label="是否显示在搜索top上">
          <template slot-scope="scope">
            <span v-if="scope.row.searchTop === 0">不显示</span>
            <span v-if="scope.row.searchTop === 1">显示</span>
          </template>
        </el-table-column>
        <el-table-column
                fixed="right"
                width="130">
          <template slot-scope="scope">
            <el-button type="primary" class="cursor" size="mini" plain @click="checkStarItem(scope.row)">选中</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
              class="pagination"
              background
              :hide-on-single-page="true"
              @current-change="handleCurrentChange1"
              :current-page="currents1.currentPage"
              :page-sizes="[15, 20, 30]"
              :page-size="15"
              layout="total, prev, pager, next, jumper"
              :total="currents1.currentTotal">
      </el-pagination>
    </el-dialog>
    <el-dialog title="专家列表" :visible.sync="dialogFormVisible2"  width="80%">
      <el-table
              :data="hotExpertList"
              style="width: 100%;"
              header-cell-class-name="bg-f5">
        <el-table-column
                fixed
                type="index"
                label="序号"
                align="center"
                width="50">
        </el-table-column>
        <el-table-column
                align="center"
                prop="sort"
                label="排序">
        </el-table-column>
        <el-table-column
                width="150"
                align="center"
                label="头像">
          <template slot-scope="scope" v-if="scope.row.userIcon">
            <img :src="scope.row.userIcon" width="100px" height="90px"/>
          </template>
        </el-table-column>
        <el-table-column
                align="center"
                prop="userName"
                label="专家名称">
        </el-table-column>
        <el-table-column
                align="center"
                prop="follows"
                label="粉丝数">
        </el-table-column>
        <el-table-column
                align="center"
                prop="userDesc"
                label="描述">
        </el-table-column>
        <el-table-column
                fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" class="cursor" size="mini" plain @click="checkhotExpert(scope.row)">选中</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
              class="pagination"
              background
              :hide-on-single-page="true"
              @current-change="handleCurrentChange2"
              :current-page="currents2.currentPage"
              :page-sizes="[15, 20, 30]"
              :page-size="15"
              layout="total, prev, pager, next, jumper"
              :total="currents2.currentTotal">
      </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import { quillEditor } from 'vue-quill-editor'
  import {Cookie} from '../../api/util'
  export default {
    name: 'index',
    data () {
      return {
        title: '',
        tabName: '',
        anchorName: '',
        isSysUrl: '1',
        isPicPath: '2',
        erroImg: false,
        erro: false,
        checkAll: false,
        dqChannel: 0,
        content: '',
        editorOption: {},
        tabSelection: [],
        currents: {
          currentPage: 1,
          currentTotal: 0
        },
        ps: {
          pageNo: 1,
          pageSize: 15
        },
        currents1: {
          currentPage: 1,
          currentTotal: 0
        },
        ps1: {
          pageNo: 1,
          pageSize: 15
        },
        currents2: {
          currentPage: 1,
          currentTotal: 0
        },
        ps2: {
          pageNo: 1,
          pageSize: 15
        },
        search: '',
        tableData: [],
        fileList: [],
        checkId: [],
        channelDate: [],
        tabId: [],
        form: {
          content: '',
          id: 0,
          fakeLike: 0,
          readNum: 0,
          deleted: 0,
          coverPicture: '',
          showHome: 0,
          title: '',
          tags: [],
          authorId: '',
          authorName: ''
        },
        jinru: -1,
        hotExpertList: [],
        allTagList: [],
        formLabelWidth: '120px',
        dialogFormVisible: false,
        dialogFormVisible1: false,
        dialogFormVisible2: false,
        isAdd: false,
        isCopy: false,
        tagId: 0,
        isDelete: false,
        tagList: [],
        multipleSelection: [],
        rules: {
          title: [
            { required: true, message: '请输入资讯名称', trigger: 'blur' }
          ]
        },
        headers: {
          'token': Cookie.get('token')
        }
      }
    },
    components: {
      quillEditor
    },
    mounted () {
      this.getArticleAllTagList()
      this.getInfo()
      this.getArticleTagList()
      this.getHotExpertList()
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
      checkhotExpert (item) {
        this.anchorName = item.userName
        this.$set(this.form, `authorId`, item.id)
        this.$set(this.form, `authorName`, item.userName)
        this.dialogFormVisible2 = false
      },
      openTab (num) {
        if (num === 1) {
          this.dialogFormVisible1 = true
        }
        if (num === 2) {
          this.dialogFormVisible2 = true
        }
      },
      // 查询专家
      getHotExpertList () {
        let param = {
          pageNum: this.ps2.pageNo,
          pageSize: this.ps2.pageSize
        }
        this.$axios('post', '/match/getHotExpertList', param).then((res) => {
          if (res.code === 200) {
            this.hotExpertList = res.data.dataList
            this.currents2.currentTotal = res.data.countSize
          }
        })
      },
      handleCurrentChange2 (val) {
        this.ps2.pageNo = val
        this.getHotExpertList()
      },
      clear () {
        this.isAdd = false
        this.isDelete = false
        let param = {
          content: '',
          id: 0,
          fakeLike: 0,
          readNum: 0,
          deleted: 0,
          coverPicture: '',
          title: '',
          tags: [],
          authorId: '',
          showHome: 0,
          authorName: ''
        }
        this.tabName = ''
        this.anchorName = ''
        this.form = Object.assign(param)
        this.dialogFormVisible = false
        this.fileList = []
      },
      handleChange (file, fileList) {
        this.fileList = fileList.slice(-1)
      },
      handleRemove (file, fileList) {
        console.log(file, fileList)
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
        this.dialogFormVisible = true
        let tagData = []
        let list = []
        for (var j = 0; j < data.tags.length; j++) {
          list.push({
            id: data.tags[j].id,
            tagName: data.tags[j].name
          })
          tagData.push(data.tags[j].name)
        }
        this.tabName = tagData.join(',')
        this.tabSelection = list
        this.jinru = 0
        this.form = Object.assign({}, data)
        this.anchorName = this.form.authorName
      },
      handleClose (tag) {
        this.tabSelection.splice(this.tabSelection.indexOf(tag), 1)
      },
      getSignList () {
        let list = []
        let listName = []
        for (var i = 0; i < this.tabSelection.length; i++) {
          list.push({
            id: this.tabSelection[i].id,
            name: this.tabSelection[i].tagName
          })
          listName.push(this.tabSelection[i].tagName)
        }
        this.tabName = listName.join(',')
        this.tabId = list
        this.dialogFormVisible1 = false
      },
      checkStarItem (item) {
        this.tabSelection.push(item)
        this.tabSelection = this.unique(this.tabSelection)
      },
      unique (arr) {
        const res = new Map()
        return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1))
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
      // 查询资讯列表
      getInfo () {
        let param = {
          pageNum: this.ps.pageNo,
          pageSize: this.ps.pageSize,
          tagId: this.tagId,
          title: this.title
        }
        this.$axios('post', '/articleBack/getArticleList', param).then((res) => {
          if (res.code === 200) {
            this.tableData = res.data.dataList
            this.currents.currentTotal = res.data.countSize
          }
        })
      },
      getArticleTagList () {
        let param = {
          pageNum: this.ps1.pageNo,
          pageSize: this.ps1.pageSize
        }
        this.$axios('post', '/articleBack/getArticleTagList', param).then((res) => {
          if (res.code === 200) {
            this.tagList = res.data.dataList
            this.currents1.currentTotal = res.data.countSize
          }
        })
      },
      getArticleAllTagList () {
        let _this = this
        let xhr = new XMLHttpRequest()
        let url = '/sequoiaBack/articleBack/getArticleTopTagList'
        xhr.open('GET', url)
        xhr.setRequestHeader('token', Cookie.get('token'))
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.responseType = ''
        xhr.send()
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.response)
            _this.allTagList = response.data
          }
        }
      },
      handleCurrentChange (val) {
        this.ps.pageNo = val
        this.getInfo()
      },
      handleCurrentChange1 (val) {
        this.ps1.pageNo = val
        this.getArticleTagList()
      },
      addImg () {
        if (this.fileList.length !== 0) {
          let imgList = []
          for (var i = 0; i < this.fileList.length; i++) {
            imgList.push(this.fileList[i].response.data)
          }
          this.$set(this.form, `coverPicture`, imgList.join(','))
        } else {
          this.erroImg = true
        }
        if (this.tabId) {
          this.$set(this.form, `tags`, this.tabId)
        }
      },
      // 新增资讯
      addSumbit () {
        this.addImg()
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (this.form.coverPicture !== '') {
              this.erroImg = false
              this.$delete(this.form, 'id')
              let param = this.form
              this.$axios('post', '/articleBack/editArticleInfo', param).then((res) => {
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
        this.$axios('post', '/articleBack/editArticleInfo', param).then((res) => {
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
      // 修改资讯
      updateSumbit () {
        this.addImg()
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (this.form.coverPicture !== '') {
              this.erroImg = false
              this.updateInfo()
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>

<style>
  .ql-editor{
    min-height: 200px;
  }
</style>
