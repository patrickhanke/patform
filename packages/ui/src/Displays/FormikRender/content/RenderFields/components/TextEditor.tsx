import React from 'react';
import { Editor } from '@repo/ui';

interface TextEditorProps {
  name: string;
  label?: string;
  id?: string;
  onChange: (value: string) => void;
  values: { [key: string]: any };
  handleBlur: (value: string) => void;
  placeholder?: string;
  isHorizontal?: boolean;
  setSecondaryContent?: React.Dispatch<React.SetStateAction<React.ReactNode | null>>;
}

const TextEditor: React.FC<TextEditorProps> = ({
	name,
	label,
	id,
	onChange,
	values,
	setSecondaryContent,
	placeholder,
	isHorizontal
}) => {
	return (
		<div className={isHorizontal ? 'form_horizontal_container' : ''}>
			<label htmlFor={name}>{label || name} </label>
			{!setSecondaryContent ? 
				<Editor
					id={id}
					content={values[name] || ''}
					onChange={onChange}
					placeholder={placeholder}
				/>
				:
				<div>
					{ values[name] ? 
						<div className='text_editor_preview_text' dangerouslySetInnerHTML={{__html: values[name]}} />
						: 
						<p>
							Kein Text
						</p>
					}
					<button
						className='full_button sm primary'
						onClick={() => setSecondaryContent(
							<Editor
								id={id}
								content={values[name] || ''}
								onChange={onChange}
								placeholder={placeholder}
							/>
						)}
					>
						Editor öffnen
					</button>
				</div>
			}
		</div>
	);
};

export default TextEditor;
