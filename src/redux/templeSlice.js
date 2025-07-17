// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from '../api/api';

// const token = 'c91ae32509fa4ce4e8c21aa4a86118100f97c4f2';
// // const token = '46c1e874b116778356a8f7dca5420b2e740d9ac7';

// export const fetchTemples = createAsyncThunk('temple/fetchTemples', async (_, thunkAPI) => {
//   try {
//     const response = await api.get('/api/v1/devotee/temple/', {
//       headers: {
//         Authorization: `Token ${token}`,
//       },
//     });
//     console.log('Fetched:', response.data);
//     return response.data.results;
//   } catch (error) {
//     return thunkAPI.rejectWithValue('Failed to fetch temples');
//   }
// });

// const templeSlice = createSlice({
//   name: 'temple',
//   initialState: {
//     temples: [],
//     loading: false,
//     error: '',
//     search: '',
//   },
//   reducers: {
//     setSearch: (state, action) => {
//       state.search = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchTemples.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchTemples.fulfilled, (state, action) => {
//         state.loading = false;
//         state.temples = action.payload;
//       })
//       .addCase(fetchTemples.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { setSearch } = templeSlice.actions;
// export default templeSlice.reducer;





import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';

// ✅ Correct environment variable key (matches your .env files)
const token = process.env.REACT_APP_STATIC_TOKEN;


export const fetchTemples = createAsyncThunk(
  'temple/fetchTemples',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/api/v1/devotee/temple/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      return response.data.results;
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to fetch temples');
    }
  }
);

const templeSlice = createSlice({
  name: 'temple',
  initialState: {
    temples: [],
    loading: false,
    error: '',
    search: '',
  },
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemples.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchTemples.fulfilled, (state, action) => {
        state.loading = false;
        state.temples = action.payload;
      })
      .addCase(fetchTemples.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error fetching temples';
      });
  },
});

export const { setSearch } = templeSlice.actions;
export default templeSlice.reducer;
