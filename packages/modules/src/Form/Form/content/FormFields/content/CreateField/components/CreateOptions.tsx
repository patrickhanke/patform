import React, { FC, useEffect } from "react";
import { CreateButton, TextInput } from "@repo/ui";
import { DnDDisplay } from "@repo/ui";
import { slugify } from "@repo/provider";
import { CreateOptionsProps, OptionNameProps } from "../types";
import { v4 } from "uuid";
import { useDebounceValue } from "usehooks-ts";

const OptionName: FC<OptionNameProps> = ({ option, onChange }) => {
  const [label, setLabel] = useDebounceValue(option.label, 1000);
  const [text, setText] = useDebounceValue(option.text, 1000);

  useEffect(() => {
    if (label && label !== option.label) {
      onChange("label", label);
    }
    if (text && text !== option.text) {
      onChange("text", text);
    }
  }, [label, text]);

  return (
    <div className="flex col j-st gap-xs">
      <div className="flex row a-ce j-st gap-sm">
        <label style={{ width: "30px" }}>Name:</label>
        <TextInput
          id="label"
          onChange={(value) => setLabel(value)}
          defaultValue={option.label}
        />
      </div>
      <div className="flex row a-ce j-st gap-sm">
        <label style={{ width: "30px" }}>Text:</label>
        <TextInput
          id="text"
          onChange={(value) => setText(value)}
          defaultValue={option.text}
        />
      </div>
    </div>
  );
};

const CreateOptions: FC<CreateOptionsProps> = ({ options, setOptions }) => {
  return (
    <div>
      <DnDDisplay
        ItemComponent={({ item }) => (
          <OptionName
            option={item}
            onChange={(key, value) => {
              const optionsCopy = [...options];
              const index = optionsCopy.findIndex(
                (option) => option.id === item.id
              );
              if (key === "label" && index !== -1 && optionsCopy[index]) {
                optionsCopy[index].label = value;
                optionsCopy[index].value = slugify(value);
                setOptions(optionsCopy);
              }
              if (key === "text" && index !== -1 && optionsCopy[index]) {
                optionsCopy[index].text = value;
                setOptions(optionsCopy);
              }
            }}
          />
        )}
        items={options}
        onChange={(items) => setOptions(items)}
      />

      <CreateButton
        size="small"
        text="Empfänger hinzufügen"
        onClick={() => {
          const optionsCopy = [...options];
          optionsCopy.push({
            value: "",
            label: "",
            text: "",
            id: v4(),
          });
          setOptions(optionsCopy);
        }}
      />
    </div>
  );
};

export default CreateOptions;
