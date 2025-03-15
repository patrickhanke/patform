import { AxiosRequestConfig, AxiosResponse } from "axios";
import axiosapi from "./axios";
import { useFeedbackStore } from "@/_UI/surfaces/Feedback";

const updateData = async ({
  className,
  objectId,
  query,
  updateObject,
  afterSaveHandler,
  feedback,
}: {
  className: string;
  objectId: string;
  query?: string;
  updateObject: object;
  afterSaveHandler?: (objectId: string) => void;
  feedback?: string;
}) => {
  let data: Array<any> = [];
  const { setFeedback } = useFeedbackStore();

  await axiosapi()
    .put(
      `classes/${className}/${objectId}`,
      query || (updateObject as AxiosRequestConfig<any>)
    )
    .then((response: AxiosResponse<any, any>) => {
      data = response.data.results;
      if (feedback) {
        setFeedback.setState((state) =>
          state.setFeedback(feedback, "success", new Date())
        );
      }
      if (afterSaveHandler) {
        afterSaveHandler(response.data.objectId);
      }
    })
    .catch((error) => {
      console.log(error.message);
      if (feedback) {
        setFeedback((state) =>
          state.setFeedback("Fehler", "error", new Date())
        );
      }
    });

  return data;
};

export default updateData;
