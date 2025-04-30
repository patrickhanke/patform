"use client";

import { getImageUrl } from "@repo/provider";
import { TableColumnImageProps } from "../types";
import "../styles.scss";

const TableColumnImage = ({ url }: TableColumnImageProps) => {
	return (
		<>
			<div className="horizontal_container">
				<div>
					{url ? (
						<div className="table_columns_image_container">
							<img
								src={getImageUrl({ filePath: url, height: 30 })}
							/>
						</div>
					) : (
						<div>Kein Bild</div>
					)}
				</div>
			</div>
		</>
	);
};

export default TableColumnImage;
