import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { deleteItem, selectInventoryStatus } from '../features/inventory/inventorySlice';

const SortableHeader = ({ children, name, sortConfig, setSortConfig }) => {
  const isSorted = sortConfig.key === name;
  const direction = isSorted ? sortConfig.direction : 'none';

  const onSort = () => {
    let newDirection = 'ascending';
    if (isSorted && sortConfig.direction === 'ascending') {
      newDirection = 'descending';
    }
    setSortConfig({ key: name, direction: newDirection });
  };

  return (
    <th onClick={onSort} style={{ cursor: 'pointer' }}>
      {children}
      {direction === 'ascending' && <i className="bi bi-arrow-up ms-2"></i>}
      {direction === 'descending' && <i className="bi bi-arrow-down ms-2"></i>}
    </th>
  );
};

const InventoryTable = ({ items, onEdit, sortConfig, setSortConfig }) => {
  const dispatch = useDispatch();
  const status = useSelector(selectInventoryStatus);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      dispatch(deleteItem(id));
    }
  };

  const LOW_STOCK_THRESHOLD = 10;

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead>
          <tr>
            <SortableHeader name="name" {...{sortConfig, setSortConfig}}>Name</SortableHeader>
            <SortableHeader name="sku" {...{sortConfig, setSortConfig}}>SKU</SortableHeader>
            <SortableHeader name="category" {...{sortConfig, setSortConfig}}>Category</SortableHeader>
            <SortableHeader name="price" {...{sortConfig, setSortConfig}}>Price</SortableHeader>
            <SortableHeader name="quantity" {...{sortConfig, setSortConfig}}>Quantity</SortableHeader>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? items.map(item => (
            <tr key={item.id} className={item.quantity <= LOW_STOCK_THRESHOLD ? 'table-warning' : ''}>
              <td>{item.name}</td>
              <td>{item.sku}</td>
              <td>{item.category || 'Uncategorized'}</td>
              <td>₹{parseFloat(item.price).toFixed(2)}</td>
              <td>
                {item.quantity}
                {item.quantity <= LOW_STOCK_THRESHOLD && 
                  <span className="badge bg-danger ms-2" title="Low Stock">
                    <i className="bi bi-exclamation-triangle"></i>
                  </span>
                }
              </td>
              <td>
                <button 
                  className="btn btn-sm btn-outline-primary me-2" 
                  onClick={() => onEdit(item)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-sm btn-outline-danger" 
                  onClick={() => handleDelete(item.id)}
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="6" className="text-center py-4">No items found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;