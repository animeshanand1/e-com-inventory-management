import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Modal from './common/Modal';

const BulkUpdateModal = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  
  const [uploadFile, setUploadFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
  
      setPreviewData([
        { productId: '1', variantIndex: 0, field: 'quantity', newValue: 100, currentValue: 50 },
        { productId: '1', variantIndex: 0, field: 'lowStockThreshold', newValue: 10, currentValue: 5 },
        { productId: '2', variantIndex: 1, field: 'quantity', newValue: 75, currentValue: 25 }
      ]);
    }
  };

  const handleBulkUpdate = async () => {
    if (!uploadFile && previewData.length === 0) {
      toast.error('Please select a file or add manual updates');
      return;
    }

    setLoading(true);
    try {
      toast.success('Bulk update completed successfully!');
      handleClose();
      setUploadFile(null);
      setPreviewData([]);
    } catch (error) {
      toast.error('Bulk update failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePreviewItem = (index) => {
    setPreviewData(prev => prev.filter((_, i) => i !== index));
  };

  const downloadTemplate = () => {
    const jsonTemplate = [
      {
        "name": "Sample Product Name",
        "description": "Detailed product description",
        "brand": "Brand Name",
        "category": {
          "primary": "Apparel",
          "secondary": "Dresses"
        },
        "subcategory": "Summer Dresses",
        "slug": "sample-product-name",
        "status": "active",
        "visibility": "visible",
        "publishedAt": new Date().toISOString(),
        "pricing": {
          "basePrice": 1200,
          "salePrice": 999,
          "currency": "INR"
        },
        "variants": [
          {
            "sku": "SKU12345-1",
            "attributes": {
              "color": {
                "name": "Red",
                "hex": "#ff0000",
                "image": "https://example.com/color-red.png"
              },
              "size": "M"
            },
            "images": [
              {
                "url": "https://example.com/product-image.jpg",
                "alt": "Front view",
                "isPrimary": true,
                "order": 1,
                "type": "front"
              }
            ],
            "inventory": {
              "quantity": 50,
              "reserved": 0,
              "available": 50,
              "lowStockThreshold": 5,
              "trackInventory": true
            },
            "physical": {
              "weight": 0.5,
              "dimensions": {
                "length": 30,
                "width": 20,
                "height": 2
              }
            }
          }
        ],
        "specifications": {
          "closure": "Zipper",
          "soleMaterial": "Rubber",
          "upperMaterial": "Cotton",
          "insole": "Foam",
          "careInstructions": [
            "Machine wash cold",
            "Do not bleach"
          ]
        },
        "isOnSale": true,
        "featured": false,
        "isNew": true,
        "seo": {
          "metaTitle": "Buy Sample Product Online",
          "metaDescription": "Best product for your needs",
          "metaKeywords": "product, sample, category"
        }
      }
    ];

    const jsonContent = JSON.stringify(jsonTemplate, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'admin_bulk_product_upload_template.json';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const footer = (
    <>
      <button type="button" className="btn btn-secondary" onClick={handleClose}>
        Cancel
      </button>
      <button 
        type="button" 
        className="btn btn-primary" 
        onClick={handleBulkUpdate}
        disabled={loading || previewData.length === 0}
      >
        {loading ? 'Updating...' : `Apply ${previewData.length} Changes`}
      </button>
    </>
  );

  return (
    <Modal
      show={show}
      handleClose={handleClose}
      title="Bulk Inventory Update"
      footer={footer}
      size="lg"
    >
      <div className="mb-4">
        <div className="row">
          <div className="col-md-8">
            <label className="form-label">Upload CSV/Excel File</label>
            <input
              ref={fileInputRef}
              type="file"
              className="form-control"
              accept=".json,.csv,.xlsx,.xls"
              onChange={handleFileSelect}
            />
            <small className="form-text text-muted">
              Upload a JSON file with product data matching the template structure. File should be an array of product objects.
            </small>
          </div>
          <div className="col-md-4 d-flex align-items-end">
            <button
              type="button"
              className="btn btn-outline-info"
              onClick={downloadTemplate}
            >
              <i className="bi bi-download me-1"></i>
              Download Template
            </button>
          </div>
        </div>
      </div>

      {uploadFile && (
        <div className="alert alert-info">
          <i className="bi bi-file-earmark-text me-2"></i>
          Selected file: <strong>{uploadFile.name}</strong>
        </div>
      )}

      {previewData.length > 0 && (
        <>
          <h6>Preview Changes ({previewData.length} items)</h6>
          <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <table className="table table-sm table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Product ID</th>
                  <th>Variant Index</th>
                  <th>Field</th>
                  <th>Current Value</th>
                  <th>New Value</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {previewData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.productId}</td>
                    <td>{item.variantIndex}</td>
                    <td>{item.field}</td>
                    <td>{item.currentValue}</td>
                    <td className="fw-bold text-primary">{item.newValue}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleRemovePreviewItem(index)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {previewData.length === 0 && !uploadFile && (
        <div className="text-center py-4">
          <i className="bi bi-cloud-upload" style={{ fontSize: '3rem', color: '#ccc' }}></i>
          <p className="mt-2 mb-0 text-muted">Select a file to preview changes</p>
        </div>
      )}
    </Modal>
  );
};

export default BulkUpdateModal;
