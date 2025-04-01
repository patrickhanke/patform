import React, { FC, useEffect, useState } from "react"
import { useCallback } from "react"
import { ApolloClient, InMemoryCache, gql } from "@apollo/client"
import { DataTranferProps } from "./types"

const DataTransfer: FC<DataTranferProps> = ({
	query,
	url,
	appId,
	masterKey,
}) => {
	const [data, setData] = useState(null)
	const client = new ApolloClient({
		uri: url,
		headers: {
			"X-Parse-Application-Id": appId,
			"X-Parse-Master-Key": masterKey,
		},
		cache: new InMemoryCache(),
	})

	const fetchQuery = useCallback(async () => {
		try {
			const response = await client.query({
				query: gql`
					${query}
				`,
			})
			setData(response.data)
		} catch (error) {
			console.error("Error fetching data:", error)
		}
	}, [query, url, appId, masterKey])

	useEffect(() => {
		fetchQuery()
	}, [])

	console.log(data)

	return (
		<div>
			<button>Preview</button>
			<button>Transport</button>
		</div>
	)
}

export default DataTransfer
