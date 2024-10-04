
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./TrainerStyle.css";
import BatchTable from './tableComponents/BatchTable';
import eventEmitter from './tableComponents/eventEmitter';
import Header from './Header';


function BatchForm() {
  const [batchData, setBatchData] = useState({
    name: '',
    startDate: '',
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
    setBatchData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleLocationChange = (e) => {
    setBatchData(prevState => ({
      ...prevState,
      locationId: e.target.value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (batchData.name === '' || batchData.startDate === '' || batchData.locationId === '') {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/batches`, {
        name: batchData.name,
        startDate: batchData.startDate,
        location: {
          id: batchData.locationId 
        }
      });


      if (response.status === 200 || response.status === 201) {
        console.log('Batch added successfully');
        setBatchData({ name: '', startDate: '', locationId: '' });
      } else {
        console.error('Failed to add batch');
      }
      eventEmitter.emit('batchAdded', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <Header/>
      <div className="container">

      <div className="title m-3" style={{fontSize:"30px"}}>Let's create Batch Form</div>
< div className='row'>

<div className='col-12 col-md-6'>
      <form onSubmit={handleSubmit}>
        {/* Batch Name Input */}
        <div className="input-container ic1">
          <input
            type="text"
            className="input form-control"
            id="name"
            value={batchData.name}
            onChange={handleChange}
            placeholder="Enter batch name"
          />
          <label className="iLabel" htmlFor="name">Batch name</label>
        </div>

        {/* Start Date Input */}
        <div className="input-container ic2">
          <input
            type="date"
            className="input form-control"
            id="startDate"
            value={batchData.startDate}
            onChange={handleChange}
          />
          <label className="iLabel" htmlFor="startDate">Start date</label>
        </div>

        {/* Location Select */}
        <div className="input-container ic3">
          <select
            className="input form-select"
            id="location"
            value={batchData.locationId}
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
        <button className="submit btn btn-primary mt-3" type="submit">
          Submit
        </button>
      </form>
      </div>
     
      
  {/* Responsive Table */}
  <div className="table-container table-responsive mt-4">
    <BatchTable />
  </div>

</div>

</div>

    </div>
  );
}

export default BatchForm;

