/* eslint-disable jsx-a11y/alt-text */
import {
    Page,
    View,
    Text,
    Image,
    Document,
    Svg,
    Circle,
} from "@react-pdf/renderer";
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
                        { padding: 0 },
                    ]}
                    fixed
                >
                    <View
                        style={[
                            styles.br,
                            {
                                flexGrow: 0,
                                flexBasis: 20,
                            },
                        ]}
                    >
                        <View style={{ marginVertical: "auto" }}>
                            <Text
                                style={[
                                    styles.bold,
                                    {
                                        color: "#2a2a2a",
                                        lineHeight: 1,
                                        textAlign: "center",
                                    },
                                ]}
                            >
                                No.
                            </Text>
                        </View>
                    </View>
                    <View
                        style={[
                            styles.br,
                            {
                                flexGrow: 0,
                                flexBasis: 90,
                            },
                        ]}
                    >
                        <View style={{ marginVertical: "auto" }}>
                            <Text
                                style={[
                                    styles.bold,
                                    {
                                        color: "#2a2a2a",
                                        lineHeight: 1,
                                        textAlign: "center",
                                    },
                                ]}
                            >
                                Name
                            </Text>
                        </View>
                    </View>
                    <View
                        style={[
                            styles.br,
                            {
                                flexGrow: 0,
                                flexBasis: 65,
                            },
                        ]}
                    >
                        <View style={{ marginVertical: "auto" }}>
                            <Text
                                style={[
                                    styles.bold,
                                    {
                                        color: "#2a2a2a",
                                        lineHeight: 1,
                                        textAlign: "center",
                                    },
                                ]}
                            >
                                Position
                            </Text>
                        </View>
                    </View>
                    <View
                        style={[
                            styles.br,
                            {
                                flexGrow: 0,
                                flexBasis: 75,
                            },
                        ]}
                    >
                        <View style={{ marginVertical: "auto" }}>
                            <Text
                                style={[
                                    styles.bold,
                                    {
                                        color: "#2a2a2a",
                                        lineHeight: 1,
                                        textAlign: "center",
                                    },
                                ]}
                            >
                                Department
                            </Text>
                        </View>
                    </View>
                    <View
                        style={[
                            styles.br,
                            {
                                flexGrow: 0,
                                flexBasis: 60,
                            },
                        ]}
                    >
                        <View style={{ marginVertical: "auto" }}>
                            <Text
                                style={[
                                    styles.bold,
                                    {
                                        color: "#2a2a2a",
                                        lineHeight: 1,
                                        textAlign: "center",
                                    },
                                ]}
                            >
                                Company
                            </Text>
                        </View>
                    </View>
                    <View
                        style={[
                            styles.br,
                            {
                                flexGrow: 0,
                                flexBasis: 215,
                            },
                        ]}
                    >
                        <View style={[{ width: 215, paddingBottom: 4 }]}>
                            <Text
                                style={[
                                    styles.bold,
                                    {
                                        color: "#2a2a2a",
                                        lineHeight: 1,
                                        paddingVertical: 2,
                                        textAlign: "center",
                                    },
                                ]}
                            >
                                Third Party Training
                            </Text>
                        </View>
                        <View style={[{ flexDirection: "row" }, styles.bt]}>
                            <View
                                style={[
                                    styles.br,
                                    {
                                        flexGrow: 0,
                                        flexBasis: 15,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.bold,
                                        {
                                            fontSize: 6.5,
                                            color: "#4c4c54",
                                            lineHeight: 1.15,
                                            textAlign: "center",
                                        },
                                    ]}
                                >
                                    SF
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.br,
                                    {
                                        flexGrow: 0,
                                        flexBasis: 30,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.bold,
                                        {
                                            fontSize: 6.5,
                                            color: "#4c4c54",
                                            lineHeight: 1.15,
                                            textAlign: "center",
                                        },
                                    ]}
                                >
                                    WHFPR
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.br,
                                    { flexGrow: 0, flexBasis: 29 },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.bold,
                                        {
                                            fontSize: 6.5,
                                            color: "#4c4c54",
                                            lineHeight: 1.15,
                                            textAlign: "center",
                                        },
                                    ]}
                                >
                                    STEDM
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.br,
                                    { flexGrow: 0, flexBasis: 35 },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.bold,
                                        {
                                            fontSize: 6.5,
                                            color: "#4c4c54",
                                            lineHeight: 1.15,
                                            textAlign: "center",
                                        },
                                    ]}
                                >
                                    CSER-L3
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.br,
                                    { flexGrow: 0, flexBasis: 15 },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.bold,
                                        {
                                            fontSize: 6.5,
                                            color: "#4c4c54",
                                            lineHeight: 1.15,
                                            textAlign: "center",
                                        },
                                    ]}
                                >
                                    BS
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.br,
                                    { flexGrow: 0, flexBasis: 15 },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.bold,
                                        {
                                            fontSize: 6.5,
                                            color: "#4c4c54",
                                            lineHeight: 1.15,
                                            textAlign: "center",
                                        },
                                    ]}
                                >
                                    PA
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.br,
                                    { flexGrow: 0, flexBasis: 20 },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.bold,
                                        {
                                            fontSize: 6.5,
                                            color: "#4c4c54",
                                            lineHeight: 1.15,
                                            textAlign: "center",
                                        },
                                    ]}
                                >
                                    DDT
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.br,
                                    { flexGrow: 0, flexBasis: 15 },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.bold,
                                        {
                                            fontSize: 6.5,
                                            color: "#4c4c54",
                                            lineHeight: 1.15,
                                            textAlign: "center",
                                        },
                                    ]}
                                >
                                    FF
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.br,
                                    { flexGrow: 0, flexBasis: 15 },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.bold,
                                        {
                                            fontSize: 6.5,
                                            color: "#4c4c54",
                                            lineHeight: 1.15,
                                            textAlign: "center",
                                        },
                                    ]}
                                >
                                    SN
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.br,
                                    { flexGrow: 0, flexBasis: 10 },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.bold,
                                        {
                                            fontSize: 6.5,
                                            color: "#4c4c54",
                                            lineHeight: 1.15,
                                            textAlign: "center",
                                        },
                                    ]}
                                >
                                    E
                                </Text>
                            </View>
                            <View style={[{ flexGrow: 0, flexBasis: 15 }]}>
                                <Text
                                    style={[
                                        styles.bold,
                                        {
                                            fontSize: 6.5,
                                            color: "#4c4c54",
                                            lineHeight: 1.15,
                                            textAlign: "center",
                                        },
                                    ]}
                                >
                                    TT
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View
                        style={[
                            styles.br,
                            {
                                flexGrow: 0,
                                flexBasis: 40,
                            },
                        ]}
                    >
                        <View style={{ marginVertical: "auto" }}>
                            <Text
                                style={[
                                    styles.bold,
                                    {
                                        color: "#2a2a2a",
                                        textAlign: "center",
                                    },
                                ]}
                            >
                                Employee
                            </Text>
                            <Text
                                style={[
                                    styles.bold,
                                    {
                                        color: "#2a2a2a",
                                        lineHeight: 1,
                                        textAlign: "center",
                                    },
                                ]}
                            >
                                Status
                            </Text>
                        </View>
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
                                    styles.br,
                                    {
                                        flexGrow: 0,
                                        paddingVertical: 4,
                                        flexBasis: 20,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        {
                                            color: "#363636",
                                            lineHeight: 1,
                                            textAlign: "center",
                                        },
                                    ]}
                                >
                                    {idx + 1}
                                </Text>
                            </View>
                            <View
                                style={[
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
                                            textAlign: "center",
                                        },
                                    ]}
                                >
                                    {emp.fullname}
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.br,
                                    {
                                        flexGrow: 0,
                                        paddingVertical: 4,
                                        flexBasis: 65,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        {
                                            color: "#363636",
                                            lineHeight: 1,
                                            textTransform: "capitalize",
                                            textAlign: "center",
                                        },
                                    ]}
                                >
                                    {emp.position ?? ""}
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.br,
                                    {
                                        flexGrow: 0,
                                        paddingVertical: 4,
                                        flexBasis: 75,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        {
                                            color: "#363636",
                                            lineHeight: 1,
                                            textAlign: "center",
                                        },
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
                                        flexBasis: 60,
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
                                    styles.br,
                                    {
                                        flexGrow: 0,
                                        flexBasis: 215,
                                        flexDirection: "row",
                                    },
                                ]}
                            >
                                <View
                                    style={[
                                        styles.br,
                                        {
                                            flexGrow: 0,
                                            flexBasis: 15,
                                            alignItems: "center",
                                            justifyContent: "center",
                                        },
                                    ]}
                                >
                                    <SvgCircle
                                        color={
                                            !!emp.trainings["SF"]
                                                ? "#02a94d"
                                                : undefined
                                        }
                                    />
                                </View>
                                <View
                                    style={[
                                        styles.br,
                                        {
                                            flexGrow: 0,
                                            flexBasis: 30,
                                            alignItems: "center",
                                            justifyContent: "center",
                                        },
                                    ]}
                                >
                                    <SvgCircle
                                        color={
                                            !!emp.trainings["WHFPR"]
                                                ? "#02a94d"
                                                : undefined
                                        }
                                    />
                                </View>
                                <View
                                    style={[
                                        styles.br,
                                        {
                                            flexGrow: 0,
                                            flexBasis: 29,
                                            alignItems: "center",
                                            justifyContent: "center",
                                        },
                                    ]}
                                >
                                    <SvgCircle
                                        color={
                                            !!emp.trainings["STEDM"]
                                                ? "#02a94d"
                                                : undefined
                                        }
                                    />
                                </View>
                                <View
                                    style={[
                                        styles.br,
                                        {
                                            flexGrow: 0,
                                            flexBasis: 35,
                                            alignItems: "center",
                                            justifyContent: "center",
                                        },
                                    ]}
                                >
                                    <SvgCircle
                                        color={
                                            !!emp.trainings["CSER-L3"]
                                                ? "#02a94d"
                                                : undefined
                                        }
                                    />
                                </View>
                                <View
                                    style={[
                                        styles.br,
                                        {
                                            flexGrow: 0,
                                            flexBasis: 15,
                                            alignItems: "center",
                                            justifyContent: "center",
                                        },
                                    ]}
                                >
                                    <SvgCircle
                                        color={
                                            !!emp.trainings["BS"]
                                                ? "#02a94d"
                                                : undefined
                                        }
                                    />
                                </View>
                                <View
                                    style={[
                                        styles.br,
                                        {
                                            flexGrow: 0,
                                            flexBasis: 15,
                                            alignItems: "center",
                                            justifyContent: "center",
                                        },
                                    ]}
                                >
                                    <SvgCircle
                                        color={
                                            !!emp.trainings["PA"]
                                                ? "#02a94d"
                                                : undefined
                                        }
                                    />
                                </View>
                                <View
                                    style={[
                                        styles.br,
                                        {
                                            flexGrow: 0,
                                            flexBasis: 20,
                                            alignItems: "center",
                                            justifyContent: "center",
                                        },
                                    ]}
                                >
                                    <SvgCircle
                                        color={
                                            !!emp.trainings["DDT"]
                                                ? "#02a94d"
                                                : undefined
                                        }
                                    />
                                </View>
                                <View
                                    style={[
                                        styles.br,
                                        {
                                            flexGrow: 0,
                                            flexBasis: 15,
                                            alignItems: "center",
                                            justifyContent: "center",
                                        },
                                    ]}
                                >
                                    <SvgCircle
                                        color={
                                            !!emp.trainings["FF"]
                                                ? "#02a94d"
                                                : undefined
                                        }
                                    />
                                </View>
                                <View
                                    style={[
                                        styles.br,
                                        { flexGrow: 0, flexBasis: 15 },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            {
                                                color: "#363636",
                                                lineHeight: 0,
                                                textAlign: "center",
                                                marginVertical: "auto",
                                            },
                                        ]}
                                    >
                                        {emp.trainings["SN"]}
                                    </Text>
                                </View>
                                <View
                                    style={[
                                        styles.br,
                                        { flexGrow: 0, flexBasis: 10 },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            {
                                                color: "#363636",
                                                lineHeight: 0,
                                                textAlign: "center",
                                                marginVertical: "auto",
                                            },
                                        ]}
                                    >
                                        {emp.trainings["E"]}
                                    </Text>
                                </View>
                                <View style={[{ flexGrow: 0, flexBasis: 15 }]}>
                                    <Text
                                        style={[
                                            {
                                                color: "#363636",
                                                lineHeight: 0,
                                                textAlign: "center",
                                                marginVertical: "auto",
                                            },
                                        ]}
                                    >
                                        {emp.trainings["TT"]}
                                    </Text>
                                </View>
                            </View>

                            <View
                                style={[
                                    styles.br,
                                    emp.status === "active"
                                        ? styles.bgSuccess
                                        : emp.status === "inactive"
                                        ? styles.bgWarning
                                        : styles.bgError,
                                    {
                                        flexGrow: 0,
                                        paddingVertical: 4,
                                        flexBasis: 40,
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
                                            textAlign: "center",
                                        },
                                    ]}
                                >
                                    {emp.status}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

                <View
                    style={[
                        styles.mt16,
                        {
                            flexDirection: "row",
                            alignSelf: "flex-end",
                            maxWidth: "60%",
                        },
                    ]}
                    fixed
                >
                    <View style={styles.mr16}>
                        <Text style={[styles.subtitle2]}>Legend</Text>
                    </View>
                    <View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <Text style={[styles.subtitle3, styles.w1]}>
                                Safety Foundation
                            </Text>
                            <Text style={[styles.subtitle3, { width: 15 }]}>
                                -
                            </Text>
                            <Text style={[styles.subtitle3, { width: 35 }]}>
                                SF
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <Text style={[styles.subtitle3, styles.w1]}>
                                Working at Height, Fall Protection & Rescue
                            </Text>
                            <Text style={[styles.subtitle3, { width: 15 }]}>
                                -
                            </Text>
                            <Text style={[styles.subtitle3, { width: 35 }]}>
                                WHFPR
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <Text style={[styles.subtitle3, styles.w1]}>
                                Scaffolding Technician Erection, Dismantling &
                                Modification
                            </Text>
                            <Text style={[styles.subtitle3, { width: 15 }]}>
                                -
                            </Text>
                            <Text style={[styles.subtitle3, { width: 35 }]}>
                                STEDM
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <Text style={[styles.subtitle3, styles.w1]}>
                                Confined Space Entry & Rescue Level 3
                            </Text>
                            <Text style={[styles.subtitle3, { width: 15 }]}>
                                -
                            </Text>
                            <Text style={[styles.subtitle3, { width: 35 }]}>
                                CSER-L3
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <Text style={[styles.subtitle3, styles.w1]}>
                                Banksman Slinger
                            </Text>
                            <Text style={[styles.subtitle3, { width: 15 }]}>
                                -
                            </Text>
                            <Text style={[styles.subtitle3, { width: 35 }]}>
                                BS
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <Text style={[styles.subtitle3, styles.w1]}>
                                PA
                            </Text>
                            <Text style={[styles.subtitle3, { width: 15 }]}>
                                -
                            </Text>
                            <Text style={[styles.subtitle3, { width: 35 }]}>
                                PA
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <Text style={[styles.subtitle3, styles.w1]}>
                                DDT
                            </Text>
                            <Text style={[styles.subtitle3, { width: 15 }]}>
                                -
                            </Text>
                            <Text style={[styles.subtitle3, { width: 35 }]}>
                                DDT
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <Text style={[styles.subtitle3, styles.w1]}>
                                Fire Fighting
                            </Text>
                            <Text style={[styles.subtitle3, { width: 15 }]}>
                                -
                            </Text>
                            <Text style={[styles.subtitle3, { width: 35 }]}>
                                FF
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <Text style={[styles.subtitle3, styles.w1]}>
                                Soon to Expire
                            </Text>
                            <Text style={[styles.subtitle3, { width: 15 }]}>
                                -
                            </Text>
                            <Text style={[styles.subtitle3, { width: 35 }]}>
                                SN
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <Text style={[styles.subtitle3, styles.w1]}>
                                Expired
                            </Text>
                            <Text style={[styles.subtitle3, { width: 15 }]}>
                                -
                            </Text>
                            <Text style={[styles.subtitle3, { width: 35 }]}>
                                E
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <Text style={[styles.subtitle3, styles.w1]}>
                                Total Trainings
                            </Text>
                            <Text style={[styles.subtitle3, { width: 15 }]}>
                                -
                            </Text>
                            <Text style={[styles.subtitle3, { width: 35 }]}>
                                TT
                            </Text>
                        </View>
                    </View>
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

function SvgCircle({ color = "#f90000" }) {
    return (
        <Svg width="5" height="5">
            <Circle cx={2.5} cy={2.5} r={2.5} fill={color} />
        </Svg>
    );
}
