import React from 'react'
import Image from '@/Components/image';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { fDate, fTime } from '@/utils/formatTime';

export default function IncidentProjectDetails ({ incident }) {
	const { form_number, injured, location, severity, day_loss, incident_date, indicator } = incident;

	return (
		<Box>
			<Box sx={{ mb: 2, px: 3 }}>
				<Image disabledEffect alt="logo" src="/logo/Fiafi-logo.png" sx={{ maxWidth: 160, margin: { xs: '0px auto 8px auto', md: 0 } }} />
			</Box>
			<Box sx={{ mb: 3 }}>
				<Typography variant="h5" textAlign="center">HSE Incident Report</Typography>
			</Box>
			<Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 3, md: 0 }} justifyContent="space-between" sx={{ mb: 5 }}>
				<Stack alignItems="center" flex={1}>
					<Box>
						<Typography variant="body2" fontWeight={700}>CMS Number:</Typography>
					</Box>
					<Box>
						<Typography variant="body1" sx={{ textTransform: 'uppercase' }}>{form_number}</Typography>
					</Box>
				</Stack>

				<Stack alignItems="center" flex={1}>
					<Box>
						<Typography variant="body2" fontWeight={700} textAlign="center">Revision:</Typography>
					</Box>
					<Box>
						<Typography variant="body1" >{0}</Typography>
					</Box>
				</Stack>

				<Stack alignItems="center" flex={1}>
					<Box>
						<Typography variant="body2" fontWeight={700}>Rollout Date:</Typography>
					</Box>
					<Box>
						<Typography variant="body1" ></Typography>
					</Box>
				</Stack>
			</Stack>

			<Grid container spacing={{ xs: 2, md: 5 }} sx={{ mb: 4 }}>
				<Grid item xs={12} sm={6}>
					<Box sx={{ mb: 1 }}>
						<Box>
							<Typography sx={{ mb: 1, fontWeight: 700 }} variant="body2">Injured</Typography>
						</Box>
						<Box>
							<Typography variant="body1" sx={{ color: 'text.secondary' }}>{injured.fullname}</Typography>
						</Box>
					</Box>

					<Box sx={{ mb: 1 }}>
						<Box>
							<Typography sx={{ mb: 1, fontWeight: 700 }} variant="body2">Location</Typography>
						</Box>
						<Box>
							<Typography variant="body1" sx={{ color: 'text.secondary' }}>{location}</Typography>
						</Box>
					</Box>

					<Box sx={{ mb: 1 }}>
						<Box>
							<Typography sx={{ mb: 1, fontWeight: 700 }} variant="body2">Day Loss</Typography>
						</Box>
						<Box>
							<Typography variant="body1" sx={{ color: 'text.secondary' }}>{day_loss}</Typography>
						</Box>
					</Box>

					<Box sx={{ mb: 1 }}>
						<Box>
							<Typography sx={{ mb: 1, fontWeight: 700 }} variant="body2">Potential Severity</Typography>
						</Box>
						<Box>
							<Typography variant="body1" sx={{ color: 'text.secondary' }}>{severity}</Typography>
						</Box>
					</Box>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Box sx={{ mb: 1, display: "flex", justifyContent: "space-between" }}>
						<Box width={.5}>
							<Box>
								<Typography sx={{ mb: 1, fontWeight: 700 }} variant="body2">Date of Incident</Typography>
							</Box>
							<Box>
								<Typography variant="body1" sx={{ color: 'text.secondary' }}>
									{fDate(incident_date)}
								</Typography>
							</Box>
						</Box>
						<Box width={.5}>
							<Box>
								<Typography sx={{ mb: 1, fontWeight: 700 }} variant="body2">Time of Incident</Typography>
							</Box>
							<Box>
								<Typography variant="body1" sx={{ color: 'text.secondary' }}>
									{fTime(incident_date)}
								</Typography>
							</Box>
						</Box>
					</Box>
					<Box sx={{ mb: 1 }}>
						<Box>
							<Typography sx={{ mb: 1, fontWeight: 700 }} variant="body2">Incident Classification</Typography>
						</Box>
						<Box>
							<Typography variant="body1" sx={{ color: 'text.secondary' }}>
								{incident.incident}
							</Typography>
						</Box>
					</Box>
					<Box sx={{ mb: 1 }}>
						<Box>
							<Typography sx={{ mb: 1, fontWeight: 700 }} variant="body2">Leading Indicator</Typography>
						</Box>
						<Box>
							<Typography variant="body1" sx={{ color: 'text.secondary' }}>
								{indicator}
							</Typography>
						</Box>
					</Box>
				</Grid>
			</Grid>

		</Box>
	)
}
