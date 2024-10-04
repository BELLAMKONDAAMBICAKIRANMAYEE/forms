
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./TrainerStyle.css";
import SubjectTable from './tableComponents/SubjectTable';
import eventEmitter from './tableComponents/eventEmitter';
import Header from './Header';

function SubjectForm() {
  const [subjectData, setSubjectData] = useState({
    name: '',
    locationId: ''
  });

  const [locations, setLocations] = useState([]); 

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/locations`);
        setLocations(response.data); 
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
 
  }, []);

  

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSubjectData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleLocationChange = (e) => {
    setSubjectData(prevState => ({
      ...prevState,
      locationId: e.target.value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (subjectData.name === '' || subjectData.locationId === '') {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/subjects`, {
        name: subjectData.name,
        location: {
          id: subjectData.locationId 
        }
      });

      if (response.status === 200 || response.status === 201) {
        console.log('Subject added successfully');
      
        setSubjectData({ name: '', locationId: '' });
       
      } else {
        console.error('Failed to add subject');
      }
      eventEmitter.emit('subjectAdded', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
    <Header/>
    
<div className='container'>
<div className='row'>
  {/* Form Section */}
<center>
    <div className="col-12 col-md-6 col-lg-4" >
      <div className="form-container p-4">
        <div className="form1">
          <h3 className="title text-center">Create Subject Form</h3>
          <form onSubmit={handleSubmit}>
            {/* Subject Name Field */}
            <div className="mb-3">
              <label className="form-label" htmlFor="name">Subject Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={subjectData.name}
                onChange={handleChange}
                placeholder="Enter subject name"
              />
            </div>

            {/* Location Dropdown */}
            <div className="mb-3">
              <label className="form-label" htmlFor="location">Location</label>
              <select
                className="form-select"
                id="location"
                value={subjectData.locationId}
                onChange={handleLocationChange}
              >
                <option value="">Select Location</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button className="btn btn-primary" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
</center>

  {/* Table Section */}
 <center>

    <div className="col-12 col-md-6">
      <div className="table-container">
        <SubjectTable />
      
    </div>
  </div>
 </center>

</div>
</div>

    </>
  );
}

export default SubjectForm;

