import { useState, useCallback, useRef, useEffect } from "react";
import axios from "axios";
import { useAlert } from "../Components/AlertProvider";
import DropDown, { ProfileDropDown } from "../Components/Inputs/DropDown";
import DatePicker from "../Components/DatePicker";
import Button from "../Components/Button";
import DataTable from "../Components/DataTable";
import { AppDispatch, RootState } from "../store/store";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { exportReport, fetchReportData } from "../slices/ThunkAPI/ThunkAPI";
import {
  LocationResponse,
  ReportData,
  SelectedDate,
} from "../types/ReportTypes";
import { EndPoint } from "../utils";

export default function AdminDashboard() {

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const myalert = useAlert();

  const [locations, setLocations] = useState<LocationResponse[]>([]);
  const [DownloadLoading, setDownloadLoading] = useState<boolean>(false);
  const [loadlocation, setLoadlocation] = useState<boolean>(false);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [showNoRecordsMessage, setShowNoRecordsMessage] =
    useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  const token = useSelector((state: RootState) => state.auth.user?.idToken);
  const reports = useSelector((state: RootState) => state.reports.data);
  const { user } = useSelector((state: RootState) => state.auth);
  const loadingreports = useSelector(
    (state: RootState) => state.reports.loading
  );

  const [filters, setFilters] = useState({
    reportType: "",
    dateFrom: "",
    dateTo: "",
    locationId: "",
    token: user?.idToken + "",
  });
  const [dates, setDates] = useState<SelectedDate>({
    pickupDate: null,
    dropoffDate: null,
    pickupTime: null,
    dropoffTime: null,
  });

  const formatDate = (
    date: Date | null,
    includeYear: boolean = true
  ): string => {
    if (!date) return "";
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "2-digit",
      ...(includeYear && { year: "numeric" }),
    };
    return date.toLocaleDateString("en-US", options);
  };

  const handleDateChange = ({
    startDate,
    endDate,
  }: {
    startDate: string;
    endDate: string;
  }) => {
    const pickupDate = new Date(startDate);
    const dropoffDate = new Date(endDate);
    setDates({ ...dates, pickupDate, dropoffDate });
    setFilters((prev) => ({
      ...prev,
      dateFrom: pickupDate.toISOString().split("T")[0],
      dateTo: dropoffDate.toISOString().split("T")[0],
    }));
  };

  const reportTypes = [
    { value: "Staff performance", label: "Staff Performance" },
    { value: "Sales report", label: "Sales Report" },
  ];

  const columns: { header: string; accessor: keyof ReportData }[] = [
    { header: "Period Start", accessor: "periodStart" },
    { header: "Period End", accessor: "periodEnd" },
    { header: "Location", accessor: "locationName" },
    { header: "Car", accessor: "carModel" },
    { header: "Car ID", accessor: "carId" },
    { header: "Days of Rent", accessor: "daysOfRent" },
    { header: "Reservations", accessor: "reservations" },
    { header: "Mileage Start", accessor: "mileageStart" },
    { header: "Mileage End", accessor: "mileageEnd" },
    { header: "Total Mileage", accessor: "totalMileage" },
    { header: "Avg Mileage Per Day", accessor: "averageMileagePerDay" },
  ];

  
  useEffect(() => {
    const fetchLocations = async () => {
      setLoadlocation(true);
      try {
        const response = await axios.get(
          `${EndPoint}/home/locations`
        );
        setLocations(response.data.content);
        setLoadlocation(false);
      } catch (error) {
        myalert({
          type: "error",
          title: "Location Fetch Error",
          subtitle:
            "An error occurred while fetching the locations. Please try again later.",
        });
        console.error("Error fetching locations:", error);
        setLoadlocation(false);
      }
    };
    fetchLocations();
  }, [myalert]);
  useEffect(() => {
    if (user?.role !== "ADMIN") {
      navigate("/");
      myalert({
        type: "error",
        title: "Unauthorized Access",
        subtitle: "You do not have permission to access this page.",
      });
    }
  }, []);

  const fetchReportDataApi = async () => {
    dispatch(fetchReportData(filters))
      .unwrap()
      .then((response) => {
        if (response.length === 0) {
          console.log("hello");
          setShowNoRecordsMessage(true);
        } else {
          setShowNoRecordsMessage(false);
        }
      })
      .catch((err: string) => {
        if (err == "No reports found for the given filters.") {
          myalert({
            type: "error",
            title: "No Reports Found",
            subtitle:
              "There are no reports available for the chosen filters. Please try different filters.",
          });
          setShowNoRecordsMessage(true);
        } else {
          myalert({
            type: "error",
            title: "Error!",
            subtitle: err || "Failed to fetch report data",
          });
        }
      })
      .finally(() => setIsButtonDisabled(false));
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExportReport = async (extension: string) => {
    try {
      setDownloadLoading(true);
      const payload = {
        filters,
        extension,
        token,
      };

      const url: string = await dispatch(exportReport(payload)).unwrap();

      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `report.${extension}`;
      anchor.click();

      myalert({
        type: "success",
        title: "Download Started",
        subtitle: `The ${extension.toUpperCase()} report is being downloaded.`,
      });
    } catch (error) {
      myalert({
        type: "error",
        title: "Download Error",
        subtitle: "Failed to fetch the report. Please try again later.",
      });
    } finally {
      setDownloadLoading(false);
    }
  };

  const throttle = (func: Function, delay: number) => {
    const lastCall = useRef(0);
    return (...args: any) => {
      const now = Date.now();
      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        func(...args);
      }
    };
  };

  const throttledFetchReportData = useCallback(
    throttle(() => {
      fetchReportDataApi();
      setTimeout(() => setIsButtonDisabled(false), 3000);
    }, 3000),
    [fetchReportDataApi]
  );

  const handleCreateReport = () => {
    if (
      !filters.dateFrom ||
      !filters.dateTo ||
      !filters.locationId ||
      !filters.reportType
    ) {
      myalert({
        type: "error",
        title: "Incomplete Filters",
        subtitle:
          "Please select the report type, location, and date range before generating the report.",
      });
      return;
    }
    setIsButtonDisabled(true);
    throttledFetchReportData();
  };

  return (
    <div className="p-6 bg-[#FFFBF3] min-h-screen mt-10">
      <div className="flex justify-between items-center mb-8 max-[420px]:flex-col max-[420px]:items-start">
        <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
        <ProfileDropDown
          label={``}
          options={[
            { value: "pdf", label: "Export PDF" },
            { value: "xls", label: "Export XLS" },
            { value: "csv", label: "Export CSV" },
          ]}
          onchange={(value) => handleExportReport(value[0])}
        >
          {reports.length > 0 &&
            (DownloadLoading ? (
              <h1>Downloading.....</h1>
            ) : (
              <button className="flex justify-center items-center gap-3 h-12 rounded-lg p-5 border border-gray-light">
                Download
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 14C20.7348 14 20.4804 14.1054 20.2929 14.2929C20.1054 14.4804 20 14.7348 20 15V19C20 19.2652 19.8946 19.5196 19.7071 19.7071C19.5196 19.8946 19.2652 20 19 20H5C4.73478 20 4.48043 19.8946 4.29289 19.7071C4.10536 19.5196 4 19.2652 4 19V15C4 14.7348 3.89464 14.4804 3.70711 14.2929C3.51957 14.1054 3.26522 14 3 14C2.73478 14 2.48043 14.1054 2.29289 14.2929C2.10536 14.4804 2 14.7348 2 15V19C2 19.7956 2.31607 20.5587 2.87868 21.1213C3.44129 21.6839 4.20435 22 5 22H19C19.7956 22 20.5587 21.6839 21.1213 21.1213C21.6839 20.5587 22 19.7956 22 19V15C22 14.7348 21.8946 14.4804 21.7071 14.2929C21.5196 14.1054 21.2652 14 21 14ZM11.29 15.71C11.3851 15.801 11.4972 15.8724 11.62 15.92C11.7397 15.9729 11.8691 16.0002 12 16.0002C12.1309 16.0002 12.2603 15.9729 12.38 15.92C12.5028 15.8724 12.6149 15.801 12.71 15.71L16.71 11.71C16.8983 11.5217 17.0041 11.2663 17.0041 11C17.0041 10.7337 16.8983 10.4783 16.71 10.29C16.5217 10.1017 16.2663 9.99591 16 9.99591C15.7337 9.99591 15.4783 10.1017 15.29 10.29L13 12.59V3C13 2.73478 12.8946 2.48043 12.7071 2.29289C12.5196 2.10536 12.2652 2 12 2C11.7348 2 11.4804 2.10536 11.29289 2.29289C11.1054 2.48043 11 2.73478 11 3V12.59L8.71 10.29C8.61676 10.1968 8.50607 10.1228 8.38425 10.0723C8.26243 10.0219 8.13186 9.99591 8 9.99591C7.86814 9.99591 7.73757 10.0219 7.61575 10.0723C7.49393 10.1228 7.38324 10.1968 7.29 10.29C7.19676 10.3832 7.1228 10.4939 7.07234 10.6158C7.02188 10.7376 6.99591 10.8681 6.99591 11C6.99591 11.1319 7.02188 11.2624 7.07234 11.3842C7.1228 11.5061 7.19676 11.6168 7.29 11.71Z"
                    fill="black"
                  />
                </svg>
              </button>
            ))}
        </ProfileDropDown>
      </div>
      <div className="flex justify-between max-[1200px]:grid max-[1200px]:gap-4 items-center mb-8 max-[630px]:w-[100%]">
        <div className="flex gap-4 max-[1000px]:grid max-[1200px]:grid-cols-2 max-[630px]:grid-cols-1 ">
          <div className="w-72 max-[630px]:w-full">
            <DropDown
              label=""
              options={reportTypes}
              placeholder={filters.reportType || "Report type"}
              onchange={(value) => handleFilterChange("reportType", value[0])}
            />
          </div>
          <div className="relative inline-block mt-1">
            <div className=" flex  justify-end items-center">
              <input
                type="text"
                className="relative border-[2px] border-[#DCDCDD] outline-none rounded-md h-[50px] p-3 text-md cursor-pointer w-72 bg-transparent"
                readOnly
                value={
                  dates.pickupDate && dates.dropoffDate
                    ? dates.pickupDate.getFullYear() ===
                      dates.dropoffDate.getFullYear()
                      ? `${formatDate(dates.pickupDate, false)} - ${formatDate(
                          dates.dropoffDate,
                          false
                        )}  ${dates.pickupDate.getFullYear()}`
                      : `${formatDate(dates.pickupDate)} - ${formatDate(
                          dates.dropoffDate
                        )}`
                    : "Period"
                }
                onClick={() => setOpenDatePicker(true)}
              />
              {dates.dropoffDate ? (
                <></>
              ) : (
                <svg
                  width="16"
                  className="absolute right-2"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M2.97007 5.49158C3.1107 5.35113 3.30132 5.27224 3.50007 5.27224C3.69882 5.27224 3.88945 5.35113 4.03007 5.49158L8.00007 9.46158L11.9701 5.49158C12.0387 5.41789 12.1215 5.35879 12.2135 5.3178C12.3055 5.2768 12.4048 5.25476 12.5056 5.25299C12.6063 5.25121 12.7063 5.26973 12.7997 5.30745C12.8931 5.34518 12.9779 5.40132 13.0491 5.47254C13.1203 5.54376 13.1765 5.62859 13.2142 5.72198C13.2519 5.81537 13.2704 5.9154 13.2687 6.0161C13.2669 6.1168 13.2448 6.21612 13.2039 6.30811C13.1629 6.40011 13.1038 6.48291 13.0301 6.55158L8.53007 11.0516C8.38945 11.192 8.19882 11.2709 8.00007 11.2709C7.80132 11.2709 7.6107 11.192 7.47007 11.0516L2.97007 6.55158C2.82962 6.41095 2.75073 6.22033 2.75073 6.02158C2.75073 5.82283 2.82962 5.6322 2.97007 5.49158Z"
                    fill="black"
                  />
                </svg>
              )}
            </div>
            {openDatePicker && (
              <DatePicker
                showMonths={2}
                showTime={false}
                onDateChange={handleDateChange}
                onClose={() => setOpenDatePicker(false)}
                currentDateTime={dates}
              />
            )}
          </div>

          <div className="w-72 max-[630px]:w-full">
            <DropDown
              label=""
              options={locations.map((loc) => ({
                value: loc.locationId,
                label: loc.locationName,
              }))}
              placeholder="Select Location"
              onchange={(value) => handleFilterChange("locationId", value[0])}
            />
          </div>
        </div>
        <Button
          onClick={handleCreateReport}
          type={isButtonDisabled || loadingreports ? "disabled" : "filled"}
          width="w-36"
        >
          Create Report
        </Button>
      </div>
      {loadingreports ? (
        <div className="flex flex-col items-center justify-center mt-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black"></div>
          <p className="mt-4 text-lg text-gray-700">Fetching Reports...</p>
        </div>
      ) : showNoRecordsMessage ? (
        <div className="flex justify-center items-center mt-36 text-gray-medium text-2xl font-semibold">
          <p>No records found on the selected dates</p>
        </div>
      ) : loadlocation ? (
        <div className="flex flex-col items-center justify-center mt-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black"></div>
          <p className="mt-4 text-lg text-gray-700">Fetching Locations...</p>
        </div>
      ) : (
        reports.length > 0 && (
          <DataTable
            columns={columns}
            data={reports}
            enableSelect={false}
            enableActionColumn={false}
          />
        )
      )}
    </div>
  );
}
