const variants = {
	initial: { 
		right: -300
	},
	animate: { 
		right: 120 ,
		transition: { duration: .3, ease: 'easeOut' }
	},
	exit: { 
		x: 1200, 
		transition: { duration: .6, ease: 'easeOut' }
	}
};

export default variants;