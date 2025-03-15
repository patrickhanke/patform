import axios from "axios";

const uploadFile = async ({
  file,
  filename,
}: {
  file: File;
  filename: string;
}) => {
  const data: { name: string; url: string } = await axios
    .post(
      `https://pg-app-ks588wtqbcwvgvbc096gr40cedytjy.scalabl.cloud/1/files/${filename}` as string,
      file,
      {
        headers: {
          "X-Parse-Application-Id": process.env.SASHIDO_APP_ID,
          "X-Parse-REST-API-Key": process.env.SASHIDO_REST_KEY,
          "Content-Type": file.type,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT",
          "Access-Control-Allow-Headers":
            "Origin, X-Requested-With, Content-Type, Accept, Authorization",
          "Access-Control-Allow-Credentials": true,
        },
      }
    )
    .then((response) => {
      return response.data;
    });

  return data;
};

export default uploadFile;
