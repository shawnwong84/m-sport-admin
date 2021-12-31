export const userData = {
    state: {
        tagList: [],
    },
    mutations: {
        setTagList: (state, data) => {
            state.tagList = data;
        },
    },
    getters: {
        getTagList: (state) => state.tagList,
    },
};
