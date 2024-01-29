import { Page, View, Text, Image, Document } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import { capitalCase } from "change-case";
import { format } from "date-fns";
// ----------------------------------------------------------------------

const spacing = {
    m8: { marginLeft: 8, marginRight: 8, marginTop: 8, marginBottom: 8 },
    m16: { marginLeft: 16, marginRight: 16, marginTop: 16, marginBottom: 16 },
    m24: { marginLeft: 24, marginRight: 24, marginTop: 24, marginBottom: 24 },
    m32: { marginLeft: 32, marginRight: 24, marginTop: 24, marginBottom: 24 },

    p8: { paddingLeft: 8, paddingRight: 8, paddingTop: 8, paddingBottom: 8 },
    p16: {
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 16,
        paddingBottom: 16,
    },
    p24: {
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: 24,
        paddingBottom: 24,
    },
    p32: {
        paddingLeft: 32,
        paddingRight: 32,
        paddingTop: 32,
        paddingBottom: 32,
    },

    mt8: { marginTop: 8 },
    mt16: { marginTop: 16 },
    mt24: { marginTop: 24 },
    mt32: { marginTop: 32 },
    mb8: { marginBottom: 8 },
    mb16: { marginBottom: 16 },
    mb24: { marginBottom: 24 },
    mb32: { marginBottom: 32 },
    ml8: { marginLeft: 8 },
    ml16: { marginLeft: 16 },
    ml24: { marginLeft: 24 },
    ml32: { marginLeft: 32 },
    mr8: { marginRight: 8 },
    mr16: { marginRight: 16 },
    mr24: { marginRight: 24 },
    mr32: { marginRight: 32 },

    pt4: { paddingTop: 4 },
    pt8: { paddingTop: 8 },
    pt16: { paddingTop: 16 },
    pt24: { paddingTop: 24 },
    pt32: { paddingTop: 32 },
    pb8: { paddingBottom: 8 },
    pb16: { paddingBottom: 16 },
    pb24: { paddingBottom: 24 },
    pb32: { paddingBottom: 32 },
    pl4: { paddingLeft: 4 },
    pl8: { paddingLeft: 8 },
    pl16: { paddingLeft: 16 },
    pl24: { paddingLeft: 24 },
    pl32: { paddingLeft: 32 },
    pr4: { paddingRight: 4 },
    pr8: { paddingRight: 8 },
    pr16: { paddingRight: 16 },
    pr24: { paddingRight: 24 },
    pr32: { paddingRight: 32 },
};

const colors = {
    gray: "#d9d9d9",
    success: "#385623",
    warning: "#ffc000",
    error: "#c00000",
    mute: "#edeff1",
    primary: "#788ec7",
    offPrimary: "#d9e2f3",
    secondary: "#00B8D9",
};

const colorStyles = {
    success: { color: colors.success },
    warning: { color: colors.warning },
    error: { color: colors.error },
    textWhite: { color: "#fff" },
    textGray: { color: colors.gray },
    textMute: { color: colors.mute },
    textSecondary: { color: colors.secondary },

    bgSuccess: { backgroundColor: colors.success, color: "#ffffff" },
    bgGray: { backgroundColor: colors.gray, color: "#0a0a0a" },
    bgWarning: { backgroundColor: colors.warning, color: "#ffffff" },
    bgError: { backgroundColor: colors.error, color: "#ffffff" },
    bgMute: { backgroundColor: colors.mute, color: "#0a0a0a" },
    bgPrimary: { backgroundColor: colors.primary, color: "#0a0a0a" },
    bgOffPrimary: { backgroundColor: colors.offPrimary, color: "#0a0a0a" },
};

const styles = StyleSheet.create({
    ...spacing,
    ...colorStyles,
    page: {
        padding: "8px 16px 40px 16px",
        fontSize: 9,
        lineHeight: 1.6,
        fontFamily: "Helvetica",
        backgroundColor: "#fff",
        textTransform: "capitalize",
        color: "#0a0a0a",
    },
    bt: { borderTop: "1px solid #0a0a0a" },
    bm: { borderBottom: "1px solid #0a0a0a" },
    bl: { borderLeft: "1px solid #0a0a0a" },
    br: { borderRight: "1px solid #0a0a0a" },
    w1: { width: "100%" },
    col4: { width: "25%" },
    col3: { width: "33.333%" },
    col8: { width: "75%" },
    col6: { width: "50%" },
    overline: {
        fontSize: 8,
        marginBottom: 8,
        fontWeight: "bold",
        textTransform: "uppercase",
    },
    h2: { fontSize: 17, fontWeight: "bold", fontFamily: "Helvetica-Bold" },
    h3: { fontSize: 16, fontWeight: "bold", fontFamily: "Helvetica-Bold" },
    h4: { fontSize: 13, fontWeight: "bold", fontFamily: "Helvetica-Bold" },
    h5: { fontSize: 11, fontWeight: "bold", fontFamily: "Helvetica-Bold" },
    bold: {
        fontWeight: "bold",
        color: "#0a0a0a",
        fontFamily: "Helvetica-Bold",
    },
    body1: { fontSize: 10 },
    subtitle2: {
        fontSize: 9,
        fontWeight: "bold",
        fontFamily: "Helvetica-Bold",
    },
    subtitle3: { fontSize: 9 },
    subtitle4: { fontSize: 7 },
    alignRight: { textAlign: "right" },
    textCenter: { textAlign: "center" },
    underlineText: {
        width: "100%",
        fontWeight: "bold",
        color: "#0a0a0a",
        borderBottom: "1px solid #0a0a0a",
    },
    footer: {
        left: 0,
        right: 0,
        bottom: 0,
        paddingVertical: 8,
        paddingHorizontal: 40,
        margin: "auto",
        position: "absolute",
    },
    gridContainer: { flexDirection: "row", justifyContent: "space-between" },
    table: { display: "flex", width: "100%" },
    tableHeader: {},
    tableBody: {},
    tableRow: {
        padding: "4px 0 2px 0",
        flexDirection: "row",
        borderBottomWidth: 1,
        borderStyle: "solid",
        fontSize: 7,
    },
    noBorder: { paddingTop: 8, paddingBottom: 0, borderBottomWidth: 0 },
    tableCell_1: { width: "15%" },
    tableCell_2: { width: "50%" },
    tableCell_3: { width: "15%" },
});

const FORMATTED_DATE = format(new Date(), "MM/dd/yy");
const YEAR = new Date().getFullYear();
export const PDF = (props) => (
    <Document
        title={props.title}
        author={props.author}
        subject={props.description}
    >
        <Page size="A4" style={styles.page}>
            <View
                style={[
                    styles.mb16,
                    { alignItems: "center", justifyContent: "center" },
                ]}
                fixed
            >
                <Image
                    source={`${window.origin}/logo/Fiafi-logo.png`}
                    style={{ height: 48 }}
                />
            </View>
            <View
                style={[
                    styles.bt,
                    styles.bm,
                    styles.mb16,
                    styles.bgPrimary,
                    styles.pt8,
                    styles.pl8,
                    styles.mb16,
                    {
                        justifyContent: "center",
                        borderTopWidth: 1.5,
                        borderBottomWidth: 1.5,
                    },
                ]}
            >
                <Text style={[styles.h2]}>HSE Inspection Tracker</Text>
            </View>

            {props.inspections.map((inspection) => (
                <View key={inspection.id} style={[styles.mb16]} wrap={false}>
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
                                styles.pl4,
                                styles.br,
                                {
                                    flexGrow: 0,
                                    paddingTop: 4,
                                    flexBasis: 110,
                                },
                            ]}
                        >
                            <Text style={styles.bold}>CMS Number</Text>
                        </View>
                        <View
                            style={[
                                styles.pl4,
                                styles.br,
                                {
                                    flexGrow: 0,
                                    paddingTop: 4,
                                    flexBasis: 106,
                                },
                            ]}
                        >
                            <Text style={styles.bold}>Submitted</Text>
                        </View>
                        <View
                            style={[
                                styles.pl4,
                                styles.br,
                                {
                                    flexGrow: 0,
                                    paddingTop: 4,
                                    flexBasis: 106,
                                },
                            ]}
                        >
                            <Text style={styles.bold}>Action</Text>
                        </View>
                        <View
                            style={[
                                styles.pl4,
                                styles.br,
                                {
                                    flexGrow: 0,
                                    paddingTop: 4,
                                    flexBasis: 106,
                                },
                            ]}
                        >
                            <Text style={styles.bold}>Verify</Text>
                        </View>
                        <View
                            style={[
                                styles.pl4,
                                styles.br,
                                {
                                    flexGrow: 0,
                                    paddingTop: 4,
                                    flexBasis: 50,
                                },
                            ]}
                        >
                            <Text style={styles.bold}>Date Issued</Text>
                        </View>
                        <View
                            style={[
                                styles.pl4,
                                styles.br,
                                {
                                    flexGrow: 0,
                                    paddingTop: 4,
                                    flexBasis: 18,
                                },
                            ]}
                        >
                            <Text style={styles.bold}>O</Text>
                        </View>
                        <View
                            style={[
                                styles.pl4,
                                styles.br,
                                {
                                    flexGrow: 0,
                                    paddingTop: 4,
                                    flexBasis: 18,
                                },
                            ]}
                        >
                            <Text style={styles.bold}>N</Text>
                        </View>
                        <View
                            style={[
                                styles.pl4,
                                styles.br,
                                {
                                    flexGrow: 0,
                                    paddingTop: 4,
                                    flexBasis: 18,
                                },
                            ]}
                        >
                            <Text style={styles.bold}>P</Text>
                        </View>
                        <View
                            style={[
                                styles.pl4,
                                styles.br,
                                { flexGrow: 1, paddingTop: 4 },
                            ]}
                        >
                            <Text style={styles.bold}>S</Text>
                        </View>
                    </View>

                    <View
                        style={[
                            styles.tableRow,
                            styles.w1,
                            styles.bl,
                            { padding: 0 },
                        ]}
                    >
                        <View
                            style={[
                                styles.pl4,
                                styles.br,
                                {
                                    flexGrow: 0,
                                    paddingTop: 4,
                                    flexBasis: 110,
                                },
                            ]}
                        >
                            <Text>{inspection?.form_number}</Text>
                        </View>
                        <View
                            style={[
                                styles.pl4,
                                styles.br,
                                {
                                    flexGrow: 0,
                                    paddingTop: 4,
                                    flexBasis: 106,
                                },
                            ]}
                        >
                            <Text>{inspection?.inspected_by}</Text>
                        </View>
                        <View
                            style={[
                                styles.pl4,
                                styles.br,
                                {
                                    flexGrow: 0,
                                    paddingTop: 4,
                                    flexBasis: 106,
                                },
                            ]}
                        >
                            <Text>{inspection?.reviewer}</Text>
                        </View>
                        <View
                            style={[
                                styles.pl4,
                                styles.br,
                                {
                                    flexGrow: 0,
                                    paddingTop: 4,
                                    flexBasis: 106,
                                },
                            ]}
                        >
                            <Text>{inspection?.verifier}</Text>
                        </View>
                        <View
                            style={[
                                styles.pl4,
                                styles.br,
                                {
                                    flexGrow: 0,
                                    paddingTop: 4,
                                    flexBasis: 50,
                                },
                            ]}
                        >
                            <Text>{inspection?.date_issued}</Text>
                        </View>
                        <View
                            style={[
                                styles.pl4,
                                styles.br,
                                {
                                    flexGrow: 0,
                                    paddingTop: 4,
                                    flexBasis: 18,
                                },
                            ]}
                        >
                            <Text>{inspection?.totalObservation}</Text>
                        </View>
                        <View
                            style={[
                                styles.pl4,
                                styles.br,
                                {
                                    flexGrow: 0,
                                    paddingTop: 4,
                                    flexBasis: 18,
                                },
                            ]}
                        >
                            <Text>{inspection?.negativeObservation}</Text>
                        </View>
                        <View
                            style={[
                                styles.pl4,
                                styles.br,
                                {
                                    flexGrow: 0,
                                    paddingTop: 4,
                                    flexBasis: 18,
                                },
                            ]}
                        >
                            <Text>{inspection?.positiveObservation}</Text>
                        </View>
                        <View
                            style={[
                                styles.pl4,
                                styles.br,
                                inspection.status
                                    ? styles[
                                          `bg${capitalCase(
                                              inspection.status.classType
                                          )}`
                                      ]
                                    : {},
                                {
                                    flexGrow: 1,
                                    paddingTop: 4,
                                },
                            ]}
                        >
                            <Text style={[styles.bold, { color: "#fff" }]}>
                                {inspection?.status?.text}
                            </Text>
                        </View>
                    </View>

                    {inspection?.report_list &&
                        inspection.report_list.map((report) => (
                            <View key={report.list_id}>
                                <View
                                    style={[
                                        styles.tableRow,
                                        styles.w1,
                                        styles.bl,
                                        styles.bgOffPrimary,
                                        { padding: 0 },
                                    ]}
                                >
                                    <View
                                        style={[
                                            styles.pl4,
                                            styles.br,
                                            {
                                                flexGrow: 0,
                                                paddingTop: 4,
                                                flexBasis: 110,
                                            },
                                        ]}
                                    >
                                        <Text style={styles.bold}>
                                            Ref #: {report.ref_num}
                                        </Text>
                                    </View>
                                    <View
                                        style={[
                                            styles.pl4,
                                            styles.br,
                                            {
                                                flexGrow: 0,
                                                paddingTop: 4,
                                                flexBasis: 318,
                                            },
                                        ]}
                                    >
                                        <Text style={styles.bold}>
                                            Title: {report.section_title}
                                        </Text>
                                    </View>
                                    <View
                                        style={[
                                            styles.pl4,
                                            styles.br,
                                            { flexGrow: 1, paddingTop: 4 },
                                        ]}
                                    >
                                        <Text style={styles.bold}>
                                            Location: {inspection?.location}
                                        </Text>
                                    </View>
                                </View>

                                <View>
                                    <View
                                        style={[
                                            styles.tableRow,
                                            styles.w1,
                                            styles.bl,
                                            styles.bgGray,
                                            { padding: 0 },
                                        ]}
                                    >
                                        <View
                                            style={[
                                                styles.pl4,
                                                styles.br,
                                                {
                                                    flexGrow: 1,
                                                    paddingTop: 4,
                                                    flexBasis: "50%",
                                                },
                                            ]}
                                        >
                                            <Text style={styles.bold}>
                                                Findings
                                            </Text>
                                        </View>
                                        <View
                                            style={[
                                                styles.pl4,
                                                styles.br,
                                                {
                                                    flexGrow: 1,
                                                    paddingTop: 4,
                                                    flexBasis: "50%",
                                                },
                                            ]}
                                        >
                                            <Text style={styles.bold}>
                                                Action
                                            </Text>
                                        </View>
                                    </View>
                                    <View
                                        style={[
                                            styles.tableRow,
                                            styles.w1,
                                            styles.bl,
                                            { padding: 0 },
                                        ]}
                                    >
                                        <View
                                            style={[
                                                styles.br,
                                                {
                                                    flexGrow: 1,
                                                    flexBasis: "50%",
                                                },
                                            ]}
                                        >
                                            {report?.photo_before && (
                                                <View
                                                    style={[
                                                        styles.bm,
                                                        { maxHeight: 180 },
                                                    ]}
                                                >
                                                    <Image
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            padding: 2,
                                                        }}
                                                        src={
                                                            report.photo_before
                                                        }
                                                    />
                                                </View>
                                            )}
                                            <View
                                                style={[
                                                    styles.pl4,
                                                    styles.pr4,
                                                    styles.pt4,
                                                ]}
                                            >
                                                <Text
                                                    style={{
                                                        fontFamily:
                                                            "Helvetica-Oblique",
                                                    }}
                                                >
                                                    {report?.findings || ""}
                                                </Text>
                                            </View>
                                        </View>
                                        <View
                                            style={[
                                                styles.br,
                                                {
                                                    flexGrow: 1,
                                                    flexBasis: "50%",
                                                },
                                            ]}
                                        >
                                            {report?.photo_after && (
                                                <View
                                                    style={[
                                                        styles.bm,
                                                        { maxHeight: 180 },
                                                    ]}
                                                >
                                                    <Image
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            padding: 2,
                                                        }}
                                                        src={report.photo_after}
                                                    />
                                                </View>
                                            )}
                                            <View
                                                style={[
                                                    styles.pl4,
                                                    styles.pr4,
                                                    styles.pt4,
                                                ]}
                                            >
                                                <Text
                                                    style={{
                                                        fontFamily:
                                                            "Helvetica-Oblique",
                                                    }}
                                                >
                                                    {report?.action_taken ||
                                                        "TBA"}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        ))}
                </View>
            ))}

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
                        &copy; FIAFI Group Company, {YEAR}. All Rights Reserved.
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
