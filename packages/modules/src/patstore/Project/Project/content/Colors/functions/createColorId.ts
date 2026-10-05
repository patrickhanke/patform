const ALPHABET = "abcdefghijklmnopqrstuvwxyz";
const ID_LENGTH = 8;

const generateCode = () =>
	Array.from(
		{ length: ID_LENGTH },
		() => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
	).join("");

const createColorId = (usedIds: string[]): string => {
	let id = generateCode();
	while (usedIds.includes(id)) {
		id = generateCode();
	}
	return id;
};

export default createColorId;
