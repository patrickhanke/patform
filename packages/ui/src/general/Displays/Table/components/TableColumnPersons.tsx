import { PersonOption, TableColumnPersonsProps } from "../types";
import { PersonDisplay } from "@repo/ui";
import { useContext, useMemo } from "react";
import ReactSelect, { components } from "react-select";
import { StylesConfig } from "react-select";
import { AppContext, generateGraphQLQuery } from "@repo/provider";
import { useQuery } from "@apollo/client";
import { PersonClass } from "@repo/types";
import { PersonsInterface } from "@repo/modules";
import { cloneDeep } from "lodash-es";

const TableColumnPersons = ({
  value = [],
  isEditable,
  onChange,
}: TableColumnPersonsProps) => {
  const { modules } = useContext(AppContext);
  const { data: personData } = useQuery(
    generateGraphQLQuery({
      type: "find",
      objectName: "Person",
      fields: ["objectId", "label", "portrait"],
    }),
    {
      variables: {
        params: {
          module: {
            _eq: modules.find((module) => module.path === "/persons")?.objectId,
          },
        },
      },
    },
  );

  console.log(personData);
  console.log(value);

  const customComponent = useMemo(() => {
    return {
      Option: (props: any) => {
        return (
          <components.Option {...props}>
            {props.data.person ? (
              <PersonDisplay person={props.data.person} />
            ) : (
              props.data.label
            )}
          </components.Option>
        );
      },
      SingleValue: (props: any) => {
        return (
          <components.SingleValue {...props}>
            {props.data.person ? (
              <PersonDisplay person={props.data.person} />
            ) : (
              props.data.label
            )}
          </components.SingleValue>
        );
      },
    };
  }, []);

  const options: PersonOption[] = useMemo(() => {
    const personOptions: PersonOption[] = [];
    if (personData) {
      personData.objects.findPerson.results.forEach((person: PersonClass) => {
        personOptions.push({
          value: person.objectId,
          label: person.label,
          person,
        });
      });
    }
    return personOptions;
  }, [personData]);

  return (
    <div>
      {/* {isEditable ? 
				<ReactSelect
					value={value.map(vl => options.find(option => option.value === vl))}
					onChange={(inputValue) => onChange(inputValue as PersonOption[]) }
					options={options}
					isMulti={true}
					// isDisabled={isDisabled}
					// isClearable={isClearable}
					className={'react_select_container'}
					classNamePrefix="react-select"
					styles={customStyles({width: 180})}
					menuPosition="fixed"
					menuPlacement="auto"	
					components={customComponent}
				/>
				:
				<div>
					{options.length > 0 && value.map(vl => <PersonDisplay key={vl} person={options.find(option => option.value === vl)} />)}
				</div>
			} */}
      <PersonsInterface persons={value} onChange={onChange} />
    </div>
  );
};

const customStyles = ({ width }: { width: string | number }): StylesConfig => ({
  control: (provided: Record<string, unknown>, state: any) => ({
    ...provided,
    minHeight: 0,
    // border: state.isFocused ? '1px solid #3F9A82' : '1px solid #99999',
    outline: "none",
    boxShadow: "none",
    border: "none",
    // "&": {
    //   border: "1px solid #cccccc",
    //   boxShadow: "none"
    // },
    "&:hover": {
      // border: '1px solid #3F9A82',
      border: "none",
    },
    width,
  }),
  container: (provided) => ({
    ...provided,
    position: "relative",
    minWidth: "120px",
  }),
  clearIndicator: (provided) => ({
    ...provided,
    padding: "4px",
  }),

  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
    fontFamily: "Geist",
    fontWeight: 400,
    fontSize: "12px",
  }),
  singleValue: (provided) => ({
    ...provided,
    fontFamily: "Geist",
    fontWeight: 400,
    fontSize: "12px",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    fontFamily: "Geist",
    fontWeight: 400,
    fontSize: "12px",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: "4px",
  }),
  placeholder: (provided) => ({
    ...provided,
    fontFamily: "Geist",
    color: "#999999",
  }),
  input: (provided) => ({
    ...provided,
    margin: 0,
  }),
});

export default TableColumnPersons;
