

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./RuningBatchStyle.css";

function RuningBatchForm() {
  const [formData, setFormData] = useState({
    batchId: '',
    trainerId: '',
    subjectId: '',
    locationId: '',
    startDate: '',
    endDate: ''
  });

  const [batches, setBatches] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [locations, setLocations] = useState([]);

  const [filteredBatches, setFilteredBatches] = useState([]);
  const [filteredTrainers, setFilteredTrainers] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);

  // Fetch Batches, Trainers, Subjects, and Locations from the backend
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/batches`).then(response => {
      setBatches(response.data);
      setFilteredBatches(response.data); // Initially, show all batches
    });
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/trainers`).then(response => {
      setTrainers(response.data);
      setFilteredTrainers(response.data); // Initially, show all trainers
    });
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/subjects`).then(response => {
      setSubjects(response.data);
      setFilteredSubjects(response.data); // Initially, show all subjects
    });
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/locations`).then(response => setLocations(response.data));
  }, []);

  const handleLocationChange = (e) => {
    const locationId = e.target.value;
    setFormData(prevState => ({
      ...prevState,
      locationId
    }));

    // Filter trainers, batches, and subjects based on the selected location
    if (locationId) {
      const filteredBatches = batches.filter(batch => batch.location.id === parseInt(locationId));
      const filteredTrainers = trainers.filter(trainer => trainer.location.id === parseInt(locationId));
      const filteredSubjects = subjects.filter(subject => subject.location.id === parseInt(locationId));

      setFilteredBatches(filteredBatches);
      setFilteredTrainers(filteredTrainers);
      setFilteredSubjects(filteredSubjects);
    } else {
      // If no location is selected, reset to all batches, trainers, and subjects
      setFilteredBatches(batches);
      setFilteredTrainers(trainers);
      setFilteredSubjects(subjects);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/runningBatches`, {
        batch: { id: formData.batchId },
        trainer: { id: formData.trainerId },
        subject: { id: formData.subjectId },
        location: { id: formData.locationId }, // Send the selected location ID
        startDate: formData.startDate,
        endDate: formData.endDate
      });

      if (response.status === 200 || response.status === 201) {
        console.log('Running batch added successfully');
        setFormData({
          batchId: '',
          trainerId: '',
          subjectId: '',
          locationId: '',
          startDate: '',
          endDate: ''
        });
      } else {
        console.error('Failed to add running batch');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='container formy mt-5'>
    <div className='row'>
      <div className='col-12'>
        <div className="title text-center mb-4">Let's create Running Batch Form</div>
      </div>
      <div className='col-12'>
        <form onSubmit={handleSubmit} className='formy data'>
          <div className="row mb-3">
            <div className="col-md-12">
              <div className="input-container">
                <label htmlFor="locationId" className="form-label">Select Location</label>
                <select
                  className="form-select"
                  id="locationId"
                  value={formData.locationId}
                  onChange={handleLocationChange}
                  required
                >
                  <option value="">Select Location</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-md-12">
              <div className="input-container">
                <label htmlFor="batchId" className="form-label">Select Batch Name</label>
                <select
                  className="form-select"
                  id="batchId"
                  value={formData.batchId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Batch Name</option>
                  {filteredBatches.map(batch => (
                    <option key={batch.id} value={batch.id}>
                      {batch.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
         
            <div className="col-md-12">
              <div className="input-container">
                <label htmlFor="trainerId" className="form-label">Select Trainer Name</label>
                <select
                  className="form-select"
                  id="trainerId"
                  value={formData.trainerId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Trainer Name</option>
                  {filteredTrainers.map(trainer => (
                    <option key={trainer.id} value={trainer.id}>
                      {trainer.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-md-12">
              <div className="input-container">
                <label htmlFor="subjectId" className="form-label">Select Subject Name</label>
                <select
                  className="form-select"
                  id="subjectId"
                  value={formData.subjectId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Subject Name</option>
                  {filteredSubjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
         
            <div className="col-md-12">
              <div className="input-container">
                <label htmlFor="startDate" className="form-label">Starting Date</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  id="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-12">
              <div className="input-container">
                <label htmlFor="endDate" className="form-label">Ending Date</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  id="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-12">
            <button className="btn btn-primary" type="submit">
              Submit
            </button>
          </div>
          </div>

        
        </form>
      </div>
    </div>
  </div>
  );
}

export default RuningBatchForm;







