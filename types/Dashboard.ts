type Dashboard = {
  top_stats: {
    active_tenancies: number;
    properties: number;
    units: number;
    rooms: number;
  };
  general: {
    credit_balance: string;
    auto_collection: number;
  };
  rentable_space: {
    total: number;
    vacant: number;
    occupied: number;
  };
  tenancy_expiry: {
    in_7_days: number;
    in_14_days: number;
    in_30_days: number;
    in_60_days: number;
    in_90_days: number;
  };
  rental_collection: {
    today: number;
    tomorrow: number;
  };
  pie_charts: {
    month: string;
    rental_collection: {
      paid: number;
      unpaid: number;
    };
    payment_status: {
      paid: number;
      unpaid: number;
      overdue: string; // جاي كنص "10553803.04"
    };
  };
};
