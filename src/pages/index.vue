<template>
    <div class="layout">
        <el-container>
            <el-aside width="200px">
                <div class="logo">
                    <img src="../assets/image/header-logo.png" width="80%" />
                </div>
                <div class="left" :style="{ height: scollerHeight }">
                    <div v-for="(item, index) in menuList" :key="index">
                        <div
                            class="menu-list"
                            :class="
                                routeName === item.jumpPath ? 'bg-bule' : ''
                            "
                        >
                            <div
                                @click="toPage(item.jumpPath)"
                                class="fx align-items"
                            >
                                <div>
                                    <img
                                        :src="
                                            require('../assets/image/' +
                                                item.jumpPath +
                                                '-h.png')
                                        "
                                        v-if="routeName === item.jumpPath"
                                        width="30px"
                                    />
                                    <img
                                        :src="
                                            require('../assets/image/' +
                                                item.jumpPath +
                                                '-q.png')
                                        "
                                        v-else
                                        width="30px"
                                    />
                                </div>
                                <div class="ml-10">{{ item.name }}</div>
                            </div>
                        </div>
                        <div
                            class="menu-list"
                            @click="toPage('role')"
                            v-if="item.jumpPath === 'account' && showMenu"
                            :class="routeName === 'role' ? 'bg-bule' : ''"
                        >
                            <div style="padding-left: 40px">角色管理</div>
                        </div>
                        <div
                            class="menu-list"
                            @click="toPage('column')"
                            v-if="item.jumpPath === 'account' && showMenu"
                            :class="routeName === 'column' ? 'bg-bule' : ''"
                        >
                            <div style="padding-left: 40px">栏目管理</div>
                        </div>
                    </div>
                </div>
            </el-aside>
            <el-container>
                <el-header>
                    <div class="fx align-items head-right">
                        <div class="ml-10">
                            <img
                                src="../assets/image/logo.jpg"
                                class="head-img"
                            />
                        </div>
                        <div class="ml-5">{{ userName }}</div>
                        <div class="ml-10 cursor" @click="loginOut">退出</div>
                    </div>
                </el-header>
                <el-main>
                    <div class="main-div" :style="{ height: scollerHeight }">
                        <router-view v-if="active"></router-view>
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import { Cookie } from '../api/util';
export default {
    name: 'index',
    provide() {
        return {
            reload: this.reload,
        };
    },
    computed: {
        scollerHeight() {
            return document.body.clientHeight - 80 + 'px';
        },
    },
    data() {
        return {
            active: true,
            showSelect: true,
            routeName: 'home',
            userName: '',
            showMenu: false,
            menuList: [],
        };
    },
    watch: {
        $route(to) {
            this.routeName = to.name;
        },
    },
    mounted() {
        this.routeName = this.$route.name;
        if (
            this.routeName === 'account' ||
            this.routeName === 'role' ||
            this.routeName === 'column'
        ) {
            this.showMenu = true;
        }
        if (!Cookie.get('token')) {
            this.$router.push({ name: 'login' });
        } else {
            this.getInfo(sessionStorage.getItem('id'));
            this.userName = sessionStorage.getItem('username');
        }
    },
    methods: {
        reload() {
            this.active = false;
            this.$nextTick(function () {
                this.active = true;
            });
        },
        // 查询栏目列表
        getInfo() {
            this.$axios('post', '/sys/menu/list').then((res) => {
                if (res.code === 200) {
                    this.menuList = res.data;
                    this.$router.push({ name: this.menuList[0].jumpPath });
                }
            });
        },
        toPage(name) {
            if (name === 'account' || name === 'role' || name === 'column') {
                this.showMenu = true;
            } else {
                this.showMenu = false;
            }
            this.$router.push({ name: name });
        },
        loginOut() {
            this.$router.push({ name: 'login' });
            this.$axios('post', '/sys/logout').then((res) => {
                sessionStorage.clear();
                Cookie.remove('token');
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.logo {
    background: rgb(64, 144, 255);
    width: 200px;
    height: 71px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.el-header {
    background: #293052;
    height: 71px !important;
}
.el-aside {
    background: #293052;
}
.el-main {
    background: #f7f7f7;
    position: relative;
    width: 100%;
    height: 100%;
    overflow: auto;
}
.main-div {
    overflow: auto;
}
html,
body {
    width: 100%;
    height: 100%;
}
.layout {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
.bg-bule {
    background-color: #4191ff; /* 不支持线性的时候显示 */
    background-image: linear-gradient(to right, #4191ff, #293052);
}
.left {
    color: white;
    padding-top: 30px;
    overflow-y: scroll;
}
.left::-webkit-scrollbar {
    display: none;
}
.menu-list {
    font-size: 12px;
    display: flex;
    align-items: center;
    padding-left: 27px;
    height: 50px;
    cursor: pointer;
}
.head-right {
    height: 71px;
    color: white;
    justify-content: flex-end;
    box-sizing: border-box;
}
.head-img {
    width: 30px;
    height: 30px;
    border-radius: 100%;
    cursor: pointer;
}
.cursor {
    cursor: pointer;
}
</style>
