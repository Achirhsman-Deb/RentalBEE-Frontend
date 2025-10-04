import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
  } from 'react';
  import ReactDOM from 'react-dom';
  import AlertBox from './AlertBox';
  
  type AlertType = 'success' | 'error' | 'warning';
  
  interface AlertProps {
    id?: number;
    type?: AlertType;
    title: string;
    subtitle?: string;
    onClose?: () => void;
    buttons?: React.ReactNode;
  }
  
  type ShowAlertFn = (props: Omit<AlertProps, 'id'>) => void;
  
  const AlertContext = createContext<ShowAlertFn>(() => {});
  export const useAlert = () => useContext(AlertContext);
  
  let idCounter = 0;
  
  interface AlertProviderProps {
    children: ReactNode;
  }
  
  export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
    const [alerts, setAlerts] = useState<AlertProps[]>([]);
  
    const showAlert = useCallback<ShowAlertFn>((props) => {
      const id = ++idCounter;
      const newAlert: AlertProps = { ...props, id };
  
      setAlerts((prev) => [...prev, newAlert]);
  
      setTimeout(() => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
      }, 2000);
    }, []);
  
    const closeAlert = (id?: number) => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    };
  
    return (
      <AlertContext.Provider value={showAlert}>
        {children}
        {ReactDOM.createPortal(
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[90] flex flex-col gap-2">
            {alerts.map((alert) => (
              <AlertBox
                key={alert.id}
                {...alert}
                onClose={() => {
                  alert.onClose?.();
                  closeAlert(alert.id);
                }}
              />
            ))}
          </div>,
          document.body
        )}
      </AlertContext.Provider>
    );
  };
  