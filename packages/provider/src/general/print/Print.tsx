import React from "react";

const Print = ({children}, ref) => {
	return (
		<div css={printContainer}>
			<div ref={ref} css={printContent} className="print-container">
				<style type="text/css" media="print">
					{
						"\
					@page {\ size:  landscape;\ }\
				"
					}
				</style>
				{children}
			</div>
		</div>
	);
};

export default Print;
