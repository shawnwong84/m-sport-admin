import Vue from 'vue';
import Vuex from 'vuex';
import * as modules from './modules';

Vue.use(Vuex);
let store = new Vuex.Store({
    modules,
});

export default store;
