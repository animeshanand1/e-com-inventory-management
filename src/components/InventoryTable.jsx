import React, { use } from 'react';
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
  console.log('fetching inventory items with sort:')
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
            <SortableHeader name="name" {...{sortConfig, setSortConfig}}>Product Name</SortableHeader>
            <SortableHeader name="brand" {...{sortConfig, setSortConfig}}>Brand</SortableHeader>
            <SortableHeader name="category" {...{sortConfig, setSortConfig}}>Category</SortableHeader>
            <SortableHeader name="pricing.basePrice" {...{sortConfig, setSortConfig}}>Price</SortableHeader>
            <th>Variants</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? items.map(item => (
            <tr key={item.id}>
              <td>
                <strong>{item.name}</strong>
                {item.isNew && <span className="badge bg-success ms-2">New</span>}
                {item.featured && <span className="badge bg-primary ms-2">Featured</span>}
                {item.isOnSale && <span className="badge bg-warning ms-2">On Sale</span>}
              </td>
              <td>{item.brand || 'N/A'}</td>
              <td>
                {typeof item.category === 'string' ? item.category : item.category?.primary || 'N/A'}
                {item.category?.secondary && (
                  <><br /><small className="text-muted">{item.category.secondary}</small></>
                )}
                {item.targetGroup && (
                  <>
                    <br />
                    <small className="text-muted">
                      For: {Array.isArray(item.targetGroup.gender) ? item.targetGroup.gender.join(', ') : item.targetGroup.gender}
                      {item.targetGroup.ageGroup && ` | ${item.targetGroup.ageGroup}`}
                      {item.targetGroup.ageRange && ` | Age: ${item.targetGroup.ageRange.min}-${item.targetGroup.ageRange.max}`}
                    </small>
                  </>
                )}
              </td>
              <td>
                ₹{parseFloat(
                  (item.variants && item.variants[0]?.pricing?.basePrice) || item.pricing?.basePrice || 0
                ).toFixed(2)}
              </td>
              <td>
                {item.variants && item.variants.length > 0 ? (
                  <table className="table table-bordered table-sm mb-0">
                    <thead>
                      <tr>
                        <th>SKU</th>
                        <th>Size</th>
                        <th>Color</th>
                        <th>Quantity</th>
                        <th>Reserved</th>
                        <th>Available</th>
                        <th>Low Stock Threshold</th>
                        <th>Track</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.variants.map((variant, vIdx) => (
                        <tr key={vIdx} className={variant.inventory.quantity <= variant.inventory.lowStockThreshold ? 'table-warning' : ''}>
                          <td><small>{variant.sku}</small></td>
                          <td>{variant.attributes?.size}</td>
                          <td>
                            {variant.attributes?.color?.name}
                            {variant.attributes?.color?.hex && (
                              <span 
                                className="ms-2 d-inline-block" 
                                style={{
                                  width: '15px', 
                                  height: '15px', 
                                  backgroundColor: variant.attributes.color.hex,
                                  border: '1px solid #ccc',
                                  borderRadius: '50%'
                                }}
                              ></span>
                            )}
                          </td>
                          <td>{variant.inventory.quantity}</td>
                          <td>{variant.inventory.reserved}</td>
                          <td>{variant.inventory.available}</td>
                          <td>{variant.inventory.lowStockThreshold}</td>
                          <td>{variant.inventory.trackInventory ? <span className="badge bg-success">Yes</span> : <span className="badge bg-secondary">No</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <span className="text-muted">No variants</span>
                )}
              </td>
              <td>
                <div>
                  {/* <strong>W:</strong> {item.physical?.weight || 'N/A'} {item.physical?.weightUnit}<br />
                  <strong>D:</strong> {item.physical?.dimensions?.length}×{item.physical?.dimensions?.width}×{item.physical?.dimensions?.height} {item.physical?.dimensions?.unit}<br />
                  <strong>Vol:</strong> {item.physical?.volume || 'N/A'} {item.physical?.volumeUnit} */}
                </div>
              </td>
              <td>
                <span className={`badge ${item.status === 'active' ? 'bg-success' : item.status === 'inactive' ? 'bg-secondary' : 'bg-warning'}`}>
                  {item.status}
                </span>
              </td>
              <td>
                <div className="btn-group" role="group">
                  <button 
                    className="btn btn-sm btn-outline-primary" 
                    onClick={() => onEdit(item)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-danger" 
                    onClick={() => onDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="8" className="text-center py-4">No items found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;