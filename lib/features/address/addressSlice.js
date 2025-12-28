import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'


export const fetchAddress = createAsyncThunk(
  'address/fetchAddress',
  async (token, thunkAPI) => {
    try {
      const { data } = await axios.get('/api/address', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return data?.addresses || []
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data || { error: 'Failed to fetch addresses' }
      )
    }
  }
)
const addressSlice = createSlice({
  name: 'address',
  initialState: {
    list: [],
    selectedAddressId: null,
  },
  reducers: {
    addAddress: (state, action) => {
      state.list.push(action.payload)
      state.selectedAddressId = action.payload.id // auto-select new address
    },
    selectAddress: (state, action) => {
      state.selectedAddressId = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAddress.fulfilled, (state, action) => {
      state.list = action.payload

      // auto-select first address if none selected
      if (!state.selectedAddressId && action.payload.length > 0) {
        state.selectedAddressId = action.payload[0].id
      }
    })
  },
})

export const { addAddress, selectAddress } = addressSlice.actions
export default addressSlice.reducer