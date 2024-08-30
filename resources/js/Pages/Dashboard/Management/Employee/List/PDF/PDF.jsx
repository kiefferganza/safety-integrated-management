/* eslint-disable jsx-a11y/alt-text */
import { Page, View, Text, Image, Document } from "@react-pdf/renderer";
// utils
import { styles } from "./PDFStyles";
import { format } from "date-fns";

// ----------------------------------------------------------------------

const FORMATTED_DATE = format(new Date(), "MM/dd/yy");
const YEAR = new Date().getFullYear();
export function PDF(props) {
    const { employees = [], analytics } = props;

    return (
        <Document title={""}>
            <Page size="A4" style={styles.page}>
                <View
                    style={[
                        styles.mb16,
                        { minHeight: 40, alignItems: "flex-start" },
                    ]}
                    fixed
                >
                    <Image
                        src={
                            window.location.origin +
                            "/image/media/logo/Fiafi-logo.png"
                        }
                        style={{ height: 32, padding: 2 }}
                    />
                </View>
                <View style={{ textAlign: "center", marginTop: "-30px" }}>
                    <Text style={[styles.h2]}>Employee Tracker</Text>
                </View>

                <View style={styles.mb8}>
                    <View
                        style={[
                            styles.gridContainer,
                            styles.mb8,
                            styles.mt8,
                            styles.pt8,
                            styles.pb8,
                            {
                                border: "1px solid #f5f5f5",
                                borderRadius: 4,
                            },
                        ]}
                    >
                        <View
                            style={[
                                styles.gridContainer,
                                styles.pl4,
                                {
                                    alignItems: "center",
                                    borderRight: "1px solid #f5f5f5",
                                    width: "100%",
                                    justifyContent: "flex-start",
                                },
                            ]}
                        >
                            <View style={[styles.pl4]}>
                                <Text style={[styles.h6, styles.info]}>
                                    Total
                                </Text>
                                <View style={{ flexDirection: "row" }}>
                                    <Text
                                        style={[
                                            styles.bold,
                                            styles.pr4,
                                            { fontSize: 8 },
                                        ]}
                                    >
                                        {analytics.total[0]}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 8,
                                            color: "#637381",
                                        }}
                                    >
                                        employees
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View
                            style={[
                                styles.gridContainer,
                                styles.pl4,
                                {
                                    alignItems: "center",
                                    borderRight: "1px solid #f5f5f5",
                                    width: "100%",
                                    justifyContent: "flex-start",
                                },
                            ]}
                        >
                            <View style={[styles.pl4]}>
                                <Text style={[styles.h6, styles.success]}>
                                    Active
                                </Text>
                                <View style={{ flexDirection: "row" }}>
                                    <Text
                                        style={[
                                            styles.bold,
                                            styles.pr4,
                                            { fontSize: 8 },
                                        ]}
                                    >
                                        {analytics.active[0]}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 8,
                                            color: "#637381",
                                        }}
                                    >
                                        employees
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View
                            style={[
                                styles.gridContainer,
                                styles.pl4,
                                {
                                    alignItems: "center",
                                    borderRight: "1px solid #f5f5f5",
                                    width: "100%",
                                    justifyContent: "flex-start",
                                },
                            ]}
                        >
                            <View style={[styles.pl4]}>
                                <Text style={[styles.h6, styles.warning]}>
                                    Inactive
                                </Text>
                                <View style={{ flexDirection: "row" }}>
                                    <Text
                                        style={[
                                            styles.bold,
                                            styles.pr4,
                                            { fontSize: 8 },
                                        ]}
                                    >
                                        {analytics.inactive[0]}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 8,
                                            color: "#637381",
                                        }}
                                    >
                                        employees
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View
                            style={[
                                styles.gridContainer,
                                styles.pl4,
                                {
                                    alignItems: "center",
                                    borderRight: "1px solid #f5f5f5",
                                    width: "100%",
                                    justifyContent: "flex-start",
                                },
                            ]}
                        >
                            <View style={[styles.pl4]}>
                                <Text style={[styles.h6, styles.error]}>
                                    Unassigned
                                </Text>
                                <View style={{ flexDirection: "row" }}>
                                    <Text
                                        style={[
                                            styles.bold,
                                            styles.pr4,
                                            { fontSize: 8 },
                                        ]}
                                    >
                                        {analytics.unassigned[0]}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 8,
                                            color: "#637381",
                                        }}
                                    >
                                        employees
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                <View
                    style={[
                        styles.tableRow,
                        styles.w1,
                        styles.bl,
                        styles.bt,
                        styles.bgOffPrimary,
                        { padding: 0 },
                    ]}
                    fixed
                >
                    <View
                        style={[
                            styles.pl4,
                            styles.br,
                            {
                                flexGrow: 0,
                                paddingTop: 4,
                                paddingBottom: 4,
                                flexBasis: 25,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.bold,
                                { color: "#363636", lineHeight: 1 },
                            ]}
                        >
                            No.
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.pl4,
                            styles.br,
                            {
                                flexGrow: 0,
                                paddingTop: 4,
                                paddingBottom: 4,
                                flexBasis: 140,
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
                                paddingTop: 4,
                                paddingBottom: 4,
                                flexBasis: 90,
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
                                paddingTop: 4,
                                paddingBottom: 4,
                                flexBasis: 110,
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
                                paddingTop: 4,
                                paddingBottom: 4,
                                flexBasis: 80,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.bold,
                                { color: "#363636", lineHeight: 1 },
                            ]}
                        >
                            Company
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.pl4,
                            styles.br,
                            {
                                flexGrow: 0,
                                paddingTop: 4,
                                paddingBottom: 4,
                                flexBasis: 50,
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
                                paddingTop: 4,
                                paddingBottom: 4,
                                flexBasis: 95,
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
                                paddingTop: 4,
                                paddingBottom: 4,
                                flexBasis: 50,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.bold,
                                { color: "#363636", lineHeight: 1 },
                            ]}
                        >
                            Trainings
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.pl4,
                            styles.br,
                            {
                                flexGrow: 0,
                                paddingTop: 4,
                                paddingBottom: 4,
                                flexBasis: 50,
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
                </View>

                <View>
                    {employees.map((emp, idx) => (
                        <View
                            style={[
                                styles.tableRow,
                                styles.w1,
                                styles.bl,
                                { padding: 0 },
                            ]}
                            wrap={false}
                            key={emp.employee_id}
                        >
                            <View
                                style={[
                                    styles.pl4,
                                    styles.br,
                                    {
                                        flexGrow: 0,
                                        paddingVertical: 4,
                                        flexBasis: 25,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        { color: "#363636", lineHeight: 1 },
                                    ]}
                                >
                                    {idx + 1}
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.pl4,
                                    styles.br,
                                    {
                                        flexGrow: 0,
                                        flexBasis: 140,
                                        position: "relative",
                                        paddingVertical: 4,
                                    },
                                ]}
                            >
                                <View
                                    style={[
                                        styles.avatar,
                                        {
                                            position: "absolute",
                                            left: 2,
                                            top: 2,
                                        },
                                    ]}
                                >
                                    <Image
                                        style={styles.avatarImg}
                                        src={
                                            emp.profile?.thumbnail
                                                ? emp.profile.thumbnail
                                                : window.location.origin +
                                                  "/image/assets/images/default-profile.jpg?w=128&h=128&fit=crop"
                                        }
                                    />
                                </View>
                                <Text
                                    style={[
                                        {
                                            marginLeft: 9,
                                            color: "#363636",
                                            lineHeight: 1,
                                        },
                                    ]}
                                >
                                    {emp.fullname}
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.pl4,
                                    styles.br,
                                    {
                                        flexGrow: 0,
                                        paddingVertical: 4,
                                        flexBasis: 90,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        {
                                            color: "#363636",
                                            lineHeight: 1,
                                            textTransform: "capitalize",
                                        },
                                    ]}
                                >
                                    {emp.position ?? ""}
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.pl4,
                                    styles.br,
                                    {
                                        flexGrow: 0,
                                        paddingVertical: 4,
                                        flexBasis: 110,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        { color: "#363636", lineHeight: 1 },
                                    ]}
                                >
                                    {emp.department ?? ""}
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.pl4,
                                    styles.br,
                                    {
                                        flexGrow: 0,
                                        paddingVertical: 4,
                                        flexBasis: 80,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        { color: "#363636", lineHeight: 1 },
                                    ]}
                                >
                                    {emp.company_name ?? ""}
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.pl4,
                                    styles.br,
                                    {
                                        flexGrow: 0,
                                        paddingVertical: 4,
                                        flexBasis: 50,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        { color: "#363636", lineHeight: 1 },
                                    ]}
                                >
                                    {emp.country ?? ""}
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.pl4,
                                    styles.br,
                                    {
                                        flexGrow: 0,
                                        paddingVertical: 4,
                                        flexBasis: 95,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        { color: "#363636", lineHeight: 1 },
                                    ]}
                                >
                                    {emp.phone_no}
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.pl4,
                                    styles.br,
                                    {
                                        flexGrow: 0,
                                        paddingVertical: 4,
                                        flexBasis: 50,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        { color: "#363636", lineHeight: 1 },
                                    ]}
                                >
                                    {emp.trainings}
                                </Text>
                            </View>

                            <View
                                style={[
                                    styles.pl4,
                                    styles.br,
                                    emp.status === "active"
                                        ? styles.bgSuccess
                                        : emp.status === "inactive"
                                        ? styles.bgWarning
                                        : styles.bgError,
                                    {
                                        flexGrow: 0,
                                        paddingVertical: 4,
                                        flexBasis: 50,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.bold,
                                        {
                                            color: "#f0f0f0",
                                            textTransform: "capitalize",
                                            lineHeight: 1,
                                        },
                                    ]}
                                >
                                    {emp.status}
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
