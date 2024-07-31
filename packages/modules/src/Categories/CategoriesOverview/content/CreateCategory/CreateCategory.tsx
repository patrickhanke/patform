import { useCallback, useContext, useMemo, useState, useEffect } from 'react';
import { Field, SlideIn } from '@repo/ui';
import { AppContext, useDataHandler } from '@repo/provider';
import { Form } from '@repo/ui';

const CreateCategory = ({ refetch, typeValue }: { refetch: () => void, typeValue: string }) => {
  const { createData } = useDataHandler();
  const { currentModule } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState({} as { [key: string]: any });

  const [disabled, setDisabled] = useState([false, false]);

  const categoryFields = useMemo(() => {
    const constantFields: Field[] = [
      {
        id: 'name',
        position: 1,
        name: 'name',
        type: 'input',
        label: 'Name',
        validation: 'string_required',
      },
      {
        id: 'description',
        position: 2,
        name: 'description',
        type: 'textarea',
        label: 'Description',
      },
    ];
    return constantFields;
  }, []);

  const handleSubmit = useCallback(async () => {
    await createData({
      className: 'Category',
      updateObject: {
        ...data,
        type: typeValue,
        module: {__type: 'Pointer', className: 'Module', objectId: currentModule.objectId},
      },
    });
    refetch();
    setIsOpen(false);
  }, [data, createData, refetch, typeValue]);

  return (
    <div>
        <button  onClick={() => setIsOpen(true)}>Kategorie erstellen</button>
        <SlideIn 
            header='Kategorie erstellen'
            isOpen={isOpen}
            cancel={() => setIsOpen(false)}
            confirm={handleSubmit}
        >
            <Form
                fields={categoryFields}
                data={data}
                formSubmitHandler={values => setData(values)}
            />
        </SlideIn>
    </div>
  );
};

export default CreateCategory;