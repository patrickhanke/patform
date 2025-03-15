import React from "react";

const styleObject = `@media print {

	/* Styling Page */
	@page {
		background-color: blue;
		/* Setting Page Size to Letter. Find different page sizes at https://pagedjs.org/documentation/5-web-design-for-print/#page-size-property */
		size: A4;
	
		/* Setting Page Margin of 10 mm */
		margin: 10mm;
	
		/* Leaving padding of 107mm from top. This is to adjust for header.  */
		padding-top: 12.0mm;
	
		/* Leaving padding of 15mm from top. This is to adjust for footer.  */
		padding-bottom: 14.85mm;
	
	
		/* Setting repeating header. For more details visit https://pagedjs.org/documentation/7-generated-content-in-margin-boxes/#styling-running-elements */
		@top-center {
			content: element(titleRunning);
			height: 160.3mm;
			padding-top: 10mm;
			padding-bottom: 50mm;
		};
	
		/* Setting repeating footer. For more details visit https://pagedjs.org/documentation/7-generated-content-in-margin-boxes/#styling-running-elements */
		@bottom-center {
			content: element(footerRunning);
		}
	}
	
	.title {
			position: running(titleRunning);
			
	
		}
	
	.flex-row {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
		}
	.divider {
			width: 100%;
			height: 1px;
			background-color: #efefef;
		}
		
		.pdf_content {
			background-color: blue;
		
		}
	}`;

const Header = () => {
  // console.log(btoa(logo));

  return (
    <html>
      <head>
        <style>{styleObject}</style>
      </head>

      <body>
        <section className="title">
          <div className="flex-row">
            <div></div>
            <p>Patflow</p>
          </div>

          <div className="divider" />
        </section>
        <div className="flex-row">
          <div></div>
          <p>Patflow</p>
        </div>
        <div style={{}} />
      </body>
    </html>
  );
};

export default Header;
