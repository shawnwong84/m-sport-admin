<template>
    <div class="info-table">
        <div class="fx align-items justify-between mt-15 mb-15 ml-10 mr-10">
            <div class="fx">
                <div class="fs-18 fw-600">房间管理</div>
            </div>
            <div class="fx align-items">
                <div class="ml-10">
                    <el-input
                        placeholder="输入房间名称"
                        size="small"
                        v-model="search"
                    >
                        <i
                            slot="prefix"
                            class="el-input__icon el-icon-search"
                        ></i>
                    </el-input>
                </div>
                <div>是否推荐：</div>
                <div class="" style="width: 100px">
                    <el-select v-model="recommend" size="small">
                        <el-option value="" label="全部"></el-option>
                        <el-option value="0" label="不推荐"></el-option>
                        <el-option value="1" label="推荐"></el-option>
                    </el-select>
                </div>
                <div>是否显示在首页：</div>
                <div class="" style="width: 100px">
                    <el-select v-model="showHome" size="small">
                        <el-option value="" label="全部"></el-option>
                        <el-option value="0" label="不显示"></el-option>
                        <el-option value="1" label="显示"></el-option>
                    </el-select>
                </div>
                <div>是否热门：</div>
                <div class="" style="width: 100px">
                    <el-select v-model="showHot" size="small">
                        <el-option value="" label="全部"></el-option>
                        <el-option value="0" label="否"></el-option>
                        <el-option value="1" label="是"></el-option>
                    </el-select>
                </div>
                <div>是否正在直播：</div>
                <div class="" style="width: 100px">
                    <el-select v-model="type" size="small">
                        <el-option value="" label="全部"></el-option>
                        <el-option value="0" label="不在"></el-option>
                        <el-option value="1" label="在"></el-option>
                    </el-select>
                </div>
                <div class="ml-10" @click="getInfo(1)">
                    <el-button
                        type="primary"
                        size="small"
                        class="el-icon-search"
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
                width="50"
            >
            </el-table-column>
            <el-table-column
                align="center"
                width="200"
                prop="huanXinRoomId"
                label="房间ID"
            >
            </el-table-column>
            <el-table-column
                align="center"
                width="200"
                prop="roomName"
                label="房间名"
            >
            </el-table-column>
            <el-table-column align="center" prop="roomNum" label="房间号">
            </el-table-column>
            <el-table-column label="房间图片">
                <template slot-scope="scope">
                    <div v-if="scope.row.roomCover">
                        <img
                            :src="scope.row.roomCover"
                            width="100px"
                            height="55px"
                        />
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="roomDesc" label="房间描述">
            </el-table-column>
            <el-table-column
                align="center"
                width="200"
                prop="matchName"
                label="关联赛程"
            >
            </el-table-column>
            <el-table-column align="center" prop="likeNum" label="点赞人数">
            </el-table-column>
            <el-table-column align="center" prop="hotNum" label="热度">
            </el-table-column>
            <el-table-column align="center" prop="anchorName" label="主播名称">
            </el-table-column>
            <el-table-column
                align="center"
                width="250"
                prop="announcement"
                label="主播公告"
            >
            </el-table-column>
            <el-table-column
                align="center"
                prop="categoryName"
                label="播放类型"
            >
            </el-table-column>
            <el-table-column align="center" width="500" label="播放链接">
                <template slot-scope="scope">
                    <div style="text-align: left">{{ scope.row.liveUrl }}</div>
                </template>
            </el-table-column>
            <el-table-column label="是否推荐">
                <template slot-scope="scope">
                    <span v-if="scope.row.recommend === 0">不推荐</span>
                    <span v-if="scope.row.recommend === 1">推荐</span>
                </template>
            </el-table-column>
            <el-table-column width="150" align="center" label="是否显示在首页">
                <template slot-scope="scope">
                    <span v-if="scope.row.showHome === 0">不显示</span>
                    <span v-if="scope.row.showHome === 1">显示</span>
                </template>
            </el-table-column>
            <el-table-column label="是否热门">
                <template slot-scope="scope">
                    <span v-if="scope.row.showHot === 0">否</span>
                    <span v-if="scope.row.showHot === 1">是</span>
                </template>
            </el-table-column>
            <el-table-column width="150" align="center" label="是否正在直播">
                <template slot-scope="scope">
                    <span v-if="scope.row.type === 0">不在</span>
                    <span v-if="scope.row.type === 1">在</span>
                </template>
            </el-table-column>
            <el-table-column
                width="150"
                align="center"
                label="是否启用聊天假消息"
            >
                <template slot-scope="scope">
                    <span v-if="scope.row.enableFakeChat === 0">禁用</span>
                    <span v-if="scope.row.enableFakeChat === 1">启用</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="qqGroupNum"
                width="150"
                label="QQ群"
            >
            </el-table-column>
            <el-table-column align="center" prop="qqNum" width="150" label="QQ">
            </el-table-column>
            <el-table-column
                align="center"
                prop="wxNum"
                width="150"
                label="微信"
            >
            </el-table-column>
            <el-table-column width="150" fixed="right">
                <template slot-scope="scope">
                    <div class="cursor">
                        <div
                            class="update w-32 bg-f2"
                            @click="update(scope.row)"
                        >
                            <el-button
                                type="primary"
                                class="cursor"
                                size="mini"
                                plain
                                >修改房间配置</el-button
                            >
                        </div>
                        <div
                            class="mt-10"
                            @click="addRoomHistoryMsg(scope.row.huanXinRoomId)"
                        >
                            <el-button
                                type="primary"
                                class="cursor"
                                size="mini"
                                plain
                                >新增历史消息</el-button
                            >
                        </div>
                        <div
                            class="mt-10"
                            @click="
                                updateRoomHistoryMsg(scope.row.huanXinRoomId)
                            "
                        >
                            <el-button
                                type="primary"
                                class="cursor"
                                size="mini"
                                plain
                                >修改历史消息</el-button
                            >
                        </div>
                        <!--            <div class="ml-10" @click="update(scope.row,2)"><img src="../../assets/image/delete-q.png"></div>-->
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
            title="房间管理"
            :visible.sync="dialogFormVisible"
            width="50%"
        >
            <el-form :model="form" ref="form">
                <el-form-item
                    label="房间封面"
                    :label-width="formLabelWidth"
                    prop="roomCover"
                >
                    <img :src="form.roomCover" width="100px" />
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
                    label="房间名"
                    :label-width="formLabelWidth"
                    prop="roomName"
                >
                    <el-input
                        v-model.number="form.roomName"
                        style="width: 200px; margin-right: 10px"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="播放链接"
                    :label-width="formLabelWidth"
                    prop="liveUrl"
                >
                    <el-input
                        type="textarea"
                        :rows="10"
                        v-model="liveUrl"
                        disabled
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="热度"
                    :label-width="formLabelWidth"
                    prop="hotNum"
                >
                    <el-input
                        v-model.number="form.hotNum"
                        style="width: 200px; margin-right: 10px"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="主播公告"
                    :label-width="formLabelWidth"
                    prop="announcement"
                >
                    <el-input
                        v-model.number="form.announcement"
                        style="width: 200px; margin-right: 10px"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="是否推荐"
                    :label-width="formLabelWidth"
                    prop="recommend"
                >
                    <el-radio v-model="form.recommend" :label="0"
                        >不推荐</el-radio
                    >
                    <el-radio v-model="form.recommend" :label="1"
                        >推荐</el-radio
                    >
                </el-form-item>
                <el-form-item
                    label="是否显示在首页"
                    :label-width="formLabelWidth"
                    prop="showHome"
                >
                    <el-radio v-model="form.showHome" :label="0"
                        >不显示</el-radio
                    >
                    <el-radio v-model="form.showHome" :label="1">显示</el-radio>
                </el-form-item>
                <el-form-item
                    label="是否热门"
                    :label-width="formLabelWidth"
                    prop="showHot"
                >
                    <el-radio v-model="form.showHot" :label="0">否</el-radio>
                    <el-radio v-model="form.showHot" :label="1">是</el-radio>
                </el-form-item>
                <el-form-item
                    label="是否正在直播"
                    :label-width="formLabelWidth"
                    prop="type"
                >
                    <el-radio v-model="form.type" :label="0">不在</el-radio>
                    <el-radio v-model="form.type" :label="1">在</el-radio>
                </el-form-item>
                <el-form-item
                    label="关联赛程"
                    :label-width="formLabelWidth"
                    prop="matchName"
                >
                    {{ matchName }}
                    <el-button type="primary" size="small" @click="openMatch()"
                        >选择</el-button
                    >
                </el-form-item>
                <el-form-item
                    label="QQ群"
                    :label-width="formLabelWidth"
                    prop="qqGroupNum"
                >
                    <el-input
                        v-model.number="form.qqGroupNum"
                        style="width: 200px; margin-right: 10px"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="QQ"
                    :label-width="formLabelWidth"
                    prop="qqNum"
                >
                    <el-input
                        v-model.number="form.qqNum"
                        style="width: 200px; margin-right: 10px"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="微信"
                    :label-width="formLabelWidth"
                    prop="wxNum"
                >
                    <el-input
                        v-model.number="form.wxNum"
                        style="width: 200px; margin-right: 10px"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="是否开启聊天假消息"
                    :label-width="formLabelWidth"
                    prop="enableFakeChat"
                >
                    <el-radio v-model="form.enableFakeChat" :label="0"
                        >禁用</el-radio
                    >
                    <el-radio v-model="form.enableFakeChat" :label="1"
                        >启用</el-radio
                    >
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="clear">取 消</el-button>
                <el-button type="primary" @click="updateSumbit"
                    >确 定</el-button
                >
            </div>
        </el-dialog>
        <el-dialog
            title="赛程列表"
            :visible.sync="dialogFormVisible1"
            width="80%"
        >
            <div class="fx align-items fx-end">
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
                <div class="ml-10">赛程名称：</div>
                <div>
                    <el-input
                        placeholder="输入赛程名称"
                        size="small"
                        v-model="matchListName"
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
                        @click="getBackGetMatchList"
                        >查询</el-button
                    >
                </div>
            </div>
            <el-table
                ref="multipleTable"
                :data="matchList"
                tooltip-effect="dark"
                style="width: 100%; margin-top: 20px"
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
                <el-table-column fixed="right">
                    <template slot-scope="scope">
                        <div @click="checkMatch(scope.row)">
                            <el-button
                                type="primary"
                                class="cursor"
                                size="mini"
                                plain
                                >选中</el-button
                            >
                        </div>
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
            title="历史消息"
            :visible.sync="dialogFormVisible2"
            width="490px"
        >
            <el-form>
                <el-form-item
                    label="发送人"
                    :label-width="formLabelWidth"
                    prop="senderName"
                >
                    <el-input
                        v-model="senderName"
                        style="width: 200px; margin-right: 10px"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="消息内容"
                    :label-width="formLabelWidth"
                    prop="message"
                >
                    <el-input
                        type="textarea"
                        :rows="10"
                        placeholder="请输入内容"
                        v-model="message"
                    >
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="clear2">取 消</el-button>
                <el-button type="primary" @click="editRoomHistoryMsg"
                    >确 定</el-button
                >
            </div>
        </el-dialog>
        <el-dialog
            title="历史消息列表"
            :visible.sync="dialogFormVisible3"
            width="80%"
        >
            <el-table
                :data="historyMsg"
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
                <el-table-column prop="senderName" label="发送人">
                </el-table-column>
                <el-table-column prop="message" width="350" label="内容">
                </el-table-column>
                <el-table-column width="150" label="更新时间">
                    <template slot-scope="scope">
                        <span>{{ fromDate(scope.row.updateTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right">
                    <template slot-scope="scope">
                        <div class="fx cursor">
                            <div
                                class="update w-32 bg-f2"
                                @click="updateRoomMsg(scope.row)"
                            >
                                <img src="../../assets/image/update-q.png" />
                            </div>
                            <div class="ml-10" @click="deleteMsg(scope.row)">
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
import { Cookie } from '../../api/util';

export default {
    name: 'index',
    data() {
        return {
            isPicPath: '2',
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
            tagName: '',
            search: '',
            message: '',
            roomId: '',
            senderName: '',
            showHome: '',
            matchName: '',
            fileList: [],
            matchList: [],
            form: {
                deleted: 0,
                recommend: 0,
                announcement: '',
                enableFakeChat: 0,
                showHome: 0,
                roomName: '',
                roomCover: '',
                showHot: 0,
                type: 0,
                matchId: '',
                qqGroupNum: '',
                qqNum: '',
                wxNum: '',
                hotNum: 0,
                id: 0,
            },
            showHot: '',
            matchListName: '',
            matchDate: '',
            liveUrl: '',
            type: '1',
            recommend: '',
            tableData: [],
            id: 0,
            detele: 0,
            imgUrl: '',
            formLabelWidth: '160px',
            dialogFormVisible: false,
            dialogFormVisible1: false,
            dialogFormVisible2: false,
            dialogFormVisible3: false,
            historyMsg: [],
            loading: false,
            headers: {
                token: Cookie.get('token'),
            },
        };
    },
    mounted() {
        this.getInfo(1);
        this.getBackGetMatchList();
    },
    methods: {
        clear() {
            let param = {
                deleted: 0,
                recommend: 0,
                showHome: 0,
                showHot: 0,
                roomName: '',
                announcement: '',
                roomCover: '',
                enableFakeChat: 0,
                matchId: '',
                qqGroupNum: '',
                qqNum: '',
                wxNum: '',
                hotNum: 0,
                type: 0,
                id: 0,
            };
            this.fileList = [];
            this.form = Object.assign(this.form, param);
            this.dialogFormVisible = false;
        },
        clear2() {
            this.message = '';
            this.senderName = '';
            this.deleted = 0;
            this.id = 0;
            this.roomId = '';
            this.dialogFormVisible2 = false;
        },
        updateRoomHistoryMsg(id) {
            this.roomId = id;
            this.getRoomHistoryMsgList(1);
            this.dialogFormVisible3 = true;
        },
        updateRoomMsg(data) {
            this.roomId = data.huanXinRoomId;
            this.message = data.message;
            this.id = data.id;
            this.deleted = 0;
            this.senderName = data.senderName;
            this.dialogFormVisible2 = true;
        },
        deleteMsg(data) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.roomId = data.huanXinRoomId;
                    this.message = data.message;
                    this.senderName = data.senderName;
                    this.deleted = 1;
                    this.id = data.id;
                    this.editRoomHistoryMsg();
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除',
                    });
                });
        },
        addRoomHistoryMsg(id) {
            this.roomId = id;
            this.dialogFormVisible2 = true;
        },
        openMatch() {
            this.dialogFormVisible1 = true;
        },
        checkMatch(item) {
            this.matchName = item.matchName;
            this.$set(this.form, `matchId`, item.id);
            this.dialogFormVisible1 = false;
        },
        handleChange(file, fileList) {
            this.fileList = fileList.slice(-1);
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        picPathBtn(value) {
            if (value === '1') {
                this.fileList = [];
            }
            if (value === '2') {
                this.$set(this.form, `tagImage`, '');
            }
        },
        // 查询赛事列表
        getBackGetMatchList() {
            let time = '';
            if (this.matchDate) {
                time = this.fromDate(this.matchDate);
            }
            let param = {
                pageNum: this.ps.pageNo,
                pageSize: this.ps.pageSize,
                endDate: '',
                matchDate: time,
                startDate: '',
                matchName: this.matchListName,
            };
            this.$axios('post', '/match/backGetMatchList', param).then(
                (res) => {
                    if (res.code === 200) {
                        this.matchList = res.data.dataList;
                        this.currents1.currentTotal = res.data.countSize;
                    }
                },
            );
        },
        // 新增历史消息
        editRoomHistoryMsg() {
            let param = {
                message: this.message,
                roomId: this.roomId,
                deleted: this.deleted,
                id: this.id,
                senderName: this.senderName,
            };
            this.$axios('post', '/backRoom/editRoomHistoryMsg', param).then(
                (res) => {
                    if (res.code === 200) {
                        this.dialogFormVisible2 = false;
                        this.getRoomHistoryMsgList(1);
                    }
                },
            );
        },
        add() {
            this.clear();
            this.isAdd = true;
            this.dialogFormVisible = true;
        },
        update(data) {
            console.log(data);
            this.form = Object.assign(this.form, data);
            this.liveUrl = data.liveUrl;
            this.matchName = data.matchName;
            this.isAdd = false;
            this.dialogFormVisible = true;
        },
        // 查询历史消息
        getRoomHistoryMsgList(num) {
            if (num) {
                this.ps2.pageNo = 1;
            }
            let param = {
                pageNum: this.ps2.pageNo,
                pageSize: this.ps2.pageSize,
                roomId: this.roomId,
            };
            this.$axios('post', '/backRoom/getRoomHistoryMsgList', param).then(
                (res) => {
                    if (res.code === 200) {
                        this.historyMsg = res.data.dataList;
                        this.currents2.currentTotal = res.data.countSize;
                    }
                },
            );
        },
        getInfo(num) {
            if (num) {
                this.ps.pageNo = 1;
            }
            let param = {
                recommend: this.recommend,
                showHome: this.showHome,
                showHot: this.showHot,
                type: this.type,
                pageNum: this.ps.pageNo,
                pageSize: this.ps.pageSize,
                roomName: this.search,
            };
            this.$axios('post', '/backRoom/getRoomList', param).then((res) => {
                if (res.code === 200) {
                    this.tableData = res.data.dataList;
                    this.currents.currentTotal = res.data.countSize;
                    // for (var i = 0; i < this.tableData.length; i++) {
                    //   if (this.tableData[i].tagImage && this.tableData[i].tagImage.substr(-3, 3) === '.en') {
                    //     this.decryptImage(this.imgUrl + this.tableData[i].tagImage, this.tableData[i])
                    //   }
                    // }
                }
            });
        },
        handleCurrentChange(val) {
            this.ps.pageNo = val;
            this.getInfo();
        },
        handleCurrentChange1(val) {
            this.ps1.pageNo = val;
            this.getBackGetMatchList();
        },
        handleCurrentChange2(val) {
            this.ps2.pageNo = val;
            this.getRoomHistoryMsgList();
        },
        addImg() {
            if (this.fileList.length !== 0) {
                let imgList = [];
                for (let i = 0; i < this.fileList.length; i++) {
                    imgList.push(this.fileList[i].response.data);
                }
                this.$set(this.form, `roomCover`, imgList.join(','));
            }
        },
        updateInfo() {
            this.addImg();
            let param = {
                deleted: this.form.deleted,
                recommend: this.form.recommend,
                showHome: this.form.showHome,
                showHot: this.form.showHot,
                type: this.form.type,
                hotNum: this.form.hotNum,
                roomId: this.form.huanXinRoomId,
                announcement: this.form.announcement,
                enableFakeChat: this.form.enableFakeChat,
                matchId: this.form.matchId,
                roomName: this.form.roomName,
                linkAccount: this.form.linkAccount,
                linkType: this.form.linkType,
                roomCover: this.form.roomCover,
                qqGroupNum: this.form.qqGroupNum,
                qqNum: this.form.qqNum,
                wxNum: this.form.wxNum,
            };
            this.$axios('post', '/backRoom/editRoomById', param).then((res) => {
                if (res.code === 200) {
                    this.$message({
                        type: 'success',
                        message: '操作成功!',
                    });
                    this.getInfo();
                    this.clear();
                } else {
                    this.$message({
                        type: 'warning',
                        message: res.msg,
                    });
                }
            });
        },
        // 修改影片房间
        updateSumbit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.updateInfo();
                } else {
                    return false;
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
    },
};
</script>

<style scoped>
.cx-box {
    border: 1px solid #2897ff;
    width: 100px;
    line-height: 30px;
    text-align: center;
    color: #2897ff;
}
.xz {
    background: #2897ff;
    color: white;
}
</style>
