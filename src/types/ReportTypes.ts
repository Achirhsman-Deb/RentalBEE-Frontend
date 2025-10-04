export interface ReportFilters {
  dateFrom: string;
  dateTo: string;
  locationId: string;
  reportType: string;
  token:string;
}

export interface ReportData {
  periodStart: string;
  periodEnd: string;
  locationName: string;
  carModel: string;
  carId: string;
  daysOfRent: number;
  reservations: number;
  mileageStart: string;
  mileageEnd: string;
  totalMileage: number;
  averageMileagePerDay: string;
}

export interface ExportReportPayload {
  filters: ReportFilters;
  extension: string;
}


export type LocationResponse = {
  locationId: string;
  locationName: string;
};

export type SelectedDate = {
  pickupDate: Date | null;
  dropoffDate: Date | null;
  pickupTime: string | null;
  dropoffTime: string | null;
};
