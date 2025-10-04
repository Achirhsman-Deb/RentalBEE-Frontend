import { createSlice, PayloadAction } from '@reduxjs/toolkit';
 
interface ServiceLocationState {
  serviceLocationInfo: Record<string, string>;
}
 
const initialState: ServiceLocationState = {
  serviceLocationInfo: {},
};
 
const serviceLocationSlice = createSlice({
  name: 'serviceLocation',
  initialState,
  reducers: {
    setServiceLocationInfo: (state, action: PayloadAction<{ locationName: string; locationId: string }[]>) => {
      const newInfo: Record<string, string> = {};
      action.payload.forEach(location => {
        newInfo[location.locationName] = location.locationId;
      });
      state.serviceLocationInfo = newInfo;
    },
    clearServiceLocationInfo: (state) => {
      state.serviceLocationInfo = {};
    },
  },
});
 
export const { setServiceLocationInfo, clearServiceLocationInfo } = serviceLocationSlice.actions;
export default serviceLocationSlice.reducer;