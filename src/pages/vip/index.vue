<template>
    <div class="info-table">
        <div class="fx align-items justify-between mt-15 mb-15 ml-10 mr-10">
            <div class="fs-18 fw-600">红榜管理</div>
            <div class="fx align-items">
                <div>
                    <el-input
                        placeholder="输入红榜标题进行搜索"
                        size="small"
                        v-model="title"
                    >
                        <i
                            slot="prefix"
                            class="el-input__icon el-icon-search"
                        ></i>
                    </el-input>
                </div>
                <div class="ml-10">
                    <el-button
                        type="primary"
                        size="small"
                        icon="el-icon-plus"
                        @click="add"
                        >增加</el-button
                    >
                </div>
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
                width="200"
            >
            </el-table-column>
            <el-table-column prop="title" label="红榜标题"> </el-table-column>
            <el-table-column prop="userName" label="专家"> </el-table-column>
            <el-table-column prop="matchName" label="关联赛事">
            </el-table-column>
            <el-table-column prop="homeVsAway" label="赛队"> </el-table-column>
            <el-table-column label="下注位">
                <template slot-scope="scope">
                    <span v-if="scope.row.betPosition === 0">主胜</span>
                    <span v-if="scope.row.betPosition === 1">平</span>
                    <span v-if="scope.row.betPosition === 2">客胜</span>
                </template>
            </el-table-column>
            <el-table-column prop="winOrLose" label="红/黑"> </el-table-column>
            <el-table-column fixed="right">
                <template slot-scope="scope">
                    <div class="fx cursor">
                        <div
                            class="update w-32 bg-f2"
                            @click="update(scope.row, 1)"
                        >
                            <img src="../../assets/image/update-q.png" />
                        </div>
                        <div class="ml-10" @click="deleteSumbit(scope.row)">
                            <img src="../../assets/image/delete-q.png" />
                        </div>
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
            :total="currents.currentTotal"
        >
        </el-pagination>
        <el-dialog
            title="红榜管理"
            :visible.sync="dialogFormVisible"
            width="80%"
        >
            <el-form :model="form" ref="form" :rules="rules">
                <el-form-item
                    label="红榜标题"
                    :label-width="formLabelWidth"
                    prop="title"
                >
                    <el-input
                        v-model="form.title"
                        autocomplete="off"
                        style="width: 217px"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="下注位"
                    :label-width="formLabelWidth"
                    prop="betPosition"
                >
                    <el-radio v-model="form.betPosition" :label="0"
                        >主胜</el-radio
                    >
                    <el-radio v-model="form.betPosition" :label="1"
                        >平</el-radio
                    >
                    <el-radio v-model="form.betPosition" :label="2"
                        >客胜</el-radio
                    >
                </el-form-item>
                <el-form-item
                    label="专家"
                    :label-width="formLabelWidth"
                    prop="userName"
                >
                    {{ userName }}
                    <el-button type="primary" size="small" @click="openTab2()"
                        >选择</el-button
                    >
                </el-form-item>
                <el-form-item
                    label="关联赛事"
                    :label-width="formLabelWidth"
                    prop="tabName"
                >
                    {{ tabName }}
                    <el-button type="primary" size="small" @click="openTab()"
                        >选择</el-button
                    >
                </el-form-item>
                <el-form-item
                    label="方案详情"
                    :label-width="formLabelWidth"
                    prop="content"
                >
                    <quill-editor
                        ref="text"
                        v-model="form.content"
                        class="myQuillEditor"
                        :options="editorOption"
                    />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="clear">取 消</el-button>
                <el-button type="primary" v-if="isAdd" @click="addSumbit"
                    >确 定</el-button
                >
                <el-button type="primary" v-else @click="updateSumbit"
                    >确 定</el-button
                >
            </div>
        </el-dialog>
        <el-dialog
            title="赛程列表"
            :visible.sync="dialogFormVisible1"
            width="80%"
        >
            <el-table
                :data="tagList"
                style="width: 100%"
                header-cell-class-name="bg-f5"
            >
                <el-table-column
                    fixed
                    type="index"
                    label="序号"
                    align="center"
                    width="200"
                >
                </el-table-column>
                <el-table-column prop="matchName" width="150" label="赛程标题">
                </el-table-column>
                <el-table-column label="赛程时间" width="150" align="center">
                    <template slot-scope="scope">
                        <span
                            >{{ scope.row.matchDate }}
                            {{ scope.row.matchTime }}</span
                        >
                    </template>
                </el-table-column>
                <el-table-column label="主队名称" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.homeTeam.teamName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="主队图片">
                    <template slot-scope="scope">
                        <div v-if="scope.row.homeTeam.teamIcon">
                            <img
                                :src="scope.row.homeTeam.teamIcon"
                                width="100px"
                                height="55px"
                            />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="主队得分" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.homeTeam.score }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="客队名称" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.awayTeam.teamName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="客队图片">
                    <template slot-scope="scope">
                        <div v-if="scope.row.awayTeam.teamIcon">
                            <img
                                :src="scope.row.awayTeam.teamIcon"
                                width="100px"
                                height="55px"
                            />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="客队得分" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.awayTeam.score }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="赛事类型" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.sportsType === 0">足球</span>
                        <span v-if="scope.row.sportsType === 1">篮球</span>
                        <!--          <span v-if="scope.row.adType === '3'">电影</span>-->
                    </template>
                </el-table-column>
                <el-table-column fixed="right" width="130">
                    <template slot-scope="scope">
                        <el-button
                            type="primary"
                            class="cursor"
                            size="mini"
                            plain
                            @click="checkStarItem(scope.row)"
                            >选中</el-button
                        >
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
                :total="currents1.currentTotal"
            >
            </el-pagination>
        </el-dialog>
        <el-dialog
            title="专家列表"
            :visible.sync="dialogFormVisible2"
            width="80%"
        >
            <el-table
                :data="userData"
                style="width: 100%"
                header-cell-class-name="bg-f5"
            >
                <el-table-column
                    fixed
                    type="index"
                    label="序号"
                    align="center"
                    width="200"
                >
                </el-table-column>
                <el-table-column label="头像图片">
                    <template slot-scope="scope">
                        <div v-if="scope.row.avatarUrl">
                            <img
                                :src="scope.row.avatarUrl"
                                width="100px"
                                height="55px"
                            />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="userName" label="昵称">
                </el-table-column>
                <el-table-column label="性别" align="center">
                    <template slot-scope="scope">
                        <span class="c-green" v-if="scope.row.sex === 2"
                            >女</span
                        >
                        <span class="c-green" v-if="scope.row.sex === 1"
                            >男</span
                        >
                        <span class="c-red" v-if="scope.row.sex === 0"
                            >保密</span
                        >
                    </template>
                </el-table-column>
                <el-table-column prop="desc" label="描述"> </el-table-column>
                <el-table-column label="类型" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.type === 0">注册用户</span>
                        <span v-if="scope.row.type === 1">主播</span>
                        <span v-if="scope.row.type === 2">游客</span>
                    </template>
                </el-table-column>
                <el-table-column label="是否热门" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.hotAnchor === 0">否</span>
                        <span v-if="scope.row.hotAnchor === 1">是</span>
                    </template>
                </el-table-column>
                <el-table-column label="热度" prop="hotNum" align="center">
                </el-table-column>
                <el-table-column label="注册时间" width="200" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.createTime }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="最后登录时间"
                    width="200"
                    align="center"
                >
                    <template slot-scope="scope">
                        <span>{{ scope.row.lastLoginTime }}</span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" width="130">
                    <template slot-scope="scope">
                        <el-button
                            type="primary"
                            class="cursor"
                            size="mini"
                            plain
                            @click="checkStarItem2(scope.row)"
                            >选中</el-button
                        >
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
                :total="currents2.currentTotal"
            >
            </el-pagination>
        </el-dialog>
    </div>
</template>

<script>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor } from 'vue-quill-editor';
import { Cookie } from '../../api/util';
export default {
    name: 'index',
    data() {
        return {
            title: '',
            tabName: '',
            userName: '',
            userId: '',
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
                currentTotal: 0,
            },
            ps: {
                pageNo: 1,
                pageSize: 15,
            },
            currents1: {
                currentPage: 1,
                currentTotal: 0,
            },
            ps1: {
                pageNo: 1,
                pageSize: 15,
            },
            currents2: {
                currentPage: 1,
                currentTotal: 0,
            },
            ps2: {
                pageNo: 1,
                pageSize: 15,
            },
            search: '',
            tableData: [],
            fileList: [],
            checkId: [],
            channelDate: [],
            tabId: '',
            form: {
                betPosition: 0,
                content: '',
                deleted: 0,
                id: 0,
                matchId: '',
                title: '',
                userId: '',
            },
            jinru: -1,
            formLabelWidth: '100px',
            dialogFormVisible: false,
            dialogFormVisible1: false,
            dialogFormVisible2: false,
            isAdd: false,
            isCopy: false,
            isDelete: false,
            tagList: [],
            multipleSelection: [],
            userData: [],
            rules: {
                title: [
                    {
                        required: true,
                        message: '请输入红榜标题',
                        trigger: 'blur',
                    },
                ],
            },
            headers: {
                token: Cookie.get('token'),
            },
        };
    },
    components: {
        quillEditor,
    },
    mounted() {
        this.getInfo();
        this.getArticleTagList();
        this.getUserInfo();
    },
    methods: {
        openTab() {
            this.dialogFormVisible1 = true;
        },
        openTab2() {
            this.dialogFormVisible2 = true;
        },
        clear() {
            this.isAdd = false;
            this.isDelete = false;
            let param = {
                betPosition: 0,
                content: '',
                deleted: 0,
                id: 0,
                matchId: '',
                title: '',
                userId: '',
            };
            this.tabName = '';
            this.tabId = '';
            this.userId = '';
            this.userName = '';
            this.form = Object.assign(param);
            this.dialogFormVisible = false;
        },
        add() {
            this.clear();
            this.isAdd = true;
            this.isDelete = false;
            this.dialogFormVisible = true;
        },
        update(data) {
            this.isAdd = false;
            this.dialogFormVisible = true;
            this.tabName = data.matchName;
            this.tabId = data.matchId;
            this.userId = data.userId;
            this.userName = data.userName;
            this.form = Object.assign({}, data);
        },
        checkStarItem(item) {
            this.tabId = item.id;
            this.tabName = item.matchName;
            this.dialogFormVisible1 = false;
        },
        checkStarItem2(item) {
            this.userId = item.id;
            this.userName = item.userName;
            this.dialogFormVisible2 = false;
        },
        deleteSumbit(data) {
            this.form = Object.assign({}, data);
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$set(this.form, `status`, 1);
                    this.addImg();
                    this.updateInfo();
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除',
                    });
                });
        },
        // 查询红榜列表
        getInfo() {
            let param = {
                matchId: '',
                userId: '',
                pageNum: this.ps.pageNo,
                pageSize: this.ps.pageSize,
            };
            this.$axios('post', '/match/getHotRankList', param).then((res) => {
                if (res.code === 200) {
                    this.tableData = res.data.dataList;
                    this.currents.currentTotal = res.data.countSize;
                }
            });
        },
        // 查询用户列表
        getUserInfo() {
            let param = {
                channel: '',
                pageNum: this.ps2.pageNo,
                pageSize: this.ps2.pageSize,
                type: 1,
                phone: '',
                registerStartTime: '',
                registerEndTime: '',
            };
            this.$axios('post', '/backUser/backGetUserList', param).then(
                (res) => {
                    if (res.code === 200) {
                        this.userData = res.data.dataList;
                        this.currents2.currentTotal = res.data.countSize;
                    }
                },
            );
        },
        // 赛程列表
        getArticleTagList() {
            let param = {
                pageNum: this.ps1.pageNo,
                pageSize: this.ps1.pageSize,
            };
            this.$axios('post', '/match/backGetMatchList', param).then(
                (res) => {
                    if (res.code === 200) {
                        this.tagList = res.data.dataList;
                        this.currents1.currentTotal = res.data.countSize;
                    }
                },
            );
        },
        handleCurrentChange(val) {
            this.ps.pageNo = val;
            this.getInfo();
        },
        handleCurrentChange1(val) {
            this.ps1.pageNo = val;
            this.getArticleTagList();
        },
        handleCurrentChange2(val) {
            this.ps2.pageNo = val;
            this.getUserInfo();
        },
        addImg() {
            this.$set(this.form, `matchId`, this.tabId);
            this.$set(this.form, `userId`, this.userId);
        },
        // 新增红榜
        addSumbit() {
            this.addImg();
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (this.form.coverPicture !== '') {
                        this.erroImg = false;
                        this.$delete(this.form, 'id');
                        let param = this.form;
                        this.$axios(
                            'post',
                            '/match/editHotRankInfo',
                            param,
                        ).then((res) => {
                            if (res.code === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '新增成功!',
                                });
                                this.getInfo();
                                this.clear();
                            }
                        });
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        updateInfo() {
            let param = this.form;
            this.$axios('post', '/match/editHotRankInfo', param).then((res) => {
                if (res.code === 200) {
                    this.$message({
                        type: 'success',
                        message: '操作成功!',
                    });
                    this.getInfo();
                    this.clear();
                }
            });
        },
        // 修改红榜
        updateSumbit() {
            this.addImg();
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (this.form.coverPicture !== '') {
                        this.erroImg = false;
                        this.$delete(this.form, 'tags');
                        this.updateInfo();
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
    },
};
</script>

<style scoped></style>
