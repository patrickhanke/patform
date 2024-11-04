import { PersonDisplay } from '@repo/ui';

const components = {
	Option: (props: any) => {
		const option = props.data;
		return (
			<components.Option {...props}>
				<PersonDisplay person={option} />
			</components.Option>
		);
	},
	SingleValue: (props: any) => {
		const option = props.data;
		return (
			<components.SingleValue {...props}>
				<PersonDisplay person={option}  />
			</components.SingleValue>
		);
	},
	MultiValue: (props: any) => {
		const options = props.data;
		return (
			<components.SingleValue {...props}>
				{options.map((option: any) => <PersonDisplay key={option.value} person={option}  />)}
			</components.SingleValue>
		);
	}
};

export default components;