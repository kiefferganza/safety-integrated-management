import { Page, View, Text, Image, Document } from "@react-pdf/renderer";
import styles from "./stylesPDF";
import { format } from "date-fns";

const FORMATTED_DATE = format(new Date(), "MM/dd/yy");
const YEAR = new Date().getFullYear();
export function PDF({ data = [], filterDate }) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.mb8}>
                    <View style={[styles.gridContainer, styles.mb8]} fixed>
                        <Image
                            src={
                                window.location.origin +
                                "/image/media/logo/Fiafi-logo.png"
                            }
                            style={{ height: 32, padding: 2 }}
                        />
                    </View>
                    <View
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "row",
                        }}
                    >
                        <Text style={styles.h4}>
                            Safety Officer & PA's DOR -{" "}
                            {format(filterDate || new Date(), "MMMM yyyy")}
                        </Text>
                    </View>
                </View>

                <View>
                    <View
                        style={[
                            styles.tableRow,
                            styles.w1,
                            styles.bl,
                            styles.bt,
                            styles.bgOffPrimary,
                            { padding: 0 },
                        ]}
                    >
                        <View
                            style={[
                                styles.br,
                                {
                                    flexGrow: 0,
                                    paddingTop: 2,
                                    paddingBottom: 2,
                                    flexBasis: 20,
                                    height: 18,
                                    justifyContent: "center",
                                    paddingLeft: 1,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.bold,
                                    { color: "#363636", lineHeight: 1 },
                                ]}
                            >
                                S.no
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.pl4,
                                styles.br,
                                {
                                    flexGrow: 0,
                                    paddingTop: 2,
                                    paddingBottom: 2,
                                    flexBasis: 120,
                                    height: 18,
                                    justifyContent: "center",
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.bold,
                                    { color: "#363636", lineHeight: 1 },
                                ]}
                            >
                                Name
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.pl4,
                                styles.br,
                                {
                                    flexGrow: 0,
                                    paddingTop: 2,
                                    paddingBottom: 2,
                                    flexBasis: 90,
                                    height: 18,
                                    justifyContent: "center",
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.bold,
                                    { color: "#363636", lineHeight: 1 },
                                ]}
                            >
                                Position
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.pl4,
                                styles.br,
                                {
                                    flexGrow: 0,
                                    paddingTop: 2,
                                    paddingBottom: 2,
                                    flexBasis: 90,
                                    height: 18,
                                    justifyContent: "center",
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.bold,
                                    { color: "#363636", lineHeight: 1 },
                                ]}
                            >
                                Department
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.pl4,
                                styles.br,
                                {
                                    flexGrow: 0,
                                    paddingTop: 2,
                                    paddingBottom: 2,
                                    flexBasis: 70,
                                    height: 18,
                                    justifyContent: "center",
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.bold,
                                    { color: "#363636", lineHeight: 1 },
                                ]}
                            >
                                Country
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.pl4,
                                styles.br,
                                {
                                    flexGrow: 0,
                                    paddingTop: 2,
                                    paddingBottom: 2,
                                    flexBasis: 90,
                                    height: 18,
                                    justifyContent: "center",
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.bold,
                                    { color: "#363636", lineHeight: 1 },
                                ]}
                            >
                                Phone No.
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.pl4,
                                styles.br,
                                {
                                    flexGrow: 0,
                                    paddingTop: 2,
                                    paddingBottom: 2,
                                    flexBasis: 55,
                                    height: 18,
                                    justifyContent: "center",
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.bold,
                                    { color: "#363636", lineHeight: 1 },
                                ]}
                            >
                                Status
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.pl4,
                                styles.br,
                                {
                                    flexGrow: 0,
                                    paddingTop: 2,
                                    paddingBottom: 2,
                                    flexBasis: 50,
                                    height: 18,
                                    justifyContent: "center",
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.bold,
                                    { color: "#363636", lineHeight: 1 },
                                ]}
                            >
                                Inspections
                            </Text>
                        </View>
                    </View>

                    {data.map((d, i) => (
                        <View
                            style={[
                                styles.tableRow,
                                styles.w1,
                                styles.bl,
                                { padding: 0 },
                            ]}
                            wrap={false}
                            key={d.id}
                        >
                            <View
                                style={[
                                    styles.pl4,
                                    styles.br,
                                    {
                                        flexGrow: 0,
                                        paddingTop: 2,
                                        paddingBottom: 2,
                                        flexBasis: 20,
                                        height: 14,
                                        justifyContent: "center",
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.bold,
                                        { color: "#363636", lineHeight: 1 },
                                    ]}
                                >
                                    {i + 1}
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.pl4,
                                    styles.br,
                                    {
                                        flexGrow: 0,
                                        paddingTop: 2,
                                        paddingBottom: 2,
                                        flexBasis: 120,
                                        height: 14,
                                        justifyContent: "center",
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        { color: "#363636", lineHeight: 1 },
                                    ]}
                                >
                                    {d.fullname}
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.pl4,
                                    styles.br,
                                    {
                                        flexGrow: 0,
                                        paddingTop: 2,
                                        paddingBottom: 2,
                                        flexBasis: 90,
                                        height: 14,
                                        justifyContent: "center",
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        { color: "#363636", lineHeight: 1 },
                                    ]}
                                >
                                    {d.position}
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.pl4,
                                    styles.br,
                                    {
                                        flexGrow: 0,
                                        paddingTop: 2,
                                        paddingBottom: 2,
                                        flexBasis: 90,
                                        height: 14,
                                        justifyContent: "center",
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        { color: "#363636", lineHeight: 1 },
                                    ]}
                                >
                                    {d.department}
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.pl4,
                                    styles.br,
                                    {
                                        flexGrow: 0,
                                        paddingTop: 2,
                                        paddingBottom: 2,
                                        flexBasis: 70,
                                        height: 14,
                                        justifyContent: "center",
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        { color: "#363636", lineHeight: 1 },
                                    ]}
                                >
                                    {d.country}
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.pl4,
                                    styles.br,
                                    {
                                        flexGrow: 0,
                                        paddingTop: 2,
                                        paddingBottom: 2,
                                        flexBasis: 90,
                                        height: 14,
                                        justifyContent: "center",
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        d.phone_no === "N/A" ? styles.bold : {},
                                        { color: "#363636", lineHeight: 1 },
                                    ]}
                                >
                                    {d.phone_no}
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.pl4,
                                    styles.br,
                                    {
                                        flexGrow: 0,
                                        paddingTop: 2,
                                        paddingBottom: 2,
                                        flexBasis: 55,
                                        height: 14,
                                        justifyContent: "center",
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.bold,
                                        d.status === "active"
                                            ? styles.success
                                            : styles.warning,
                                        { lineHeight: 1 },
                                    ]}
                                >
                                    {d.status}
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.pl4,
                                    styles.br,
                                    {
                                        flexGrow: 0,
                                        paddingTop: 2,
                                        paddingBottom: 2,
                                        flexBasis: 50,
                                        height: 14,
                                        justifyContent: "center",
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.bold,
                                        { color: "#363636", lineHeight: 1 },
                                    ]}
                                >
                                    {d.inspections_count}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

                <View style={[styles.gridContainer, styles.footer]} fixed>
                    <View style={styles.col4}>
                        <Text
                            style={[
                                styles.bold,
                                {
                                    fontSize: 7,
                                    textAlign: "left",
                                    color: "#141414",
                                },
                            ]}
                        >
                            Uncontrolled Copy if Printed
                        </Text>
                    </View>
                    <View style={styles.col6}>
                        <Text
                            style={[
                                styles.bold,
                                {
                                    fontSize: 7,
                                    textAlign: "center",
                                    color: "#141414",
                                },
                            ]}
                        >
                            &copy; FIAFI Group Company, {YEAR}. All Rights
                            Reserved.
                        </Text>
                    </View>
                    <View style={styles.col4}>
                        <Text
                            style={[
                                styles.bold,
                                {
                                    fontSize: 7,
                                    textAlign: "right",
                                    color: "#141414",
                                },
                            ]}
                            render={({ pageNumber, totalPages }) =>
                                `${FORMATTED_DATE} Page ${pageNumber} / ${totalPages}`
                            }
                        ></Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
}
