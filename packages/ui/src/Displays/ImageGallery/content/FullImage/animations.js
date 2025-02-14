export const fullImageVariant = {
	initial: {
		opacity: 1,
        
		top: '-50%',
		transition: {
			ease: 'easeOut'
		}
	},
	animate:{
		opacity: 1,

		top: 'calc(50% - 25px)',
		transition: {
			ease: 'easeOut'
		}
	},
	exit: {
		opacity: 1,
		top: '-50%',
		transition: {
			ease: 'easeOut'
		}
	}
};