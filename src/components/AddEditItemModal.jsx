import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "./common/Modal";
import { addNewItem, updateItem, clearError, clearAddUpdateStatus, selectAddUpdateStatus } from "../features/inventory/inventorySlice";
import { toast } from "react-toastify";

const AddEditItemModal = ({ show, handleClose, item }) => {
  const dispatch = useDispatch();
  const addUpdateStatus = useSelector(selectAddUpdateStatus);
  const error = useSelector((state) => state.inventory.error);
  
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: 0,
    category: "",
    variants: [
      {
        size: "",
        color: "",
        inventory: {
          quantity: 0,
          reserved: 0,
          available: 0,
          lowStockThreshold: 0,
          trackInventory: true,
        },
        status: "in_stock"
      }
    ]
  });

  const isEditMode = item !== null;

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        name: item.name || "",
        sku: item.sku || "",
        price: item.price || 0,
        category: item.category || "",
        variants: item.variants || [
          {
            size: "",
            color: "",
            inventory: {
              quantity: 0,
              reserved: 0,
              available: 0,
              lowStockThreshold: 0,
              trackInventory: true,
            },
            status: "in_stock"
          }
        ]
      });
    } else {
      setFormData({
        name: "",
        sku: "",
        price: 0,
        category: "",
        variants: [
          {
            size: "",
            color: "",
            inventory: {
              quantity: 0,
              reserved: 0,
              available: 0,
              lowStockThreshold: 0,
              trackInventory: true,
            },
            status: "in_stock"
          }
        ]
      });
    }
  }, [item, show, isEditMode]);

  useEffect(() => {
    
    if (show) {
      dispatch(clearError());
      dispatch(clearAddUpdateStatus());
    }
  }, [show, dispatch]);

  useEffect(() => {
    
    if (addUpdateStatus === 'succeeded') {
      toast.success(isEditMode ? "Item updated successfully!" : "Item added successfully!");
      handleClose();
      
      setTimeout(() => {
        dispatch(clearAddUpdateStatus());
      }, 100);
    } else if (addUpdateStatus === 'failed' && error) {
      toast.error(error);
    }
  }, [addUpdateStatus, error, isEditMode, handleClose, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVariantChange = (idx, field, value) => {
    setFormData((prev) => {
      const variants = [...prev.variants];
      if (field.startsWith('inventory.')) {
        const invField = field.split('.')[1];
        variants[idx].inventory[invField] = invField === 'trackInventory' ? value : Number(value);
        
        if (invField === 'quantity' || invField === 'reserved') {
          variants[idx].inventory.available = variants[idx].inventory.quantity - variants[idx].inventory.reserved;
        }
      } else {
        variants[idx][field] = value;
      }
      return { ...prev, variants };
    });
  };

  const handleAddVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          size: "",
          color: "",
          inventory: {
            quantity: 0,
            reserved: 0,
            available: 0,
            lowStockThreshold: 0,
            trackInventory: true,
          },
          status: "in_stock"
        }
      ]
    }));
  };

  const handleRemoveVariant = (idx) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const itemData = {
      ...formData,
      price: parseFloat(formData.price),
      variants: formData.variants.map(v => ({
        ...v,
        inventory: {
          ...v.inventory,
          quantity: Number(v.inventory.quantity),
          reserved: Number(v.inventory.reserved),
          available: Number(v.inventory.available),
          lowStockThreshold: Number(v.inventory.lowStockThreshold),
          trackInventory: Boolean(v.inventory.trackInventory)
        }
      }))
    };
    if (isEditMode) {
      const updateData = {
        ...itemData,
        id: item.id
      };
      dispatch(updateItem(updateData));
    } else {
      dispatch(addNewItem(itemData));
    }
  };

  const footer = (
    <>
      <button type="button" className="btn btn-secondary" onClick={handleClose}>
        Close
      </button>
      <button 
        type="button" 
        className="btn btn-primary" 
        onClick={handleSubmit}
        disabled={addUpdateStatus === 'loading'}
      >
        {addUpdateStatus === 'loading' ? 'Saving...' : (isEditMode ? "Save Changes" : "Add Item")}
      </button>
    </>
  );

  return (
    <Modal
      show={show}
      handleClose={handleClose}
      title={isEditMode ? "Edit Item" : "Add New Item"}
      footer={footer}
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">SKU</label>
          <input
            type="text"
            name="sku"
            className="form-control"
            value={formData.sku}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            step="0.01"
            name="price"
            className="form-control"
            value={formData.price}
            onChange={handleChange}
            min="0"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Category</label>
          <input
            type="text"
            name="category"
            className="form-control"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g., Men, Women, Kids, etc."
          />
        </div>
        <hr />
        <h5>Variants</h5>
        {formData.variants.map((variant, idx) => (
          <div key={idx} className="border rounded p-3 mb-4 bg-light">
            <div className="row g-3 align-items-end mb-2">
              <div className="col-md-3">
                <label className="form-label">Size</label>
                <input
                  type="text"
                  className="form-control"
                  value={variant.size}
                  onChange={e => handleVariantChange(idx, 'size', e.target.value)}
                  placeholder="e.g., M, L, XL"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Color</label>
                <input
                  type="text"
                  className="form-control"
                  value={variant.color}
                  onChange={e => handleVariantChange(idx, 'color', e.target.value)}
                  placeholder="e.g., Red, Blue"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={variant.status}
                  onChange={e => handleVariantChange(idx, 'status', e.target.value)}
                >
                  <option value="in_stock">In Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                  <option value="discontinued">Discontinued</option>
                </select>
              </div>
              <div className="col-md-3 d-flex justify-content-end">
                {formData.variants.length > 1 && (
                  <button type="button" className="btn btn-outline-danger" onClick={() => handleRemoveVariant(idx)}>
                    Remove Variant
                  </button>
                )}
              </div>
            </div>
            <div className="row g-3 mb-2">
              <div className="col-md-2">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  value={variant.inventory.quantity}
                  onChange={e => handleVariantChange(idx, 'inventory.quantity', e.target.value)}
                  min="0"
                  required
                />
              </div>
              <div className="col-md-2">
                <label className="form-label">Reserved</label>
                <input
                  type="number"
                  className="form-control"
                  value={variant.inventory.reserved}
                  onChange={e => handleVariantChange(idx, 'inventory.reserved', e.target.value)}
                  min="0"
                  required
                />
              </div>
              <div className="col-md-2">
                <label className="form-label">Available</label>
                <input
                  type="number"
                  className="form-control"
                  value={variant.inventory.available}
                  readOnly
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Low Stock Threshold</label>
                <input
                  type="number"
                  className="form-control"
                  value={variant.inventory.lowStockThreshold}
                  onChange={e => handleVariantChange(idx, 'inventory.lowStockThreshold', e.target.value)}
                  min="0"
                  required
                />
              </div>
              <div className="col-md-3 d-flex align-items-center mt-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={variant.inventory.trackInventory}
                    onChange={e => handleVariantChange(idx, 'inventory.trackInventory', e.target.checked)}
                  />
                  <label className="form-check-label">Track Inventory</label>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="d-flex justify-content-end">
          <button type="button" className="btn btn-outline-primary mb-3" onClick={handleAddVariant}>
            Add Variant
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEditItemModal;
