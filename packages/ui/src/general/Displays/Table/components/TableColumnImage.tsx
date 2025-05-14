"use client";

import { getImageUrl } from "@repo/provider";
import { TableColumnImageProps } from "../types";
import "../styles.scss";
import Image from "next/image";

const TableColumnImage = ({ url }: TableColumnImageProps) => {
	return (
		<>
			<div className="horizontal_container">
				<div>
					{url ? (
						<div className="table_columns_image_container">
							<Image
								alt={url}
								src={getImageUrl({
									filePath: url,
									height: 128
								})}
								style={{ objectFit: "contain" }}
								height={36}
								width={64}
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
