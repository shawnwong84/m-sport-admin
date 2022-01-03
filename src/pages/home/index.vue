<template>
    <div class="info-table">
        <div class="fx align-items justify-between mt-15 mb-15 ml-10 mr-10">
            <div class="fs-18 fw-600">用户管理</div>
            <div class="fx align-items" style="margin-right: 60px">
                <div class="ml-10">时间类型：</div>
                <div class="ml-10">
                    <el-select
                        v-model="sortType"
                        placeholder="请选择"
                        size="small"
                        style="width: 80px"
                    >
                        <el-option value="0" label="最后登录时间"></el-option>
                        <el-option value="1" label="注册时间"></el-option>
                    </el-select>
                </div>
                <div class="ml-10">
                    <el-date-picker
                        v-model="time"
                        type="datetimerange"
                        size="small"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    >
                    </el-date-picker>
                </div>
            </div>
        </div>
        <div class="fx align-items fx-end mt-15 mb-15 ml-10 mr-10">
            <div class="fx align-items">
                <div class="">
                    <el-input
                        placeholder="请输入用户昵称"
                        size="small"
                        style="width: 150px"
                        v-model="userName"
                    >
                    </el-input>
                </div>
                <div class="ml-10">
                    <el-input
                        placeholder="请输入手机号查询"
                        size="small"
                        style="width: 150px"
                        v-model="phone"
                    >
                    </el-input>
                </div>
                <div class="ml-10">是否热门：</div>
                <div class="ml-10">
                    <el-select
                        v-model="hotAnchor1"
                        placeholder="请选择"
                        size="small"
                        style="width: 80px"
                    >
                        <el-option value="0" label="否"></el-option>
                        <el-option value="1" label="是"></el-option>
                    </el-select>
                </div>
                <div class="ml-10">
                    <el-select
                        v-model="type"
                        placeholder="请选择"
                        size="small"
                        class="w-150"
                    >
                        <el-option value="" label="全部"></el-option>
                        <el-option value="0" label="注册用户"></el-option>
                        <el-option value="1" label="主播"></el-option>
                        <el-option value="2" label="游客"></el-option>
                    </el-select>
                </div>
                <div class="ml-10">
                    <el-button type="primary" size="small" @click="getInfo"
                        >查询</el-button
                    >
                </div>
            </div>
        </div>
        <el-table
            :data="tableData"
            style="width: 100%"
            header-cell-class-name="bg-f5"
        >
            <el-table-column
                fixed
                type="index"
                label="序号"
                align="center"
                width="150"
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
            <el-table-column prop="userName" label="昵称"> </el-table-column>
            <el-table-column prop="gold" label="金币"> </el-table-column>
            <el-table-column label="性别" align="center">
                <template slot-scope="scope">
                    <span class="c-green" v-if="scope.row.sex === 2">女</span>
                    <span class="c-green" v-if="scope.row.sex === 1">男</span>
                    <span class="c-red" v-if="scope.row.sex === 0">保密</span>
                </template>
            </el-table-column>
            <el-table-column prop="phone" label="手机号"> </el-table-column>
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
            <el-table-column label="最后登录时间" width="200" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.lastLoginTime }}</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right">
                <template slot-scope="scope">
                    <div class="fx cursor">
                        <div
                            class="update w-32 bg-f2"
                            @click="update(scope.row)"
                        >
                            <img src="../../assets/image/update-q.png" />
                        </div>
                        <div class="ml-10" @click="detele(scope.row.id)">
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
            :page-size="15"
            layout="total, prev, pager, next, jumper"
            :total="currents.currentTotal"
        >
        </el-pagination>
        <el-dialog
            title="用户管理"
            :visible.sync="dialogFormVisible"
            width="490px"
        >
            <el-form>
                <el-form-item
                    label="用户头像"
                    label-width="160px"
                    prop="userCover"
                >
                    <img :src="userCover" width="100px" />
                    <div>
                        <el-upload
                            class="upload-demo"
                            :action="'/sequoiaBack/file/fileUpload'"
                            :on-remove="handleRemove"
                            :on-change="handleChange"
                            :file-list="fileList"
                            :headers="headers"
                            list-type="picture"
                        >
                            <el-button size="small" type="primary"
                                >点击上传</el-button
                            >
                        </el-upload>
                    </div>
                </el-form-item>
                <el-form-item
                    label="主播昵称"
                    label-width="160px"
                    prop="nickName"
                    v-if="userType === 1"
                >
                    <el-input
                        v-model="nickName"
                        style="width: 200px; margin-right: 10px"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="是否热门"
                    label-width="160px"
                    prop="hotAnchor"
                    v-if="userType === 1"
                >
                    <el-radio v-model="hotAnchor" :label="0">否</el-radio>
                    <el-radio v-model="hotAnchor" :label="1">是</el-radio>
                </el-form-item>
                <el-form-item
                    label="热度"
                    label-width="160px"
                    prop="hotNum"
                    v-if="userType === 1"
                >
                    <el-input
                        v-model.number="hotNum"
                        style="width: 200px; margin-right: 10px"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="主播描述"
                    label-width="160px"
                    prop="desc"
                    v-if="userType === 1"
                >
                    <el-input
                        v-model="desc"
                        style="width: 200px; margin-right: 10px"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="clear">取 消</el-button>
                <el-button type="primary" @click="updateSumbit"
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
        var checkVipId = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('VIP卡名称不能为空'));
            }
            setTimeout(() => {
                if (value < 0) {
                    callback(new Error('请选择VIP卡名称'));
                } else {
                    callback();
                }
            }, 1000);
        };
        return {
            userName: '',
            goldNumber: 0,
            tableData: [],
            fileList: [],
            hotAnchor: 0,
            hotAnchor1: 0,
            sortType: 0,
            hotNum: 0,
            userCover: '',
            vipLevelList: [],
            type: '0',
            time: '',
            phone: '',
            desc: '',
            deviceId: '',
            userType: 0,
            nickName: '',
            channel: '',
            channelId: '',
            currents: {
                currentPage: 1,
                currentTotal: 0,
            },
            ps: {
                pageNo: 1,
                pageSize: 15,
            },
            userId: 0,
            dialogFormVisible: false,
            form: {
                vipid: 0,
                ybAccount: '',
            },
            headers: {
                token: Cookie.get('token'),
            },
            rules: {
                vipid: [{ validator: checkVipId, trigger: 'blur' }],
            },
        };
    },
    mounted() {
        this.getInfo();
    },
    methods: {
        clear() {
            this.userId = 0;
            this.fileList = [];
            this.userCover = '';
            this.dialogFormVisible = false;
        },
        update(data) {
            this.userId = data.id;
            this.userCover = data.avatarUrl;
            this.hotAnchor = data.hotAnchor;
            this.userType = data.type;
            this.nickName = data.userName;
            this.hotNum = data.hotNum;
            this.desc = data.desc;
            this.isAdd = false;
            this.dialogFormVisible = true;
        },
        handleChange(file, fileList) {
            this.fileList = fileList.slice(-1);
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        detele(id) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    let param = {
                        id: id,
                    };
                    this.$axios('post', '/backUser/delUserById', param).then(
                        (res) => {
                            if (res.code === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!',
                                });
                                this.getInfo();
                            } else {
                                this.$message({
                                    type: 'warning',
                                    message: res.code,
                                });
                            }
                        },
                    );
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除',
                    });
                });
        },
        // 查询用户列表
        getInfo() {
            let timeStar = '';
            let timeEnd = '';
            if (this.time !== '') {
                timeStar = this.fromDate(this.time[0]);
                timeEnd = this.fromDate(this.time[1]);
            }
            let param = {
                channel: this.channel,
                pageNum: this.ps.pageNo,
                pageSize: this.ps.pageSize,
                hotAnchor: this.hotAnchor1,
                sortType: this.sortType,
                userName: this.userName,
                type: this.type,
                phone: this.phone,
                registerStartTime: timeStar,
                registerEndTime: timeEnd,
            };
            this.$axios('post', '/backUser/backGetUserList', param).then(
                (res) => {
                    if (res.code === 200) {
                        this.tableData = res.data.dataList;
                        this.currents.currentTotal = res.data.countSize;
                    }
                },
            );
        },
        handleSizeChange(val) {
            this.ps.pageSize = val;
            this.getInfo();
        },
        handleCurrentChange(val) {
            this.ps.pageNo = val;
            this.getInfo();
        },
        // 修改用户头像
        updateSumbit() {
            let imgurl = '';
            if (this.fileList.length !== 0) {
                let imgList = [];
                for (let i = 0; i < this.fileList.length; i++) {
                    imgList.push(this.fileList[i].response.data);
                }
                imgurl = imgList.join(',');
            } else {
                imgurl = this.userCover;
            }
            let param = {
                avatarUrl: imgurl,
                id: this.userId,
                hotAnchor: this.hotAnchor,
                nickName: this.nickName,
                hotNum: this.hotNum,
                desc: this.desc,
            };
            this.$axios('post', '/backUser/editUserInfo', param).then((res) => {
                if (res.code === 200) {
                    this.getInfo();
                    this.clear();
                }
            });
        },
        fromDate(date) {
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? '0' + m : m;
            var d = date.getDate();
            d = d < 10 ? '0' + d : d;
            var h = date.getHours();
            h = h < 10 ? '0' + h : h;
            var minute = date.getMinutes();
            minute = minute < 10 ? '0' + minute : minute;
            var second = date.getSeconds();
            second = second < 10 ? '0' + second : second;
            return (
                y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
            );
        },
    },
};
</script>

<style scoped>
.w-150 {
    width: 110px;
}
</style>
