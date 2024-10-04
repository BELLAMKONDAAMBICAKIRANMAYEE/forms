import logo from './logo.svg';
import './App.css';
import Home from './component/Home';
import Page2 from './component/Page2';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import SubjectForm from './component/SubjectForm';
import BatchForm from './component/BatchForm';
import TrainerForm from './component/TrainerForm';

function App() {
  return (

  
       <BrowserRouter>
  
  
       {/* <Header/>  */}
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/page2" element={<Page2/>}/>
        <Route path="/TrainerForm" element={<TrainerForm/>}/>
        <Route path="/SubjectForm" element={<SubjectForm/>}/>
        <Route path="/BatchForm" element={<BatchForm/>}/>
      </Routes>

   
    </BrowserRouter>

    
  );
}

export default App;
