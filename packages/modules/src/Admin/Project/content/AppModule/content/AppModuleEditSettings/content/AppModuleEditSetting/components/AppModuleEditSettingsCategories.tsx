import { ModuleSettings } from "@repo/types";
import { AppModuleEditSettingsCategoriesProps } from "../types";
import { CreateButton } from "@repo/ui";
import { useCallback } from "react";
import { v4 } from "uuid";
import { slugify } from "@repo/provider";

const AppModuleEditSettingsCategories = ({
  categories,
  setSettings,
}: AppModuleEditSettingsCategoriesProps) => {
  const changeHandler = useCallback(
    (value: ModuleSettings["categories"][number]) => {
      setSettings((draft: ModuleSettings) => {
        // console.log(draft)
        // console.log(categoryIndex);

        // if (categoryIndex !== -1) {
        //     const draftCopy = {...draft}
        //     set(draftCopy, `categories.${[categoryIndex]}`, value)
        //     draft = draftCopy
        // }
        const categoryIndex = draft.categories.findIndex(
          (category) => category.id === value.id
        );
        draft.categories[categoryIndex] = value;
      });
    },
    [setSettings]
  );

  console.log(categories);

  return (
    <div>
      {categories.map((category: ModuleSettings["categories"][number]) => {
        return (
          <div key={category.id}>
            <h3>{category.label}</h3>
            <div>
              <label>Label</label>
              <input
                type="text"
                defaultValue={category.label}
                onChange={(e) =>
                  changeHandler({
                    ...category,
                    label: e.target.value,
                    value: slugify(e.target.value),
                  })
                }
              />
            </div>
          </div>
        );
      })}
      <div>
        <CreateButton
          text="Kategorie hinzufügen"
          size="medium"
          onClick={() => {
            setSettings((draft: ModuleSettings) => {
              draft;
              draft.categories.push({
                label: "",
                value: v4() as string,
                position: draft.categories.length + 1,
                id: v4() as string,
              });
            });
          }}
        />
      </div>
    </div>
  );
};

export default AppModuleEditSettingsCategories;
