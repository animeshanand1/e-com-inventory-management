import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import KPIWidget from "./KPIWidget";
import { fetchDashboardSummary, selectDashboardSummary, selectDashboardStatus } from "./dashboardSlice";
import Loader from "../../components/common/Loader";

const Dashboard = () => {
  const dispatch = useDispatch();
  const dashboardStatus = useSelector(selectDashboardStatus);
  const summary = useSelector(selectDashboardSummary);

  useEffect(() => {
    if (dashboardStatus === "idle") {
      dispatch(fetchDashboardSummary());
    }
  }, [dashboardStatus, dispatch]);

  if (dashboardStatus === "loading") {
    return <Loader />;
  }

  return (
    <div>
      <h1 className="mb-4">Dashboard</h1>
      <div>
        <div className="row">
          <KPIWidget
            title="Total Items"
            value={summary.totalItems}
            icon="bi-box-seam"
            colorClass="bg-primary"
          />
          <KPIWidget
            title="Low Stock Items"
            value={summary.lowStockCount}
            icon="bi-exclamation-triangle"
            colorClass="bg-warning"
          />
          <KPIWidget
            title="Total Quantity"
            value={summary.totalQuantity}
            icon="bi-collection"
            colorClass="bg-success"
          />
          <KPIWidget
            title="Total Inventory Value"
            value={`INR${summary.totalValue.toLocaleString()}`}
            icon="bi-currency-dollar"
            colorClass="bg-info"
          />
        </div>
        {/* You can add more dashboard components here, like a recent activity feed or a quick-look at low-stock items */}
      </div>
    </div>
  );
};

export default Dashboard;
