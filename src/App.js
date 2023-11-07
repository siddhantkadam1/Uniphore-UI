import logo from './logo.svg';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Routes,
  Navigate,
  useNavigate
} from "react-router-dom";

import Navbar from './components/navbar';
import Dashboard from './components/dashboard';
import Login from './components/login';
import Corpus from './components/corpus';
import CorpusDetails from './components/corpus-details';
import UserManagement from './components/user-management';
import Dataset from './components/data-set';
import Panel from './components/panel';
import DataSetPanel from './components/data-set-panel/DataSetPanel';
import { PanelContext } from './context/panelContext';
import { SearchContext } from './context/searchContext';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import UserSidebar from './components/user-sidebar/UserSidebar';
import UserDetailsSidebar from './components/user-details-sidebar/UserDetailsSidebar';
import UserManagementPanel from './components/user-management-panel/UserManagementPanel';
import { AuthProvider } from './context/auth';
import RequireAuth from './components/RequireAuth'
import ProtectedRoutes from './components/ProtectedRoutes';
import PageNotFound from './components/PageNotFound';
import CorpusManagement from './components/corpus-management';
import CreateCorpusPanel from './components/create-corpus/CreateCorpusPanel';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CloneSidebar from './components/clone/CloneSidebar';
import GlobalSpinner from './common-components/global-spinner/GlobalSpinner';
 import SharedSnacbar from './common-components/SharedSnackbar';
 import AdminDialog from './common-components/admin-list-dialog/AdminDialog';

function App() {
   const [toggle,setToggle] = useState(
    {
      toggle:true,
      obj:{},
      isEdit:true,
      callListApi:0,
      isEditDataset:true,
      datasetToggle:true,
      callDatasetListApi:0, 
      uacToggle:true,
      uacObj:{},
      userDetailsObj:{},
      isEditUsers:false,
      callTeamsListApi:0,
      callUsersListApi:0,
      isEditUac:true,
      uacToggle:true,
      callUacListApi:0,
      isDrawerOpen:false,
      isUserDrawerOpen:false,
      isCreateCorpusDrawerOpen:false,
      isCloneDrawerOpen:false,
      isUserDetailsDrawerOpen:false,
      isUserManagementPanelOpen:false,
    }
    );
    const [corpusState,setCorpusState] = useState({
      corpusObj:{},
      skipStep:false,
      push:false,
      pull:false,
      callTeamListApi:false,
    })
   const [searchValue,setSearchValue] = useState('');
   const [searchMycorpus,setSearchMycorpus] = useState('');
   const [isSidebarOpen,setIsSidebarOpen] = useState(false);
   const [searchDatasetValue,setSearchDatasetValue] = useState('');
   const [searchTeams,setSearchTeams] = useState('');
   const [searchUsers,setSearchUsers] = useState('');
 
  return (
    <> 
    <LocalizationProvider dateAdapter={AdapterDayjs}> 
    <AuthProvider> 
    <PanelContext.Provider value={{toggle,setToggle,corpusState,setCorpusState}}>
    <Panel />
    <CreateCorpusPanel />
    <GlobalSpinner/>
    <AdminDialog/>
    <CloneSidebar />
    <DataSetPanel />
    <UserManagementPanel/>
    <Sidebar/>
    <UserSidebar/>
    <UserDetailsSidebar/>
      <SearchContext.Provider value={
        {
          searchValue,setSearchValue,searchDatasetValue,
          setSearchDatasetValue,setSearchTeams,searchTeams,
          setSearchUsers,searchUsers,
          searchMycorpus,setSearchMycorpus
        }
        }> 
      <Router>
          <Routes>
            <Route exact path='/' element={<Login/>} />
            <Route exact path='/login' element={<Login/>} />
            <Route exact path='/dashboard' element={<ProtectedRoutes><Dashboard/></ProtectedRoutes>} />
            <Route exact path='/corpus-management' element={<ProtectedRoutes><CorpusManagement/></ProtectedRoutes> } />
            <Route exact path='/user-management' element={<RequireAuth ><UserManagement/></RequireAuth> } />
            <Route exact path='*' element={<PageNotFound/>} />
          </Routes>
      </Router>
      </SearchContext.Provider>
    </PanelContext.Provider>
    </AuthProvider>
    </LocalizationProvider>
    <SharedSnacbar ></SharedSnacbar>
    </>
  );
}



export default App;
