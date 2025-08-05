import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const LowStockAlert = () => {
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const items = useSelector((state) => state.inventory.items);

  useEffect(() => {
    
    const lowStock = [];
    items.forEach(item => {
      if (item.variants) {
        item.variants.forEach((variant, vIdx) => {
          if (variant.inventory.trackInventory && 
              variant.inventory.quantity <= variant.inventory.lowStockThreshold) {
            lowStock.push({
              ...variant,
              productId: item.id,
              productName: item.name,
              productSku: item.sku,
              variantIndex: vIdx
            });
          }
        });
      }
    });
    setLowStockItems(lowStock);
  }, [items]);

  const handleMarkAsRestocked = (productId, variantIndex) => {
    
    toast.info('Mark as restocked functionality would be implemented here');
  };

  const handleReorder = (productId, variantIndex) => {
    
    toast.info('Reorder functionality would be implemented here');
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <i className="bi bi-exclamation-triangle-fill text-warning me-2"></i>
          Low Stock Alerts ({lowStockItems.length})
        </h5>
        {lowStockItems.length > 0 && (
          <span className="badge bg-warning">{lowStockItems.length} items need attention</span>
        )}
      </div>
      <div className="card-body">
        {lowStockItems.length === 0 ? (
          <div className="text-center py-4">
            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '2rem' }}></i>
            <p className="mt-2 mb-0">All items are adequately stocked!</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Variant</th>
                  <th>Current Stock</th>
                  <th>Threshold</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((item, idx) => (
                  <tr key={idx} className="table-warning">
                    <td>
                      <strong>{item.productName}</strong>
                      <br />
                      <small className="text-muted">{item.productSku}</small>
                    </td>
                    <td>
                      {item.size && <span className="badge bg-secondary me-1">{item.size}</span>}
                      {item.color && <span className="badge bg-info">{item.color}</span>}
                    </td>
                    <td>
                      <span className="badge bg-danger">{item.inventory.quantity}</span>
                    </td>
                    <td>{item.inventory.lowStockThreshold}</td>
                    <td>
                      <span className={`badge ${item.status === 'out_of_stock' ? 'bg-danger' : 'bg-warning'}`}>
                        {item.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-success me-2"
                        onClick={() => handleMarkAsRestocked(item.productId, item.variantIndex)}
                      >
                        Restock
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleReorder(item.productId, item.variantIndex)}
                      >
                        Reorder
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LowStockAlert;
