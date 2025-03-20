import { CreateButton, IconButton, SlideIn } from "@repo/ui";
import { TableColumnDatesFieldProps } from "./types";
import { useCallback, useState } from "react";
import { EventDate } from "@repo/types";
import { useImmer } from "use-immer";
import TableColumnEditDate from "./components/TableColumnEditDate";
import TableColumnDate from "./components/TableColumnDate";
import { v4 } from "uuid";
import initialDateValues from "./constants/initialDateValues";

const TableColumnDatesField = ({
  initialDates,
  onChange,
}: TableColumnDatesFieldProps) => {
  const [loading, setLoading] = useState(false);
  const [editDates, setEditDates] = useState(false);
  const [dates, setDates] = useImmer<EventDate[]>(initialDates || []);
  const [activeDate, setActiveDate] = useState<EventDate["id"] | null>(null);

  const slideInConfirmHandler = useCallback(async () => {
    setLoading(true);
    await onChange(dates);

    setEditDates(false);
    setLoading(false);
  }, [dates]);

  const findActiveDate = useCallback(
    (id: string | null) => {
      return dates.find((field) => field.id === id);
    },
    [dates],
  );

  return (
    <>
      <div className="button_container">
        <button className="edit_text">
          {dates.length} {dates.length === 1 ? "Termin" : "Termine"}
        </button>
        <IconButton icon="edit" onClick={() => setEditDates(!editDates)} />
      </div>
      <SlideIn
        cancel={() => setEditDates(false)}
        confirm={() => slideInConfirmHandler()}
        isOpen={editDates}
        header="Felder bearbeiten"
        showSecondaryContent={!!activeDate}
        secondaryContent={
          <TableColumnEditDate
            date={findActiveDate(activeDate)}
            setDates={setDates}
          />
        }
        disabled={[loading, loading]}
      >
        <CreateButton
          text="Termin hinzufügen"
          size="small"
          onClick={() => {
            setDates((draft) => {
              draft.push({
                ...initialDateValues,
                id: v4() as string,
              });
            });
          }}
        />
        <div className="table_columns_dates_list">
          {dates.map((date) => (
            <TableColumnDate
              key={date.id}
              date={date}
              setActiveDate={setActiveDate}
            />
          ))}
        </div>
      </SlideIn>
    </>
  );
};

export default TableColumnDatesField;
