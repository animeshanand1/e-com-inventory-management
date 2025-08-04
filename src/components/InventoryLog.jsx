import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const InventoryLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    productId: '',
    changeType: '',
    user: ''
  });

  const sampleLogs = [
    {
      id: 1,
      timestamp: '2025-01-08T10:30:00Z',
      productId: 'PROD001',
      productName: 'T-Shirt',
      variantIndex: 0,
      variantDetails: 'Size: M, Color: Blue',
      changeType: 'quantity_update',
      field: 'quantity',
      oldValue: 50,
      newValue: 100,
      user: 'admin@example.com',
      reason: 'Manual inventory adjustment'
    },
    {
      id: 2,
      timestamp: '2025-01-08T09:15:00Z',
      productId: 'PROD001',
      productName: 'T-Shirt',
      variantIndex: 0,
      variantDetails: 'Size: M, Color: Blue',
      changeType: 'reserve',
      field: 'reserved',
      oldValue: 5,
      newValue: 10,
      user: 'system',
      reason: 'Order #12345 placed'
    },
    {
      id: 3,
      timestamp: '2025-01-08T08:45:00Z',
      productId: 'PROD002',
      productName: 'Jeans',
      variantIndex: 1,
      variantDetails: 'Size: L, Color: Black',
      changeType: 'threshold_update',
      field: 'lowStockThreshold',
      oldValue: 5,
      newValue: 10,
      user: 'admin@example.com',
      reason: 'Updated low stock threshold'
    }
  ];

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
     
      setTimeout(() => {
        setLogs(sampleLogs);
        setLoading(false);
      }, 500);
    } catch (error) {
      toast.error('Failed to fetch inventory logs');
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyFilters = () => {
    fetchLogs();
  };

  const getChangeTypeIcon = (changeType) => {
    switch (changeType) {
      case 'quantity_update':
        return <i className="bi bi-arrow-up-circle text-primary"></i>;
      case 'reserve':
        return <i className="bi bi-lock text-warning"></i>;
      case 'release':
        return <i className="bi bi-unlock text-success"></i>;
      case 'threshold_update':
        return <i className="bi bi-gear text-info"></i>;
      case 'status_change':
        return <i className="bi bi-toggle-on text-secondary"></i>;
      default:
        return <i className="bi bi-pencil text-muted"></i>;
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const exportLogs = () => {
    
    const headers = ['Timestamp', 'Product', 'Variant', 'Change Type', 'Field', 'Old Value', 'New Value', 'User', 'Reason'];
    const csvContent = [
      headers.join(','),
      ...logs.map(log => [
        formatTimestamp(log.timestamp),
        `"${log.productName}"`,
        `"${log.variantDetails}"`,
        log.changeType,
        log.field,
        log.oldValue,
        log.newValue,
        log.user,
        `"${log.reason}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <i className="bi bi-clock-history me-2"></i>
          Inventory Change Log
        </h5>
        <button className="btn btn-outline-secondary btn-sm" onClick={exportLogs}>
          <i className="bi bi-download me-1"></i>
          Export Logs
        </button>
      </div>
      
      <div className="card-body border-bottom">
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label">Date From</label>
            <input
              type="date"
              name="dateFrom"
              className="form-control"
              value={filters.dateFrom}
              onChange={handleFilterChange}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Date To</label>
            <input
              type="date"
              name="dateTo"
              className="form-control"
              value={filters.dateTo}
              onChange={handleFilterChange}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Change Type</label>
            <select
              name="changeType"
              className="form-select"
              value={filters.changeType}
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              <option value="quantity_update">Quantity Update</option>
              <option value="reserve">Reserve</option>
              <option value="release">Release</option>
              <option value="threshold_update">Threshold Update</option>
              <option value="status_change">Status Change</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label">User</label>
            <input
              type="text"
              name="user"
              className="form-control"
              placeholder="User email"
              value={filters.user}
              onChange={handleFilterChange}
            />
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button className="btn btn-primary" onClick={handleApplyFilters}>
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      <div className="card-body">
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Product</th>
                  <th>Variant</th>
                  <th>Change</th>
                  <th>Old → New</th>
                  <th>User</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id}>
                    <td>{formatTimestamp(log.timestamp)}</td>
                    <td>
                      <strong>{log.productName}</strong>
                      <br />
                      <small className="text-muted">{log.productId}</small>
                    </td>
                    <td>{log.variantDetails}</td>
                    <td>
                      {getChangeTypeIcon(log.changeType)}
                      <span className="ms-2">{log.changeType.replace('_', ' ')}</span>
                      <br />
                      <small className="text-muted">{log.field}</small>
                    </td>
                    <td>
                      <span className="text-muted">{log.oldValue}</span>
                      <i className="bi bi-arrow-right mx-2"></i>
                      <span className="fw-bold">{log.newValue}</span>
                    </td>
                    <td>{log.user}</td>
                    <td>{log.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {!loading && logs.length === 0 && (
          <div className="text-center py-4">
            <i className="bi bi-journal-x" style={{ fontSize: '3rem', color: '#ccc' }}></i>
            <p className="mt-2 mb-0 text-muted">No inventory changes found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryLog;
