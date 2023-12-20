import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "userData",
  initialState: {
    id:null,
    sessions: [],
    tasks: []
  },
  reducers: {
    addSession: (state, action) => {
     
          const sessionData = {
           // Store start time as a string
            endTime:action.payload.date, // Store end time as a string
            duration: action.payload.duration,
            completed:action.payload.completed
          };
         state.sessions.push(sessionData)
      
    }, 
    setSessions: (state, action) => {
      state.sessions = action.payload;
    },
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    deleteTask:(state,action) =>{
        state.tasks = action.payload
    },
    setTasks:(state,action)=>{
        state.tasks = action.payload
    },
setId:(state,action)=>{
state.id = action.payload
}
    // Add other session-related reducers as needed
  },
});

export const { addSession, setSessions ,addTask,deleteTask,setTasks,setId} = userSlice.actions;
export default userSlice.reducer;