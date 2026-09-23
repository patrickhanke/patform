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
									alt={file.name}
									src={getImageUrl({
										fileName: file.name,
										width: 128,
										height: 72
									})}
									width={128}
									height={72}
									style={{
										width: "100%",
										height: "auto",
										objectFit: "contain"
									}}
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
