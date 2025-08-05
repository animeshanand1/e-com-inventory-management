import React, { useState } from 'react';

const AdvancedFilter = ({ onFilterChange, onClearFilters }) => {
  const [filters, setFilters] = useState({
    category: '',
    gender: '',
    ageGroup: '',
    status: '',
    stockLevel: '',
    trackInventory: '',
    lowStock: false,
    outOfStock: false
  });

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      category: '',
      gender: '',
      ageGroup: '',
      status: '',
      stockLevel: '',
      trackInventory: '',
      lowStock: false,
      outOfStock: false
    };
    setFilters(clearedFilters);
    onClearFilters();
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      value === true || (value !== false && value !== '')
    ).length;
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0">
            <i className="bi bi-funnel me-2"></i>
            Advanced Filters
            {getActiveFiltersCount() > 0 && (
              <span className="badge bg-primary ms-2">{getActiveFiltersCount()}</span>
            )}
          </h6>
          <button 
            className="btn btn-sm btn-outline-secondary" 
            onClick={handleClearFilters}
            disabled={getActiveFiltersCount() === 0}
          >
            Clear All
          </button>
        </div>
        
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Apparel">Apparel</option>
              <option value="Tops">Tops</option>
              <option value="T-Shirts">T-Shirts</option>
              <option value="Outerwear">Outerwear</option>
              <option value="Hoodies">Hoodies</option>
              <option value="Dresses">Dresses</option>
            </select>
          </div>
          
          <div className="col-md-3">
            <label className="form-label">Gender</label>
            <select
              className="form-select"
              value={filters.gender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
            >
              <option value="">All Genders</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>
          
          <div className="col-md-3">
            <label className="form-label">Age Group</label>
            <select
              className="form-select"
              value={filters.ageGroup}
              onChange={(e) => handleFilterChange('ageGroup', e.target.value)}
            >
              <option value="">All Ages</option>
              <option value="adult">Adult</option>
              <option value="teen">Teen</option>
              <option value="kids">Kids</option>
            </select>
          </div>
          
          <div className="col-md-3">
            <label className="form-label">Variant Status</label>
            <select
              className="form-select"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </div>
        </div>
        
        <div className="row g-3 mt-2">
          <div className="col-md-3">
            <label className="form-label">Stock Level</label>
            <select
              className="form-select"
              value={filters.stockLevel}
              onChange={(e) => handleFilterChange('stockLevel', e.target.value)}
            >
              <option value="">All Levels</option>
              <option value="high">High Stock (&gt;50)</option>
              <option value="medium">Medium Stock (11-50)</option>
              <option value="low">Low Stock (1-10)</option>
              <option value="zero">Zero Stock</option>
            </select>
          </div>
          
          <div className="col-md-3">
            <label className="form-label">Track Inventory</label>
            <select
              className="form-select"
              value={filters.trackInventory}
              onChange={(e) => handleFilterChange('trackInventory', e.target.value)}
            >
              <option value="">All Items</option>
              <option value="true">Tracked</option>
              <option value="false">Not Tracked</option>
            </select>
          </div>
        </div>
        
        <div className="row mt-3">
          <div className="col-md-6">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="lowStockFilter"
                checked={filters.lowStock}
                onChange={(e) => handleFilterChange('lowStock', e.target.checked)}
              />
              <label className="form-check-label" htmlFor="lowStockFilter">
                <i className="bi bi-exclamation-triangle text-warning me-1"></i>
                Show only low stock items
              </label>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="outOfStockFilter"
                checked={filters.outOfStock}
                onChange={(e) => handleFilterChange('outOfStock', e.target.checked)}
              />
              <label className="form-check-label" htmlFor="outOfStockFilter">
                <i className="bi bi-x-circle text-danger me-1"></i>
                Show only out of stock items
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilter;
