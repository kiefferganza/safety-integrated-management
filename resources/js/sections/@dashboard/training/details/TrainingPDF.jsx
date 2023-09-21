import { useMemo } from 'react';
/* eslint-disable jsx-a11y/alt-text */
import PropTypes from 'prop-types';
import { Page, View, Text, Image, Document } from '@react-pdf/renderer';
// utils
import { fDate } from '@/utils/formatTime';

import styles from './TrainingStyle';
import { format } from 'date-fns';
import { fCurrencyNumber } from '@/utils/formatNumber';
import { ellipsis } from '@/utils/exercpt';

// ----------------------------------------------------------------------

TrainingPDF.propTypes = {
	training: PropTypes.object,
	module: PropTypes.string,
	page: PropTypes.string
};

const PER_PAGE = 10;

export default function TrainingPDF ({ page = "1/1", training, module }) {

	const getTotalAmmount = training?.external_details && training?.type === 3 ? training?.trainees?.length * (parseInt(training?.external_details?.course_price)) : 0;

	const pages = useMemo(() => {
		if (training?.trainees?.length > PER_PAGE) {
			const chunkSize = PER_PAGE;
			let arr = [];
			for (let i = 0; i < training.trainees.length; i += chunkSize) {
				const chunk = training.trainees.slice(i, i + chunkSize);
				arr.push(chunk)
			}
			return arr;
		} else {
			// 
			return [training?.trainees];
		}
	}, [training]);

	return (
		<Document title={training.cms ? training.cms.toUpperCase() : module + " Training"}>
			{pages.map((trainees, pageIndex) => (
				<Page size="A4" style={styles.page} key={pageIndex}>
					<View style={styles.mb16}>
						<View style={styles.gridContainer}>
							<Image source="/logo/Fiafi-logo.png" style={{ height: 32, padding: 2 }} />
						</View>
						<View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
							<Text style={styles.h3}> {`${module} Training`}</Text>
						</View>
						<View style={styles.gridContainer}>
							<View style={[styles.col3, { alignItems: 'center', flexDirection: 'column' }]}>
								<Text style={styles.subtitle2}>CMS Number:</Text>
								<Text style={[styles.body1, { fontWeight: 700 }]}>{training.cms ? training.cms.toUpperCase() : ""}</Text>
							</View>
							<View style={[styles.col3, { alignItems: 'center', flexDirection: 'column' }]}>
								{/* <Text style={styles.subtitle2}>Revision:</Text>
								<Text style={[styles.body1, { fontWeight: 700 }]}>{training.revision_no || 0}</Text> */}
							</View>
							<View style={[styles.col3, { alignItems: 'center', flexDirection: 'column' }]}>
								<Text style={styles.subtitle2}>Rollout Date:</Text>
								<Text></Text>
							</View>
						</View>
					</View>

					<View style={[styles.gridContainer, styles.mb16]}>
						<View style={[styles.col6, { paddingRight: 8 }]}>
							<View style={{ flexDirection: 'column' }}>
								<Text style={styles.subtitle2}>Course Title</Text>
								<View style={{ width: '100%' }}>
									<Text style={[styles.underlineText, styles.body1]}>{training?.course ? training.course.course_name : training.title}</Text>
								</View>
							</View>

							<View style={{ flexDirection: 'column' }}>
								<Text style={styles.subtitle2}>Training Location</Text>
								<View style={{ width: '100%' }}>
									<Text style={[styles.underlineText, styles.body1]}>{training.location}</Text>
								</View>
							</View>

							<View style={{ flexDirection: 'column' }}>
								<Text style={styles.subtitle2}>Contract No.</Text>
								<View style={{ width: '100%' }}>
									<Text style={[styles.underlineText, styles.body1]}>{training.contract_no}</Text>
								</View>
							</View>

							<View style={{ flexDirection: 'column' }}>
								<Text style={styles.subtitle2}>Conducted By</Text>
								<View style={{ width: '100%' }}>
									<Text style={[styles.underlineText, styles.body1]}>{training.trainer}</Text>
								</View>
							</View>

							{training.training_center && (
								<View style={{ flexDirection: 'column' }}>
									<Text style={styles.subtitle2}>Training Center</Text>
									<View style={{ width: '100%' }}>
										<Text style={[styles.underlineText, styles.body1]}>{training.training_center}</Text>
									</View>
								</View>
							)}
						</View>

						<View style={[styles.col6, { paddingLeft: 8 }]}>
							<View style={{ flexDirection: 'column' }}>
								<Text style={styles.subtitle2}>Date of Training</Text>
								<View style={{ width: '100%' }}>
									<Text style={[styles.underlineText, styles.body1]}>{training?.training_date ? fDate(new Date(training.training_date)) : ""}</Text>
								</View>
							</View>

							<View style={{ flexDirection: 'column' }}>
								<Text style={styles.subtitle2}>Date Expired</Text>
								<View style={{ width: '100%' }}>
									<Text style={[styles.underlineText, styles.body1]}>{training?.date_expired ? fDate(new Date(training.date_expired)) : null}</Text>
								</View>
							</View>

							<View style={{ flexDirection: 'column' }}>
								<Text style={styles.subtitle2}>Training Hours</Text>
								<View style={{ width: '100%' }}>
									<Text style={[styles.underlineText, styles.body1]}>{training.training_hrs}</Text>
								</View>
							</View>

							<View style={{ flexDirection: 'column' }}>
								<Text style={styles.subtitle2}>Status</Text>
								<View style={{ width: '100%' }}>
									<Text
										style={[styles.underlineText, styles.body1,
										{
											color: training?.status?.rawColor,
											fontWeight: 700,
										}
										]}>
										{training?.status?.text}
									</Text>
								</View>
							</View>
							{training.type === 3 && (
								<View style={{ flexDirection: 'column' }}>
									<Text style={styles.subtitle2}>Signed File</Text>
									<View style={{ width: '100%' }}>
										{training?.external_status?.currentFile ? (
											<Text style={{ color: 'blue' }}>
												{ellipsis(training.external_status.currentFile.name || "", 24)}
											</Text>
										) : (
											<Text style={[styles.faded, { fontWeight: 400 }]}>
												No Signed File
											</Text>
										)}
									</View>
								</View>
							)}
						</View>
					</View>

					<View style={styles.table}>
						<View style={styles.tableHeader}>
							<View style={styles.tableRow}>
								<View style={styles.tableCell_1}>
									<Text style={[styles.subtitle2, { paddingLeft: 4 }]}>S.no</Text>
								</View>

								<View style={styles.tableCell_2}>
									<Text style={styles.subtitle2}>Name</Text>
								</View>

								<View style={[styles.tableCell_2]}>
									<Text style={styles.subtitle2}>Position</Text>
								</View>

								<View style={styles.tableCell_1}>
									<Text style={[styles.subtitle2, { textAlign: 'center' }]}>Certificate</Text>
								</View>
							</View>
						</View>

						<View style={styles.tableBody}>
							{trainees?.map((item, idx) => (
								<View style={styles.tableRow} key={item.employee_id}>
									<View style={styles.tableCell_1}>
										<Text style={{ paddingLeft: 8 }}>{(idx + 1) + (pageIndex * PER_PAGE)}</Text>
									</View>

									<View style={styles.tableCell_2}>
										<Text>{item.fullname}</Text>
									</View>

									<View style={[styles.tableCell_2]}>
										<Text>{item.position}</Text>
									</View>

									<View style={styles.tableCell_1}>
										<Text style={[styles.subtitle2, { textAlign: 'center' }]}>{training?.external_status?.currentFile ? "Yes" : (item?.src ? "Yes" : "No")}</Text>
									</View>
								</View>
							))}
							{trainees?.length < PER_PAGE && (
								Array.from(Array(PER_PAGE - trainees.length).keys()).map((_, idx) => (
									<View style={styles.tableRow} key={idx}>
										<View style={styles.tableCell_1}>
											<Text style={{ paddingLeft: 8 }}>{trainees.length + ((idx + 1) + (pageIndex * PER_PAGE))}</Text>
										</View>

										<View style={styles.tableCell_2}>
										</View>

										<View style={[styles.tableCell_2]}>
										</View>

										<View style={styles.tableCell_1}>
										</View>
									</View>

								))
							)}
						</View>
					</View>

					<View style={[styles.mb40, { marginTop: training.type === 3 ? 32 : 80 }]}>
						<View style={styles.mb40}>
							<View style={[styles.gridContainer, styles.mb40]}>
								<Text style={styles.subtitle2}>Remarks</Text>
							</View>
							<View style={{ width: '100%', borderBottom: 1 }}>
							</View>
						</View>
						{training?.external_details || training.type === 3 ? (
							<View>
								<View style={[styles.gridContainer, styles.mb32]}>
									<View style={styles.col3}>
										<Text style={[styles.body1, { textAlign: 'center', width: 140 }]}>{training?.user_employee ? `${training?.user_employee?.firstname?.trim()} ${training?.user_employee?.lastname?.trim()}` : ''}</Text>
										<Text style={[styles.body1, { width: 140, textAlign: 'center', paddingTop: 4 }]}>Submitted By</Text>
									</View>
									<View style={styles.col3}>
										{training?.external_details?.reviewer && (
											<>
												<Text style={[styles.body1, { textAlign: 'center', width: 140 }]}>
													{training?.external_details?.reviewer ? `${training?.external_details?.reviewer?.firstname?.trim()} ${training?.external_details?.reviewer?.lastname?.trim()}` : ""}
												</Text>
												<Text style={[styles.body1, { borderTop: 1, width: 140, textAlign: 'center', paddingTop: 4 }]}>Reviewed By</Text>
											</>
										)}
									</View>
									<View style={styles.col3}>
										{training?.external_details?.approval && (
											<>
												<Text style={[styles.body1, { textAlign: 'center', width: 140 }]}>
													{training?.external_details?.approval ? `${training?.external_details?.approval?.firstname?.trim()} ${training?.external_details?.approval?.lastname?.trim()}` : ""}
												</Text>
												<Text style={[styles.body1, { borderTop: 1, width: 140, textAlign: 'center', paddingTop: 4 }]}>Approved By</Text>
											</>
										)}
									</View>
								</View>
								<View style={[styles.gridContainer, { flexDirection: "column" }]}>
									<View style={[styles.mb8, { display: 'flex', flexDirection: 'row' }]}>
										<View style={{ width: 80 }}>
											<Text>Total Attendees</Text>
										</View>
										<View style={{ width: 15 }}>
											<Text>:</Text>
										</View>
										<View>
											<Text style={{ textTransform: 'lowercase' }}>{training?.trainees?.length} pax</Text>
										</View>
									</View>

									<View style={[styles.mb8, { display: 'flex', flexDirection: 'row' }]}>
										<View style={{ width: 80 }}>
											<Text>Course Price</Text>
										</View>
										<View style={{ width: 15 }}>
											<Text>:</Text>
										</View>
										<View>
											<Text>{fCurrencyNumber(training?.external_details?.course_price) + '.00'} {training?.external_details?.currency}</Text>
										</View>
									</View>

									<View style={[styles.mb8, { display: 'flex', flexDirection: 'row' }]}>
										<View style={{ width: 80 }}>
											<Text>Total Ammount</Text>
										</View>
										<View style={{ width: 15 }}>
											<Text>:</Text>
										</View>
										<View>
											<Text>{fCurrencyNumber(getTotalAmmount) || fCurrencyNumber(training?.external_details?.course_price) + '.00'} {training?.external_details?.currency}</Text>
										</View>
									</View>

									<View style={[styles.mb8, { display: 'flex', flexDirection: 'row' }]}>
										<View style={{ width: 80 }}>
											<Text>Date Requested</Text>
										</View>
										<View style={{ width: 15 }}>
											<Text>:</Text>
										</View>
										<View>
											<Text>{fDate(new Date(training?.external_details?.date_requested))}</Text>
										</View>
									</View>
								</View>
							</View>
						) : (
							<View>
								<Text style={[styles.body1, { textAlign: 'center', width: 140 }]}>{training?.user_employee ? `${training?.user_employee?.firstname?.trim()} ${training?.user_employee?.lastname?.trim()}` : ''}</Text>
								<Text style={[styles.body1, { borderTop: 1, width: 140, textAlign: 'center', paddingTop: 4 }]}>Submitted By</Text>
							</View>
						)}
					</View>

					<View style={[styles.gridContainer, styles.footer]}>
						<View style={styles.col4}>
							<Text style={[styles.subtitle2, { fontSize: 9, textAlign: 'left' }]}>Uncontrolled Copy if Printed</Text>
						</View>
						<View style={styles.col6}>
							<Text style={[styles.subtitle2, { fontSize: 9, textAlign: 'center' }]}>&copy; FIAFI Group Company, {new Date().getFullYear()}. All Rights Reserved.</Text>
						</View>
						<View style={styles.col4}>
							<Text style={[styles.subtitle2, { fontSize: 9, textAlign: 'right' }]}>{format(new Date(), 'MM/dd/yy')} Page {page}</Text>
						</View>
					</View>
				</Page>
			))}
		</Document >
	);
}
