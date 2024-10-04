import React from 'react'
import Header from './Header'
import "./Page2.css"
import RuningBatchForm from './RuningBatchForm'



function Page2() {
    return (
        <div>
            <Header />

            <div className="form-container">
            <div className="row-container">
         
            {/* <RuningBatchDropDown/>

            <TrainerDropDown/>
         
            <SubjectDropDown/>
       
            <BatchDropDown/> */}

<RuningBatchForm />
            

        </div>

        
      </div>


        </div>
    )
}

export default Page2