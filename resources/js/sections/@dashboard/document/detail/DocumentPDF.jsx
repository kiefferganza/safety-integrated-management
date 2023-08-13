/* eslint-disable jsx-a11y/alt-text */
import PropTypes from 'prop-types';
import { Page, View, Text, Image, Document } from '@react-pdf/renderer';
// utils
import { format } from 'date-fns';
import { fDate } from '@/utils/formatTime';
import { getDocumentReviewStatus } from '@/utils/formatStatuses';
// 
import styles from './DocStyle';
import { useTheme } from '@mui/material';

// ----------------------------------------------------------------------

DocumentPDF.propTypes = {
	tbt: PropTypes.object,
	cms: PropTypes.string,
};


export function DocumentPDF ({ document, cms, latestUploadedFile, positions, rolloutDate }) {
	const theme = useTheme();
	const {
		title: documentTitle,
		originator,
		sequence_no,
		rev,
		date_uploaded,
		project_code,
		discipline,
		document_type,
		document_zone,
		document_level,
		employee,
		comments,
		external_approver,
		approval_employee,
		reviewer_employees,
		external_comments,
		approval_status
	} = document;

	const approvalPos = approval_employee ? positions.find(pos => pos.position_id === approval_employee?.position) : null;
	const approvalStatus = getDocumentReviewStatus(approval_status);
	return (
		<Document title={cms !== "N/A" ? cms : documentTitle}>
			<Page size="A4" style={styles.page}>

				<View style={styles.mb16}>
					<View style={styles.gridContainer}>
						<Image source="/logo/Fiafi-logo.png" style={{ height: 32, padding: 2 }} />
					</View>
					<View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
						<Text style={styles.h3}>Document Review Sheet</Text>
					</View>
					<View style={styles.gridContainer}>
						<View style={[styles.col3, { alignItems: 'center', flexDirection: 'column' }]}>
							<Text style={styles.subtitle2}>CMS Number:</Text>
							<Text style={[styles.body1, { fontWeight: 700 }]}>{cms.toUpperCase()}</Text>
						</View>
						<View style={[styles.col3, { alignItems: 'center', flexDirection: 'column' }]}>
							<Text style={styles.subtitle2}>Revision:</Text>
							<Text style={[styles.body1, { fontWeight: 700 }]}>{rev || 0}</Text>
						</View>
						<View style={[styles.col3, { alignItems: 'center', flexDirection: 'column' }]}>
							<Text style={styles.subtitle2}>Rollout Date:</Text>
							<Text style={[styles.body1, { fontWeight: 700 }]}>{fDate(rolloutDate)}</Text>
						</View>
					</View>
				</View>

				<View style={[styles.gridContainer, { border: "1px solid #000" }]}>
					<View style={styles.col6}>
						<View>
							<View style={{ width: "100%", paddingVertical: 12, backgroundColor: theme.palette.primary.light }}>
								{employee?.profile?.small &&
									<Image src={employee?.profile?.small} style={{ borderRadius: "50%", width: "32px", height: "32px", margin: "auto" }} />
								}
							</View>
							<View style={{ width: "100%", backgroundColor: theme.palette.primary.dark, paddingVertical: 2 }}>
								<Text style={{ textAlign: "center", color: "#fff", fontSize: 9 }}>Submitted By: {employee.fullname}</Text>
								<Text style={{ textAlign: "center", color: "rgba(255,255,255,.8)", fontSize: 8 }}>{employee?.position?.position}</Text>
							</View>
							<View style={[styles.gridContainer, { paddingVertical: 4 }]}>
								<View style={styles.col6}>
									{latestUploadedFile && (
										<View style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "52px", paddingHorizontal: 2 }}>
											<Text style={[styles.textDefault, { color: "blue" }]}>{latestUploadedFile.src}</Text>
										</View>
									)}
								</View>
								<View style={styles.col6}>
									<View style={{ marginBottom: 4, marginTop: 2 }}>
										<Text style={{ fontSize: 7 }}>Phone No.: {employee.phone_no}</Text>
									</View>
									<View style={{ marginBottom: 4 }}>
										<Text style={{ fontSize: 7 }}>Email: {employee.email}</Text>
									</View>
									<View style={{ marginBottom: 4 }}>
										<Text style={{ fontSize: 7 }}>Job Title: {employee?.position?.position}</Text>
									</View>
									<View style={{ marginBottom: 4 }}>
										<Text style={{ fontSize: 7 }}>Department: {employee?.department?.department}</Text>
									</View>
								</View>
							</View>
						</View>
					</View>
					<View style={[styles.col6, styles.bl]}>
						<View style={[styles.gridContainer, styles.bm]}>
							<View style={[styles.br, { width: "30%", paddingVertical: 3 }]}>
								<Text style={{ textAlign: "right", lineHeight: 0, paddingRight: 2, fontSize: 8 }}>Project Code:</Text>
							</View>
							<View style={{ paddingVertical: 3, width: "70%" }}>
								<Text style={{ fontSize: 8, paddingLeft: 4, lineHeight: 0 }}>{project_code}</Text>
							</View>
						</View>

						<View style={[styles.gridContainer, styles.bm]}>
							<View style={[styles.br, { width: "30%", paddingVertical: 3 }]}>
								<Text style={{ textAlign: "right", lineHeight: 0, paddingRight: 2, fontSize: 8 }}>Originator:</Text>
							</View>
							<View style={{ paddingVertical: 3, width: "70%" }}>
								<Text style={{ fontSize: 8, paddingLeft: 4, lineHeight: 0 }}>{originator}</Text>
							</View>
						</View>

						<View style={[styles.gridContainer, styles.bm]}>
							<View style={[styles.br, { width: "30%", paddingVertical: 3 }]}>
								<Text style={{ textAlign: "right", lineHeight: 0, paddingRight: 2, fontSize: 8 }}>Discipline:</Text>
							</View>
							<View style={{ paddingVertical: 3, width: "70%" }}>
								<Text style={{ fontSize: 8, paddingLeft: 4, lineHeight: 0 }}>{discipline}</Text>
							</View>
						</View>

						<View style={[styles.gridContainer, styles.bm]}>
							<View style={[styles.br, { width: "30%", paddingVertical: 3 }]}>
								<Text style={{ textAlign: "right", lineHeight: 0, paddingRight: 2, fontSize: 8 }}>Type:</Text>
							</View>
							<View style={{ paddingVertical: 3, width: "70%" }}>
								<Text style={{ fontSize: 8, paddingLeft: 4, lineHeight: 0 }}>{document_type}</Text>
							</View>
						</View>

						<View style={[styles.gridContainer, styles.bm]}>
							<View style={[styles.br, { width: "30%", paddingVertical: 3 }]}>
								<Text style={{ textAlign: "right", lineHeight: 0, paddingRight: 2, fontSize: 8 }}>Zone:</Text>
							</View>
							<View style={{ paddingVertical: 3, width: "70%" }}>
								<Text style={{ fontSize: 8, paddingLeft: 4, lineHeight: 0 }}>{document_zone || "N/A"}</Text>
							</View>
						</View>

						<View style={[styles.gridContainer, styles.bm]}>
							<View style={[styles.br, { width: "30%", paddingVertical: 3 }]}>
								<Text style={{ textAlign: "right", lineHeight: 0, paddingRight: 2, fontSize: 8 }}>Level:</Text>
							</View>
							<View style={{ paddingVertical: 3, width: "70%" }}>
								<Text style={{ fontSize: 8, paddingLeft: 4, lineHeight: 0 }}>{document_level || "N/A"}</Text>
							</View>
						</View>

						<View style={[styles.gridContainer, styles.bm]}>
							<View style={[styles.br, { width: "30%", paddingVertical: 3 }]}>
								<Text style={{ textAlign: "right", lineHeight: 0, paddingRight: 2, fontSize: 8 }}>Sequence No.:</Text>
							</View>
							<View style={{ paddingVertical: 3, width: "70%" }}>
								<Text style={{ fontSize: 8, paddingLeft: 4, lineHeight: 0 }}>{sequence_no}</Text>
							</View>
						</View>

						<View style={[styles.gridContainer, styles.bm]}>
							<View style={[styles.br, { width: "30%", paddingVertical: 3 }]}>
								<Text style={{ textAlign: "right", lineHeight: 0, paddingRight: 2, fontSize: 8 }}>Rev No.:</Text>
							</View>
							<View style={{ paddingVertical: 3, width: "70%" }}>
								<Text style={{ fontSize: 8, paddingLeft: 4, lineHeight: 0 }}>{rev || 0}</Text>
							</View>
						</View>

						<View style={[styles.gridContainer, styles.bm]}>
							<View style={[styles.br, { width: "30%", paddingVertical: 3 }]}>
								<Text style={{ textAlign: "right", lineHeight: 0, paddingRight: 2, fontSize: 8 }}>Transmittal Date:</Text>
							</View>
							<View style={{ paddingVertical: 3, width: "70%" }}>
								<Text style={{ fontSize: 8, paddingLeft: 4, lineHeight: 0 }}>{fDate(date_uploaded)}</Text>
							</View>
						</View>

						<View style={styles.gridContainer}>
							<View style={[styles.br, { width: "30%", paddingVertical: 3 }]}>
								<Text style={{ textAlign: "right", lineHeight: 0, paddingRight: 2, fontSize: 8 }}>Document Title:</Text>
							</View>
							<View style={{ paddingVertical: 3, width: "70%" }}>
								<Text style={{ fontSize: 8, paddingLeft: 4, lineHeight: 0 }}>{documentTitle}</Text>
							</View>
						</View>
					</View>
				</View>

				<View style={[styles.bm, styles.br, styles.bl, { backgroundColor: styles.primary, color: '#fff' }]}>
					<View style={styles.gridContainer}>
						<View style={styles.col6}>
							<Text style={[styles.textDefault, styles.bold1, { paddingLeft: 4 }]}>Comment Code Legend:</Text>
						</View>
						<View style={[styles.col6, styles.bl]}>
							<Text style={[styles.textDefault, styles.bold1, { paddingLeft: 4 }]}>Originator Reply Code Legend:</Text>
						</View>
					</View>
				</View>
				<View style={[styles.bm, styles.br, styles.bl]}>
					<View style={styles.gridContainer}>
						<View style={styles.col6}>
							<Text style={[styles.textDefault, styles.bold1, { paddingLeft: 4, color: styles.primary }]}>1 = action required on this issue, 2 = advisory comment</Text>
						</View>
						<View style={[styles.col6, styles.bl]}>
							<Text style={[styles.textDefault, styles.bold1, { paddingLeft: 4, color: styles.primary }]}>i = Incorporated, ii = Evaluated and not incorporated for reason stated</Text>
						</View>
					</View >
				</View >

				<View style={[styles.bm, styles.br, styles.bl]}>
					<View style={styles.gridContainer}>
						<View style={styles.col6}>
							<View style={[styles.gridContainer]}>
								<View style={[styles.br, { width: "10%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }]}>
									<Text style={[styles.textDefault, styles.bold2]}>No</Text>
								</View>
								<View style={[styles.br, { width: "10%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }]}>
									<Text style={[styles.textDefault, styles.bold2]}>Initial</Text>
								</View>
								<View style={[styles.br, { width: "15%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }]}>
									<Text style={[styles.textDefault, styles.bold2]}>Page/ Section</Text>
								</View>
								<View style={[styles.br, { width: "15%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }]}>
									<Text style={[styles.textDefault, styles.bold2]}>Comment Code</Text>
								</View>
								<View style={{ width: "50%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }}>
									<Text style={[styles.textDefault, styles.bold2]}>INTERNAL COMMENTS</Text>
								</View>
							</View>
						</View>
						<View style={[styles.col6, styles.bl]}>
							<View style={styles.gridContainer}>
								<View style={[styles.br, { width: "20%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }]}>
									<Text style={[styles.textDefault, styles.bold2]}>Reply Code</Text>
								</View>
								<View style={[styles.br, { width: "60%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }]}>
									<Text style={[styles.textDefault, styles.bold2]}>ORIGINATOR REPLY</Text>
								</View>
								<View style={{ width: "20%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }}>
									<Text style={[styles.textDefault, styles.bold2]}>Reply Status</Text>
								</View>
							</View>
						</View>
					</View>
					{comments.length > 0 ? comments.map((comment, idx) => {
						const currReviewer = reviewer_employees.find(revEmp => revEmp.employee_id === comment.reviewer_id);
						const commentPages = comment.pages.split(",");
						return (
							<View style={[styles.gridContainer, styles.bt]} key={comment.response_id}>
								<View style={styles.col6}>
									<View style={styles.gridContainer}>
										<View style={[styles.br, { width: "10%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }]}>
											<Text style={styles.textDefault}>{idx + 1}</Text>
										</View>
										<View style={[styles.br, { width: "10%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }]}>
											<Text style={[styles.textDefault, { textTransform: "uppercase" }]}>{`${currReviewer?.firstname?.charAt(0)}. ${currReviewer?.lastname?.charAt(0)}.`}</Text>
										</View>
										<View style={[styles.br, { width: "15%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }]}>
											{commentPages.map(p => (
												<Text style={styles.textDefault} key={p}>{p.trim()}</Text>
											))}
										</View>
										<View style={[styles.br, { width: "15%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }]}>
											<Text style={styles.textDefault}>{comment.comment_code}</Text>
										</View>
										<View style={{ width: "50%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }}>
											<Text style={styles.textDefault}>{comment.comment}</Text>
										</View>
									</View>
								</View>
								<View style={[styles.col6, styles.bl]}>
									<View style={[styles.gridContainer, styles.bm]}>
										<View style={[styles.br, { width: "20%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }]}>
											<Text style={styles.textDefault}>{comment.reply_code}</Text>
										</View>
										<View style={[styles.br, { width: "60%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }]}>
											<Text style={styles.textDefault}>{comment.reply}</Text>
										</View>
										<View style={{ width: "20%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }}>
											{comment.comment_status === 0 ? (
												<View style={[styles.badge, { backgroundColor: theme.palette.info.main }]}>
													<Text style={[styles.textDefault, { color: "#fff", textAlign: "center" }]}>Open</Text>
												</View>
											) : (
												<View style={[styles.badge, { backgroundColor: theme.palette.error.main }]}>
													<Text style={[styles.textDefault, { color: "#fff", textAlign: "center" }]}>Closed</Text>
												</View>
											)}
										</View>
									</View>
								</View>
							</View>
						)
					}) : (
						<View style={[styles.gridContainer, styles.bt]}>
							<Text style={[styles.textDefault, styles.bold2, styles.faded, { textAlign: 'center', width: '100%' }]}>No Comments</Text>
						</View>
					)}
				</View>

				{external_comments && external_comments?.length > 0 ? (
					<View style={[styles.bm, styles.br, styles.bl]} >
						<View style={styles.gridContainer}>
							<View style={styles.col6}>
								<View style={styles.gridContainer}>
									<View style={[styles.br, { width: "10%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }]}>
										<Text style={[styles.textDefault, styles.bold2]}>No</Text>
									</View>
									<View style={[styles.br, { width: "10%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }]}>
										<Text style={[styles.textDefault, styles.bold2]}>Initial</Text>
									</View>
									<View style={[styles.br, { width: "15%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }]}>
										<Text style={[styles.textDefault, styles.bold2]}>Page/ Section</Text>
									</View>
									<View style={[styles.br, { width: "15%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }]}>
										<Text style={[styles.textDefault, styles.bold2]}>Comment Code</Text>
									</View>
									<View style={{ width: "50%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }}>
										<Text style={[styles.textDefault, styles.bold2]}>EXTERNAL COMMENTS</Text>
									</View>
								</View>
							</View>
							<View style={[styles.col6, styles.bl]}>
								<View style={styles.gridContainer}>
									<View style={[styles.br, { width: "20%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }]}>
										<Text style={styles.textDefault}>Reply Code</Text>
									</View>
									<View style={[styles.br, { width: "60%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }]}>
										<Text style={styles.textDefault}>ORIGINATOR REPLY</Text>
									</View>
									<View style={{ width: "20%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }}>
										<Text style={styles.textDefault}>Reply Status</Text>
									</View>
								</View>
							</View>
						</View>
						{external_comments.map((comment, idx) => {
							const currReviewer = external_approver.find(app => app.id === comment.approver);
							const commentPages = comment.comment_page_section.split(",");
							return (
								<View style={[styles.gridContainer, styles.bt]} key={comment.id}>
									<View style={styles.col6}>
										<View style={styles.gridContainer}>
											<View style={[styles.br, { width: "10%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }]}>
												<Text style={styles.textDefault}>{idx + 1}</Text>
											</View>
											<View style={[styles.br, { width: "10%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }]}>
												<Text style={[styles.textDefault, { textTransform: "uppercase" }]}>{`${currReviewer?.firstname?.charAt(0)}. ${currReviewer?.lastname?.charAt(0)}.`}</Text>
											</View>
											<View style={[styles.br, { width: "15%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }]}>
												{commentPages.map(p => (
													<Text style={styles.textDefault} key={p}>{p.trim()}</Text>
												))}
											</View>
											<View style={[styles.br, { width: "15%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }]}>
												<Text style={styles.textDefault}>{comment.comment_code}</Text>
											</View>
											<View style={{ width: "50%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }}>
												<Text style={styles.textDefault}>{comment.comment}</Text>
											</View>
										</View>
									</View>
									<View style={[styles.col6, styles.bl]}>
										<View style={[styles.gridContainer, styles.bm]}>
											<View style={[styles.br, { width: "20%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }]}>
												<Text style={styles.textDefault}>{comment.reply_code}</Text>
											</View>
											<View style={[styles.br, { width: "60%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }]}>
												<Text style={styles.textDefault}>{comment.reply}</Text>
											</View>
											<View style={{ width: "20%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }}>
												{comment.status === 0 ? (
													<View style={[styles.badge, { backgroundColor: theme.palette.info.main }]}>
														<Text style={[styles.textDefault, { color: "#fff", textAlign: "center" }]}>Open</Text>
													</View>
												) : (
													<View style={[styles.badge, { backgroundColor: theme.palette.error.main }]}>
														<Text style={[styles.textDefault, { color: "#fff", textAlign: "center" }]}>Closed</Text>
													</View>
												)}
											</View>
										</View>
									</View>
								</View>
							)
						})}
					</View>
				) : (
					<View style={[styles.bm, styles.br, styles.bl]}>
						<View style={styles.gridContainer}>
							<View style={styles.col6}>
								<View style={styles.gridContainer}>
									<View style={[styles.br, { width: "10%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }]}>
										<Text style={[styles.textDefault, styles.bold2]}>No</Text>
									</View>
									<View style={[styles.br, { width: "10%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }]}>
										<Text style={[styles.textDefault, styles.bold2]}>Initial</Text>
									</View>
									<View style={[styles.br, { width: "15%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }]}>
										<Text style={[styles.textDefault, styles.bold2]}>Page/ Section</Text>
									</View>
									<View style={[styles.br, { width: "15%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }]}>
										<Text style={[styles.textDefault, styles.bold2]}>Comment Code</Text>
									</View>
									<View style={{ width: "50%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }}>
										<Text style={[styles.textDefault, styles.bold2]}>EXTERNAL COMMENTS</Text>
									</View>
								</View>
							</View>
							<View style={[styles.col6, styles.bl]}>
								<View style={styles.gridContainer}>
									<View style={[styles.br, { width: "20%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }]}>
										<Text style={[styles.textDefault, styles.bold2]}>Reply Code</Text>
									</View>
									<View style={[styles.br, { width: "60%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }]}>
										<Text style={[styles.textDefault, styles.bold2]}>ORIGINATOR REPLY</Text>
									</View>
									<View style={{ width: "20%", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "24px" }}>
										<Text style={[styles.textDefault, styles.bold2]}>Reply Status</Text>
									</View>
								</View>
							</View>
						</View>
						<View style={[styles.gridContainer, styles.bt]}>
							<Text style={[styles.textDefault, styles.bold2, styles.faded, { textAlign: 'center', width: '100%' }]}>In Progress</Text>
						</View>
					</View>
				)}


				<View style={[styles.bm, styles.br, styles.bl]}>
					<View style={styles.gridContainer}>
						<View style={[styles.br, { width: "17.5%" }]}>
							<Text style={[styles.textDefault, styles.bold2, { paddingLeft: 4 }]}>Document</Text>
							<Text style={[styles.textDefault, styles.bold2, { paddingLeft: 4 }]}>Status Code</Text>
						</View>
						<View style={{ width: "82.5%" }}>
							<View style={styles.gridContainer}>
								<View style={[styles.col3, styles.bm, styles.br]}>
									<Text style={[styles.textDefault, styles.faded, { paddingLeft: 8 }]}>A.  Approved</Text>
								</View>
								<View style={[styles.col3, styles.bm, styles.br]}>
									<Text style={[styles.textDefault, styles.faded, { paddingLeft: 8 }]}>B.  SONO</Text>
								</View>
								<View style={[styles.col3, styles.bm]}>
									<Text style={[styles.textDefault, styles.faded, { paddingLeft: 8 }]}>C.  Fail/Not approved</Text>
								</View>
							</View>
							<View style={styles.gridContainer}>
								<View style={[styles.col3, styles.br]}>
									<Text style={[styles.textDefault, styles.faded, { paddingLeft: 8 }]}>D.  Approved with comments</Text>
								</View>
								<View style={[styles.col3, styles.br]}>
									<Text style={[styles.textDefault, styles.faded, { paddingLeft: 8 }]}>E.  NOWC: No Objection with comments</Text>
								</View>
								<View style={styles.col3}>
									<Text style={[styles.textDefault, styles.faded, { paddingLeft: 8 }]}>F.  Responded / Reviewed / Actioned</Text>
								</View>
							</View>
						</View>
					</View>
				</View>

				<View style={[styles.bm, styles.br, styles.bl]}>
					<View style={styles.gridContainer}>
						<View style={styles.col6}>
							<View style={{ backgroundColor: styles.primary }}>
								<Text style={[styles.textDefault, styles.bold2, { textAlign: "center", color: '#fff' }]}>Internal Reviewer Comments Status</Text>
							</View>
							<View style={[styles.gridContainer, styles.bt, styles.bm]}>
								<View style={[styles.br, { width: "8%", alignItems: "center", justifyContent: "center" }]}>
									<Text style={[styles.textDefault, styles.bold2]}>No</Text>
								</View>
								<View style={[styles.br, { width: "8%", alignItems: "center", justifyContent: "center" }]}>
									<Text style={[styles.textDefault, styles.bold2]}>Initial</Text>
								</View>
								<View style={[styles.br, { width: "20%", alignItems: "center", justifyContent: "center" }]}>
									<Text style={[styles.textDefault, styles.bold2]}>Position</Text>
								</View>
								<View style={[styles.br, { width: "40%", alignItems: "center", justifyContent: "center" }]}>
									<Text style={[styles.textDefault, styles.bold2]}>Remarks</Text>
								</View>
								<View style={{ width: "24%", alignItems: "center", justifyContent: "center" }}>
									<Text style={[styles.textDefault, styles.bold2]}>Status</Text>
								</View>
							</View>
							{reviewer_employees.map((revEmp, idx) => {
								const pos = positions.find(p => p.position_id === revEmp.position);
								const revStatus = getDocumentReviewStatus(revEmp?.pivot?.review_status);
								return (
									<View key={revEmp.employee_id} style={[styles.gridContainer, styles.bt, styles.bm]}>
										<View style={[styles.br, { width: "8%", alignItems: "center", justifyContent: "center" }]}>
											<Text style={styles.textDefault}>{idx + 1}</Text>
										</View>
										<View style={[styles.br, { width: "8%", alignItems: "center", justifyContent: "center" }]}>
											<Text style={[styles.textDefault, { textTransform: "uppercase" }]}>{`${revEmp?.firstname?.charAt(0)}. ${revEmp?.lastname?.charAt(0)}.`}</Text>
										</View>
										<View style={[styles.br, { width: "20%", alignItems: "center", justifyContent: "center" }]}>
											<Text style={styles.textDefault}>{pos.position}</Text>
										</View>
										<View style={[styles.br, { width: "40%", alignItems: "center", justifyContent: "center" }]}>
											<Text style={styles.textDefault}>{revEmp?.remarks || "N/A"}</Text>
										</View>
										<View style={{ width: "24%", alignItems: "center", justifyContent: "center" }}>
											<View style={[styles.badge, { paddingVertical: 1, paddingHorizontal: 2, backgroundColor: theme.palette[revStatus.statusClass].main, marginVertical: 2 }]}>
												<Text style={[styles.textDefault, { fontSize: 6, color: "#fff", textAlign: "center" }]}>{revStatus.statusText}</Text>
											</View>
										</View>
									</View>
								)
							})}
						</View>
						<View style={[styles.col6, styles.bl]}>
							<View>
								<View style={{ backgroundColor: styles.primary }}>
									<Text style={[styles.textDefault, styles.bold2, { textAlign: "center", color: '#fff' }]}>Internal Approver Comments Status</Text>
								</View>

								<View style={[styles.gridContainer, styles.bt, styles.bm]}>
									<View style={[styles.br, { width: "10%", alignItems: "center", justifyContent: "center" }]}>
										<Text style={[styles.textDefault, styles.bold2]}>Initial</Text>
									</View>
									<View style={[styles.br, { width: "20%", alignItems: "center", justifyContent: "center" }]}>
										<Text style={[styles.textDefault, styles.bold2]}>Position</Text>
									</View>
									<View style={[styles.br, { width: "45%", alignItems: "center", justifyContent: "center" }]}>
										<Text style={[styles.textDefault, styles.bold2]}>Remarks</Text>
									</View>
									<View style={{ width: "25%", alignItems: "center", justifyContent: "center" }}>
										<Text style={[styles.textDefault, styles.bold2]}>Status</Text>
									</View>
								</View>
								{approval_employee && (
									<View style={[styles.gridContainer]}>
										<View style={[styles.br, { width: "10%", alignItems: "center", justifyContent: "center" }]}>
											<Text style={[styles.textDefault, { textTransform: "uppercase" }]}>{`${approval_employee?.firstname?.charAt(0)}. ${approval_employee?.lastname?.charAt(0)}.`}</Text>
										</View>
										<View style={[styles.br, { width: "20%", alignItems: "center", justifyContent: "center" }]}>
											<Text style={styles.textDefault}>{approvalPos?.position}</Text>
										</View>
										<View style={[styles.br, { width: "45%", alignItems: "center", justifyContent: "center" }]}>
											<Text style={styles.textDefault}>{document?.remarks || "N/A"}</Text>
										</View>
										<View style={{ width: "25%", alignItems: "center", justifyContent: "center" }}>
											<View style={[styles.badge, { paddingVertical: 1, paddingHorizontal: 2, backgroundColor: theme.palette[approvalStatus.statusClass].main, marginVertical: 2 }]}>
												<Text style={[styles.textDefault, { fontSize: 6, color: "#fff", textAlign: "center" }]}>{approvalStatus.statusText}</Text>
											</View>
										</View>
									</View>
								)}
							</View>
						</View>
					</View>
				</View>

				{external_approver && external_approver?.length > 0 && (
					<View style={styles.gridContainer}>
						<View style={[styles.bl, styles.br]}>
							<View>
								<View style={{ backgroundColor: styles.primary }}>
									<Text style={[styles.textDefault, styles.bold2, { textAlign: "center", width: "100%", color: '#fff' }]}>External Comments Status</Text>
								</View>
								<View style={[styles.gridContainer, styles.bt]}>
									<View style={[styles.br, { width: "10%", alignItems: "center", justifyContent: "center" }]}>
										<Text style={[styles.textDefault, styles.bold2]}>Initial</Text>
									</View>
									<View style={[styles.br, { width: "20%", alignItems: "center", justifyContent: "center" }]}>
										<Text style={[styles.textDefault, styles.bold2]}>Position</Text>
									</View>
									<View style={[styles.br, { width: "45%", alignItems: "center", justifyContent: "center" }]}>
										<Text style={[styles.textDefault, styles.bold2]}>Remarks</Text>
									</View>
									<View style={{ width: "25%", alignItems: "center", justifyContent: "center" }}>
										<Text style={[styles.textDefault, styles.bold2]}>Status</Text>
									</View>
								</View>
								{external_approver.map((ext) => {
									const extStatus = getDocumentReviewStatus(ext?.status);
									return (
										<View key={ext.id} style={[styles.gridContainer, styles.bt, styles.bm]}>
											<View style={[styles.br, { width: "10%", alignItems: "center", justifyContent: "center" }]}>
												<Text style={[styles.textDefault, { textTransform: "uppercase" }]}>{`${ext?.firstname?.charAt(0)}. ${ext?.lastname?.charAt(0)}.`}</Text>
											</View>
											<View style={[styles.br, { width: "20%", alignItems: "center", justifyContent: "center" }]}>
												<Text style={styles.textDefault}>{ext?.position || "N/A"}</Text>
											</View>
											<View style={[styles.br, { width: "45%", alignItems: "center", justifyContent: "center" }]}>
												<Text style={styles.textDefault}>{ext?.remarks || "N/A"}</Text>
											</View>
											<View style={{ width: "25%", alignItems: "center", justifyContent: "center" }}>
												<View style={[styles.badge, { paddingVertical: 1, paddingHorizontal: 2, backgroundColor: theme.palette[extStatus.statusClass].main, marginVertical: 2 }]}>
													<Text style={[styles.textDefault, { fontSize: 6, color: "#fff", textAlign: "center" }]}>{extStatus.statusText}</Text>
												</View>
											</View>
										</View>
									)
								})}
							</View>
						</View>
					</View>
				)}

				<View style={[styles.gridContainer, styles.footer]}>
					<View style={styles.col4}>
						<Text style={[styles.bold2, styles.faded, { fontSize: 9, textAlign: 'left' }]}>Uncontrolled Copy if Printed</Text>
					</View>
					<View style={styles.col6}>
						<Text style={[styles.bold2, styles.faded, { fontSize: 9, textAlign: 'center' }]}>&copy; FIAFI Group Company, {new Date().getFullYear()}. All Rights Reserved.</Text>
					</View>
					<View style={styles.col4}>
						<Text style={[styles.bold2, styles.faded, { fontSize: 9, textAlign: 'right' }]}>{format(new Date(), 'MM/dd/yy')} Page {`1 / 1`}</Text>
					</View>
				</View>

			</Page >
		</Document >
	);
}
