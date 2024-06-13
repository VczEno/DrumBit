import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../api/axios";

const initialState = {
    patternList: [],
    loading: false, 
    error: ''
}

export const getAllPatterns = createAsyncThunk('GetPattern/fetch', async () => {
return axios('/api/pattern')
.then(response =>response.data);
})

export const storePattern = createAsyncThunk('AddPattern/fetch', async (pattern, {dispatch}) => {
    return axios.post('/api/pattern', {
        pattern: pattern,
        user_id: 1
    }).then(response => {
        dispatch(getAllPatterns())
        console.log(response)
    }).catch(error => console.log(error))
    })

export const updatePattern = createAsyncThunk('AddPattern/fetch', async (args, {dispatch}) => {
    let {pattern, id} = args
    return axios.put('/api/pattern/'+id, {
        pattern: pattern,
        user_id: 1,
        id: id
    }).then(response => {
        dispatch(getAllPatterns())
        console.log(response)
    }).catch(error => console.log(error))
    })

export const destroyPattern = createAsyncThunk('AddPattern/fetch', async (id, {dispatch}) => {
    return axios.delete('/api/pattern/'+id)
    .then(response => {
        dispatch(getAllPatterns())
        console.log(response)
    }).catch(error => console.log(error))
    })
    
    
export const patternSlice = createSlice(
    {
        name:'pattern',
        initialState: initialState,

        reducers: (create) => ({
            /* addPattern: create.reducer((state,action) => {
                console.log(action);
                state.patternList.push(action.payload)
            }), */
            deletePattern: create.reducer((state, action) => {
                console.log(action);
                state.patternList.splice(action.payload, 1)
                
                
               
            })
        }),

        extraReducers: builder => {
            builder.addCase(getAllPatterns.pending, (state, action) => {
                state.loading = true
            })
            builder.addCase(getAllPatterns.rejected, (state, action) => {
                state.loading = false
                state.error = 'Errore nel caricamento dei dati'
            })
            builder.addCase(getAllPatterns.fulfilled, (state, action) => {
                state.loading = false
                state.patternList = action.payload
            })
            
            
            
        }
    }
)

const {reducer, actions} =patternSlice;
export const {addPattern, deletePattern} = actions;
export default reducer