import axios from "axios";
import { createStandaloneToast } from '@chakra-ui/react';
import i18n from 'i18next'; // Import i18n instance

// Create standalone toast (works outside React components)
const { toast } = createStandaloneToast();

const handleTokenExpiry = () => {
  console.warn("Token expired - cleaning up and redirecting to login");
  
  // Show toast message with translations
  toast({
    title: i18n.t("TOAST_SESSION_EXPIRED_TITLE"),
    description: i18n.t("TOAST_SESSION_EXPIRED_DESCRIPTION"),
    status: "warning",
    duration: 3000,
    isClosable: true,
    position: "top",
    variant: "subtle",
  });
  
  // Call context logout if available, otherwise fallback to direct cleanup
  if ((window as any).authLogout) {
    (window as any).authLogout('expired');
  } else {
    // Fallback cleanup
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("safeUserData");
    window.dispatchEvent(new Event("tokenChanged"));
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  }
};

// Create a generic Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_PROVIDER_BASE_URL,
  headers: {
    accept: "application/json",
  },
});

// Add a request interceptor to include the Authorization token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor for comprehensive error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error Details:", {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
      message: error.response?.data?.message || error.message,
      hasResponse: !!error.response
    });
    
    // Priority check for 401 errors - check status from response OR error message
    const status = error.response?.status;
    const isUnauthorized = status === 401 ||
                          error.message?.includes('401') ||
                          error.message?.includes('Unauthorized');

    if (isUnauthorized) {
      console.warn("401 Unauthorized detected - token expired or invalid");
      handleTokenExpiry();
      return Promise.reject(new Error(i18n.t("TOAST_SESSION_EXPIRED_DESCRIPTION")));
    }

    // Handle other response errors
    if (error.response && status) {
      // Handle forbidden access
      if (status === 403) {
        toast({
          title: i18n.t("TOAST_ACCESS_DENIED_TITLE"),
          description: i18n.t("TOAST_ACCESS_DENIED_DESCRIPTION"),
          status: "error",
          duration: 6000,
          isClosable: true,
          position: "top",
        });
        return Promise.reject(new Error(i18n.t("TOAST_ACCESS_DENIED_DESCRIPTION")));
      }

      // Handle other client errors
      if (status >= 400 && status < 500) {
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error_description || 
                           `Error ${status}: ${error.response?.statusText || 'Client Error'}`;
        
        toast({
          title: i18n.t("TOAST_ERROR_TITLE"),
          description: errorMessage,
          status: "error",
          duration: 6000,
          isClosable: true,
          position: "top",
        });
        
        return Promise.reject(new Error(errorMessage));
      }
      
      // Handle server errors
      if (status >= 500) {
        toast({
          title: i18n.t("TOAST_SERVER_ERROR_TITLE"),
          description: i18n.t("TOAST_SERVER_ERROR_DESCRIPTION"),
          status: "error",
          duration: 7000,
          isClosable: true,
          position: "top",
        });
        return Promise.reject(new Error(i18n.t("TOAST_SERVER_ERROR_DESCRIPTION")));
      }
    }
    
    // Handle network errors (only if NOT a 401)
    if ((error.code === 'NETWORK_ERROR' || !error.response) && !isUnauthorized) {
      toast({
        title: i18n.t("TOAST_CONNECTION_ERROR_TITLE"),
        description: i18n.t("TOAST_CONNECTION_ERROR_DESCRIPTION"),
        status: "error",
        duration: 7000,
        isClosable: true,
        position: "top",
      });
      return Promise.reject(new Error(i18n.t("TOAST_CONNECTION_ERROR_DESCRIPTION")));
    }
    
    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
  }
);

export default apiClient;