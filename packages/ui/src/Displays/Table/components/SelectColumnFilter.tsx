import React, { useMemo } from "react";
import PropTypes from "prop-types";
import Select from "@clientComponents/form/Select";

const SelectColumnFilter = ({
  column: { filterValue, setFilter, preFilteredRows, id },
}) => {
  const all = [{ value: "", label: "Alle" }];
  const options = useMemo(() => {
    const optionsSet = new Set();

    preFilteredRows.forEach((row) => {
      optionsSet.add(row.values[id]);
    });
    return [...optionsSet.values()];
  }, [id, preFilteredRows]);

  return (
    <Select
      value={{ value: filterValue, label: filterValue || "Alle" }}
      onChange={(e) => {
        if (e) {
          return setFilter(e.value || undefined);
        }
        return setFilter("");
      }}
      options={all.concat(
        options.map((option) => ({ value: option, label: option })),
      )}
      width="200px"
    />
  );
};

SelectColumnFilter.propTypes = {
  column: PropTypes.object.isRequired,
};

export default SelectColumnFilter;
