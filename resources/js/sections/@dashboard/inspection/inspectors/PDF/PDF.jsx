import { Page, View, Text, Image, Document } from "@react-pdf/renderer";
import styles from "./stylesPDF";
import { format } from "date-fns";

const data = [
    {
        user_id: 102,
        employee_id: 794,
        firstname: "Jaafar Mahmood",
        middlename: ".",
        lastname: "Shakir",
        email: "tbc@tbcdhjbctjncgjbvggasdf.com",
        phone_no: "N/A",
        date_created: "2023-12-07 19:41:39",
        position: "Safety Officer ",
        department: "HSE Department",
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 9,
        profile: null,
        fullname: "Jaafar Mahmood Shakir",
        user: {
            user_id: 102,
            media: [],
        },
        id: 794,
        status: "active",
    },
    {
        user_id: 100,
        employee_id: 793,
        firstname: "Muhi Ismael",
        middlename: ".",
        lastname: "Muhi",
        email: "tbckuykygfuyfiuyf@tbc.com",
        phone_no: "N/A",
        date_created: "2023-12-04 05:17:53",
        position: "Safety Officer ",
        department: "HSE Department",
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 6,
        profile: null,
        fullname: "Muhi Ismael Muhi",
        user: {
            user_id: 100,
            media: [],
        },
        id: 793,
        status: "active",
    },
    {
        user_id: 101,
        employee_id: 792,
        firstname: "Wael Mohammed",
        middlename: ".",
        lastname: "Hadi",
        email: "tbcsdfgshsfghsfggt@tbc.com",
        phone_no: "N/A",
        date_created: "2023-12-03 18:39:18",
        position: "Safety Officer ",
        department: "HSE Department",
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 3,
        profile: null,
        fullname: "Wael Mohammed Hadi",
        user: {
            user_id: 101,
            media: [],
        },
        id: 792,
        status: "active",
    },
    {
        user_id: 98,
        employee_id: 745,
        firstname: "Ahmed",
        middlename: ".",
        lastname: "Nadheer Abdulwahid",
        email: "tba@tshsjsbdhsnxba.com",
        phone_no: "N/A",
        date_created: "2023-10-09 20:17:36",
        position: "PA",
        department: "HSE Department",
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 9,
        profile: null,
        fullname: "Ahmed Nadheer Abdulwahid",
        user: {
            user_id: 98,
            media: [],
        },
        id: 745,
        status: "active",
    },
    {
        user_id: 97,
        employee_id: 744,
        firstname: "Ahmed",
        middlename: ".",
        lastname: "Mohammed Khamees",
        email: "tbc@tbcsdfertyghjhk.com",
        phone_no: "N/A",
        date_created: "2023-10-04 17:29:57",
        position: "PA",
        department: "HSE Department",
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 5,
        profile: null,
        fullname: "Ahmed Mohammed Khamees",
        user: {
            user_id: 97,
            media: [],
        },
        id: 744,
        status: "active",
    },
    {
        user_id: 96,
        employee_id: 743,
        firstname: "Hassan",
        middlename: ".",
        lastname: "Khalaf Abdalla",
        email: "tbc@tbkjhuytnbfhgdc.com",
        phone_no: "N/A",
        date_created: "2023-09-27 17:22:43",
        position: "PA",
        department: "HSE Department",
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 20,
        profile: {
            thumbnail:
                "http://127.0.0.1:8000/image/user/c3ea9f3f8f97ba96f88be73b59fa6b37/3.jpg?w=40&h=40&fit=crop",
        },
        fullname: "Hassan Khalaf Abdalla",
        user: {
            user_id: 96,
            media: [
                {
                    id: 930,
                    model_type: "App\\Models\\User",
                    model_id: 96,
                    uuid: "e92a8246-9aa6-4f1a-9332-a6a5c7cbd230",
                    collection_name: "profile",
                    name: "3",
                    file_name: "3.jpg",
                    mime_type: "image/jpeg",
                    disk: "public",
                    conversions_disk: "public",
                    size: 359732,
                    manipulations: [],
                    custom_properties: {
                        primary: true,
                    },
                    generated_conversions: [],
                    responsive_images: [],
                    order_column: 1,
                    created_at: "2023-10-14T18:57:54.000000Z",
                    updated_at: "2023-10-14T18:57:54.000000Z",
                    original_url:
                        "http://127.0.0.1:8000/storage/user/c3ea9f3f8f97ba96f88be73b59fa6b37/3.jpg",
                    preview_url: "",
                },
            ],
        },
        id: 743,
        status: "active",
    },
    {
        user_id: 93,
        employee_id: 716,
        firstname: "Haider Alaa",
        middlename: ".",
        lastname: "Jameel",
        email: "tbc@tbczxmngjkiuytff.com",
        phone_no: "N/A",
        date_created: "2023-09-15 15:54:01",
        position: "PA",
        department: "HSE Department",
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 5,
        profile: {
            thumbnail:
                "http://127.0.0.1:8000/image/user/5ae818de79d8d486bd78a6f4c6ee11ea/IMG_20230220_103012.jpg?w=40&h=40&fit=crop",
        },
        fullname: "Haider Alaa Jameel",
        user: {
            user_id: 93,
            media: [
                {
                    id: 738,
                    model_type: "App\\Models\\User",
                    model_id: 93,
                    uuid: "d7a12741-dfa8-459a-b7dc-69da3e5fa17e",
                    collection_name: "profile",
                    name: "IMG_20230220_103012",
                    file_name: "IMG_20230220_103012.jpg",
                    mime_type: "image/jpeg",
                    disk: "public",
                    conversions_disk: "public",
                    size: 1607665,
                    manipulations: [],
                    custom_properties: {
                        primary: true,
                    },
                    generated_conversions: [],
                    responsive_images: [],
                    order_column: 2,
                    created_at: "2023-09-23T22:23:27.000000Z",
                    updated_at: "2023-09-23T22:23:27.000000Z",
                    original_url:
                        "http://127.0.0.1:8000/storage/user/5ae818de79d8d486bd78a6f4c6ee11ea/IMG_20230220_103012.jpg",
                    preview_url: "",
                },
            ],
        },
        id: 716,
        status: "active",
    },
    {
        user_id: 94,
        employee_id: 715,
        firstname: "Mohammed",
        middlename: ".",
        lastname: "Hussain Hassan",
        email: "tbcmkjgerfdsd@tbc.com",
        phone_no: "N/A",
        date_created: "2023-09-15 15:50:48",
        position: "Safety Officer ",
        department: "HSE Department",
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 30,
        profile: {
            thumbnail:
                "http://127.0.0.1:8000/image/user/34c8e7b188f9531f213276047ff73bbc/82413266_787162695119836_5375388270886649856_n.jpg?w=40&h=40&fit=crop",
        },
        fullname: "Mohammed Hussain Hassan",
        user: {
            user_id: 94,
            media: [
                {
                    id: 912,
                    model_type: "App\\Models\\User",
                    model_id: 94,
                    uuid: "090f504d-58ea-4a2a-b391-f3170cc0e02a",
                    collection_name: "profile",
                    name: "82413266_787162695119836_5375388270886649856_n",
                    file_name:
                        "82413266_787162695119836_5375388270886649856_n.jpg",
                    mime_type: "image/jpeg",
                    disk: "public",
                    conversions_disk: "public",
                    size: 60259,
                    manipulations: [],
                    custom_properties: {
                        primary: true,
                    },
                    generated_conversions: [],
                    responsive_images: [],
                    order_column: 1,
                    created_at: "2023-10-11T23:59:26.000000Z",
                    updated_at: "2023-10-11T23:59:26.000000Z",
                    original_url:
                        "http://127.0.0.1:8000/storage/user/34c8e7b188f9531f213276047ff73bbc/82413266_787162695119836_5375388270886649856_n.jpg",
                    preview_url: "",
                },
            ],
        },
        id: 715,
        status: "active",
    },
    {
        user_id: 92,
        employee_id: 713,
        firstname: "Abbas",
        middlename: ".",
        lastname: "Abdulhussein",
        email: "tbc@tbcasfgjiyrw.com",
        phone_no: "N/A",
        date_created: "2023-09-14 19:04:41",
        position: "Safety Officer ",
        department: "HSE Department",
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 1,
        profile: null,
        fullname: "Abbas Abdulhussein",
        user: {
            user_id: 92,
            media: [],
        },
        id: 713,
        status: "active",
    },
    {
        user_id: 91,
        employee_id: 712,
        firstname: "Ali",
        middlename: ".",
        lastname: "Salman",
        email: "tbc@asghuyrtgfdstbc.com",
        phone_no: "N/A",
        date_created: "2023-09-14 19:03:12",
        position: "PA",
        department: "HSE Department",
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 10,
        profile: null,
        fullname: "Ali Salman",
        user: {
            user_id: 91,
            media: [],
        },
        id: 712,
        status: "active",
    },
    {
        user_id: 90,
        employee_id: 711,
        firstname: "Murtadha",
        middlename: " ",
        lastname: "Saleem",
        email: "tbc@ahgfsawerttbc.com",
        phone_no: "N/A",
        date_created: "2023-09-14 19:01:57",
        position: "PA",
        department: "HSE Department",
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 13,
        profile: {
            thumbnail:
                "http://127.0.0.1:8000/image/user/f38866e45190406dda9ac983f38c04b4/3B1C1F48-CE0A-4CDA-95ED-7A7B33EB1479.jpeg?w=40&h=40&fit=crop",
        },
        fullname: "Murtadha Saleem",
        user: {
            user_id: 90,
            media: [
                {
                    id: 1040,
                    model_type: "App\\Models\\User",
                    model_id: 90,
                    uuid: "ebe704ef-1b1a-4a26-b0eb-ba6d9fed1349",
                    collection_name: "profile",
                    name: "3B1C1F48-CE0A-4CDA-95ED-7A7B33EB1479",
                    file_name: "3B1C1F48-CE0A-4CDA-95ED-7A7B33EB1479.jpeg",
                    mime_type: "image/jpeg",
                    disk: "public",
                    conversions_disk: "public",
                    size: 2984513,
                    manipulations: [],
                    custom_properties: {
                        primary: true,
                    },
                    generated_conversions: [],
                    responsive_images: [],
                    order_column: 1,
                    created_at: "2023-10-28T07:12:10.000000Z",
                    updated_at: "2023-10-28T07:12:10.000000Z",
                    original_url:
                        "http://127.0.0.1:8000/storage/user/f38866e45190406dda9ac983f38c04b4/3B1C1F48-CE0A-4CDA-95ED-7A7B33EB1479.jpeg",
                    preview_url: "",
                },
            ],
        },
        id: 711,
        status: "active",
    },
    {
        user_id: 89,
        employee_id: 710,
        firstname: "Mohammed",
        middlename: ".",
        lastname: "Hassan",
        email: "tbczcbnjhtyu@tbc.com",
        phone_no: "N/A",
        date_created: "2023-09-14 19:00:33",
        position: "PA",
        department: "HSE Department",
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 28,
        profile: {
            thumbnail:
                "http://127.0.0.1:8000/image/user/305f7a65079d7e10be44424df8b75a02/Screenshot_20200426_181251_com.whatsapp.jpg?w=40&h=40&fit=crop",
        },
        fullname: "Mohammed Hassan",
        user: {
            user_id: 89,
            media: [
                {
                    id: 1688,
                    model_type: "App\\Models\\User",
                    model_id: 89,
                    uuid: "20bf29fe-2a2e-4466-857f-7a834b6b1893",
                    collection_name: "profile",
                    name: "Screenshot_20200426_181251_com.whatsapp",
                    file_name: "Screenshot_20200426_181251_com.whatsapp.jpg",
                    mime_type: "image/jpeg",
                    disk: "public",
                    conversions_disk: "public",
                    size: 557692,
                    manipulations: [],
                    custom_properties: {
                        primary: true,
                    },
                    generated_conversions: [],
                    responsive_images: [],
                    order_column: 1,
                    created_at: "2024-02-27T02:49:07.000000Z",
                    updated_at: "2024-02-27T02:49:07.000000Z",
                    original_url:
                        "http://127.0.0.1:8000/storage/user/305f7a65079d7e10be44424df8b75a02/Screenshot_20200426_181251_com.whatsapp.jpg",
                    preview_url: "",
                },
            ],
        },
        id: 710,
        status: "active",
    },
    {
        user_id: 88,
        employee_id: 709,
        firstname: "Jabbar",
        middlename: ".",
        lastname: "Ali",
        email: "tbc@tbzsdrfvcsfec.com",
        phone_no: "N/A",
        date_created: "2023-09-14 18:58:51",
        position: "PA",
        department: "HSE Department",
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 14,
        profile: null,
        fullname: "Jabbar Ali",
        user: {
            user_id: 88,
            media: [],
        },
        id: 709,
        status: "active",
    },
    {
        user_id: 87,
        employee_id: 704,
        firstname: "Muntadhar",
        middlename: ".",
        lastname: "Qusai",
        email: "tbc@tbcmnbhhjkiuyt.com",
        phone_no: "770-700-6288",
        date_created: "2023-08-22 13:47:49",
        position: "PA/Safety Officer",
        department: "HSE Department",
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 60,
        profile: {
            thumbnail:
                "http://127.0.0.1:8000/image/user/064d063ef5feeda3902193163c5c6e77/IMG_20230911_200248_850.jpg?w=40&h=40&fit=crop",
        },
        fullname: "Muntadhar Qusai",
        user: {
            user_id: 87,
            media: [
                {
                    id: 649,
                    model_type: "App\\Models\\User",
                    model_id: 87,
                    uuid: "87c0e32f-4ab9-4b66-af16-afd3cef1840d",
                    collection_name: "profile",
                    name: "IMG_20230911_200248_850",
                    file_name: "IMG_20230911_200248_850.jpg",
                    mime_type: "image/jpeg",
                    disk: "public",
                    conversions_disk: "public",
                    size: 93848,
                    manipulations: [],
                    custom_properties: {
                        primary: true,
                    },
                    generated_conversions: [],
                    responsive_images: [],
                    order_column: 1,
                    created_at: "2023-09-12T01:03:01.000000Z",
                    updated_at: "2023-09-12T01:03:01.000000Z",
                    original_url:
                        "http://127.0.0.1:8000/storage/user/064d063ef5feeda3902193163c5c6e77/IMG_20230911_200248_850.jpg",
                    preview_url: "",
                },
            ],
        },
        id: 704,
        status: "active",
    },
    {
        user_id: 85,
        employee_id: 687,
        firstname: "Asaad",
        middlename: ".",
        lastname: "Jawad",
        email: "tbcasdqwert@tbc.com",
        phone_no: "N/A",
        date_created: "2023-07-28 10:24:12",
        position: "Safety Officer ",
        department: "HSE Department",
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 8,
        profile: null,
        fullname: "Asaad Jawad",
        user: {
            user_id: 85,
            media: [],
        },
        id: 687,
        status: "active",
    },
    {
        user_id: 86,
        employee_id: 686,
        firstname: "Mohammed",
        middlename: ".",
        lastname: "Kamil",
        email: "tbc@asdqwezxctbc.com",
        phone_no: "N/A",
        date_created: "2023-07-28 10:23:14",
        position: "PA",
        department: "HSE Department",
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 22,
        profile: null,
        fullname: "Mohammed Kamil",
        user: {
            user_id: 86,
            media: [],
        },
        id: 686,
        status: "active",
    },
    {
        user_id: 84,
        employee_id: 685,
        firstname: "Mustafa",
        middlename: ".",
        lastname: "Chasib",
        email: "tbc@tbasdasdqwec.com",
        phone_no: "N/A",
        date_created: "2023-07-28 10:22:11",
        position: "Safety Officer ",
        department: "HSE Department",
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 1,
        profile: {
            thumbnail:
                "http://127.0.0.1:8000/image/user/6d3ee7244989442040f22be49a9e9999/IMG_0534.jpeg?w=40&h=40&fit=crop",
        },
        fullname: "Mustafa Chasib",
        user: {
            user_id: 84,
            media: [
                {
                    id: 1485,
                    model_type: "App\\Models\\User",
                    model_id: 84,
                    uuid: "89307d0f-8fd1-46a5-8957-c9dc686ffdcb",
                    collection_name: "profile",
                    name: "IMG_0534",
                    file_name: "IMG_0534.jpeg",
                    mime_type: "image/jpeg",
                    disk: "public",
                    conversions_disk: "public",
                    size: 339069,
                    manipulations: [],
                    custom_properties: {
                        primary: true,
                    },
                    generated_conversions: [],
                    responsive_images: [],
                    order_column: 1,
                    created_at: "2023-12-15T06:21:42.000000Z",
                    updated_at: "2023-12-15T06:21:42.000000Z",
                    original_url:
                        "http://127.0.0.1:8000/storage/user/6d3ee7244989442040f22be49a9e9999/IMG_0534.jpeg",
                    preview_url: "",
                },
            ],
        },
        id: 685,
        status: "active",
    },
    {
        user_id: 83,
        employee_id: 684,
        firstname: "Hussain",
        middlename: ".",
        lastname: "Abdulkareem",
        email: "tbc@asdasdasdtbc.com",
        phone_no: "N/A",
        date_created: "2023-07-28 10:21:04",
        position: "Safety Officer ",
        department: "HSE Department",
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 1,
        profile: null,
        fullname: "Hussain Abdulkareem",
        user: {
            user_id: 83,
            media: [],
        },
        id: 684,
        status: "active",
    },
    {
        user_id: 75,
        employee_id: 646,
        firstname: "Mohammed",
        middlename: ".",
        lastname: "Ridha Farhan",
        email: "tbc@tbsfgdhsc.com",
        phone_no: "781-622-8823",
        date_created: "2023-06-16 18:13:32",
        position: "Safety Officer ",
        department: "HSE Department",
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 20,
        profile: {
            thumbnail:
                "http://127.0.0.1:8000/image/user/5edc08bc3fdd5813ab8f396bd21e583b/Screenshot_%D9%A2%D9%A0%D9%A2%D9%A2-%D9%A1%D9%A2-%D9%A2%D9%A1-%D9%A0%D9%A0-%D9%A0%D9%A9-%D9%A4%D9%A7-%D9%A3%D9%A4%D9%A2_com.miui.gallery.jpg?w=40&h=40&fit=crop",
        },
        fullname: "Mohammed Ridha Farhan",
        user: {
            user_id: 75,
            media: [
                {
                    id: 499,
                    model_type: "App\\Models\\User",
                    model_id: 75,
                    uuid: "b6d80c4e-8784-482c-a2df-e76d1dfbb866",
                    collection_name: "profile",
                    name: "Screenshot_٢٠٢٢-١٢-٢١-٠٠-٠٩-٤٧-٣٤٢_com.miui.gallery",
                    file_name:
                        "Screenshot_٢٠٢٢-١٢-٢١-٠٠-٠٩-٤٧-٣٤٢_com.miui.gallery.jpg",
                    mime_type: "image/jpeg",
                    disk: "public",
                    conversions_disk: "public",
                    size: 745694,
                    manipulations: [],
                    custom_properties: {
                        primary: true,
                    },
                    generated_conversions: [],
                    responsive_images: [],
                    order_column: 1,
                    created_at: "2023-07-07T05:09:38.000000Z",
                    updated_at: "2023-07-07T05:09:38.000000Z",
                    original_url:
                        "http://127.0.0.1:8000/storage/user/5edc08bc3fdd5813ab8f396bd21e583b/Screenshot_٢٠٢٢-١٢-٢١-٠٠-٠٩-٤٧-٣٤٢_com.miui.gallery.jpg",
                    preview_url: "",
                },
            ],
        },
        id: 646,
        status: "active",
    },
    {
        user_id: 74,
        employee_id: 631,
        firstname: "Hassan",
        middlename: ".",
        lastname: "Qasim Jabor",
        email: "tbcsftntfuntf@tbc.com",
        phone_no: "781-303-2966",
        date_created: "2023-06-06 18:19:41",
        position: "Safety Officer ",
        department: "HSE Department",
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 31,
        profile: null,
        fullname: "Hassan Qasim Jabor",
        user: {
            user_id: 74,
            media: [],
        },
        id: 631,
        status: "active",
    },
    {
        user_id: 82,
        employee_id: 450,
        firstname: "Ahmed",
        middlename: ".",
        lastname: "Ibrahim Hassan",
        email: "ahmed7881@fiafigroup.com",
        phone_no: "N/A",
        date_created: "2022-11-28 20:49:50",
        position: "laborer",
        department: null,
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 10,
        profile: {
            thumbnail:
                "http://127.0.0.1:8000/image/user/2343f00350e3ac90a5bfc1c755d56a96/IMG_20211118_101242_235.webp?w=40&h=40&fit=crop",
        },
        fullname: "Ahmed Ibrahim Hassan",
        user: {
            user_id: 82,
            media: [
                {
                    id: 1156,
                    model_type: "App\\Models\\User",
                    model_id: 82,
                    uuid: "0092af15-8434-4f75-aad9-66ac8cdaf358",
                    collection_name: "profile",
                    name: "IMG_20211118_101242_235",
                    file_name: "IMG_20211118_101242_235.webp",
                    mime_type: "image/webp",
                    disk: "public",
                    conversions_disk: "public",
                    size: 104134,
                    manipulations: [],
                    custom_properties: {
                        primary: true,
                    },
                    generated_conversions: [],
                    responsive_images: [],
                    order_column: 1,
                    created_at: "2023-11-09T00:42:28.000000Z",
                    updated_at: "2023-11-09T00:42:28.000000Z",
                    original_url:
                        "http://127.0.0.1:8000/storage/user/2343f00350e3ac90a5bfc1c755d56a96/IMG_20211118_101242_235.webp",
                    preview_url: "",
                },
            ],
        },
        id: 450,
        status: "active",
    },
    {
        user_id: 69,
        employee_id: 443,
        firstname: "Mahdi",
        middlename: ".",
        lastname: "Nadir",
        email: "tbc@tBGHTYbc.com",
        phone_no: "773-245-3283",
        date_created: "2022-11-28 15:02:00",
        position: "PA",
        department: "HSE Department",
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 15,
        profile: {
            thumbnail:
                "http://127.0.0.1:8000/image/user/e38bbc8f4cb8d7117868cdebeb774edd/IMG_5164.jpeg?w=40&h=40&fit=crop",
        },
        fullname: "Mahdi Nadir",
        user: {
            user_id: 69,
            media: [
                {
                    id: 412,
                    model_type: "App\\Models\\User",
                    model_id: 69,
                    uuid: "51b23b88-7fde-4845-a38a-a7e7f54ae6d3",
                    collection_name: "profile",
                    name: "IMG_5164",
                    file_name: "IMG_5164.jpeg",
                    mime_type: "image/jpeg",
                    disk: "public",
                    conversions_disk: "public",
                    size: 1929194,
                    manipulations: [],
                    custom_properties: {
                        primary: false,
                    },
                    generated_conversions: [],
                    responsive_images: [],
                    order_column: 1,
                    created_at: "2023-06-10T11:53:54.000000Z",
                    updated_at: "2023-06-10T11:56:52.000000Z",
                    original_url:
                        "http://127.0.0.1:8000/storage/user/82b97efb51b6eddf2fe1365e462a5e3f/IMG_5164.jpeg",
                    preview_url: "",
                },
                {
                    id: 413,
                    model_type: "App\\Models\\User",
                    model_id: 69,
                    uuid: "4e2f8a11-3591-4fb0-9f0d-fa148e952206",
                    collection_name: "profile",
                    name: "IMG_5164",
                    file_name: "IMG_5164.jpeg",
                    mime_type: "image/jpeg",
                    disk: "public",
                    conversions_disk: "public",
                    size: 1929194,
                    manipulations: [],
                    custom_properties: {
                        primary: false,
                    },
                    generated_conversions: [],
                    responsive_images: [],
                    order_column: 2,
                    created_at: "2023-06-10T11:56:52.000000Z",
                    updated_at: "2023-06-10T11:58:32.000000Z",
                    original_url:
                        "http://127.0.0.1:8000/storage/user/61dcdf56490777da87d2c2b82b20a451/IMG_5164.jpeg",
                    preview_url: "",
                },
                {
                    id: 414,
                    model_type: "App\\Models\\User",
                    model_id: 69,
                    uuid: "a80f5a3a-bdf0-4594-8390-44938193188a",
                    collection_name: "profile",
                    name: "IMG_5164",
                    file_name: "IMG_5164.jpeg",
                    mime_type: "image/jpeg",
                    disk: "public",
                    conversions_disk: "public",
                    size: 1929194,
                    manipulations: [],
                    custom_properties: {
                        primary: false,
                    },
                    generated_conversions: [],
                    responsive_images: [],
                    order_column: 3,
                    created_at: "2023-06-10T11:58:32.000000Z",
                    updated_at: "2023-06-11T01:08:14.000000Z",
                    original_url:
                        "http://127.0.0.1:8000/storage/user/1042c1f3d4a220a59e0466414c07dc11/IMG_5164.jpeg",
                    preview_url: "",
                },
                {
                    id: 417,
                    model_type: "App\\Models\\User",
                    model_id: 69,
                    uuid: "4d72dc44-cb4c-4a8c-b31f-f1ade8c13908",
                    collection_name: "profile",
                    name: "IMG_5164",
                    file_name: "IMG_5164.jpeg",
                    mime_type: "image/jpeg",
                    disk: "public",
                    conversions_disk: "public",
                    size: 1929194,
                    manipulations: [],
                    custom_properties: {
                        primary: true,
                    },
                    generated_conversions: [],
                    responsive_images: [],
                    order_column: 4,
                    created_at: "2023-06-11T01:08:14.000000Z",
                    updated_at: "2023-06-11T01:08:14.000000Z",
                    original_url:
                        "http://127.0.0.1:8000/storage/user/e38bbc8f4cb8d7117868cdebeb774edd/IMG_5164.jpeg",
                    preview_url: "",
                },
            ],
        },
        id: 443,
        status: "active",
    },
    {
        user_id: 68,
        employee_id: 389,
        firstname: "Mustafa",
        middlename: ".",
        lastname: "Ali Naji",
        email: "Mustafa999clash@gmail.com",
        phone_no: "N/A",
        date_created: "2022-11-19 19:12:34",
        position: "Safety Officer ",
        department: "HSE Department",
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 4,
        profile: {
            thumbnail:
                "http://127.0.0.1:8000/image/user/f7723706806866576186fca63a6cc4cb/IMG_20230615_062832.jpg?w=40&h=40&fit=crop",
        },
        fullname: "Mustafa Ali Naji",
        user: {
            user_id: 68,
            media: [
                {
                    id: 552,
                    model_type: "App\\Models\\User",
                    model_id: 68,
                    uuid: "af48273a-c231-4997-bbf2-49cbba03533e",
                    collection_name: "profile",
                    name: "IMG_20230615_062832",
                    file_name: "IMG_20230615_062832.jpg",
                    mime_type: "image/jpeg",
                    disk: "public",
                    conversions_disk: "public",
                    size: 3107848,
                    manipulations: [],
                    custom_properties: {
                        primary: true,
                    },
                    generated_conversions: [],
                    responsive_images: [],
                    order_column: 1,
                    created_at: "2023-07-22T23:24:48.000000Z",
                    updated_at: "2023-07-22T23:24:48.000000Z",
                    original_url:
                        "http://127.0.0.1:8000/storage/user/f7723706806866576186fca63a6cc4cb/IMG_20230615_062832.jpg",
                    preview_url: "",
                },
            ],
        },
        id: 389,
        status: "active",
    },
    {
        user_id: 67,
        employee_id: 388,
        firstname: "Laith ",
        middlename: ".",
        lastname: "Asaad",
        email: "tba@tba.com",
        phone_no: "07702686069",
        date_created: "2022-11-19 19:07:07",
        position: "Safety Officer ",
        department: "HSE Department",
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 24,
        profile: null,
        fullname: "Laith Asaad",
        user: {
            user_id: 67,
            media: [],
        },
        id: 388,
        status: "active",
    },
    {
        user_id: 72,
        employee_id: 385,
        firstname: "Mohammed",
        middlename: ".",
        lastname: "Abdulkareem",
        email: "Mohammedqatrani@gmail.com",
        phone_no: "07801181119",
        date_created: "2022-11-19 14:37:38",
        position: "Safety Officer ",
        department: "HSE Department",
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 1,
        profile: {
            thumbnail:
                "http://127.0.0.1:8000/image/user/ffa18a27c44e31d4dbe55484e5c5cca8/329f788e-7926-489e-808a-4ac45583b1cd.jpeg?w=40&h=40&fit=crop",
        },
        fullname: "Mohammed Abdulkareem",
        user: {
            user_id: 72,
            media: [
                {
                    id: 1162,
                    model_type: "App\\Models\\User",
                    model_id: 72,
                    uuid: "7511ea68-cba3-476c-898c-a535a256b1e0",
                    collection_name: "profile",
                    name: "329f788e-7926-489e-808a-4ac45583b1cd",
                    file_name: "329f788e-7926-489e-808a-4ac45583b1cd.jpeg",
                    mime_type: "image/jpeg",
                    disk: "public",
                    conversions_disk: "public",
                    size: 104283,
                    manipulations: [],
                    custom_properties: {
                        primary: true,
                    },
                    generated_conversions: [],
                    responsive_images: [],
                    order_column: 3,
                    created_at: "2023-11-09T04:11:26.000000Z",
                    updated_at: "2023-11-09T04:11:26.000000Z",
                    original_url:
                        "http://127.0.0.1:8000/storage/user/ffa18a27c44e31d4dbe55484e5c5cca8/329f788e-7926-489e-808a-4ac45583b1cd.jpeg",
                    preview_url: "",
                },
            ],
        },
        id: 385,
        status: "active",
    },
    {
        user_id: 66,
        employee_id: 348,
        firstname: "Ahmed Salih",
        middlename: ".",
        lastname: "Abdzaid",
        email: "hse.ahmed@fiafigroup.com",
        phone_no: "07823436265",
        date_created: "2022-10-14 06:28:20",
        position: "PA/Safety Officer",
        department: "HSE Department",
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 50,
        profile: {
            thumbnail:
                "http://127.0.0.1:8000/image/user/ed344f5c0fb5831ab58cbb5e8562f23f/IMG_20230401_163008_536.jpg?w=40&h=40&fit=crop",
        },
        fullname: "Ahmed Salih Abdzaid",
        user: {
            user_id: 66,
            media: [
                {
                    id: 231,
                    model_type: "App\\Models\\User",
                    model_id: 66,
                    uuid: "d790f0c9-c918-400d-bb1e-f4911cb841de",
                    collection_name: "profile",
                    name: "1677333016171-1679563562",
                    file_name: "1677333016171-1679563562.jpg",
                    mime_type: "image/jpeg",
                    disk: "public",
                    conversions_disk: "public",
                    size: 160052,
                    manipulations: [],
                    custom_properties: {
                        primary: false,
                    },
                    generated_conversions: [],
                    responsive_images: [],
                    order_column: 1,
                    created_at: "2023-04-04T12:06:42.000000Z",
                    updated_at: "2023-04-16T01:09:45.000000Z",
                    original_url:
                        "http://127.0.0.1:8000/storage/user/2f2fc00ca5f316bb40c58fc41b1dbb2b/1677333016171-1679563562.jpg",
                    preview_url: "",
                },
                {
                    id: 260,
                    model_type: "App\\Models\\User",
                    model_id: 66,
                    uuid: "8be99066-d454-4728-b373-87f4f26d2494",
                    collection_name: "profile",
                    name: "IMG_20230401_163008_536",
                    file_name: "IMG_20230401_163008_536.jpg",
                    mime_type: "image/jpeg",
                    disk: "public",
                    conversions_disk: "public",
                    size: 118652,
                    manipulations: [],
                    custom_properties: {
                        primary: true,
                    },
                    generated_conversions: [],
                    responsive_images: [],
                    order_column: 2,
                    created_at: "2023-04-16T01:09:45.000000Z",
                    updated_at: "2023-04-16T01:09:45.000000Z",
                    original_url:
                        "http://127.0.0.1:8000/storage/user/ed344f5c0fb5831ab58cbb5e8562f23f/IMG_20230401_163008_536.jpg",
                    preview_url: "",
                },
            ],
        },
        id: 348,
        status: "active",
    },
    {
        user_id: 62,
        employee_id: 346,
        firstname: "Ali",
        middlename: ".",
        lastname: "Omer",
        email: "ali.alrassam19915@gmail.com",
        phone_no: "N/A",
        date_created: "2022-09-29 17:18:48",
        position: "PA",
        department: "HSE Department",
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 7,
        profile: null,
        fullname: "Ali Omer",
        user: {
            user_id: 62,
            media: [],
        },
        id: 346,
        status: "active",
    },
    {
        user_id: 79,
        employee_id: 344,
        firstname: "Mohammed",
        middlename: ".",
        lastname: "Ardem",
        email: "mohammed.ardam@gmail.com",
        phone_no: "N/A",
        date_created: "2022-09-29 17:16:04",
        position: "Safety Officer ",
        department: "HSE Department",
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 2,
        profile: {
            thumbnail:
                "http://127.0.0.1:8000/image/user/8411bf53e776e5fb3ef91c96136d828f/WhatsApp-Image-2021-02-26-at-13.28.19.jpeg?w=40&h=40&fit=crop",
        },
        fullname: "Mohammed Ardem",
        user: {
            user_id: 79,
            media: [
                {
                    id: 565,
                    model_type: "App\\Models\\User",
                    model_id: 79,
                    uuid: "4128eac2-9d47-4c27-84c0-eb88dc6064ae",
                    collection_name: "profile",
                    name: "WhatsApp Image 2021-02-26 at 13.28.19",
                    file_name: "WhatsApp-Image-2021-02-26-at-13.28.19.jpeg",
                    mime_type: "image/jpeg",
                    disk: "public",
                    conversions_disk: "public",
                    size: 57264,
                    manipulations: [],
                    custom_properties: {
                        primary: true,
                    },
                    generated_conversions: [],
                    responsive_images: [],
                    order_column: 1,
                    created_at: "2023-07-30T23:59:30.000000Z",
                    updated_at: "2023-07-30T23:59:30.000000Z",
                    original_url:
                        "http://127.0.0.1:8000/storage/user/8411bf53e776e5fb3ef91c96136d828f/WhatsApp-Image-2021-02-26-at-13.28.19.jpeg",
                    preview_url: "",
                },
                {
                    id: 566,
                    model_type: "App\\Models\\User",
                    model_id: 79,
                    uuid: "d680e57e-8d37-4042-8d1b-7d43d4d49fc8",
                    collection_name: "cover",
                    name: "WhatsApp Image 2023-07-30 at 19.06.58",
                    file_name: "WhatsApp-Image-2023-07-30-at-19.06.58.jpg",
                    mime_type: "image/jpeg",
                    disk: "public",
                    conversions_disk: "public",
                    size: 162971,
                    manipulations: [],
                    custom_properties: {
                        primary: false,
                    },
                    generated_conversions: [],
                    responsive_images: [],
                    order_column: 2,
                    created_at: "2023-07-31T00:08:14.000000Z",
                    updated_at: "2023-07-31T00:11:00.000000Z",
                    original_url:
                        "http://127.0.0.1:8000/storage/user/4e3b68cdfede84ea9774ba90f3dcc456/WhatsApp-Image-2023-07-30-at-19.06.58.jpg",
                    preview_url: "",
                },
                {
                    id: 567,
                    model_type: "App\\Models\\User",
                    model_id: 79,
                    uuid: "1cbac3b1-f1bc-4475-8dcb-6cc77af72f7e",
                    collection_name: "cover",
                    name: "Image-2-Rumaila-Oil-Field",
                    file_name: "Image-2-Rumaila-Oil-Field.jpg",
                    mime_type: "image/jpeg",
                    disk: "public",
                    conversions_disk: "public",
                    size: 611147,
                    manipulations: [],
                    custom_properties: {
                        primary: false,
                    },
                    generated_conversions: [],
                    responsive_images: [],
                    order_column: 3,
                    created_at: "2023-07-31T00:11:00.000000Z",
                    updated_at: "2023-07-31T00:13:38.000000Z",
                    original_url:
                        "http://127.0.0.1:8000/storage/user/6cbc907db7e6bbc04ceaae2c9418b0bb/Image-2-Rumaila-Oil-Field.jpg",
                    preview_url: "",
                },
                {
                    id: 568,
                    model_type: "App\\Models\\User",
                    model_id: 79,
                    uuid: "43deca39-c2e1-4741-b081-af7fe9dad029",
                    collection_name: "cover",
                    name: "Image-2-Rumaila-Oil-Field",
                    file_name: "Image-2-Rumaila-Oil-Field.jpg",
                    mime_type: "image/jpeg",
                    disk: "public",
                    conversions_disk: "public",
                    size: 228474,
                    manipulations: [],
                    custom_properties: {
                        primary: true,
                    },
                    generated_conversions: [],
                    responsive_images: [],
                    order_column: 4,
                    created_at: "2023-07-31T00:13:38.000000Z",
                    updated_at: "2023-07-31T00:13:38.000000Z",
                    original_url:
                        "http://127.0.0.1:8000/storage/user/1dbb7ccce16c670b53d42021b8e3fd98/Image-2-Rumaila-Oil-Field.jpg",
                    preview_url: "",
                },
            ],
        },
        id: 344,
        status: "active",
    },
    {
        user_id: 58,
        employee_id: 343,
        firstname: "Amjed",
        middlename: ".",
        lastname: "Jafer",
        email: "tbacn@tba.com",
        phone_no: "N/A",
        date_created: "2022-09-29 17:15:01",
        position: "PA",
        department: "HSE Department",
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 8,
        profile: null,
        fullname: "Amjed Jafer",
        user: {
            user_id: 58,
            media: [],
        },
        id: 343,
        status: "active",
    },
    {
        user_id: 59,
        employee_id: 342,
        firstname: "Abbas",
        middlename: ".",
        lastname: "Jafer",
        email: "abbasjffer@gmail.com",
        phone_no: "07713111304",
        date_created: "2022-09-29 17:13:55",
        position: "PA",
        department: "HSE Department",
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 77,
        profile: {
            thumbnail:
                "http://127.0.0.1:8000/image/user/209ff1dce36eb63b1a855ecf4b3fa15a/c16fa5bd-f4d5-4873-8004-7259cdb57a73.jpeg?w=40&h=40&fit=crop",
        },
        fullname: "Abbas Jafer",
        user: {
            user_id: 59,
            media: [
                {
                    id: 1348,
                    model_type: "App\\Models\\User",
                    model_id: 59,
                    uuid: "52eccda5-b806-478e-9a96-b1209b8386fc",
                    collection_name: "profile",
                    name: "c16fa5bd-f4d5-4873-8004-7259cdb57a73",
                    file_name: "c16fa5bd-f4d5-4873-8004-7259cdb57a73.jpeg",
                    mime_type: "image/jpeg",
                    disk: "public",
                    conversions_disk: "public",
                    size: 127188,
                    manipulations: [],
                    custom_properties: {
                        primary: true,
                    },
                    generated_conversions: [],
                    responsive_images: [],
                    order_column: 1,
                    created_at: "2023-12-01T12:39:14.000000Z",
                    updated_at: "2023-12-01T12:39:14.000000Z",
                    original_url:
                        "http://127.0.0.1:8000/storage/user/209ff1dce36eb63b1a855ecf4b3fa15a/c16fa5bd-f4d5-4873-8004-7259cdb57a73.jpeg",
                    preview_url: "",
                },
            ],
        },
        id: 342,
        status: "active",
    },
    {
        user_id: 56,
        employee_id: 340,
        firstname: "Saif",
        middlename: ".",
        lastname: "Latif",
        email: "saif.leteef@fiafigroup.com",
        phone_no: "N/A",
        date_created: "2022-09-29 17:10:40",
        position: "PA",
        department: "HSE Department",
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 6,
        profile: null,
        fullname: "Saif Latif",
        user: {
            user_id: 56,
            media: [],
        },
        id: 340,
        status: "active",
    },
    {
        user_id: 55,
        employee_id: 339,
        firstname: "Muammel",
        middlename: ".",
        lastname: "Issam",
        email: "amole.essam@gmail.com",
        phone_no: "N/A",
        date_created: "2022-09-29 17:09:19",
        position: "PA",
        department: "HSE Department",
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 9,
        profile: null,
        fullname: "Muammel Issam",
        user: {
            user_id: 55,
            media: [],
        },
        id: 339,
        status: "active",
    },
    {
        user_id: 46,
        employee_id: 331,
        firstname: "Wisam",
        middlename: ".",
        lastname: "Abdulmohsin",
        email: "hse.wisam@fiafigroup.com",
        phone_no: "07834992416",
        date_created: "2022-09-29 16:51:39",
        position: "Safety Officer ",
        department: "HSE Department",
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 14,
        profile: {
            thumbnail:
                "http://127.0.0.1:8000/image/user/66ee0d53030efa52c6b8ef31cd36f274/my-photo.jpeg?w=40&h=40&fit=crop",
        },
        fullname: "Wisam Abdulmohsin",
        user: {
            user_id: 46,
            media: [
                {
                    id: 228,
                    model_type: "App\\Models\\User",
                    model_id: 46,
                    uuid: "a5b8766b-45d2-4650-81f2-c446fc72ce15",
                    collection_name: "profile",
                    name: "my photo-1676800489",
                    file_name: "my-photo-1676800489.jpeg",
                    mime_type: "image/jpeg",
                    disk: "public",
                    conversions_disk: "public",
                    size: 141343,
                    manipulations: [],
                    custom_properties: {
                        primary: false,
                    },
                    generated_conversions: [],
                    responsive_images: [],
                    order_column: 1,
                    created_at: "2023-04-04T12:06:42.000000Z",
                    updated_at: "2023-04-12T03:55:26.000000Z",
                    original_url:
                        "http://127.0.0.1:8000/storage/user/2e3fe143ec7f6f1e7556b919bebf66e9/my-photo-1676800489.jpeg",
                    preview_url: "",
                },
                {
                    id: 324,
                    model_type: "App\\Models\\User",
                    model_id: 46,
                    uuid: "f845461b-6a3a-43a2-a931-e1e29927ffe5",
                    collection_name: "profile",
                    name: "DSC_0543",
                    file_name: "DSC_0543.JPG",
                    mime_type: "image/jpeg",
                    disk: "public",
                    conversions_disk: "public",
                    size: 3090644,
                    manipulations: [],
                    custom_properties: {
                        primary: false,
                    },
                    generated_conversions: [],
                    responsive_images: [],
                    order_column: 2,
                    created_at: "2023-05-29T01:01:51.000000Z",
                    updated_at: "2023-06-09T03:47:25.000000Z",
                    original_url:
                        "http://127.0.0.1:8000/storage/user/958df403b7eba72b26314774d804948f/DSC_0543.JPG",
                    preview_url: "",
                },
                {
                    id: 498,
                    model_type: "App\\Models\\User",
                    model_id: 46,
                    uuid: "7ee81154-e3a2-4c63-aa22-8b5bc17fff20",
                    collection_name: "profile",
                    name: "my photo",
                    file_name: "my-photo.jpeg",
                    mime_type: "image/jpeg",
                    disk: "public",
                    conversions_disk: "public",
                    size: 141343,
                    manipulations: [],
                    custom_properties: {
                        primary: true,
                    },
                    generated_conversions: [],
                    responsive_images: [],
                    order_column: 3,
                    created_at: "2023-07-06T18:39:09.000000Z",
                    updated_at: "2023-07-06T18:39:09.000000Z",
                    original_url:
                        "http://127.0.0.1:8000/storage/user/66ee0d53030efa52c6b8ef31cd36f274/my-photo.jpeg",
                    preview_url: "",
                },
            ],
        },
        id: 331,
        status: "active",
    },
    {
        user_id: 44,
        employee_id: 330,
        firstname: "Zaid",
        middlename: ".",
        lastname: "Abdulkreem",
        email: "zaidalhilfi92@gmail.com",
        phone_no: "N/A",
        date_created: "2022-09-29 16:47:32",
        position: "PA/Safety Officer",
        department: "HSE Department",
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 10,
        profile: {
            thumbnail:
                "http://127.0.0.1:8000/image/user/9d690142a44ac680986e8b08db2599d9/B641EECE-A70D-4C74-8BC0-97BC9C1DD16A-1676572375.jpeg?w=40&h=40&fit=crop",
        },
        fullname: "Zaid Abdulkreem",
        user: {
            user_id: 44,
            media: [
                {
                    id: 227,
                    model_type: "App\\Models\\User",
                    model_id: 44,
                    uuid: "f27e4ae4-57d1-4909-a8d9-abe0a873fc92",
                    collection_name: "profile",
                    name: "B641EECE-A70D-4C74-8BC0-97BC9C1DD16A-1676572375",
                    file_name:
                        "B641EECE-A70D-4C74-8BC0-97BC9C1DD16A-1676572375.jpeg",
                    mime_type: "image/jpeg",
                    disk: "public",
                    conversions_disk: "public",
                    size: 156570,
                    manipulations: [],
                    custom_properties: {
                        primary: true,
                    },
                    generated_conversions: [],
                    responsive_images: [],
                    order_column: 1,
                    created_at: "2023-04-04T12:06:42.000000Z",
                    updated_at: "2023-04-04T12:06:42.000000Z",
                    original_url:
                        "http://127.0.0.1:8000/storage/user/9d690142a44ac680986e8b08db2599d9/B641EECE-A70D-4C74-8BC0-97BC9C1DD16A-1676572375.jpeg",
                    preview_url: "",
                },
            ],
        },
        id: 330,
        status: "active",
    },
    {
        user_id: 43,
        employee_id: 307,
        firstname: "Salam ",
        middlename: ".",
        lastname: "Abdalmohsin",
        email: "hse.salam@fiafigroup.com",
        phone_no: "09482469545",
        date_created: "2022-09-26 09:22:23",
        position: "HSE Deputy ",
        department: "HSE Department",
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 2,
        profile: {
            thumbnail:
                "http://127.0.0.1:8000/image/user/1e970d1dcf2fcf89ba1ce6df7b1c46a2/WhatsApp-Image-2023-10-26-at-2.40.19-AM.jpeg?w=40&h=40&fit=crop",
        },
        fullname: "Salam Abdalmohsin",
        user: {
            user_id: 43,
            media: [
                {
                    id: 226,
                    model_type: "App\\Models\\User",
                    model_id: 43,
                    uuid: "032abadd-58d8-4d12-af62-a4619656f470",
                    collection_name: "profile",
                    name: "WhatsApp Image 2022-06-04 at 9.06.19 PM",
                    file_name: "WhatsApp-Image-2022-06-04-at-9.06.19-PM.jpeg",
                    mime_type: "image/jpeg",
                    disk: "public",
                    conversions_disk: "public",
                    size: 22904,
                    manipulations: [],
                    custom_properties: {
                        primary: false,
                    },
                    generated_conversions: [],
                    responsive_images: [],
                    order_column: 1,
                    created_at: "2023-04-04T12:06:42.000000Z",
                    updated_at: "2023-10-28T17:49:12.000000Z",
                    original_url:
                        "http://127.0.0.1:8000/storage/user/a82180acc3a24cc828ee03f656f03c57/WhatsApp-Image-2022-06-04-at-9.06.19-PM.jpeg",
                    preview_url: "",
                },
                {
                    id: 1041,
                    model_type: "App\\Models\\User",
                    model_id: 43,
                    uuid: "98c6546a-4f37-4c75-b8a7-d2713d3a0f1f",
                    collection_name: "profile",
                    name: "WhatsApp Image 2023-10-26 at 2.40.19 AM",
                    file_name: "WhatsApp-Image-2023-10-26-at-2.40.19-AM.jpeg",
                    mime_type: "image/jpeg",
                    disk: "public",
                    conversions_disk: "public",
                    size: 32623,
                    manipulations: [],
                    custom_properties: {
                        primary: true,
                    },
                    generated_conversions: [],
                    responsive_images: [],
                    order_column: 2,
                    created_at: "2023-10-28T17:49:12.000000Z",
                    updated_at: "2023-10-28T17:49:12.000000Z",
                    original_url:
                        "http://127.0.0.1:8000/storage/user/1e970d1dcf2fcf89ba1ce6df7b1c46a2/WhatsApp-Image-2023-10-26-at-2.40.19-AM.jpeg",
                    preview_url: "",
                },
            ],
        },
        id: 307,
        status: "active",
    },
    {
        user_id: 28,
        employee_id: 205,
        firstname: "Mohammed",
        middlename: ".",
        lastname: "Jawad",
        email: "ops.jawad@fiafigroup.com",
        phone_no: "N/A",
        date_created: "2022-04-28 19:08:17",
        position: "Mechanical Manager",
        department: null,
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 1,
        profile: {
            thumbnail:
                "http://127.0.0.1:8000/image/user/7a5e42a69ea458dbe73df7a45da1851d/84492547_183495689654730_7726320246205710336_n.jpg?w=40&h=40&fit=crop",
        },
        fullname: "Mohammed Jawad",
        user: {
            user_id: 28,
            media: [
                {
                    id: 218,
                    model_type: "App\\Models\\User",
                    model_id: 28,
                    uuid: "b332c6c6-455d-48df-823e-84fd2772a360",
                    collection_name: "profile",
                    name: "84492547_183495689654730_7726320246205710336_n",
                    file_name:
                        "84492547_183495689654730_7726320246205710336_n.jpg",
                    mime_type: "image/jpeg",
                    disk: "public",
                    conversions_disk: "public",
                    size: 51296,
                    manipulations: [],
                    custom_properties: {
                        primary: true,
                    },
                    generated_conversions: [],
                    responsive_images: [],
                    order_column: 1,
                    created_at: "2023-04-04T12:06:42.000000Z",
                    updated_at: "2023-04-04T12:06:42.000000Z",
                    original_url:
                        "http://127.0.0.1:8000/storage/user/7a5e42a69ea458dbe73df7a45da1851d/84492547_183495689654730_7726320246205710336_n.jpg",
                    preview_url: "",
                },
            ],
        },
        id: 205,
        status: "active",
    },
    {
        user_id: 53,
        employee_id: 160,
        firstname: "Haider",
        middlename: ".",
        lastname: "Hadi",
        email: "hayderalhadi@yahoo.com",
        phone_no: "N/A",
        date_created: "2022-03-03 07:57:53",
        position: "PA",
        department: "HSE Department",
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 2,
        profile: null,
        fullname: "Haider Hadi",
        user: {
            user_id: 53,
            media: [],
        },
        id: 160,
        status: "active",
    },
    {
        user_id: 29,
        employee_id: 81,
        firstname: "Ali",
        middlename: "Nasir",
        lastname: "Laiby",
        email: "hse.luaiby@fiafigroup.com",
        phone_no: "N/A",
        date_created: "2022-02-04 14:28:06",
        position: "PA/Safety Officer",
        department: "HSE Department",
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 9,
        profile: {
            thumbnail:
                "http://127.0.0.1:8000/image/user/c1c9d95eaa17a0abdbfe269fad8f5e44/87258503_179913020094001_5137820817857445888_n.jpg?w=40&h=40&fit=crop",
        },
        fullname: "Ali Laiby",
        user: {
            user_id: 29,
            media: [
                {
                    id: 219,
                    model_type: "App\\Models\\User",
                    model_id: 29,
                    uuid: "63c1541d-b773-444b-9264-000cce09d1af",
                    collection_name: "profile",
                    name: "87258503_179913020094001_5137820817857445888_n",
                    file_name:
                        "87258503_179913020094001_5137820817857445888_n.jpg",
                    mime_type: "image/jpeg",
                    disk: "public",
                    conversions_disk: "public",
                    size: 56696,
                    manipulations: [],
                    custom_properties: {
                        primary: true,
                    },
                    generated_conversions: [],
                    responsive_images: [],
                    order_column: 1,
                    created_at: "2023-04-04T12:06:42.000000Z",
                    updated_at: "2023-04-04T12:06:42.000000Z",
                    original_url:
                        "http://127.0.0.1:8000/storage/user/c1c9d95eaa17a0abdbfe269fad8f5e44/87258503_179913020094001_5137820817857445888_n.jpg",
                    preview_url: "",
                },
            ],
        },
        id: 81,
        status: "active",
    },
    {
        user_id: 70,
        employee_id: 79,
        firstname: "Ali",
        middlename: ".",
        lastname: "Salih Raheem",
        email: "salih@fiafi.com",
        phone_no: "N/A",
        date_created: "2022-02-04 14:23:26",
        position: "PA",
        department: "HSE Department",
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 15,
        profile: null,
        fullname: "Ali Salih Raheem",
        user: {
            user_id: 70,
            media: [],
        },
        id: 79,
        status: "active",
    },
    {
        user_id: 18,
        employee_id: 27,
        firstname: "Ayoub",
        middlename: "Abdul",
        lastname: "Younis",
        email: "hse.ayoob@fiafigroup.com",
        phone_no: "N/A",
        date_created: "2022-01-28 07:10:17",
        position: "PA/Safety Officer",
        department: "HSE Department",
        is_deleted: 0,
        is_active: 0,
        country: "Iraq",
        inspections_count: 1,
        profile: {
            thumbnail:
                "http://127.0.0.1:8000/image/user/7a000056a4e122d4eac4265d788e6556/271943838_305990018231801_7784910771597309715_n.jpg?w=40&h=40&fit=crop",
        },
        fullname: "Ayoub Younis",
        user: {
            user_id: 18,
            media: [
                {
                    id: 213,
                    model_type: "App\\Models\\User",
                    model_id: 18,
                    uuid: "744c5276-1672-4df7-ae20-f2509205b385",
                    collection_name: "profile",
                    name: "271943838_305990018231801_7784910771597309715_n",
                    file_name:
                        "271943838_305990018231801_7784910771597309715_n.jpg",
                    mime_type: "image/jpeg",
                    disk: "public",
                    conversions_disk: "public",
                    size: 62985,
                    manipulations: [],
                    custom_properties: {
                        primary: true,
                    },
                    generated_conversions: [],
                    responsive_images: [],
                    order_column: 1,
                    created_at: "2023-04-04T12:06:42.000000Z",
                    updated_at: "2023-04-04T12:06:42.000000Z",
                    original_url:
                        "http://127.0.0.1:8000/storage/user/7a000056a4e122d4eac4265d788e6556/271943838_305990018231801_7784910771597309715_n.jpg",
                    preview_url: "",
                },
            ],
        },
        id: 27,
        status: "active",
    },
];
const FORMATTED_DATE = format(new Date(), "MM/dd/yy");
const YEAR = new Date().getFullYear();
export function PDF() {
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
                            Safety Officer & Pa's DOR - February 2024
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
