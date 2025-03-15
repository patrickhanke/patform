import IconButton from "@clientComponents/buttons/IconButton";
import React, { useMemo } from "react";
import * as XLSX from "xlsx/xlsx.mjs";
import PropTypes from "prop-types";

const DataDownload = ({ data, title }) => {
  const dataToDownload = useMemo(() => {
    const dataToDisplay = [];
    data.forEach((dataElement) => {
      const newDataObject = {};
      const keys = Object.keys(dataElement);
      keys.forEach((key) => {
        if (typeof dataElement[key] === "object") {
          newDataObject[key] = JSON.stringify(dataElement[key], "", null);
        }
        if (typeof dataElement[key] === "string") {
          newDataObject[key] = dataElement[key];
        }
      });

      dataToDisplay.push(newDataObject);
    });
    return dataToDisplay;
  }, [data]);

  const dataDownload = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dataToDownload);

    XLSX.utils.book_append_sheet(wb, ws, "Spieler_innen");
    XLSX.writeFile(
      wb,
      `${title}_${new Date().getDate().toString()}-${new Date().getMonth().toString()}-${new Date().getFullYear().toString()}.xlsx`
    );
  };

  return (
    <IconButton
      text="Daten herunterladen"
      icon="download"
      color="secondary"
      onClick={() => dataDownload()}
    />
  );
};

DataDownload.propTypes = {
  data: PropTypes.array.isRequired,
  title: PropTypes.string,
};

DataDownload.defaultProps = {
  title: "Daten",
};

export default DataDownload;
