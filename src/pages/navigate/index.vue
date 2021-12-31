<template>
    <div class="info-table">
        <div class="fx align-items justify-between mt-15 mb-15 ml-10 mr-10">
            <div class="fs-18 fw-600">专家列表</div>
            <div class="fx align-items">
                <div>
                    <el-input
                        placeholder="输入专家名称名称进行搜索"
                        size="small"
                        v-model="search"
                    >
                        <i
                            slot="prefix"
                            class="el-input__icon el-icon-search"
                        ></i>
                    </el-input>
                </div>
                <div class="ml-10" @click="add">
                    <el-button type="primary" size="small" icon="el-icon-plus"
                        >增加</el-button
                    >
                </div>
            </div>
        </div>
        <el-table
            :data="
                tableData.filter(
                    (data) =>
                        !search ||
                        data.anchorName
                            .toLowerCase()
                            .includes(search.toLowerCase()),
                )
            "
            style="width: 100%"
            header-cell-class-name="bg-f5"
        >
            <el-table-column
                fixed
                type="index"
                label="序号"
                align="center"
                width="50"
            >
            </el-table-column>
            <el-table-column align="center" prop="sort" label="排序">
            </el-table-column>
            <el-table-column width="150" align="center" label="头像">
                <template slot-scope="scope" v-if="scope.row.userIcon">
                    <img
                        :src="scope.row.userIcon"
                        width="100px"
                        height="90px"
                    />
                </template>
            </el-table-column>
            <el-table-column align="center" prop="userName" label="专家名称">
            </el-table-column>
            <el-table-column align="center" prop="follows" label="粉丝数">
            </el-table-column>
            <el-table-column align="center" prop="userDesc" label="描述">
            </el-table-column>
            <el-table-column fixed="right">
                <template slot-scope="scope">
                    <div class="fx cursor">
                        <div
                            class="update w-32 bg-f2"
                            @click="update(scope.row, 1)"
                        >
                            <img src="../../assets/image/update-q.png" />
                        </div>
                        <div class="ml-10" @click="update(scope.row, 2)">
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
            title="专家列表管理"
            :visible.sync="dialogFormVisible"
            width="420px"
        >
            <el-form :model="form" ref="form" :rules="rules">
                <el-form-item label="头像" :label-width="formLabelWidth">
                    <div>
                        <el-upload
                            class="upload-demo"
                            :action="'http://hszhibo.live/sequoiaBack/file/fileUpload'"
                            :on-remove="handleRemove"
                            :on-change="handleChange"
                            :file-list="fileList"
                            :headers="headers"
                            list-type="picture"
                        >
                            <el-button size="small" type="primary"
                                >点击上传</el-button
                            >
                            <span class="fs-12 c-red" v-if="erroImg"
                                >请上传图片</span
                            >
                        </el-upload>
                    </div>
                    <img
                        :src="form.userIcon"
                        width="100px"
                        v-if="form.userIcon !== ''"
                    />
                </el-form-item>
                <el-form-item
                    label="专家名称"
                    :label-width="formLabelWidth"
                    prop="userName"
                >
                    <el-input
                        v-model="form.userName"
                        autocomplete="off"
                        style="width: 217px"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="描述"
                    :label-width="formLabelWidth"
                    prop="userDesc"
                >
                    <el-input
                        v-model="form.userDesc"
                        autocomplete="off"
                        style="width: 217px"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="粉丝"
                    :label-width="formLabelWidth"
                    prop="follows"
                >
                    <el-input
                        v-model="form.follows"
                        autocomplete="off"
                        style="width: 217px"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="clear">取 消</el-button>
                <el-button type="primary" @click="addSumbit" v-if="isAdd"
                    >确 定</el-button
                >
                <el-button type="primary" @click="updateSumbit" v-else
                    >确 定</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { Cookie } from '../../api/util';
export default {
    name: 'index',
    data() {
        return {
            currents: {
                currentPage: 1,
                currentTotal: 0,
            },
            ps: {
                pageNo: 1,
                pageSize: 15,
            },
            search: '',
            fileList: [],
            tableData: [],
            form: {
                userDesc: '',
                userIcon: '',
                id: 0,
                userName: '',
                deleted: 0,
                follows: 0,
            },
            erroImg: false,
            formLabelWidth: '120px',
            dialogFormVisible: false,
            isAdd: false,
            rules: {
                anchorName: [
                    {
                        required: true,
                        message: '请输入专家名称',
                        trigger: 'blur',
                    },
                ],
            },
            headers: {
                token: Cookie.get('token'),
            },
        };
    },
    mounted() {
        this.getInfo();
    },
    methods: {
        clear() {
            let param = {
                userDesc: '',
                userIcon: '',
                id: 0,
                userName: '',
                deleted: 0,
                follows: 0,
            };
            this.fileList = [];
            this.form = Object.assign(this.form, param);
            this.dialogFormVisible = false;
        },
        handleChange(file, fileList) {
            this.fileList = fileList.slice(-1);
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        add() {
            this.clear();
            this.isAdd = true;
            this.dialogFormVisible = true;
        },
        update(data, num) {
            if (num === 1) {
                this.dialogFormVisible = true;
                this.isAdd = false;
                this.form = Object.assign(this.form, data);
            } else {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                })
                    .then(() => {
                        this.$set(data, `deleted`, 1);
                        this.form = Object.assign(this.form, data);
                        this.updateInfo();
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除',
                        });
                    });
            }
        },
        // 查询
        getInfo() {
            let param = {
                pageNum: this.ps.pageNo,
                pageSize: this.ps.pageSize,
            };
            this.$axios('post', '/match/getHotExpertList', param).then(
                (res) => {
                    if (res.code === 200) {
                        this.tableData = res.data.dataList;
                        this.currents.currentTotal = res.data.countSize;
                    }
                },
            );
        },
        handleCurrentChange(val) {
            this.ps.pageNo = val;
            this.getInfo();
        },
        addImg() {
            if (this.fileList.length !== 0) {
                let imgList = [];
                for (var i = 0; i < this.fileList.length; i++) {
                    imgList.push(this.fileList[i].response.data);
                }
                this.$set(this.form, `userIcon`, imgList.join(','));
            } else {
                this.erroImg = true;
            }
        },
        // 新增
        addSumbit() {
            this.addImg();
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.$delete(this.form, 'id');
                    let param = this.form;
                    this.$axios('post', '/match/editHotExpert', param).then(
                        (res) => {
                            if (res.code === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '新增成功!',
                                });
                                this.getInfo();
                                this.clear();
                            }
                        },
                    );
                } else {
                    return false;
                }
            });
        },
        updateInfo() {
            let param = this.form;
            this.$axios('post', '/match/editHotExpert', param).then((res) => {
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
        // 修改
        updateSumbit() {
            this.addImg();
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (this.form.userIcon !== '') {
                        this.erroImg = false;
                        this.updateInfo();
                    }
                } else {
                    return false;
                }
            });
        },
    },
};
</script>

<style scoped></style>
