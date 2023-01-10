


export const formatCms = (table) => {
	return table?.project_code ? `${table?.project_code}-${table?.originator}-${table?.discipline}-${table?.document_type}-${table?.document_zone ? table?.document_zone + "-" : ""}${table?.document_level ? table?.document_level + "-" : ""}${table?.sequence_no}` : "N/A"
}