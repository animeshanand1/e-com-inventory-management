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
    quantity: 0,
    price: 0,
    category: "",
  });

  const isEditMode = item !== null;

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        name: item.name || "",
        sku: item.sku || "",
        quantity: item.quantity || 0,
        price: item.price || 0,
        category: item.category || "",
      });
    } else {
      setFormData({
        name: "",
        sku: "",
        quantity: 0,
        price: 0,
        category: "",
      });
    }
  }, [item, show, isEditMode]);

  useEffect(() => {
    // Clear errors and status when modal opens
    if (show) {
      dispatch(clearError());
      dispatch(clearAddUpdateStatus());
    }
  }, [show, dispatch]);

  useEffect(() => {
    // Handle success/error states
    if (addUpdateStatus === 'succeeded') {
      toast.success(isEditMode ? "Item updated successfully!" : "Item added successfully!");
      handleClose();
      // Clear the status after a short delay
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const itemData = {
      ...formData,
      quantity: parseInt(formData.quantity, 10),
      price: parseFloat(formData.price),
    };
    
    if (isEditMode) {
      // Include the id when updating
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
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Quantity</label>
            <input
              type="number"
              name="quantity"
              className="form-control"
              value={formData.quantity}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
          <div className="col-md-6 mb-3">
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
        </div>
        <div className="mb-3">
          <label className="form-label">Category</label>
          <input
            type="text"
            name="category"
            className="form-control"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g., Electronics, Furniture, etc."
          />
        </div>
      </form>
    </Modal>
  );
};

export default AddEditItemModal;
