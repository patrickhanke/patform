"use client";

import { TableColumnImageProps } from "../types";
import "../styles.scss";
import Image from "next/image";
import { getImageUrl } from "@repo/provider";

const TableColumnImage = ({ file }: TableColumnImageProps) => {
	return (
		<>
			<div className="horizontal_container">
				<div>
					{file ? (
						<div className="table_columns_image_container">
							<Image
								alt={file.name}
								src={getImageUrl({
									fileName: file.name,
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
