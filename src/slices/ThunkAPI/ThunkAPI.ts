import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import api from "./api";
import { Booking, BookingStatus, EditBookingPayload } from "../../types/BookingTypes";
import { ExportReportPayload, ReportData, ReportFilters } from "../../types/ReportTypes";
import { AppNotification } from "../NotificationSlice";

export interface UserDocumentsParams {
  userId: string;
}

export interface FetchUsersParams {
  status?: "ALL" | "VERIFIED" | "UNVERIFIED";
  page?: number;
  limit?: number;
}

interface ReservationData {
  carId: string;
  clientId: string;
  pickupDateTime: string;
  dropOffDateTime: string;
  pickupLocationId: string;
  dropOffLocationId: string;
}

interface FetchClientReviewsPayload {
  carId: string;
  page?: number;
  size?: number;
  sort?: string;
  direction?: string;
}

export interface BookingDetailsPayload {
  bookingId: string;
}

interface cancelDataType {
  bookingId: string;
  userId: string;
}

interface FetchBookingsArgs {
  UserId: string;
}

interface noti {
  NotiId: string;
}

export interface FeedbackPayload {
  bookingId: string;
  carId: string;
  clientId: string;
  feedbackText: string;
  rating: string;
}

// ... (Other interfaces like SingleDocument, DocumentStatus, UserWithDocuments, FetchUsersResponse, BookingApiItem remain the same) ...

export interface SingleDocument {
  documentUrl: string | null;
  status: string;
  fileName: string | null;
  fileSize: string | null;
}

export interface DocumentStatus {
  AadhaarCard: string;
  DrivingLicense: string;
}

export interface UserWithDocuments {
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  documents: DocumentStatus;
}

// type BookingApiItem = {
//   bookingId: string;
//   bookingStatus: string;
//   carId: string;
//   carImageUrl: string;
//   carModel: string;
//   orderDetails: string;
// };

export interface UserDocumentsResponse {
  success: boolean;
  message: string;
  data: {
    AadhaarCard: SingleDocument;
    DrivingLicense: SingleDocument;
  };
}

export interface FetchUsersResponse {
  success: boolean;
  message: string;
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  count: number;
  data: UserWithDocuments[];
}

const statusMap: Record<string, BookingStatus> = {
  BOOKED: 'booked',
  RESERVED: 'reserved',
  SERVICESTARTED: 'serviceStarted',
  SERVICEPROVIDED: 'serviceProvided',
  SERVICEFINISHED: 'serviceFinished',
  CANCELED: 'canceled',
};

// --- AUTHENTICATED THUNKS (Bearer Token removed) ---

export const confirmReservation = createAsyncThunk(
  "booking/confirmReservation",
  async (data: ReservationData, { rejectWithValue }) => {
    try {
      const response = await api.post("/bookings/", data, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log(response)
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ success: boolean; error: { message: string; code: string } }>;

      if (err.response?.data) {
        return rejectWithValue(err.response.data.error);
      }

      return rejectWithValue({ message: err.message || "Unknown error", code: "CLIENT_ERROR" });
    }
  }
);

export const fetchBookings = createAsyncThunk<Booking[], FetchBookingsArgs>(
  "booking/fetchBookings",
  // ⚠️ REMOVED TOKEN DESTRUCTURING
  async ({ UserId }, { rejectWithValue }) => { 
    try {
      // ⚠️ REMOVED TOKEN HEADER
      const res = await api.get<{ content: any[] }>(
        `/bookings/${UserId}`, {
          headers: {
            'Content-Type': 'application/json',
          }
      });

      if (res.status === 204) {
        return []; // no bookings
      }
      
      // ... (Mapping logic remains the same) ...
      return res.data.content.map((item) => {
        const normalizedStatus = statusMap[item.bookingStatus];
        const dateMatch = item.orderDetails.match(/\((.*?)\)/)?.[1];
        const fallbackSplit = item.orderDetails.split(" ");

        return {
          id: item.bookingId,
          carImage: item.carImageUrl,
          carId: item.carId,
          carName: item.carModel,
          orderId: fallbackSplit[0],
          date: dateMatch || fallbackSplit[1] || "",
          status: normalizedStatus,
        };
      });
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;

      return rejectWithValue(err.response?.data.error || 500);
    }
  }
);

// --- UNAUTHENTICATED/COMMON THUNKS (Use 'api' instance, no header change) ---

export const getLocations = createAsyncThunk("locations/getLocations", async (_, thunkAPI) => {
  try {
    const response = await api.get("/home/locations");
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data || "Failed to fetch locations");
  }
});

export const getCarDetailsById = createAsyncThunk(
  "car/getCarDetailsById",
  async (carId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/cars/${carId}`);
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(err.response?.data || "Something went wrong");
    }
  }
);

export interface RegistrationData {
  firstName: string;
  email: string;
  password: string;
  lastName: string;
}

export const registerUser = createAsyncThunk('auth/sign-up',
  async (data: RegistrationData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/sign-up', data);
      return response.data.message;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      return rejectWithValue(err.response?.data?.error || 'Registration failed');
    }
  }
);

interface LoginData {
  email: string;
  password: string;
}

export const loginUser = createAsyncThunk("auth/sign-in", async (data: LoginData, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/sign-in", data);
    return response.data.body;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "Unknown Error");
  }
});

export const logoutUser = createAsyncThunk<void, void>(
  "auth/logout-user",
  async (_, ) => {
    try {
      // 💡 CALLING API TO CLEAR SERVER-SIDE COOKIES
      await api.post('/auth/logout'); 
      return;
    } catch (error) {
      // Still return success to clear frontend state, even if API call fails (e.g., token already gone)
      return; 
    }
  }
);

// --- AUTHENTICATED THUNKS (Bearer Token removed) ---

interface ChangePasswordData {
  id: string;
  currentPassword: string;
  newPassword: string;
  // token: string; <--- REMOVED
}

export const changePassword = createAsyncThunk("auth/change-passsword", async (data: ChangePasswordData, { rejectWithValue }) => {
  try {
    const { id, currentPassword, newPassword } = data; // ⚠️ REMOVED TOKEN DESTRUCTURING
    const response = await api.put(
      `/users/${id}/change-password`,
      { currentPassword, newPassword },
      {
        headers: {
          'Content-Type': 'application/json',
          // ⚠️ REMOVED: 'Authorization': `Bearer ${data.token}`, 
        }
      }
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ error: string }>;
    return rejectWithValue(err.response?.data?.error || "Unknown Error");
  }
});

interface PersonalInfoGetData {
  id: string;
  // token: string; <--- REMOVED
}

export const personalInfoGet = createAsyncThunk("auth/personal-info", async (data: PersonalInfoGetData, { rejectWithValue }) => {
  try {
    const response = await api.get(
      `/user/personal-info/${data.id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          // ⚠️ REMOVED: 'Authorization': `Bearer ${data.token}`, 
        },
      }
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ error: string }>;
    return rejectWithValue(err.response?.data?.error || "Unknown Error");
  }
});

export interface PersonalInfoPutData {
  id: string;
  // token: string; <--- REMOVED
  firstName: string;
  lastName: string;
  phoneNumber: string;
  country: string;
  city: string;
  street: string;
  postalCode: string;
  imageFile?: File | null;
}

export const personalInfoPut = createAsyncThunk(
  "auth/personal-info-put",
  async (data: PersonalInfoPutData, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      if (data.firstName) formData.append("firstName", data.firstName);
      if (data.lastName) formData.append("lastName", data.lastName);
      if (data.phoneNumber) formData.append("phoneNumber", data.phoneNumber);
      if (data.country) formData.append("country", data.country);
      if (data.city) formData.append("city", data.city);
      if (data.street) formData.append("street", data.street);
      if (data.postalCode) formData.append("postalCode", data.postalCode);
      if (data.imageFile) {
        formData.append("imageUrl", data.imageFile);
      }

      console.log(formData)

      const response = await api.put(
        `/user/personal-info/${data.id}`,
        formData,
        {
          headers: {
            // Must keep Content-Type for FormData, but remove Authorization
            // ⚠️ REMOVED: Authorization: `Bearer ${data.token}`, 
          },
        }
      );

      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      return rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
  }
);

// --- UNAUTHENTICATED THUNKS (No change in logic, use 'api') ---

export const fetchBookedDates = createAsyncThunk<
  string[],
  string,
  { rejectValue: string }
>(
  "car/fetchBookedDates",
  async (carId, { rejectWithValue }) => {
    try {
      const response = await api.get<{ content: string[] }>(`/cars/${carId}/booked-days`);
      return response.data.content;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to fetch booked dates");
    }
  }
);

// --- AUTHENTICATED THUNKS (Bearer Token removed) ---

export const postFeedback = createAsyncThunk(
  "feedback/postFeedback",
  async (feedbackData: FeedbackPayload, { rejectWithValue }) => {
    try {
      const response = await api.post(`/feedbacks`, feedbackData, {
        headers: {
          'Content-Type': 'application/json',
          // ⚠️ REMOVED: 'Authorization': `Bearer ${feedbackData.token}`
        }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to submit feedback"
      );
    }
  }
);

export const fetchReportData = createAsyncThunk<ReportData[], ReportFilters, { rejectValue: string }>(
  "reports/fetchReportData",
  async (filters, { rejectWithValue }) => {
    try {
      const { ...queryParams } = filters; // ⚠️ TOKEN DESTROYED
      const response = await api.get<{ content: ReportData[] }>(`/reports`, {
        params: queryParams,
        headers: {
          "Content-Type": "application/json",
          // ⚠️ REMOVED: 'Authorization': `Bearer ${filters.token}`
        },
      });
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch reports");
    }
  }
);

export const exportReport = createAsyncThunk<string, ExportReportPayload, { rejectValue: string }>(
  "reports/exportReport",
  async ({ filters, extension }, { rejectWithValue }) => {
    try {
      const { ...queryParams } = filters; // ⚠️ TOKEN DESTROYED
      const response = await api.post<{ url: string }>(`/reports/${extension}`, queryParams, {
        headers: {
          "Content-Type": "application/json",
          // ⚠️ REMOVED: 'Authorization': `Bearer ${filters.token}`
        },
      });
      return response.data.url;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to export report");
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'bookings/cancelBooking',
  async (cancelData: cancelDataType, { rejectWithValue }) => {
    try {
      const { bookingId, userId } = cancelData; // ⚠️ REMOVED TOKEN DESTRUCTURING
      const response = await api.put(
        `/bookings/cancel/${bookingId}`,
        { userId },
        {
          headers: {
            'Content-Type': 'application/json',
            // ⚠️ REMOVED: 'Authorization': `Bearer ${cancelData.token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.log(error)
      return rejectWithValue(
        error.response.data.message || 'Failed to cancel booking'
      );
    }
  }
);

export const getBookingDetails = createAsyncThunk(
  'bookings/getBookingDetails',
  async ({ bookingId }: BookingDetailsPayload, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/bookings/details/${bookingId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch booking details'
      );
    }
  }
);

export const editBooking = createAsyncThunk(
  'booking/editBooking',
  async ({ bookingId, userId, updatedData }: EditBookingPayload, { rejectWithValue }) => { // ⚠️ REMOVED TOKEN DESTRUCTURING
    try {
      const response = await api.put(
        `/bookings/edit/${bookingId}`,
        {
          userId,
          ...updatedData
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      console.log(response.data)
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update booking' });
    }
  }
);

export const fetchClientReviews = createAsyncThunk(
  'feedback/fetchClientReviews',
  async (
    { carId, page = 0, size = 10, sort = 'DATE', direction = 'DESC' }: FetchClientReviewsPayload,
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(
        `/cars/${carId}/client-review`,
        {
          params: { page, size, sort, direction },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch client reviews'
      );
    }
  }
);

// Upload document
export const uploadDocumentThunk = createAsyncThunk(
  "documents/upload",
  async ({
    userId,
    docType,
    file,
  }: { userId: string; docType: string; file: File }) => { // ⚠️ REMOVED TOKEN FROM TYPE
    const formData = new FormData();
    formData.append("document", file);

    const response = await api.put(
      `/user/document/upload/${userId}/${docType}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          // ⚠️ REMOVED: Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
);

// Get user documents
export const getDocumentsThunk = createAsyncThunk(
  "documents/get",
  async ({
    userId,
  }: { userId: string }) => { // ⚠️ REMOVED TOKEN FROM TYPE
    const response = await api.get(`/user/document/${userId}`, {
      headers: {
        // ⚠️ REMOVED: Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
);

export const fetchNotifications = createAsyncThunk<
  AppNotification[],
  // ⚠️ CHANGED ARGUMENT TYPE TO VOID/UNDEFINED
  void, 
  { rejectValue: string }
>("notifications/fetchNotifications", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get<{ success: boolean; notifications: AppNotification[] }>(`/notifications/`, {
      headers: {
        'Content-Type': 'application/json',
        // ⚠️ REMOVED: Authorization: `Bearer ${token}`,
      },
    });
    return res.data.notifications;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.error || "Failed to fetch notifications"
    );
  }
});

export const ReadNotifications = createAsyncThunk<
  AppNotification,
  noti,
  { rejectValue: string }
>("notifications/readNotification", async (data, { rejectWithValue }) => { // ⚠️ REMOVED TOKEN DESTRUCTURING
  try {
    const res = await api.patch<{ success: boolean; notification: AppNotification }>(`/notifications/${data.NotiId}/read`, {}, {
      headers: {
        'Content-Type': 'application/json',
        // ⚠️ REMOVED: Authorization: `Bearer ${data.token}`,
      },
    });
    return res.data.notification;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.error || "Failed to fetch notifications"
    );
  }
});

export const fetchUsersWithDocuments = createAsyncThunk<
  any,
  FetchUsersParams,
  { rejectValue: string }
>(
  "admin/fetchUsersWithDocuments",
  async ({ status = "ALL", page = 1, limit = 10 }, { rejectWithValue }) => { // ⚠️ REMOVED TOKEN DESTRUCTURING
    try {
      const response = await api.get<any>(
        `/support/documents`,
        {
          params: { status, page, limit },
          headers: {
            "Content-Type": "application/json",
            // ⚠️ REMOVED: Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Error fetching users with documents:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);


export const fetchUserDocumentsById = createAsyncThunk<
  any,
  UserDocumentsParams,
  { rejectValue: string }
>(
  "admin/fetchUserDocumentsById",
  async ({ userId }, { rejectWithValue }) => { // ⚠️ REMOVED TOKEN DESTRUCTURING
    try {
      const response = await api.get<any>(
        `/support/documents/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            // ⚠️ REMOVED: Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching user documents:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user documents"
      );
    }
  }
);

export const fetchSupportBookings = createAsyncThunk(
  "support_bookings/fetchAll",
  async (
    {
      status,
      page,
      limit,
    }: { status?: string; page?: number; limit?: number }, // ⚠️ REMOVED TOKEN FROM TYPE
    { rejectWithValue }
  ) => {
    try {
      const params: any = { page, limit };
      if (status && status !== "ALL") params.status = status;

      const response = await api.get(`/support/get-bookings`, {
        headers: { 
          "Content-Type": "application/json", 
        },
        params,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch bookings");
    }
  }
);

export const fetchSupportBookingById = createAsyncThunk(
  "support_bookings/fetchById",
  async ({ id }: { id: string }, { rejectWithValue }) => { // ⚠️ REMOVED TOKEN FROM TYPE
    try {
      const response = await api.get(`/support/get-booking/${id}`, {
        headers: { 
          "Content-Type": "application/json",
          // ⚠️ REMOVED: Authorization: `Bearer ${token}`
        },
      });
      return response.data.booking;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch booking details");
    }
  }
);