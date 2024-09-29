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
    const { employees = [], type = "thirdParty" } = props;

    const getLengthByStatus = (status) =>
        employees.filter((item) => item.status === status).length;

    const getUnassignedEmployeeLength = () =>
        employees.filter((item) => !item.user_id).length;

    const trainings =
        type === "thirdParty"
            ? employees[0]?.thirdPartyTrainings
            : type === "inHouse"
            ? employees[0]?.internalTrainings
            : employees[0]?.clientTrainings;
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
                    <Text style={[styles.h2]}>
                        Employee Training Tracker Report
                    </Text>
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
                                        {employees.length}
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
                                        {getLengthByStatus("active")}
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
                                        {getLengthByStatus("inactive")}
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
                                        {getUnassignedEmployeeLength()}
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

                <TableHeader trainings={trainings} type={type} />

                <View>
                    {employees.map((emp, idx) => (
                        <TableRow
                            key={emp.employee_id}
                            emp={emp}
                            idx={idx}
                            type={type}
                        />
                    ))}
                </View>

                <Legend trainings={trainings} />

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

function TableHeader({ trainings = {}, type = "thirdParty" }) {
    return (
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
                        flexBasis: 18,
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
                        flexGrow: 0.33,
                        flexBasis: 85,
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
                        flexGrow: 0.33,
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
                        flexGrow: 0.33,
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
                        Department
                    </Text>
                </View>
            </View>
            <View
                style={[
                    styles.br,
                    {
                        flexGrow: 0,
                        flexBasis: 50,
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
            <View style={[styles.br]}>
                <View
                    style={[
                        {
                            paddingBottom: 4,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.bold,
                            {
                                color: "#2a2a2a",
                                lineHeight: 1,
                                paddingTop: 2,
                                textAlign: "center",
                            },
                        ]}
                    >
                        {type === "thirdParty"
                            ? "Third Party Training"
                            : type === "inHouse"
                            ? "In House Training"
                            : "Client Training"}
                    </Text>
                </View>
                <View style={[{ flexDirection: "row" }, styles.bt]}>
                    {Object.values(trainings).map((t) => (
                        <View
                            style={[styles.br, { paddingHorizontal: 1.5 }]}
                            key={t.acronym}
                        >
                            <Text
                                style={[
                                    styles.bold,
                                    {
                                        fontSize: 6.5,
                                        color: "#4c4c54",
                                        lineHeight: 1,
                                        textAlign: "center",
                                        paddingTop: 1,
                                        paddingBottom: 2,
                                    },
                                ]}
                            >
                                {t.acronym}
                            </Text>
                        </View>
                    ))}
                    <View style={[styles.br, { flexGrow: 0, flexBasis: 15 }]}>
                        <Text
                            style={[
                                styles.bold,
                                {
                                    fontSize: 6.5,
                                    color: "#4c4c54",
                                    lineHeight: 1,
                                    textAlign: "center",
                                    paddingTop: 1,
                                    paddingBottom: 2,
                                },
                            ]}
                        >
                            SN
                        </Text>
                    </View>
                    <View style={[styles.br, { flexGrow: 0, flexBasis: 10 }]}>
                        <Text
                            style={[
                                styles.bold,
                                {
                                    fontSize: 6.5,
                                    color: "#4c4c54",
                                    lineHeight: 1,
                                    textAlign: "center",
                                    paddingTop: 1,
                                    paddingBottom: 2,
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
                                    lineHeight: 1,
                                    textAlign: "center",
                                    paddingTop: 1,
                                    paddingBottom: 2,
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
    );
}

function TableRow({ emp, idx, type = "thirdParty" }) {
    const trainings = Object.values(
        type === "thirdParty"
            ? emp.thirdPartyTrainings
            : type === "inHouse"
            ? emp.internalTrainings
            : emp.clientTrainings
    );
    const trainingStatus =
        emp.trainings[
            type === "thirdParty"
                ? "external"
                : type === "inHouse"
                ? "internal"
                : "client"
        ];
    return (
        <View
            style={[styles.tableRow, styles.w1, styles.bl, { padding: 0 }]}
            wrap={false}
        >
            <View
                style={[
                    styles.br,
                    {
                        flexGrow: 0,
                        paddingVertical: 4,
                        flexBasis: 18,
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
                        flexGrow: 0.33,
                        paddingVertical: 4,
                        flexBasis: 85,
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
                        flexGrow: 0.33,
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
                        flexGrow: 0.33,
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
                        paddingRight: 1,
                        flexBasis: 50,
                    },
                ]}
            >
                <Text style={[{ color: "#363636", lineHeight: 1 }]}>
                    {emp.company_name ?? ""}
                </Text>
            </View>
            <View
                style={[
                    styles.br,
                    {
                        flexDirection: "row",
                    },
                ]}
            >
                {trainings.map((t) => (
                    <View
                        style={[
                            styles.br,
                            {
                                paddingHorizontal: 1.5,
                                position: "relative",
                            },
                        ]}
                        key={t.acronym}
                    >
                        <Text
                            style={[
                                styles.bold,
                                {
                                    fontSize: 6.5,
                                    paddingTop: 1,
                                    lineHeight: 1,
                                    textAlign: "center",
                                    opacity: 0,
                                },
                            ]}
                        >
                            {t.acronym}
                        </Text>
                        {(t.sn || t.active || t.expired) && (
                            <SvgCircle
                                color={
                                    t.sn
                                        ? "febe00"
                                        : t.active
                                        ? "#02a94d"
                                        : undefined
                                }
                                style={{
                                    position: "absolute",
                                    top: "39%",
                                    left: "39%",
                                }}
                            />
                        )}
                    </View>
                ))}
                <View style={[styles.br, { flexGrow: 0, flexBasis: 15 }]}>
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
                        {trainingStatus["SN"]}
                    </Text>
                </View>
                <View style={[styles.br, { flexGrow: 0, flexBasis: 10 }]}>
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
                        {trainingStatus["E"]}
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
                        {trainingStatus["TT"]}
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
    );
}

function Legend({ trainings = {} }) {
    return (
        <View
            style={[
                styles.mt16,
                {
                    flexDirection: "row",
                    alignSelf: "flex-end",
                    maxWidth: "60%",
                },
            ]}
        >
            <View style={styles.mr16}>
                <Text style={[styles.subtitle2]}>Legend</Text>
            </View>
            <View>
                {Object.values(trainings).map((t) => (
                    <View
                        key={t.acronym}
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text style={[styles.subtitle3, styles.w1]}>
                            {t.name}
                        </Text>
                        <Text style={[styles.subtitle3, { width: 15 }]}>-</Text>
                        <Text style={[styles.subtitle3, { width: 35 }]}>
                            {t.acronym}
                        </Text>
                    </View>
                ))}
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <Text style={[styles.subtitle3, styles.w1]}>
                        Soon to Expire
                    </Text>
                    <Text style={[styles.subtitle3, { width: 15 }]}>-</Text>
                    <Text style={[styles.subtitle3, { width: 35 }]}>SN</Text>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <Text style={[styles.subtitle3, styles.w1]}>Expired</Text>
                    <Text style={[styles.subtitle3, { width: 15 }]}>-</Text>
                    <Text style={[styles.subtitle3, { width: 35 }]}>E</Text>
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
                    <Text style={[styles.subtitle3, { width: 15 }]}>-</Text>
                    <Text style={[styles.subtitle3, { width: 35 }]}>TT</Text>
                </View>
            </View>
        </View>
    );
}

function SvgCircle({ color = "#f90000", style = {} }) {
    return (
        <Svg width="5" height="5" style={style}>
            <Circle cx={2.5} cy={2.5} r={2.5} fill={color} />
        </Svg>
    );
}
