export const PDF2 = () => {
    const inspection = {
        inspection_id: 1019,
        employee_id: 1,
        reviewer_id: 79,
        verifier_id: 32,
        accompanied_by: "dqwd",
        form_number: "CN103-FG-HSE-CSRP-000555",
        status: {
            code: 1,
            classType: "warning",
            text: "I P",
            tooltip: "In Progress",
        },
        revision_no: 0,
        location: "Mushrif Shamiya",
        contract_no: "103018",
        inspected_by: "Rryanneal Respondo",
        inspected_date: "30-Jan-2024",
        inspected_time: "08:00",
        avg_score: "1.03",
        date_issued: "2024-01-03",
        date_due: "2024-01-31",
        reviewer: "Ali Salih raheem",
        verifier: "Mazin Nagem abdullah",
        report_list: [
            {
                list_id: 36875,
                inspection_id: 1019,
                employee_id: 1,
                table_name: null,
                ref_num: 4,
                section_title:
                    "START Cards completed for all task taking place?",
                ref_score: 2,
                photo_before: null,
                findings: "qwd",
                photo_after: null,
                action_taken: null,
                item_status: null,
                date_submitted: "2024-01-03",
                is_deleted: 0,
                close_on: null,
            },
        ],
        id: 1019,
        type: "submitted",
        totalObservation: 30,
        positiveObservation: 29,
        negativeObservation: 1,
    };
    return (
        <Document title="Inspection Report PDF">
            <Page size="A4" style={styles.page}>
                <View
                    style={[styles.mb16, styles.mt8, { position: "relative" }]}
                >
                    <Image
                        source="/logo/Fiafi-logo.png"
                        style={{
                            height: 32,
                            padding: 2,
                            position: "absolute",
                            top: -12,
                            bottom: 0,
                            left: 0,
                        }}
                    />
                    <Text style={[styles.h4, { textAlign: "center" }]}>
                        HSE Inspection Report List
                    </Text>
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
                            {/* <Text>{inspection?.form_number}</Text> */}
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
                            {/* <Text>{inspection?.inspected_by}</Text> */}
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
                            {/* <Text>{inspection?.reviewer}</Text> */}
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
                            {/* <Text>{inspection?.verifier}</Text> */}
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
                            <Text>
                                {/* {inspection?.date_issued
                                  ? fDate(inspection.date_issued)
                                  : ""} */}
                            </Text>
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
                            {/* <Text>{inspection?.totalObservation}</Text> */}
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
                            {/* <Text>{inspection?.negativeObservation}</Text> */}
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
                            {/* <Text>{inspection?.positiveObservation}</Text> */}
                        </View>
                        <View
                            style={[
                                styles.pl4,
                                styles.br,
                                {
                                    flexGrow: 1,
                                    paddingTop: 4,
                                    fontSize: "700",
                                },
                            ]}
                        >
                            <Text>I P</Text>
                        </View>
                    </View>

                    <View>
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
                                <Text style={styles.bold}>Ref #: 4</Text>
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
                                    Title: START Cards completed for all task
                                    taking place?
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
                                    Location: Mushrif Shamiya
                                </Text>
                            </View>
                        </View>

                        <View>
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
                                            flexGrow: 1,
                                            paddingTop: 4,
                                            flexBasis: "50%",
                                        },
                                    ]}
                                >
                                    <Text style={styles.bold}>Findings</Text>
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
                                    <Text style={styles.bold}>Action</Text>
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
                                        styles.pr4,
                                        styles.br,
                                        {
                                            flexGrow: 1,
                                            paddingTop: 4,
                                            flexBasis: "50%",
                                        },
                                    ]}
                                >
                                    <Text style={styles.bold}>
                                        Lorem ipsum dolor sit amet consectetur
                                        adipisicing elit. Ratione illum libero
                                        voluptate odit quia quae culpa soluta
                                        consequatur quas itaque alias voluptatum
                                        repudiandae, totam laborum aliquid
                                        facere et laboriosam ex?
                                    </Text>
                                </View>
                                <View
                                    style={[
                                        styles.pl4,
                                        styles.pr4,
                                        styles.br,
                                        {
                                            flexGrow: 1,
                                            paddingTop: 4,
                                            flexBasis: "50%",
                                        },
                                    ]}
                                >
                                    <Text style={styles.bold}>
                                        Lorem ipsum dolor sit amet consectetur
                                        adipisicing elit. Ipsam magnam, libero,
                                        exercitationem fugiat
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={[styles.gridContainer, styles.footer]}>
                    <View style={styles.col4}>
                        <Text
                            style={[
                                styles.bold,
                                { fontSize: 9, textAlign: "left" },
                            ]}
                        >
                            Uncontrolled Copy if Printed
                        </Text>
                    </View>
                    <View style={styles.col6}>
                        <Text
                            style={[
                                styles.bold,
                                { fontSize: 9, textAlign: "center" },
                            ]}
                        >
                            &copy; FIAFI Group Company,{" "}
                            {new Date().getFullYear()}. All Rights Reserved.
                        </Text>
                    </View>
                    <View style={styles.col4}>
                        <Text
                            style={[
                                styles.bold,
                                { fontSize: 9, textAlign: "right" },
                            ]}
                        >
                            {format(new Date(), "MM/dd/yy")} Page 1 / 1
                        </Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};
