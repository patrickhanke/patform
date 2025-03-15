import React, { useEffect, useState } from "react";
import { ErrorMessage } from "@types";
import { generateGraphQLQuery, useDataHandler } from "@repo/provider";
import { useQuery } from "@apollo/client";
import { EditHolidayTemplateProps } from "./types";
import EditHoliday from "./content/EditHoliday";
import { IconButton, Modal } from "@repo/ui";

const EditHolidayTemplate: React.FC<EditHolidayTemplateProps> = ({
  template,
  refetch,
  holidays,
}) => {
  const [loading, setLoading] = useState(false);
  const { deleteData } = useDataHandler();
  const [deleteTemplate, setDeleteTemplate] = useState(false);
  const [editTemplate, setEditTemplate] = useState(false);
  const [errors, setErrors] = useState<ErrorMessage[]>([]);

  const { data, loading: recordsLoading } = useQuery(
    generateGraphQLQuery({
      type: "find",
      objectName: "Record",
      fields: ["objectId"],
    }),
    {
      variables: {
        params: { holiday_template: { _eq: template.objectId } },
      },
    },
  );

  useEffect(() => {
    const errorArray: ErrorMessage[] = [];
    if (data && data?.objects.findRecord.results.length > 0) {
      errorArray.push({
        id: "in_use",
        key: "in_use",
        message:
          "Die Vorlage wird noch verwendet und kann nicht gelöscht werden.",
      });
    }
    setErrors(errorArray);
  }, [data]);

  return (
    <>
      <div className="button_container">
        <IconButton icon="delete" onClick={() => setDeleteTemplate(true)} />
        <IconButton icon="edit" onClick={() => setEditTemplate(true)} />
      </div>
      <EditHoliday
        template={template}
        editTemplate={editTemplate}
        setEditTemplate={setEditTemplate}
        refetch={refetch}
        holidays={holidays}
      />
      <Modal
        isOpen={deleteTemplate}
        cancelButtonHandler={() => setDeleteTemplate(false)}
        buttonDisabled={[
          loading || recordsLoading,
          loading || errors.length > 0 || recordsLoading,
        ]}
        confirmButtonHandler={async () => {
          setLoading(true);
          await deleteData({
            className: "Template",
            objectId: template.objectId,
          });
          await refetch();
          setLoading(false);
          setDeleteTemplate(false);
        }}
        errors={[]}
        header="Vorlage löschen"
      >
        <div className="surcharge_container">
          <p>
            Sind Sie sicher, dass sie Die Vorlage {template.name} löschen
            möchten. Dieser Vorgang kann nicht rückgängig gemacht werden.
          </p>
        </div>
      </Modal>
    </>
  );
};

export default EditHolidayTemplate;
