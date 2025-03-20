"use client";

import React, { useContext, useMemo, useState } from "react";
import useGetRecords from "./hooks/useGetRecords";
import initialFilters from "./constants/initialFilters";
import WeeklyRecords from "./content/WeeklyRecords/WeeklyRecords";
import siteStates from "./constants/site_states";
import RecordsCalendar from "./content/RecordsCalendar";
import RecordsAbsence from "./content/RecordsAbsence";
import RecordsStaffOverview from "./content/RecordsStaffOverview";
import { AppContext } from "@repo/provider";
import { Filter } from "@repo/types";
import RecordsSettings from "./content/RecordsSettings";
import { Page } from "@repo/ui";

const RecordsOverview = () => {
  const { year } = useContext(AppContext);
  const [filters, setFilters] = React.useState(
    initialFilters(year) as Filter[],
  );
  const { records, loading, refetch } = useGetRecords({ filters });
  const [siteState, setSiteState] = useState(
    siteStates[0] as (typeof siteStates)[0],
  );
  const [editAbsence, setEditAbsence] = useState(false);

  const pageHeaderButtons = useMemo(() => {
    if (siteState.value === "absence") {
      return [
        {
          type: "button",
          text: "Neue Abwesenheit",
          onClick: () => {
            setEditAbsence(true);
          },
          color: "primary",
          is_add_button: true,
        },
      ];
    }
  }, [siteState]);

  if (!records) {
    return null;
  }

  return (
    <Page
      title="Zeiterfassung"
      description="Hier finden Sie alle erfassten Arbeitszeiten und Urlaube."
      pageState={siteState}
      pageStates={siteStates}
      setPageState={setSiteState}
      pageHeaderButtons={pageHeaderButtons}
    >
      {siteState.value === "weeks" && (
        <WeeklyRecords
          records={records}
          refetch={refetch}
          loading={loading}
          filters={filters}
          setFilters={setFilters}
        />
      )}
      {siteState.value === "workers" && <RecordsStaffOverview year={year} />}
      {siteState.value === "absence" && (
        <RecordsAbsence
          records={records}
          editAbsence={editAbsence}
          setEditAbsence={setEditAbsence}
        />
      )}
      {siteState.value === "calendar" && <RecordsCalendar records={records} />}
      {siteState.value === "settings" && <RecordsSettings />}
    </Page>
  );
};

export default RecordsOverview;
