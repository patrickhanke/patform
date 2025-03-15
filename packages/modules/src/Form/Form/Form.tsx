"use client";

import { useGetForm } from "./hooks/useGetForm";
import siteStates from "./constants/siteStates";
import { Page, PageHeaderButton } from "@repo/ui";
import { useMemo, useState } from "react";
import { ProjectLoader } from "@repo/provider";
import FormData from "./content/FormData";
import FormSettings from "./content/FormSettings";
import FormFields from "./content/FormFields";
import { Params } from "@repo/types";

const Form = ({ params }: { params: Params }) => {
  const formId = params.form_id;
  const { form, refetch } = useGetForm({ formId });
  const [siteState, setSiteState] = useState<(typeof siteStates)[number]>(
    siteStates[0] as { value: string; label: string }
  );
  const [createField, setCreateField] = useState(false);

  const pageHeaderButtons: PageHeaderButton[] = useMemo(() => {
    if (siteState.value === "fields") {
      return [
        {
          text: "Feld hinzufügen",
          onClick: () => setCreateField(true),
          is_add_button: true,
          disabled: form.settings.static_form === true,
        },
      ];
    }
    return [];
  }, [siteState, form]);

  if (!form) {
    return <ProjectLoader loading={!form} />;
  }

  return (
    <Page
      title={form ? form?.name : "Lädt ..."}
      emptyContent={true}
      refetch={refetch}
      pageStates={siteStates}
      pageState={siteState}
      setPageState={setSiteState}
      pageHeaderButtons={pageHeaderButtons}
    >
      {!form ? (
        <p>Formular nicht gefunden</p>
      ) : (
        <>
          {siteState.value === "data" && <FormData formId={formId} />}
          {siteState.value === "settings" && <FormSettings formId={formId} />}
          {siteState.value === "fields" && (
            <FormFields
              formId={formId}
              createField={createField}
              setCreateField={setCreateField}
            />
          )}
        </>
      )}
    </Page>
  );
};

export default Form;
