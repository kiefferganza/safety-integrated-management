import {
    Page,
    View,
    Text,
    Image,
    Document,
    PDFViewer,
} from "@react-pdf/renderer";
import { capitalCase } from "change-case";
import { format } from "date-fns";
import { styles, colors } from "./PDFStyles";
import FileSVG from "@/Components/pdf-svg/FileSVG";
// ----------------------------------------------------------------------

const FORMATTED_DATE = format(new Date(), "MM/dd/yy");
const YEAR = new Date().getFullYear();
const PDF = (props) => (
    <PDFViewer style={{ height: "100%", width: "100%" }}>
        <Document
            onRender={props.rendered}
            title={props.title}
            author={props.author}
            subject={props.description}
        >
            <Page size="A3" style={styles.page}>
                <View
                    style={[
                        styles.mb16,
                        { minHeight: 40, alignItems: "flex-start" },
                    ]}
                    fixed
                >
                    <Image
                        src={route("image", {
                            path: "media/logo/Fiafi-logo.png",
                        })}
                        style={{ height: 40 }}
                    />
                </View>
                <View style={{ textAlign: "center", marginTop: "-30px" }}>
                    <Text style={[styles.h2]}>HSE Inspection Tracker</Text>
                </View>

                <View style={[styles.pl24, styles.pr24]}>
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
                            <View
                                style={[
                                    {
                                        position: "relative",
                                        height: 30,
                                    },
                                ]}
                            >
                                <Image
                                    src={props.info.total.img}
                                    style={{ height: 30, width: 30 }}
                                />
                                <View
                                    style={{
                                        width: 16,
                                        height: 16,
                                        position: "absolute",
                                        left: 7.5,
                                        top: 7.5,
                                    }}
                                >
                                    <FileSVG color={props.info.total.color} />
                                </View>
                            </View>
                            <View style={[styles.pl4]}>
                                <Text style={styles.h6}>Total</Text>
                                <View style={{ flexDirection: "row" }}>
                                    <Text
                                        style={[
                                            styles.bold,
                                            styles.pr4,
                                            { fontSize: 8 },
                                        ]}
                                    >
                                        {props.info.total.value}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 8,
                                            color: "#637381",
                                        }}
                                    >
                                        inspections
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
                            <View
                                style={[{ position: "relative", height: 30 }]}
                            >
                                <Image
                                    src={props.info.submitted.img}
                                    style={{ height: 30, width: 30 }}
                                />
                                <View
                                    style={{
                                        width: 16,
                                        height: 16,
                                        position: "absolute",
                                        left: 7.5,
                                        top: 7,
                                    }}
                                >
                                    <FileSVG
                                        color={props.info.submitted.color}
                                    />
                                </View>
                            </View>
                            <View style={[styles.pl4]}>
                                <Text style={styles.h6}>Submitted</Text>
                                <View style={{ flexDirection: "row" }}>
                                    <Text
                                        style={[
                                            styles.bold,
                                            styles.pr4,
                                            { fontSize: 8 },
                                        ]}
                                    >
                                        {props.info.submitted.value}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 8,
                                            color: "#637381",
                                        }}
                                    >
                                        inspections
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
                            <View
                                style={[{ position: "relative", height: 30 }]}
                            >
                                <Image
                                    src={props.info.review.img}
                                    style={{ height: 30, width: 30 }}
                                />
                                <View
                                    style={{
                                        width: 16,
                                        height: 16,
                                        position: "absolute",
                                        left: 7.5,
                                        top: 7,
                                    }}
                                >
                                    <FileSVG color={props.info.review.color} />
                                </View>
                            </View>
                            <View style={[styles.pl4]}>
                                <Text style={styles.h6}>Review</Text>
                                <View style={{ flexDirection: "row" }}>
                                    <Text
                                        style={[
                                            styles.bold,
                                            styles.pr4,
                                            { fontSize: 8 },
                                        ]}
                                    >
                                        {props.info.review.value}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 8,
                                            color: "#637381",
                                        }}
                                    >
                                        inspections
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
                            <View
                                style={[{ position: "relative", height: 30 }]}
                            >
                                <Image
                                    src={props.info.verify.img}
                                    style={{ height: 30, width: 30 }}
                                />
                                <View
                                    style={{
                                        width: 16,
                                        height: 16,
                                        position: "absolute",
                                        left: 7.5,
                                        top: 7,
                                    }}
                                >
                                    <FileSVG color={props.info.verify.color} />
                                </View>
                            </View>
                            <View style={[styles.pl4]}>
                                <Text style={styles.h6}>Verify & Approve</Text>
                                <View style={{ flexDirection: "row" }}>
                                    <Text
                                        style={[
                                            styles.bold,
                                            styles.pr4,
                                            { fontSize: 8 },
                                        ]}
                                    >
                                        {props.info.verify.value}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 8,
                                            color: "#637381",
                                        }}
                                    >
                                        inspections
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
                                    width: "100%",
                                    justifyContent: "flex-start",
                                },
                            ]}
                        >
                            <View
                                style={[{ position: "relative", height: 30 }]}
                            >
                                <Image
                                    src={props.info.closeout.img}
                                    style={{ height: 30, width: 30 }}
                                />
                                <View
                                    style={{
                                        width: 16,
                                        height: 16,
                                        position: "absolute",
                                        left: 7.5,
                                        top: 7,
                                    }}
                                >
                                    <FileSVG
                                        color={props.info.closeout.color}
                                    />
                                </View>
                            </View>
                            <View style={[styles.pl4]}>
                                <Text style={styles.h6}>Closeout</Text>
                                <View style={{ flexDirection: "row" }}>
                                    <Text
                                        style={[
                                            styles.bold,
                                            styles.pr4,
                                            { fontSize: 8 },
                                        ]}
                                    >
                                        {props.info.closeout.value}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 8,
                                            color: "#637381",
                                        }}
                                    >
                                        inspections
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                <View
                    style={[
                        styles.pl24,
                        styles.pr24,
                        styles.mb16,
                        { width: "100%", alignItems: "flex-end" },
                    ]}
                >
                    <View style={{ width: 228 }}>
                        <View style={styles.mb8}>
                            <Text
                                style={[styles.subtitle2, { color: "#637381" }]}
                            >
                                Status Legend:
                            </Text>
                            <View
                                style={[
                                    styles.mb4,
                                    {
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                    },
                                ]}
                            >
                                <View
                                    style={[
                                        styles.labelOutline,
                                        {
                                            borderColor: colors.warning,
                                            color: colors.warning,
                                        },
                                    ]}
                                >
                                    <Text>I P = In Progress</Text>
                                </View>
                                <View
                                    style={[
                                        styles.labelOutline,
                                        {
                                            borderColor: colors.error,
                                            color: colors.error,
                                        },
                                    ]}
                                >
                                    <Text>W F C = Waiting For Closure</Text>
                                </View>
                                <View
                                    style={[
                                        styles.labelOutline,
                                        {
                                            borderColor: colors.success,
                                            color: colors.success,
                                        },
                                    ]}
                                >
                                    <Text>C = Closed</Text>
                                </View>
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                }}
                            >
                                <View
                                    style={[
                                        styles.labelOutline,
                                        {
                                            borderColor: colors.error,
                                            color: colors.error,
                                        },
                                    ]}
                                >
                                    <Text>F R = For Revision</Text>
                                </View>
                                <View
                                    style={[
                                        styles.labelOutline,
                                        {
                                            borderColor: colors.success,
                                            color: colors.success,
                                        },
                                    ]}
                                >
                                    <Text>A,D, = Active Days</Text>
                                </View>
                                <View
                                    style={[
                                        styles.labelOutline,
                                        {
                                            borderColor: colors.error,
                                            color: colors.error,
                                        },
                                    ]}
                                >
                                    <Text>O.D. = Overdue Days</Text>
                                </View>
                            </View>
                        </View>
                        <View>
                            <Text
                                style={[
                                    styles.subtitle2,
                                    styles.mb4,
                                    { color: "#637381" },
                                ]}
                            >
                                Table Title Legend:
                            </Text>
                            <View
                                style={[
                                    styles.mb4,
                                    {
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                    },
                                ]}
                            >
                                <View
                                    style={[
                                        styles.labelOutline,
                                        {
                                            borderColor: "#4f4f4f",
                                            color: "#4f4f4f",
                                        },
                                    ]}
                                >
                                    <Text>O = Number of Observation</Text>
                                </View>
                                <View
                                    style={[
                                        styles.labelOutline,
                                        {
                                            borderColor: "#4f4f4f",
                                            color: "#4f4f4f",
                                        },
                                    ]}
                                >
                                    <Text>
                                        P = Number of Positive Observation
                                    </Text>
                                </View>
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                }}
                            >
                                <View
                                    style={[
                                        styles.labelOutline,
                                        {
                                            borderColor: "#4f4f4f",
                                            color: "#4f4f4f",
                                            marginRight: 4,
                                        },
                                    ]}
                                >
                                    <Text>
                                        N = Number of Negative Observation
                                    </Text>
                                </View>
                                <View
                                    style={[
                                        styles.labelOutline,
                                        {
                                            borderColor: "#4f4f4f",
                                            color: "#4f4f4f",
                                        },
                                    ]}
                                >
                                    <Text>S = Statuses</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {props.inspections.map((inspection) => (
                    <View
                        key={inspection.id}
                        style={[styles.mb16]}
                        wrap={false}
                    >
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
                                        paddingTop: 2,
                                        paddingBottom: 2,
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
                                    CMS Number
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
                                    Submitted
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
                                        flexBasis: 165,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.bold,
                                        { color: "#363636", lineHeight: 1 },
                                    ]}
                                >
                                    Observation
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
                                    Action
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
                                        flexBasis: 165,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.bold,
                                        { color: "#363636", lineHeight: 1 },
                                    ]}
                                >
                                    Result
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
                                    Verify
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
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.bold,
                                        { color: "#363636", lineHeight: 1 },
                                    ]}
                                >
                                    Date Issued
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
                                        flexBasis: 18,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.bold,
                                        { color: "#363636", lineHeight: 1 },
                                    ]}
                                >
                                    O
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
                                        flexBasis: 18,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.bold,
                                        { color: "#363636", lineHeight: 1 },
                                    ]}
                                >
                                    N
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
                                        flexBasis: 18,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.bold,
                                        { color: "#363636", lineHeight: 1 },
                                    ]}
                                >
                                    P
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.pl4,
                                    styles.br,
                                    {
                                        flexGrow: 1,
                                        paddingTop: 2,
                                        paddingBottom: 2,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.bold,
                                        { color: "#363636", lineHeight: 1 },
                                    ]}
                                >
                                    S
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
                                    {inspection?.form_number}
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.pl4,
                                    styles.br,
                                    {
                                        flexGrow: 0,
                                        paddingTop: 4,
                                        flexBasis: 80,
                                    },
                                ]}
                            >
                                <Text>{inspection?.inspected_by}</Text>
                            </View>
                            <View
                                style={[
                                    styles.br,
                                    {
                                        flexGrow: 0,
                                        flexBasis: 165,
                                    },
                                ]}
                            >
                                {inspection.report_list.observation.map(
                                    (observation, idx) => (
                                        <View
                                            key={idx}
                                            style={[
                                                styles.pl4,
                                                styles.pt4,
                                                idx !==
                                                    inspection.report_list
                                                        .observation.length -
                                                        1 && styles.bm,
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    {
                                                        fontFamily: observation
                                                            ? "Helvetica-Oblique"
                                                            : "Helvetica-BoldOblique",
                                                    },
                                                ]}
                                            >
                                                {observation
                                                    ? `${
                                                          idx + 1
                                                      }. ${observation}`
                                                    : "TBA"}
                                            </Text>
                                        </View>
                                    )
                                )}
                            </View>
                            <View
                                style={[
                                    styles.pl4,
                                    styles.br,
                                    {
                                        flexGrow: 0,
                                        paddingTop: 4,
                                        flexBasis: 80,
                                    },
                                ]}
                            >
                                <Text>{inspection?.reviewer}</Text>
                            </View>
                            <View
                                style={[
                                    styles.br,
                                    {
                                        flexGrow: 0,
                                        flexBasis: 165,
                                    },
                                ]}
                            >
                                {inspection.report_list.result.map(
                                    (result, idx) => (
                                        <View
                                            key={idx}
                                            style={[
                                                styles.pl4,
                                                styles.pt4,
                                                idx !==
                                                    inspection.report_list
                                                        .result.length -
                                                        1 && styles.bm,
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    {
                                                        fontFamily: result
                                                            ? "Helvetica-Oblique"
                                                            : "Helvetica-BoldOblique",
                                                    },
                                                ]}
                                            >
                                                {result
                                                    ? `${idx}. ${result}`
                                                    : "TBA"}
                                            </Text>
                                        </View>
                                    )
                                )}
                            </View>
                            <View
                                style={[
                                    styles.pl4,
                                    styles.br,
                                    {
                                        flexGrow: 0,
                                        paddingTop: 4,
                                        flexBasis: 80,
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
                                        fontFamily: "Helvetica-Oblique",
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
                                    styles.br,
                                    {
                                        flexGrow: 1,
                                    },
                                ]}
                            >
                                <View
                                    style={
                                        inspection.status
                                            ? styles[
                                                  `bg${capitalCase(
                                                      inspection.status
                                                          .classType
                                                  )}`
                                              ]
                                            : {}
                                    }
                                >
                                    <Text
                                        style={[
                                            styles.bold,
                                            {
                                                color: "#fff",
                                                textAlign: "center",
                                                paddingTop: 4,
                                            },
                                        ]}
                                    >
                                        {inspection?.status?.text}
                                    </Text>
                                </View>
                                {(inspection.type === "verify" ||
                                    inspection.type === "review") && (
                                    <View
                                        style={
                                            inspection.status
                                                ? styles[
                                                      `bg${capitalCase(
                                                          inspection.status
                                                              .classType
                                                      )}`
                                                  ]
                                                : {}
                                        }
                                    >
                                        <Text
                                            style={[
                                                styles.bold,
                                                inspection?.dueStatus
                                                    ? styles[
                                                          `bg${capitalCase(
                                                              inspection
                                                                  .dueStatus
                                                                  .classType
                                                          )}`
                                                      ]
                                                    : {},
                                                {
                                                    color: "#fff",
                                                    textAlign: "center",
                                                    paddingTop: 4,
                                                },
                                            ]}
                                        >
                                            {inspection?.dueStatus?.text}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
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
    </PDFViewer>
);

export default PDF;
