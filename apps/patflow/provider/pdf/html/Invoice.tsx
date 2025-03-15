import { UserTypes } from "@types";
import Header from "./Header";
import { useEffect } from "react";
import Head from "next/head";
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

const Invoice = (data: UserTypes.Order) => {
  console.log(data);

  const contentArray = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <html lang="de">
      <head>
        <meta charSet="utf-8" />
        <title>{data.objectId || "app"}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="/styles.css" rel="stylesheet" />
        <Head>
          <script
            key="1234"
            src="https://unpkg.com/pagedjs@0.2.0/dist/paged.polyfill.js"
          ></script>
          <script
            key="3434"
            src="https://bytescout-com.s3.us-west-2.amazonaws.com/files/cloudapi-templates/paged.polyfill-020.js"
          ></script>
        </Head>

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

        {/* {getBody(data.body, data.compdata || {})} */}
        {/* {data.scripts ? generateScriptTags(data.scripts) : null} */}

        <section id="main">
          {contentArray.map((element) => (
            <div key={element}>
              <div>
                <h3>hello</h3>
              </div>
              <div>
                <h1>{data.objectId}</h1>
              </div>
              <div></div>
              <div>
                <p>Noch mehr Content</p>
              </div>
            </div>
          ))}
        </section>
      </body>
    </html>
  );
};

export default Invoice;
