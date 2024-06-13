import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../api/axios";


const baseUrl2 = '/sample909/'
const baseUrl = '/defaultsamples/'

const initialState = {
    kitList:[
        {
            kit: '808',
            sample: {
                kick: baseUrl + 'kick.wav',
                snare: baseUrl + 'snare.wav',
                closed_hh: baseUrl + 'closed_hh.wav',
                open_hh: baseUrl + 'open_hh.wav',
                clap: baseUrl + 'clap.wav',
                rimshot: baseUrl + 'rimshot.wav',
                shaker: baseUrl + 'shaker.wav',
                cowbell: baseUrl + 'cowbell.wav',
                cymbal: baseUrl + 'cymbal.wav'
            }
        },
        {
            kit: '909',
            sample: {
                kick: baseUrl2 + 'kick.wav',
                snare: baseUrl2 + 'snare.wav',
                closed_hh: baseUrl2 + 'closed_hh.wav',
                open_hh: baseUrl2 + 'open_hh.wav',
                clap: baseUrl2 + 'clap.wav',
                rimshot: baseUrl2 + 'rimshot.wav',
                crash: baseUrl2 + 'crash.wav',
                tom_hi: baseUrl2 + 'tom_hi.wav',
                tom_mid: baseUrl2 + 'tom_mid.wav'
            }
        }
    ]
}

export const kitSlice = createSlice(
    {
        name:'kit',
        initialState:initialState,

        reducers: (create) => ({
            addKit: create.reducer((state,action) => {
                console.log(action);
                state.kitList.push(action.payload)
            }),
            deleteKit: create.reducer((state, action) => {
                console.log(action);
                state.kit = state.kit.filter(kit => kit.name !== action.payload.kit) // da rivedere
            })
        })
    }
)

const {reducer, actions} =kitSlice;
export const {addKit, deleteKit} = actions;
export default reducer