
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RunningBatchTableStyle.css';

function RunningBatchTable() {
  const [runningBatches, setRunningBatches] = useState([]);
  const [filters, setFilters] = useState({
    location: '',
    batchName: '',
    trainerName: '',
    subjectName: '',
    startDate: '',
    endDate: ''
  });


  const [editRowId, setEditRowId] = useState(null); // Track the row being edited
  const [editData, setEditData] = useState({});

  const fetchRunningBatches = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/runningBatches`);
      const batches = response.data;

      const batchDetails = await Promise.all(
        batches.map(batch =>
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/runningBatches/${batch.id.batchId}/${batch.id.trainerId}/${batch.id.subjectId}`)
        )
      );
      setRunningBatches(batchDetails.map(res => res.data));
    } catch (error) {
      console.error("Error fetching the running batches!", error);
    }
  };

  useEffect(() => {
    fetchRunningBatches();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleDelete = async (batchId, trainerId, subjectId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/runningBatches/${batchId}/${trainerId}/${subjectId}`);
      console.log("the batch has been deleted");
      fetchRunningBatches(); 
    } catch (error) {
      console.error("Error deleting the running batch!", error);
    }
  };

  const handleEdit = (batchId, trainerId, subjectId) => {
    setEditRowId(`${batchId}-${trainerId}-${subjectId}`);
    const batchToEdit = runningBatches.find(
      batch => batch.id.batchId === batchId && batch.id.trainerId === trainerId && batch.id.subjectId === subjectId
    );
    setEditData({ startDate: batchToEdit.startDate, endDate: batchToEdit.endDate });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value
    });
  };

  const handleSave = async (batchId, trainerId, subjectId) => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/runningBatches/${batchId}/${trainerId}/${subjectId}`, editData);
      setEditRowId(null); // Exit editing mode
      fetchRunningBatches(); // Refresh the table data
    } catch (error) {
      console.error("Error saving the updated batch!", error);
    }
  };

  const handleCancel = () => {
    setEditRowId(null); // Exit editing mode
    setEditData({});
  };

  // Apply filters
  const filteredBatches = runningBatches.filter(batch => {
    const batchStartDate = new Date(batch.startDate).toISOString().slice(0, 16);
    const batchEndDate = new Date(batch.endDate).toISOString().slice(0, 16);

    return (
      (filters.location === '' || batch.location.name === filters.location) &&
      (filters.batchName === '' || batch.batch.name === filters.batchName) &&
      (filters.trainerName === '' || batch.trainer.name === filters.trainerName) &&
      (filters.subjectName === '' || batch.subject.name === filters.subjectName) &&
      (filters.startDate === '' || batchStartDate >= filters.startDate) &&
      (filters.endDate === '' || batchEndDate <= filters.endDate)
    );
  });

  // Get dynamic filter options based on the filtered batches
  const availableLocations = [...new Set(filteredBatches.map(batch => batch.location.name))];
  const availableBatchNames = [...new Set(filteredBatches.map(batch => batch.batch.name))];
  const availableTrainerNames = [...new Set(filteredBatches.map(batch => batch.trainer.name))];
  const availableSubjectNames = [...new Set(filteredBatches.map(batch => batch.subject.name))];

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          {/* Responsive table */}
          <div className="table-responsive">
            <table className="table table-striped runningBatchTable">
              <thead>
                <tr>
                  <th>
                    Location
                    <select
                      name="location"
                      className="form-select"
                      value={filters.location}
                      onChange={handleFilterChange}
                    >
                      <option value="">All</option>
                      {availableLocations.map((location, index) => (
                        <option key={index} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </th>
                  <th>
                    Batch Name
                    <select
                      name="batchName"
                      className="form-select"
                      value={filters.batchName}
                      onChange={handleFilterChange}
                    >
                      <option value="">All</option>
                      {availableBatchNames.map((batchName, index) => (
                        <option key={index} value={batchName}>
                          {batchName}
                        </option>
                      ))}
                    </select>
                  </th>
                  <th>
                    Trainer Name
                    <select
                      name="trainerName"
                      className="form-select"
                      value={filters.trainerName}
                      onChange={handleFilterChange}
                    >
                      <option value="">All</option>
                      {availableTrainerNames.map((trainerName, index) => (
                        <option key={index} value={trainerName}>
                          {trainerName}
                        </option>
                      ))}
                    </select>
                  </th>
                  <th>
                    Subject Name
                    <select
                      name="subjectName"
                      className="form-select"
                      value={filters.subjectName}
                      onChange={handleFilterChange}
                    >
                      <option value="">All</option>
                      {availableSubjectNames.map((subjectName, index) => (
                        <option key={index} value={subjectName}>
                          {subjectName}
                        </option>
                      ))}
                    </select>
                  </th>
                  <th>
                    Start Date & Time
                    <input
                      type="datetime-local"
                      name="startDate"
                      className="form-control date"
                      value={filters.startDate}
                      onChange={handleFilterChange}
                    />
                  </th>
                  <th>
                    End Date & Time
                    <input
                      type="datetime-local"
                      name="endDate"
                      className="form-control date"
                      value={filters.endDate}
                      onChange={handleFilterChange}
                    />
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBatches.map((batch, index) => (
                  <tr key={index}>
                    {editRowId === `${batch.id.batchId}-${batch.id.trainerId}-${batch.id.subjectId}` ? (
                      <>
                        {/* Editable row with input fields only for startDate and endDate */}
                        <td>{batch.location.name}</td>
                        <td>{batch.batch.name}</td>
                        <td>{batch.trainer.name}</td>
                        <td>{batch.subject.name}</td>
                        <td>
                          <input
                            type="datetime-local"
                            name="startDate"
                            className="form-control"
                            value={new Date(editData.startDate).toISOString().slice(0, 16)}
                            onChange={handleInputChange}
                          />
                        </td>
                        <td>
                          <input
                            type="datetime-local"
                            name="endDate"
                            className="form-control"
                            value={new Date(editData.endDate).toISOString().slice(0, 16)}
                            onChange={handleInputChange}
                          />
                        </td>
                        <td>
                          <button className="btn btn-success me-2" onClick={() => handleSave(batch.id.batchId, batch.id.trainerId, batch.id.subjectId)}>Save</button>
                          <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        {/* Non-editable row with data */}
                        <td>{batch.location.name}</td>
                        <td>{batch.batch.name}</td>
                        <td>{batch.trainer.name}</td>
                        <td>{batch.subject.name}</td>
                        <td>{new Date(batch.startDate).toLocaleString()}</td>
                        <td>{new Date(batch.endDate).toLocaleString()}</td>
                        <td>
                          <button className="btn btn-primary me-2" onClick={() => handleEdit(batch.id.batchId, batch.id.trainerId, batch.id.subjectId)}>Update</button>
                          <button className="btn btn-danger" onClick={() => handleDelete(batch.id.batchId, batch.id.trainerId, batch.id.subjectId)}>Delete</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RunningBatchTable;


