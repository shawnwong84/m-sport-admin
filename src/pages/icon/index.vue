<template>
    <div class="info-table">
        <div class="fx align-items justify-between mt-15 mb-15 ml-10 mr-10">
            <div class="fs-18 fw-600">赛事配置</div>
            <div class="fx align-items">
                <div>赛程时间：</div>
                <div class="ml-10">
                    <el-date-picker
                        v-model="matchDate"
                        type="date"
                        size="small"
                        placeholder="选择日期时间"
                    >
                    </el-date-picker>
                </div>
                <div class="ml-10">赛程短标题：</div>
                <div>
                    <el-input
                        placeholder="输入赛程短标题"
                        size="small"
                        v-model="matchName"
                    >
                    </el-input>
                </div>
                <div class="ml-10">
                    <el-button type="primary" size="small" @click="getInfo"
                        >查询</el-button
                    >
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
                width="50"
            >
            </el-table-column>
            <el-table-column prop="matchName" width="150" label="赛程标题">
            </el-table-column>
            <el-table-column
                prop="matchShortName"
                width="150"
                label="赛程短标题"
            >
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
            <el-table-column width="100" label="主队图片">
                <template slot-scope="scope">
                    <div v-if="scope.row.homeTeam.teamIcon">
                        <img
                            :src="scope.row.homeTeam.teamIcon"
                            width="80px"
                            height="80px"
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
            <el-table-column width="100" label="客队图片">
                <template slot-scope="scope">
                    <div v-if="scope.row.awayTeam.teamIcon">
                        <img
                            :src="scope.row.awayTeam.teamIcon"
                            width="80px"
                            height="80px"
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
            <el-table-column fixed="right" width="200">
                <template slot-scope="scope">
                    <div class="fx align-items cursor">
                        <div
                            class="update w-32 bg-f2"
                            @click="update(scope.row, 1)"
                        >
                            <img src="../../assets/image/update-q.png" />
                        </div>
                        <div class="ml-10" @click="update(scope.row, 2)">
                            <img src="../../assets/image/delete-q.png" />
                        </div>
                        <div class="ml-10">
                            <div @click="openLiveConfig(scope.row.id)">
                                <el-button
                                    type="primary"
                                    class="cursor"
                                    size="mini"
                                    plain
                                    >新增信号源</el-button
                                >
                            </div>
                            <div
                                class="mt-10"
                                @click="updateConfig(scope.row.id)"
                            >
                                <el-button
                                    type="primary"
                                    class="cursor"
                                    size="mini"
                                    plain
                                    >修改信号源</el-button
                                >
                            </div>
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
            title="赛事管理"
            :visible.sync="dialogFormVisible"
            width="550px"
        >
            <el-form :model="form" ref="form">
                <el-form-item
                    label="主队"
                    :label-width="formLabelWidth"
                    prop="homeId"
                >
                    {{ homeName }}
                    <el-button type="primary" size="small" @click="openTeam(1)"
                        >选择</el-button
                    >
                </el-form-item>
                <el-form-item
                    label="主队得分"
                    :label-width="formLabelWidth"
                    prop="homeSource"
                >
                    <el-input
                        v-model.number="form.homeSource"
                        style="width: 200px; margin-right: 10px"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="客队"
                    :label-width="formLabelWidth"
                    prop="awayId"
                >
                    {{ awayName }}
                    <el-button type="primary" size="small" @click="openTeam(2)"
                        >选择</el-button
                    >
                </el-form-item>
                <el-form-item
                    label="客队得分"
                    :label-width="formLabelWidth"
                    prop="awaySource"
                >
                    <el-input
                        v-model.number="form.awaySource"
                        style="width: 200px; margin-right: 10px"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="赛程类型"
                    :label-width="formLabelWidth"
                    prop="sportsId"
                >
                    <el-select v-model="form.sportsId" placeholder="请选择">
                        <el-option
                            v-for="(item, index) in sportsList"
                            :key="index"
                            :label="
                                '[' +
                                item.sportsName +
                                ']' +
                                item.competitionName
                            "
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="开始时间"
                    :label-width="formLabelWidth"
                    prop="startTime"
                >
                    <el-date-picker
                        v-model="form.startTime"
                        type="datetime"
                        placeholder="选择日期时间"
                    >
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="clear">取 消</el-button>
                <el-button type="primary" v-if="isAdd" @click="addSumbit"
                    >确 定</el-button
                >
                <el-button type="primary" v-if="!isAdd" @click="updateSumbit"
                    >确 定</el-button
                >
            </div>
        </el-dialog>
        <el-dialog
            title="队伍列表"
            :visible.sync="dialogFormVisible1"
            width="80%"
        >
            <el-table
                :data="teamList"
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
                <el-table-column prop="teamName" label="队伍名称">
                </el-table-column>
                <el-table-column label="队伍图标">
                    <template slot-scope="scope">
                        <img :src="scope.row.teamIcon" />
                    </template>
                </el-table-column>
                <el-table-column fixed="right" width="130">
                    <template slot-scope="scope">
                        <el-button
                            type="primary"
                            class="cursor"
                            size="mini"
                            plain
                            @click="checkTeam(scope.row)"
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
            title="信号源配置"
            :visible.sync="dialogFormVisible2"
            width="50%"
        >
            <table>
                <tr class="ta-c">
                    <td></td>
                    <td>信号源名称</td>
                    <td>提供者名称</td>
                    <td>信号源路径</td>
                    <td v-if="!isAdd1"></td>
                </tr>
                <tr
                    v-for="(item, index) in liveConfig"
                    :key="index"
                    v-if="item.deleted === 0"
                >
                    <td>{{ index + 1 }}</td>
                    <td>
                        <el-input
                            v-model="item.createUser"
                            style="width: 200px; margin-right: 10px"
                        ></el-input>
                    </td>
                    <td>
                        <el-input
                            v-model="item.liveName"
                            style="width: 200px; margin-right: 10px"
                        ></el-input>
                    </td>
                    <td>
                        <el-input
                            v-model="item.liveUrl"
                            style="width: 200px; margin-right: 10px"
                        ></el-input>
                    </td>
                    <td @click="deleteInfo(item)" v-if="!isAdd1">
                        <img src="../../assets/image/delete-q.png" />
                    </td>
                </tr>
            </table>
            <div class="mt-20 ta-c" v-if="liveConfig.length === 0 && !isAdd1">
                暂无数据。。。
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="clear2">取 消</el-button>
                <el-button type="primary" @click="editMatchLiveConfig"
                    >确 定</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
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
            currents1: {
                currentPage: 1,
                currentTotal: 0,
            },
            ps1: {
                pageNo: 1,
                pageSize: 15,
            },
            search: '',
            tableData: [],
            matchName: '',
            fileList: [],
            teamNum: 0,
            awayName: '',
            homeName: '',
            matchId: '',
            liveConfig: [
                {
                    createUser: '',
                    id: 0,
                    liveName: '',
                    deleted: 0,
                    liveUrl: '',
                },
                {
                    createUser: '',
                    id: 0,
                    liveName: '',
                    deleted: 0,
                    liveUrl: '',
                },
                {
                    createUser: '',
                    id: 0,
                    liveName: '',
                    deleted: 0,
                    liveUrl: '',
                },
                {
                    createUser: '',
                    id: 0,
                    liveName: '',
                    deleted: 0,
                    liveUrl: '',
                },
                {
                    createUser: '',
                    id: 0,
                    liveName: '',
                    deleted: 0,
                    liveUrl: '',
                },
                {
                    createUser: '',
                    id: 0,
                    liveName: '',
                    deleted: 0,
                    liveUrl: '',
                },
            ],
            form: {
                awayId: '',
                awaySource: 0,
                deleted: 0,
                homeId: '',
                homeSource: 0,
                id: 0,
                sportsId: '',
                startTime: '',
            },
            matchDate: '',
            formLabelWidth: '100px',
            dialogFormVisible: false,
            dialogFormVisible1: false,
            dialogFormVisible2: false,
            isAdd: false,
            isAdd1: false,
            teamList: [],
            sportsList: [],
        };
    },
    mounted() {
        this.getInfo();
        this.getTeamList();
        this.getSportsList();
    },
    methods: {
        clear() {
            this.isAdd = false;
            this.teamNum = 0;
            let param = {
                awayId: '',
                awaySource: 0,
                deleted: 0,
                homeId: '',
                homeSource: 0,
                id: '',
                sportsId: '',
                startTime: '',
            };
            this.form = Object.assign(param);
            this.dialogFormVisible = false;
        },
        checkTeam(item) {
            if (this.teamNum === 1) {
                this.homeName = item.teamName;
                this.$set(this.form, `homeId`, item.id);
            }
            if (this.teamNum === 2) {
                this.awayName = item.teamName;
                this.$set(this.form, `awayId`, item.id);
            }
            this.dialogFormVisible1 = false;
        },
        deleteInfo(item) {
            this.$set(item, `deleted`, 1);
        },
        openLiveConfig(id) {
            this.matchId = id;
            this.isAdd1 = true;
            this.liveConfig = [
                {
                    createUser: '',
                    id: 0,
                    liveName: '',
                    deleted: 0,
                    liveUrl: '',
                },
                {
                    createUser: '',
                    id: 0,
                    liveName: '',
                    deleted: 0,
                    liveUrl: '',
                },
                {
                    createUser: '',
                    id: 0,
                    liveName: '',
                    deleted: 0,
                    liveUrl: '',
                },
                {
                    createUser: '',
                    id: 0,
                    liveName: '',
                    deleted: 0,
                    liveUrl: '',
                },
                {
                    createUser: '',
                    id: 0,
                    liveName: '',
                    deleted: 0,
                    liveUrl: '',
                },
                {
                    createUser: '',
                    id: 0,
                    liveName: '',
                    deleted: 0,
                    liveUrl: '',
                },
            ];
            this.dialogFormVisible2 = true;
        },
        clear2() {
            this.isAdd1 = false;
            this.dialogFormVisible2 = false;
        },
        updateConfig(id) {
            this.matchId = id;
            this.isAdd1 = false;
            this.getMatchLiveConfigList(id);
            this.dialogFormVisible2 = true;
        },
        add() {
            this.clear();
            this.isAdd = true;
            this.dialogFormVisible = true;
        },
        openTeam(num) {
            this.teamNum = num;
            this.dialogFormVisible1 = true;
        },
        update(data, num) {
            this.isAdd = false;
            let param = {
                awayId: data.awayTeam.id,
                awaySource: data.awayTeam.score,
                deleted: 0,
                homeId: data.homeTeam.id,
                homeSource: data.homeTeam.score,
                id: data.id,
                sportsId: data.sportsId,
                startTime: data.matchDate + ' ' + data.matchTime,
            };
            this.homeName = data.homeTeam.teamName;
            this.awayName = data.awayTeam.teamName;
            this.form = Object.assign({}, param);
            if (num === 1) {
                this.dialogFormVisible = true;
            } else {
                this.deleteSumbit();
            }
        },
        deleteSumbit() {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$set(this.form, `deleted`, 1);
                    this.updateSumbit();
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除',
                    });
                });
        },
        // 查询赛事列表
        getInfo() {
            let time = '';
            if (this.matchDate) {
                this.ps.pageNo = 1;
                time = this.fromDate(this.matchDate);
            }
            let param = {
                pageNum: this.ps.pageNo,
                pageSize: this.ps.pageSize,
                endDate: time,
                matchDate: '',
                startDate: time,
                matchName: this.matchName,
            };
            this.$axios('post', '/match/backGetMatchList', param).then(
                (res) => {
                    if (res.code === 200) {
                        this.tableData = res.data.dataList;
                        this.currents.currentTotal = res.data.countSize;
                    }
                },
            );
        },
        // 查询队伍列表
        getTeamList() {
            let param = {
                pageNum: this.ps1.pageNo,
                pageSize: this.ps1.pageSize,
            };
            this.$axios('post', '/team/getTeamList', param).then((res) => {
                if (res.code === 200) {
                    this.teamList = res.data.dataList;
                    this.currents1.currentTotal = res.data.countSize;
                }
            });
        },
        getSportsList() {
            this.$axios('post', '/match/getSportsList').then((res) => {
                if (res.code === 200) {
                    this.sportsList = res.data;
                }
            });
        },
        handleCurrentChange(val) {
            this.ps.pageNo = val;
            this.getInfo();
        },
        handleCurrentChange1(val) {
            this.ps1.pageNo = val;
            this.getTeamList();
        },
        // 配置信号源
        editMatchLiveConfig() {
            let param = {
                matchId: this.matchId,
                liveConfig: this.liveConfig,
            };
            this.$axios('post', '/match/editMatchLiveConfig', param).then(
                (res) => {
                    if (res.code === 200) {
                        this.$message({
                            type: 'success',
                            message: '配置成功!',
                        });
                        this.dialogFormVisible2 = false;
                    }
                },
            );
        },
        // 查询信号源列表
        getMatchLiveConfigList(id) {
            let param = {
                matchId: id,
                pageNum: 1,
                pageSize: 15,
            };
            this.$axios('post', '/match/getMatchLiveConfigList', param).then(
                (res) => {
                    if (res.code === 200) {
                        this.liveConfig = res.data.dataList;
                    }
                },
            );
        },
        // 新增赛事
        addSumbit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.$delete(this.form, 'id');
                    this.$set(
                        this.form,
                        `startTime`,
                        this.fromDate(this.form.startTime),
                    );
                    let param = this.form;
                    this.$axios('post', '/match/addMatch', param).then(
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
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 修改赛事
        updateSumbit() {
            let param = this.form;
            console.log(this.form.startTime);
            this.$set(this.form, `startTime`, this.time(this.form.startTime));
            this.$axios('post', '/match/updateMatch', param).then((res) => {
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
        fromDate(date) {
            var d = new Date(date);
            var m = d.getMonth() + 1;
            var day = d.getDate();
            if (m < 10) {
                m = '0' + (d.getMonth() + 1);
            }
            if (day < 10) {
                day = '0' + d.getDate();
            }
            var datetime = d.getFullYear() + '-' + m + '-' + day;
            return datetime;
        },
        time(date) {
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

<style scoped></style>
