"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Response } from "@repo/types";
import Feedback from "./components/Feedback";
import DataContext, { DataContextProps } from "./DataContext";

export const DataContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [feedback, setFeedback] = useState<Response | null>(null);
  const [loading, setLoading] = useState(false);

  const feedbackHandler = useCallback((response: Response) => {
    setFeedback(response);
    setTimeout(() => {
      setFeedback(null);
    }, 3000);
  }, []);

  const loadingHandler = useCallback(
    (loadingValue: boolean) => {
      if (loadingValue !== loading) {
        setLoading(loadingValue);
      }
      if (loadingValue) {
        setTimeout(() => {
          if (loading === true) {
            setLoading(false);
          }
        }, 10000);
      }
    },
    [loading]
  );

  const appContextObject: DataContextProps = useMemo(
    () => ({
      feedbackHandler,
      loadingHandler,
    }),
    [feedbackHandler, loadingHandler]
  );

  return (
    <DataContext.Provider value={appContextObject}>
      <Feedback feedback={feedback} />
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  return React.useContext(DataContext) as DataContextProps;
};
