import { useMemo } from 'react';
import { Page, View, Text, Image, Document } from '@react-pdf/renderer';

import styles from './MatrixPDFStyle';
import { format } from 'date-fns';

// ----------------------------------------------------------------------

const POSITIONS = {
	"Driver": "#2f75b5",
	"HSE Deputy": "#c6e0b4",
	"PA/Safety Officer": "#ab0cff",
	"PA/Supervisor": "#85660c",
	"Electrician": "#782ab7",
	"Painter": "#1c8356",
	"laborer": "#17ff32",
	"Worker": "#ebd29e",
	"PA": "#e3e3e3",
	"Welder": "#1cbf4e",
	"Scaffolder": "#c5441c",
	"Mechanical Technician": "#dfa1fe",
	"Carpenter": "#ff00fc",
	"Safety Officer": "#ffaf16",
	"Engineer": "#f9a19f",
	"Grinder": "#91ad1c",
	"Site Supervisor": "#1cffcf",
	"QA/QC Engineer": "#2ed9ff",
	"Foreman": "#b10ca1",
	"Civil Manager": "#00b0f0",
	"Logistic": "#c174a7",
	"PA/Engineer": "#795548",
	"Surveyor": "#fe1cbf",
	"Storekeeper": "#b10068",
	"Security Guard": "#fae326",
	"Planner Engineer": "#e6ee9c",
};


// const PER_PAGE = 10;

export default function MatrixPDF ({ years, titles }) {


	// const pages = () => {
	// 	return [];
	// 	// if (training?.trainees?.length > PER_PAGE) {
	// 	// 	const chunkSize = PER_PAGE;
	// 	// 	let arr = [];
	// 	// 	for (let i = 0; i < training.trainees.length; i += chunkSize) {
	// 	// 		const chunk = training.trainees.slice(i, i + chunkSize);
	// 	// 		arr.push(chunk)
	// 	// 	}
	// 	// 	return arr;
	// 	// } else {
	// 	// 	// 
	// 	// 	return [training?.trainees];
	// 	// }
	// }

	const total = {};
	Object.entries(years).forEach(([year, data]) => {
		data.forEach(data2 => {
			data2.data.forEach(comp => {
				if (!total[year]) {
					total[year] = {
						[comp.courseName]: 0,
						'positions': new Set()
					};
				}
				total[year]['positions'].add(comp.position);
				if (comp.isCompleted) {
					total[year][comp.courseName] = total[year][comp.courseName] ? total[year][comp.courseName] + 1 : 1;
				}
			});
		})
	});

	return (
		<Document title={"Training Matrix"}>
			{Object.entries(years).map(([year, data], idx) => (
				<Page size="A3" style={styles.page} key={year}>
					<View>
						<View style={{ marginBottom: 16 }}>
							<View style={styles.mb16}>
								<View style={styles.gridContainer}>
									<Image source="/logo/Fiafi-logo.png" style={{ height: 48, padding: 2 }} />
								</View>
								<View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
									<Text style={styles.h2}>{`Training Matrix - YEAR ${year}`}</Text>
								</View>
							</View>
						</View>
						<View style={{ alignItems: 'center', justifyContent: 'center' }}>
							<MatrixTable titles={titles} data={data} year={year} total={total} />
						</View>
						<View style={{ marginTop: 16 }}>
							{idx === 0 && (
								<View style={styles.gridContainer}>
									<View style={styles.col4} />
									<View style={styles.col8}>
										<Text style={[styles.h5]}>Position Legend:</Text>
										<View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
											{Object.entries(POSITIONS).map(([pos, color]) => (
												<View style={{ flexDirection: 'row', width: '33%' }} key={pos}>
													<View style={{ width: '50%' }}>
														<Text style={[styles.subtitle2]}>{pos}</Text>
													</View>
													<View style={{ width: '50%' }}>
														<View style={{ width: 60, height: 16, backgroundColor: color, border: '0.25px solid #000' }} />
													</View>
												</View>
											))}
										</View>
									</View>
								</View>
							)}
						</View>
					</View>
					<View style={[styles.gridContainer, styles.footer]}>
						<View style={styles.col4}>
							<Text style={[styles.subtitle2, { textAlign: 'left' }]}>Uncontrolled Copy if Printed</Text>
						</View>
						<View style={styles.col6}>
							<Text style={[styles.subtitle2, { textAlign: 'center' }]}>&copy; FIAFI Group Company, {new Date().getFullYear()}. All Rights Reserved.</Text>
						</View>
						<View style={styles.col4}>
							<Text style={[styles.subtitle2, { textAlign: 'right' }]}>{format(new Date(), 'MM/dd/yy')} Page {idx + 1}</Text>
						</View>
					</View>
				</Page>
			))}
		</Document >
	)
}


function MatrixTable ({ titles, data, year, total }) {

	return (
		<View style={styles.gridContainer}>
			<View>
				<View style={styles.tableHead}>
					<View style={[styles.tableHeadCell, { width: 40 }]}>
						<View style={styles.tableHeadCellWrapper}>
							<Text style={styles.tableHeadCellText}>S.no</Text>
						</View>
					</View>
					<View style={[styles.tableHeadCell, { width: 120 }]}>
						<View style={styles.tableHeadCellWrapper}>
							<Text style={styles.tableHeadCellText}>Name</Text>
						</View>
					</View>
					<View style={[styles.tableHeadCell, { width: 90 }]}>
						<View style={styles.tableHeadCellWrapper}>
							<Text style={styles.tableHeadCellText}>Position</Text>
						</View>
					</View>
					{titles?.map((title, idx) => (
						<View style={[styles.tableHeadCell, { width: 40 }]} key={idx}>
							<View style={styles.tableTextVerticialWrapper}>
								<Text style={[styles.tableHeadCellText, styles.tableTextVerticial]}>{title}</Text>
							</View>
						</View>
					))}
				</View>
				{(data || [])?.map((d, i) => (
					<View key={i} style={styles.tableBody}>
						<View style={[styles.tableHeadCell, { justifyContent: 'center', width: 40, height: 16, padding: 0 }]}>
							<Text style={[styles.tableHeadCellText, { fontWeight: 500, paddingBottom: 0, paddingTop: 1, paddingLeft: 4, color: "#000" }]}>{i + 1}</Text>
						</View>
						<View style={[styles.tableHeadCell, { justifyContent: 'center', width: 120, height: 16, padding: 0 }]}>
							<Text style={[styles.tableHeadCellText, { fontWeight: 500, paddingBottom: 0, paddingTop: 1, paddingLeft: 4, color: "#000" }]}>{d.fullName}</Text>
						</View>
						<View style={[styles.tableHeadCell, { justifyContent: 'center', width: 90, height: 16, padding: 0 }]}>
							<Text style={[styles.tableHeadCellText, { fontWeight: 500, paddingBottom: 0, paddingTop: 1, paddingLeft: 4, color: "#000" }]}>{d.position}</Text>
						</View>
						{titles?.map((title, idx) => {
							const course = d?.data?.find(d => d?.courseName?.trim()?.toLowerCase() === title?.trim()?.toLowerCase());
							return (
								<View style={[styles.tableHeadCell, { backgroundColor: course ? (course.isCompleted ? '#808080' : 'red') : (POSITIONS[d.position] || 'transparent'), width: 40, height: 16, padding: 0 }]} key={idx}>
								</View>
							)
						})}
					</View>
				))}
				<View style={{ flexDirection: 'row', marginVertical: 8 }}>
					<View style={[styles.tableHeadCell, { border: 0, justifyContent: 'center', width: 40, height: 16, padding: 0 }]}></View>
					<View style={[styles.tableHeadCell, { border: 0, justifyContent: 'center', width: 120, height: 16, padding: 0 }]}>
						<Text style={[styles.tableHeadCellText, { paddingVertical: 0, fontSize: 10, paddingLeft: 4, color: "#000", fontWeight: 700 }]}>Total</Text>
					</View>

					<View style={[styles.tableHeadCell, { border: 0, justifyContent: 'center', width: 90, height: 18, padding: 0 }]}>
						<Text style={[styles.tableHeadCellText, { paddingVertical: 0, fontSize: 10, paddingLeft: 4, color: "#000", fontWeight: 700 }]}>{total[year]?.positions?.size || 0}</Text>
					</View>
					{titles?.map((title, idx) => (
						<View style={[styles.tableHeadCell, { border: 0, width: 40, height: 18, padding: 0 }]} key={idx}>
							<Text style={[styles.tableHeadCellText, { paddingVertical: 0, fontSize: 10, textAlign: 'center', paddingLeft: 4, color: "#000", fontWeight: 700 }]}>{total[year][title] || 0}</Text>
						</View>
					))}
				</View>
			</View>
		</View>
	)
}