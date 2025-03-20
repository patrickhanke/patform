import { FC, useMemo } from "react";
import { Select } from "@repo/ui";
import { FIND_ALL_PROPERTY } from "@repo/provider";
import { useQuery } from "@apollo/client";
import { SiteHeaderContentComponent } from "../types";
import styles from "../Tickets.module.scss";
import { filterChangeHandler, getDateString } from "@repo/provider";
import { Property, Ticket } from "@repo/types";
import { TextInput } from "@repo/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SiteHeaderContent: FC<SiteHeaderContentComponent> = ({
  id,
  filters,
  setFilters,
  initialFilters,
  tickets,
}) => {
  const { data: objectData } = useQuery(FIND_ALL_PROPERTY, {
    skip: !!id,
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectOptions = useMemo(() => {
    const dateOptions = [] as { value: string; label: string }[];
    let objectOptions = [] as { value: string; label: string }[];

    if (objectData) {
      objectOptions = objectData.objects.findProperty.results.map(
        (property: Property) => ({
          value: property.objectId,
          label: property.name,
        })
      );
    }

    if (tickets && dateOptions.length === 0) {
      tickets.forEach((ticket: Ticket) => {
        if (
          !dateOptions.find(
            (option) => option.label === getDateString(ticket.createdAt).date
          )
        )
          dateOptions.push({
            value: ticket.createdAt,
            label: getDateString(ticket.createdAt).date,
          });
      });
    }
    return { dateOptions, objectOptions };
  }, [tickets]);

  return (
    <div className={styles.siteheader_content}>
      <div className="button_container">
        <TextInput
          label=""
          id="objectId"
          defaultValue={
            (filters.find((filterElement) => filterElement.key === "objectId")
              ?.value as string) || ""
          }
          onChange={(value) =>
            setFilters(filterChangeHandler("objectId", value, "_eq", filters))
          }
          placeholder="Ticket ID..."
          width="120px"
        />
        {!id && objectData && (
          <Select
            label=""
            width="150px"
            options={selectOptions.objectOptions}
            value={
              filters.find((filterElement) => filterElement.key === "property")
                ?.value || null
            }
            onChange={(value) =>
              setFilters(
                filterChangeHandler("property", value.value, "_eq", filters)
              )
            }
            placeholder="Objekt..."
            isClearable
          />
        )}
        <Select
          label=""
          options={selectOptions.dateOptions}
          value={
            filters.find((filterElement) => filterElement.key === "createdAt")
              ?.value || null
          }
          onChange={(value) =>
            setFilters(
              filterChangeHandler("createdAt", value.value, "_gte", filters)
            )
          }
          placeholder="Von..."
          isClearable
        />
        <Select
          label=""
          options={selectOptions.dateOptions}
          value={
            filters.find((filterElement) => filterElement.key === "createdAt")
              ?.value || null
          }
          onChange={(value) =>
            setFilters(
              filterChangeHandler("createdAt", value.value, "_lte", filters)
            )
          }
          placeholder="Bis..."
          isClearable
        />
      </div>
      <button
        className="full_button md secondary"
        onClick={() => {
          if (searchParams.get("ticket")) {
            router.push(pathname);
          }
          setFilters(initialFilters());
        }}
      >
        Filter zurücksetzen
      </button>
    </div>
  );
};

export default SiteHeaderContent;
