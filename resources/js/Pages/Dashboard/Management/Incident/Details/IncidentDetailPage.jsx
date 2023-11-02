import React from 'react';
import IncidentProjectDetails from '@/sections/@dashboard/incident/detail/IncidentProjectDetails';
import Card from '@mui/material/Card';
import IncidentDetailBody from '@/sections/@dashboard/incident/detail/IncidentDetailBody';

export default function IncidentDetailPage ({ incident }) {

	return (
		<Card sx={{ pt: { xs: 3, md: 5 }, px: { xs: 3, md: 8 } }}>
			<IncidentProjectDetails incident={incident} />
			<IncidentDetailBody incident={incident} />
		</Card>
	)
}
