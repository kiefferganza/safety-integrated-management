import React from 'react';
import { Divider, List, ListItem, ListItemText, Stack } from '@mui/material';

export default function IncidentDetailBody ({ incident }) {
	const { body_part, detail, equipment, mechanism, mechanism_other, media, nature, nature_other, remarks, root_cause, root_cause_other, supervisor } = incident;
	return (
		<Stack>
			<List>
				<Divider />
				<ListItem sx={{ py: 0 }} divider>
					<Stack direction={{ xs: 'column', md: 'row' }} divider={<Divider sx={{ borderWidth: 1 }} />} justifyContent="space-between" width={1}>
						<Stack sx={{ py: 2, flex: 1 }}>
							<ListItemText
								primary="Root cause of incident"
								secondary={root_cause || root_cause_other || "N/A"}
							/>
						</Stack>
						<Stack sx={{ p: 2, flex: 1 }}>
							<ListItemText
								primary="Equipment Involved"
								secondary={equipment || "N/A"}
							/>
						</Stack>
					</Stack>
				</ListItem>
				<ListItem sx={{ py: 0 }} divider>
					<Stack direction={{ xs: 'column', md: 'row' }} divider={<Divider sx={{ borderWidth: 1 }} />} justifyContent="space-between" width={1}>
						<Stack sx={{ py: 2, flex: 1 }}>
							<ListItemText
								primary="Mechanism of incident"
								secondary={mechanism || mechanism_other || "N/A"}
							/>
						</Stack>
						<Stack sx={{ p: 2, flex: 1 }}>
							<ListItemText
								primary="Nature of injury"
								secondary={nature || nature_other || "N/A"}
							/>
						</Stack>
					</Stack>
				</ListItem>
				<ListItem sx={{ py: 0 }} divider>
					<Stack direction={{ xs: 'column', md: 'row' }} divider={<Divider sx={{ borderWidth: 1 }} />} justifyContent="space-between" width={1}>
						<Stack sx={{ py: 2, flex: 1 }}>
							<ListItemText
								primary="Part of body affected"
								secondary={body_part || "N/A"}
							/>
						</Stack>
						<Stack sx={{ p: 2, flex: 1 }}>
							<ListItemText
								primary="Workday"
								secondary={detail?.workday || "N/A"}
							/>
						</Stack>
					</Stack>
				</ListItem>
				{detail?.witnesses && (
					<ListItem sx={{ mt: 2 }}>
						<ListItemText
							primary="Unsafe workplace conditions"
							secondary={detail.witnesses}
						/>
					</ListItem>
				)}
				<ListItem sx={{ mt: 2 }}>
					<ListItemText
						primary="Unsafe workplace conditions"
						secondary={detail?.unsafe_workplace || detail?.unsafe_workplace_other || "N/A"}
					/>
				</ListItem>
				{detail?.unsafe_workplace_reason && (
					<ListItem>
						<ListItemText
							primary=""
							secondary={detail.unsafe_workplace_reason}
						/>
					</ListItem>
				)}
				<Divider />
				<ListItem>
					<ListItemText
						primary="Unsafe acts by people"
						secondary={detail?.unsafe_act || detail?.unsafe_act_other || "N/A"}
					/>
				</ListItem>
				{detail?.unsafe_act_reason && (
					<ListItem>
						<ListItemText
							primary=""
							secondary={detail.unsafe_act_reason}
						/>
					</ListItem>
				)}
				<Divider />
				{detail?.similar_incident && (
					<ListItem>
						<ListItemText
							primary="Similar Incident"
							secondary={detail?.similar_incident}
						/>
					</ListItem>
				)}
				<Divider />
				<ListItem>
					<ListItemText
						primary="Remark"
						secondary={remarks || "N/A"}
					/>
				</ListItem>
			</List>
		</Stack>
	)
}
