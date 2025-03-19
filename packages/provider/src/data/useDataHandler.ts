"use client";

import { useCallback, useMemo, useState } from "react";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import axiosclient from "./axios";
import { useDataContext } from "./DataContext";
import compileAxiosError from "./compileAxiosError";

const useDataHandler = () => {
  const setFeedback = (a: string, b: string, c: Date) => console.log(a, b, c);
  const [loading, setLoading] = useState(false);
  const { feedbackHandler } = useDataContext();

  const updateData = useCallback(
    async ({
      className,
      objectId,
      updateObject,
      afterSaveHandler,
      feedback,
      onError,
    }: {
      className: string;
      objectId: string;
      updateObject: any;
      afterSaveHandler?: (objectId: string) => void;
      feedback?: string;
      onError?: (error: string) => void;
    }) => {
      let data: Array<any> = [];
      setLoading(true);

      await axiosclient()
        .put(
          `classes/${className}/${objectId}`,
          updateObject as AxiosRequestConfig<any>
        )
        .then((response: AxiosResponse<any, any>) => {
          data = response.data.results;
          if (feedback) {
            feedbackHandler({
              success: true,
              message: feedback,
              type: "success",
            });
          }
          if (afterSaveHandler) {
            afterSaveHandler(response.data.objectId);
          }
        })
        .catch((error) => {
          if (feedback) {
            feedbackHandler(compileAxiosError(error));
          }
          if (onError) {
            onError(error.message);
          }
        });
      setLoading(false);

      return data;
    },
    []
  );

  const deleteData = useCallback(
    async ({
      className,
      objectId,
      afterSaveHandler,
      feedback,
    }: {
      className: string;
      objectId: string;
      afterSaveHandler?: (objectId: string) => void;
      feedback?: string;
    }) => {
      setLoading(true);
      if (feedback) {
        setFeedback("lädt", "loading", new Date());
      }
      await axiosclient()
        .delete(`classes/${className}/${objectId}`)
        .then((response: AxiosResponse<any, any>) => {
          if (feedback) {
            feedbackHandler({
              success: true,
              message: feedback,
              type: "success",
            });
          }
          if (afterSaveHandler) {
            afterSaveHandler(response.data.objectId);
          }
        })
        .catch((error) => {
          feedbackHandler(compileAxiosError(error));
        });
      setLoading(false);
      setFeedback("", "", new Date());
    },
    []
  );

  const createData = useCallback(
    async ({
      className,
      query,
      updateObject,
      afterSaveHandler,
      feedback,
    }: {
      className: string;
      query?: string;
      updateObject?: any;
      afterSaveHandler?: (objectId: string) => void;
      feedback?: string;
    }) => {
      const data: Array<any> = [];
      setLoading(true);
      await axiosclient()
        .post(
          `classes/${className}`,
          query || (updateObject as AxiosRequestConfig<any>)
        )
        .then((response: AxiosResponse<any, any>) => {
          if (feedback) {
            feedbackHandler({
              success: true,
              message: feedback,
              type: "success",
            });
          }
          if (afterSaveHandler) {
            afterSaveHandler(response.data.objectId);
          }
        })
        .catch((error) => {
          feedbackHandler(compileAxiosError(error));
        });
      setLoading(false);
      return data;
    },
    []
  );

  const getData = useCallback(
    async ({ className, query }: { className: string; query?: string }) => {
      let data: Array<any> = [];
      setLoading(true);
      if (query) {
        await axiosclient()
          .get(`classes/${className}?where={${query}}`)
          .then((response: AxiosResponse<any, any>) => {
            data = response.data.results;
          })
          .catch((error) => {
            console.error(`Error: ${error.message}`);
          });
      }
      if (!query) {
        await axiosclient()
          .get(`classes/${className}`)
          .then((response: AxiosResponse<any, any>) => {
            data = response.data.results;
          })
          .catch((error) => {
            feedbackHandler(compileAxiosError(error));
          });
      }
      setLoading(false);
      return data;
    },
    []
  );

  const returnFunctions = useMemo(() => {
    return {
      loading,
      updateData,
      createData,
      deleteData,
      getData,
    };
  }, []);

  return returnFunctions;
};

export default useDataHandler;
