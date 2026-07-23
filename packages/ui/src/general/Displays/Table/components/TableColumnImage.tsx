"use client";

import { TableColumnImageProps } from "../types";
import "../styles.scss";
import Image from "next/image";
import { getImageUrl } from "@repo/provider";
import { IconButton } from "@repo/ui";

const TableColumnImage = ({ file }: TableColumnImageProps) => {
	return (
		<>
			<div className="horizontal_container">
				<div>
					{file ? (
						<div className="horizontal_container">
							<div className="table_columns_image_container">
								<Image
									fill
									alt={file.name}
									src={getImageUrl({
										fileName: file.name,
										height: 128
									})}
									sizes="54px"
									style={{ objectFit: "contain" }}
								/>
							</div>
							<IconButton
								icon={"view"}
								onClick={() => {
									window.open(file.url, "_blank");
								}}
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
