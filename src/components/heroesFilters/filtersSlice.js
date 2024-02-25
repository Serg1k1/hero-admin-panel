import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { useHttp } from '../../hooks/http.hook';

// const initialState = {
//     filters: [],
//     filtersLoadingStatus: 'idle',
//     activeFilter: 'all'
// }

const filtersAdapter = createEntityAdapter();

const initialState = filtersAdapter.getInitialState({
    filtersLoadingStatus: 'idle',
    activeFilter: 'all'
})

export const filterHeroes = createAsyncThunk(
    "filters/filterHeroes",
    async () => {
        const { request } = useHttp();
        return await request("https://festive-crystalline-twister.glitch.me/filters");
    }
)

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        filtersActiveFilterChanged: (state, action) => {
            state.activeFilter = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(filterHeroes.pending, state => { state.filtersLoadingStatus = 'loading' })
            .addCase(filterHeroes.fulfilled, (state, action) => {
                state.filtersLoadingStatus = 'idle';
                filtersAdapter.setAll(state, action.payload);
            })
            .addCase(filterHeroes.rejected, state => {
                state.filtersLoadingStatus = 'error';
            })
            .addDefaultCase(() => { })
    }
});


export const { selectAll } = filtersAdapter.getSelectors((state) => state.filters);

const { actions, reducer } = filtersSlice;
export default reducer;
export const {
    filtersActiveFilterChanged,
} = actions;