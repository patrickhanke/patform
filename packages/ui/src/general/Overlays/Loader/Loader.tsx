"use client";

import "./styles.scss";

const Loader = ({ width, height }: { width: string; height: string }) => {
	return (
		<div
			className="loader_container"
			style={{ width: width || "auto", height: height || "auto" }}
		></div>
	);
};

export default Loader;
