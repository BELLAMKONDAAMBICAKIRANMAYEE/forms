
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./BatchTable.css";
import eventEmitter from './eventEmitter';

function BatchTable() {
  const [batches, setBatches] = useState([]);
  const [locations, setLocations] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [batchFilter, setBatchFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [filteredBatchNames, setFilteredBatchNames] = useState([]);
  const [editBatchId, setEditBatchId] = useState(null);
  const [formData, setFormData] = useState({ id: '', name: '', startDate: '', location: '', locationId: '' });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const batchResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/batches`);
        const formattedBatches = batchResponse.data.map(batch => ({
          ...batch,
          startDate: batch.startDate.split('T')[0]
        }));
        setBatches(formattedBatches);
        setFilteredBatches(formattedBatches);


        const locationResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/locations`);
        setLocations(locationResponse.data);
        setFilteredLocations(locationResponse.data);
        setFilteredBatchNames(formattedBatches.map(batch => batch.name));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

  }, []);

  useEffect(() => {
    const handleBatchAdded = (newBatch) => {
      const formattedBatch = {
        ...newBatch,
        startDate: newBatch.startDate.split('T')[0],
      };

      setBatches((prevBatches) => [...prevBatches, formattedBatch]);
      setFilteredBatches((prevFilteredBatches) => [...prevFilteredBatches, formattedBatch]);
    };

    eventEmitter.on('batchAdded', handleBatchAdded);
    return () => {
      eventEmitter.off('batchAdded', handleBatchAdded);
    };
  }, []);



  const handleBatchFilterChange = (e) => {
    const selectedBatchName = e.target.value;
    setBatchFilter(selectedBatchName);
    filterLocations(selectedBatchName);
    filterTable(selectedBatchName, locationFilter);
  };


  const handleLocationFilterChange = (e) => {
    const selectedLocation = e.target.value;
    setLocationFilter(selectedLocation);
    filterBatches(selectedLocation);
    filterTable(batchFilter, selectedLocation);
  };


  const filterLocations = (selectedBatchName) => {
    if (selectedBatchName) {
      const filteredLocs = batches
        .filter(batch => batch.name === selectedBatchName)
        .map(batch => batch.location);
      setFilteredLocations([...new Set(filteredLocs)]);
    } else {
      setFilteredLocations(locations);
    }
  };

  const filterBatches = (selectedLocation) => {
    if (selectedLocation) {
      const filteredBatches = batches
        .filter(batch => batch.location.name === selectedLocation)
        .map(batch => batch.name);
      setFilteredBatchNames([...new Set(filteredBatches)]);
    } else {
      setFilteredBatchNames(batches.map(batch => batch.name));
    }
  };


  const filterTable = (selectedBatch, selectedLocation) => {
    let filtered = batches;

    if (selectedBatch) {
      filtered = filtered.filter(batch => batch.name === selectedBatch);
    }

    if (selectedLocation) {
      filtered = filtered.filter(batch => batch.location.name === selectedLocation);
    }

    setFilteredBatches(filtered);
  };


  const handleUpdate = (batch) => {
    setEditBatchId(batch.id);
    setFormData({
      id: batch.id,
      name: batch.name,
      startDate: batch.startDate,
      location: batch.location.name,
      locationId: batch.location.id
    });
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editBatchId) {
      try {
        const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/batches/${editBatchId}`, {
          id: formData.id,
          name: formData.name,
          startDate: formData.startDate,
          location: {
            id: formData.locationId,
            name: formData.location
          }
        });

        const updatedBatch = {
          ...response.data,
          startDate: response.data.startDate.split('T')[0]
        };

        setBatches(batches.map(batch =>
          batch.id === editBatchId ? updatedBatch : batch
        ));

        setFilteredBatches(filteredBatches.map(batch =>
          batch.id === editBatchId ? updatedBatch : batch
        ));

        setEditBatchId(null);
        setFormData({ id: '', name: '', startDate: '', location: '', locationId: '' });
      } catch (error) {
        console.error('Error updating batch:', error);
      }
    }
  };


  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/batches/${id}`);
      setBatches(batches.filter(batch => batch.id !== id));
      setFilteredBatches(filteredBatches.filter(batch => batch.id !== id));
    } catch (error) {
      console.error('Error deleting batch:', error);
    }
  };

  return (
    <div>
      <h2>Batch List</h2>
      <table border="1" cellPadding="10" cellSpacing="0" className="batch-table">
        <thead>
          <tr>

            <th>
              <select value={batchFilter} onChange={handleBatchFilterChange}>
                <option value="">All Batches</option>
                {filteredBatchNames.map((batchName, index) => (
                  <option key={index} value={batchName}>{batchName}</option>
                ))}
              </select>
            </th>
            <th>Start Date</th>

            <th>
              <select value={locationFilter} onChange={handleLocationFilterChange}>
                <option value="">All Locations</option>
                {filteredLocations.map(location => (
                  <option key={location.id} value={location.name}>{location.name}</option>
                ))}
              </select>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBatches.map(batch => (
            <tr key={batch.id}>
              {editBatchId === batch.id ? (
                <>
                  <td>
                    <input
                      type="text"
                      name="name"
                      className='inputBatch'
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      name="startDate"
                      className='inputBatch'
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="location"
                      className='inputBatch'
                      value={formData.location}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="hidden"
                      name="locationId"
                      className='inputBatch'
                      value={formData.locationId}
                    />
                  </td>
                  <td>
                    <button type="button" onClick={handleSubmit}>Save</button>
                    <button type="button" onClick={() => setEditBatchId(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{batch.name}</td>
                  <td>{batch.startDate}</td>
                  <td>{batch.location.name}</td>
                  <td>
                    <button onClick={() => handleUpdate(batch)}>Update</button>
                    {/* <button onClick={() => handleDelete(batch.id)}>Delete</button> */}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BatchTable;




