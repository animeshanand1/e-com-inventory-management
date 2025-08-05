import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  fetchInventory, 
  selectAllItems, 
  selectInventoryStatus, 
  selectInventoryError,
  clearError 
} from './inventorySlice';

import Loader from '../../components/common/Loader';
import Pagination from '../../components/common/Pagination';
import { useDebounce } from '../../hooks/useDebounce';
import { exportToCSV } from '../../utils/exportUtils';
import InventoryTable from '../../components/InventoryTable';
import AddEditItemModal from '../../components/AddEditItemModal';
import LowStockAlert from '../../components/LowStockAlert';
import BulkUpdateModal from '../../components/BulkUpdateModal';
import InventoryLog from '../../components/InventoryLog';
import AdvancedFilter from '../../components/AdvancedFilter';

const ITEMS_PER_PAGE = 10;

const Inventory = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectAllItems);
  const status = useSelector(selectInventoryStatus);
  const error = useSelector(selectInventoryError);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [isBulkUpdateOpen, setIsBulkUpdateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('inventory'); 
  const [advancedFilters, setAdvancedFilters] = useState({});

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchInventory());
    }
  }, [status, dispatch]);

  useEffect(() => {
   
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleOpenModal = (item = null) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
  };

  const handleExport = () => {
    exportToCSV(items, 'inventory_data');
    toast.success('Inventory data exported successfully!');
  };

  const handleRefresh = () => {
    // dispatch(fetchInventory());
    toast.info('Refreshing inventory data...');
  };

  const handleFilterChange = (filters) => {
    setAdvancedFilters(filters);
  };

  const handleClearFilters = () => {
    setAdvancedFilters({});
  };

  const sortedAndFilteredItems = useMemo(() => {
let processableItems = Array.isArray(items) ? [...items] : [];

    if (debouncedSearchTerm) {
      processableItems = processableItems.filter(item => 
        item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    if (Object.keys(advancedFilters).length > 0) {
      processableItems = processableItems.filter(item => {
        
        if (advancedFilters.category && item.category !== advancedFilters.category) {
          return false;
        }

        if (item.variants && item.variants.length > 0) {
          const hasMatchingVariant = item.variants.some(variant => {
           
            if (advancedFilters.status && variant.status !== advancedFilters.status) {
              return false;
            }

            if (advancedFilters.trackInventory !== '' && 
                variant.inventory.trackInventory.toString() !== advancedFilters.trackInventory) {
              return false;
            }

            if (advancedFilters.stockLevel) {
              const qty = variant.inventory.quantity;
              switch (advancedFilters.stockLevel) {
                case 'high': if (qty <= 50) return false; break;
                case 'medium': if (qty < 11 || qty > 50) return false; break;
                case 'low': if (qty < 1 || qty > 10) return false; break;
                case 'zero': if (qty !== 0) return false; break;
              }
            }

            if (advancedFilters.lowStock && 
                variant.inventory.quantity > variant.inventory.lowStockThreshold) {
              return false;
            }

            if (advancedFilters.outOfStock && variant.inventory.quantity > 0) {
              return false;
            }

            return true;
          });
          
          if (!hasMatchingVariant) return false;
        }

        return true;
      });
    }

    if (sortConfig.key) {
      processableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return processableItems;
  }, [items, debouncedSearchTerm, sortConfig, advancedFilters]);

  const totalPages = Math.ceil(sortedAndFilteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = sortedAndFilteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (status === 'loading' && items.length === 0) return <Loader />;

  return (
    <>
      
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            <i className="bi bi-boxes me-2"></i>
            Inventory Management
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => setActiveTab('alerts')}
          >
            <i className="bi bi-exclamation-triangle me-2"></i>
            Low Stock Alerts
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            <i className="bi bi-clock-history me-2"></i>
            Change Logs
          </button>
        </li>
      </ul>

      {activeTab === 'inventory' && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <div className="input-group" style={{ maxWidth: '400px' }}>
              <span className="input-group-text"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <button 
                className="btn btn-outline-secondary me-2" 
                onClick={handleRefresh}
                disabled={status === 'loading'}
              >
                <i className="bi bi-arrow-clockwise me-1"></i> 
                {status === 'loading' ? 'Refreshing...' : 'Refresh'}
              </button>
              <button className="btn btn-outline-info me-2" onClick={() => setIsBulkUpdateOpen(true)}>
                <i className="bi bi-upload me-1"></i> Bulk Update
              </button>
              <button className="btn btn-outline-secondary me-2" onClick={handleExport}>
                <i className="bi bi-download me-1"></i> Export CSV
              </button>
              <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                <i className="bi bi-plus-circle me-1"></i> Add New Item
              </button>
            </div>
          </div>

          <AdvancedFilter 
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />

          <div className="table-container">
            <InventoryTable 
              items={paginatedItems} 
              onEdit={handleOpenModal} 
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
            />
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}
      {activeTab === 'alerts' && <LowStockAlert />}

      {activeTab === 'logs' && <InventoryLog />}

      
      <AddEditItemModal 
        show={isModalOpen}
        handleClose={handleCloseModal}
        item={currentItem}
      />

      <BulkUpdateModal 
        show={isBulkUpdateOpen}
        handleClose={() => setIsBulkUpdateOpen(false)}
      />
    </>
  );
};

export default Inventory;