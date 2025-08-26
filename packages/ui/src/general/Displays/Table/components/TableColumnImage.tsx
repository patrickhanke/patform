"use client";

import { getImageUrlFromBytescale } from "@repo/provider";
import { TableColumnImageProps } from "../types";
import "../styles.scss";
import Image from "next/image";
import { getImageUrl } from "../../../../../../provider/src/general/functions/getImageUrl";

const TableColumnImage = ({ file }: TableColumnImageProps) => {
	if (typeof file === "string") {
		return (
			<>
				<div className="horizontal_container">
					<div>
						{file ? (
							<div className="table_columns_image_container">
								<Image
									alt={file}
									src={getImageUrlFromBytescale({
										filePath: file,
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
	}
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
