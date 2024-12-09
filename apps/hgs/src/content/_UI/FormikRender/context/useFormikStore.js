import create from 'zustand';

const useFormikStore = create((set) => ({
	submitForm: () => {},
	dataHasChanged: false,
	isValid: true,
	setFormSubmitHandler: submitHandler => set(() => ({submitForm: submitHandler})),
	setDataHasChanged: value => set(() => ({dataHasChanged: value})),
	setIsValid: value => set(() => ({isValid: value}))
}));

export default useFormikStore;