import { Fragment, useMemo } from "react";
import styles, { colors } from "@/lib/pdfStyles";
import { Page, View, Text, Image, Document } from "@react-pdf/renderer";
import { format, isSameDay, isSameMonth } from "date-fns";

const TODAY = new Date();
const FORMATTED_DATE = format(TODAY, "MM/dd/yy");
const YEAR = TODAY.getFullYear();

const MAX_ITEM = 20;

const data = [
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
    {
        id: 3,
        location: "Qurainat",
        date_issued: "2024-03-14",
        created_by: 1,
        fullname: "Rryanneal Respondo",
        img: "http://127.0.0.1:8000/image/user/5197602cc59ffc32716ef3bd35a7b2c1/Passport-picture-new.png?w=40&h=40&fit=crop",
        position: "HSE Manager",
        status: Math.random() < 0.8,
        assigned: Array.from(Array(Math.floor(Math.random() * 12) + 1).keys()),
    },
];

export function PDF({ logo }) {
    const { total, summary, dateTupple } = useMemo(() => {
        const total = {};
        const summary = {};
        const dateTupple = [0, 0];
        if (data.length > 0) {
            let submitted = 0;
            let notSubmitted = 0;
            let totalAttnd = 0;
            let summarySubmitted = 0;
            let summaryNotSubmitted = 0;
            let summaryTotalAttnd = 0;

            dateTupple[0] = new Date(data[0].date_issued).getTime();
            dateTupple[1] = new Date(data[0].date_issued).getTime();

            for (let i = 0; i < data.length; i++) {
                totalAttnd += data[i]?.assigned?.length ?? 0;
                const timestamps = new Date(data[i].date_issued).getTime();

                if (timestamps < dateTupple[0]) {
                    dateTupple[0] = timestamps;
                }

                if (timestamps > dateTupple[1]) {
                    dateTupple[1] = timestamps;
                }

                if (data[i].status) {
                    submitted += 1;
                } else {
                    notSubmitted += 1;
                }
                if ((i + 1) % MAX_ITEM === 0 || i === data.length - 1) {
                    total[i] = { submitted, notSubmitted, totalAttnd };
                    summarySubmitted += submitted;
                    summaryNotSubmitted += notSubmitted;
                    summaryTotalAttnd += totalAttnd;
                    summary[i] = {
                        submitted: summarySubmitted,
                        notSubmitted: summaryNotSubmitted,
                        totalAttnd: summaryTotalAttnd,
                    };
                    submitted = 0;
                    notSubmitted = 0;
                    totalAttnd = 0;
                }
            }
            return { total, summary, dateTupple };
        }

        return { total, summary, dateTupple: [] };
    }, [data]);

    const emptyRows =
        data.length % MAX_ITEM === 0 ? 0 : MAX_ITEM - (data.length % MAX_ITEM);

    const dateFormattedString = dateLabel(dateTupple[0], dateTupple[1]);

    return (
        <Document title="Toolbox Talk Tracker">
            <Page size="A4" style={styles.page}>
                <View style={styles.mb8} fixed>
                    <View style={[styles.gridContainer, styles.mb8]}>
                        <Image src={logo} style={{ height: 32, padding: 2 }} />
                    </View>
                    <View
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "row",
                        }}
                    >
                        <Text style={[styles.h3, { color: "#616161" }]}>
                            Toolbox Talk Tracker
                        </Text>
                    </View>
                </View>

                <View>
                    {/* TABLE HEADER */}
                    <View fixed>
                        <Text style={{ fontSize: 12 }}>
                            {dateFormattedString}
                        </Text>
                        <View style={styles.tableHeader}>
                            <View
                                style={[
                                    styles.tableCenterCell,
                                    { flexBasis: 40 },
                                ]}
                            >
                                <Text style={styles.tableHeaderText}>#</Text>
                            </View>
                            <View
                                style={[
                                    styles.tableCenterCell,
                                    { flexBasis: 140 },
                                ]}
                            >
                                <Text style={styles.tableHeaderText}>Name</Text>
                            </View>
                            <View style={styles.tableCenterCell}>
                                <Text style={styles.tableHeaderText}>
                                    Position
                                </Text>
                            </View>
                            <View style={styles.tableCenterCell}>
                                <Text style={styles.tableHeaderText}>
                                    Location
                                </Text>
                            </View>
                            <View style={styles.tableCenterCell}>
                                <Text style={styles.tableHeaderText}>Date</Text>
                            </View>
                            <View
                                style={[
                                    styles.tableCenterCell,
                                    { flexBasis: 80 },
                                ]}
                            >
                                <Text style={styles.tableHeaderText}>
                                    TBT Status
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.tableCenterCell,
                                    { flexBasis: 40 },
                                ]}
                            >
                                <Text style={[styles.tableHeaderText]}>
                                    Total Attnd.
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* TABLE BODY */}
                    <View>
                        {data.map((row, index) => (
                            <Fragment key={index}>
                                <View wrap={false} style={styles.tableRow}>
                                    <View
                                        style={[
                                            styles.tableCenterCell,
                                            { flexBasis: 40 },
                                        ]}
                                    >
                                        <Text style={styles.tableBodyText}>
                                            {index + 1}
                                        </Text>
                                    </View>
                                    <View
                                        style={[
                                            styles.tableCenterCell,
                                            { flexBasis: 140 },
                                        ]}
                                    >
                                        <Text style={styles.tableBodyText}>
                                            {row.fullname}
                                        </Text>
                                    </View>
                                    <View style={styles.tableCenterCell}>
                                        <Text style={styles.tableBodyText}>
                                            {row.position}
                                        </Text>
                                    </View>
                                    <View style={styles.tableCenterCell}>
                                        <Text style={styles.tableBodyText}>
                                            {row.location}
                                        </Text>
                                    </View>
                                    <View style={styles.tableCenterCell}>
                                        <Text style={styles.tableBodyText}>
                                            {format(
                                                new Date(row.date_issued),
                                                "MMMM dd, yyyy"
                                            )}
                                        </Text>
                                    </View>
                                    <View
                                        style={[
                                            styles.tableCenterCell,
                                            { flexBasis: 80 },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.tableBodyText,
                                                styles.bold,
                                                {
                                                    color: row.status
                                                        ? colors.successMain
                                                        : colors.warningMain,
                                                },
                                            ]}
                                        >
                                            {row.status
                                                ? "Submitted"
                                                : "Not Submitted"}
                                        </Text>
                                    </View>
                                    <View
                                        style={[
                                            styles.tableCenterCell,
                                            { flexBasis: 40 },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.tableBodyText,
                                                styles.bold,
                                            ]}
                                        >
                                            {row?.assigned?.length ?? 0}
                                        </Text>
                                    </View>
                                </View>

                                {/* EMPTY ROWS */}
                                {data.length === index + 1 && emptyRows > 0 && (
                                    <EmptyRows
                                        emptyRows={emptyRows}
                                        dataLength={data.length}
                                    />
                                )}

                                {/* TOTAL & SUMMARY TOTAL */}
                                <TableTotalFooter
                                    dataLength={data.length}
                                    i={index}
                                    total={total}
                                    summary={summary}
                                />
                            </Fragment>
                        ))}
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
                                    color: "#616161",
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
                                    color: "#616161",
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
                                    color: "#616161",
                                },
                            ]}
                            render={(params) => {
                                return `${FORMATTED_DATE} Page ${params.pageNumber} / ${params.totalPages}`;
                            }}
                        ></Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
}

function TableTotalFooter({
    dataLength,
    i,
    total,
    summary = { submitted: 0, notSubmitted: 0 },
}) {
    if (dataLength === 0 || i === 0 || (!total[i] && !summary[i])) return null;

    if (dataLength <= MAX_ITEM) {
        return (
            <View style={[styles.mt24, styles.mb32]}>
                <SummaryTotal
                    submitted={summary[i].submitted}
                    notSubmitted={summary[i].notSubmitted}
                    totalAttnd={summary[i].totalAttnd}
                />
            </View>
        );
    }

    return (
        <View style={[styles.mt24, styles.mb32]}>
            <Total
                submitted={total[i].submitted}
                notSubmitted={total[i].notSubmitted}
                totalAttnd={total[i].totalAttnd}
            />
            <SummaryTotal
                submitted={summary[i].submitted}
                notSubmitted={summary[i].notSubmitted}
                totalAttnd={summary[i].totalAttnd}
            />
        </View>
    );
}

function Total({ submitted = 0, notSubmitted = 0, totalAttnd = 0 }) {
    return (
        <View>
            {/* TOTAL SUBMITTED */}
            <View
                style={[
                    styles.tableFooter,
                    { borderBottom: "0.325px solid #ffffff" },
                ]}
            >
                <View
                    style={[
                        styles.tableCenterCell,
                        {
                            flexBasis: 540,
                            borderRight: 0,
                            justifyContent: "flex-start",
                        },
                    ]}
                >
                    <Text style={[styles.tableHeaderText, styles.pl8]}>
                        Total Submitted
                    </Text>
                </View>
                <View
                    style={[
                        styles.tableCenterCell,
                        {
                            flexBasis: 80,
                            borderRight: 0,
                        },
                    ]}
                >
                    <Text style={styles.tableHeaderText}>{submitted}</Text>
                </View>
                <View
                    style={[
                        styles.tableCenterCell,
                        {
                            flexBasis: 40,
                            borderRight: 0,
                        },
                    ]}
                >
                    <Text style={styles.tableHeaderText}>{totalAttnd}</Text>
                </View>
            </View>
            {/* TOTAL NOT SUBMITTED */}
            <View style={styles.tableFooter}>
                <View style={styles.tableFooter}>
                    <View
                        style={[
                            styles.tableCenterCell,
                            {
                                flexBasis: 540,
                                borderRight: 0,
                                justifyContent: "flex-start",
                            },
                        ]}
                    >
                        <Text style={[styles.tableHeaderText, styles.pl8]}>
                            Total Not Submitted
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.tableCenterCell,
                            {
                                flexBasis: 80,
                                borderRight: 0,
                            },
                        ]}
                    >
                        <Text style={styles.tableHeaderText}>
                            {notSubmitted}
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.tableCenterCell,
                            {
                                flexBasis: 40,
                                borderRight: 0,
                            },
                        ]}
                    ></View>
                </View>
            </View>
        </View>
    );
}

function SummaryTotal({ submitted = 0, notSubmitted = 0, totalAttnd = 0 }) {
    return (
        <View>
            <View style={[styles.mt8, styles.mb8]}>
                <Text
                    style={[
                        styles.h6,
                        {
                            color: "#0a0a0a",
                            lineHeight: 1,
                        },
                    ]}
                >
                    Summary Total:
                </Text>
            </View>
            {/* SUMMARY TOTAL SUBMITTED */}
            <View
                style={[
                    styles.tableFooter,
                    { borderBottom: "0.325px solid #ffffff" },
                ]}
            >
                <View
                    style={[
                        styles.tableCenterCell,
                        {
                            flexBasis: 540,
                            borderRight: 0,
                            justifyContent: "flex-start",
                        },
                    ]}
                >
                    <Text style={[styles.tableHeaderText, styles.pl8]}>
                        Summary Total Submitted
                    </Text>
                </View>
                <View
                    style={[
                        styles.tableCenterCell,
                        {
                            flexBasis: 80,
                            borderRight: 0,
                        },
                    ]}
                >
                    <Text style={styles.tableHeaderText}>{submitted}</Text>
                </View>
                <View
                    style={[
                        styles.tableCenterCell,
                        {
                            flexBasis: 40,
                            borderRight: 0,
                        },
                    ]}
                >
                    <Text style={styles.tableHeaderText}>{totalAttnd}</Text>
                </View>
            </View>
            {/* SUMMARY TOTAL NOT SUBMITTED */}
            <View style={styles.tableFooter}>
                <View
                    style={[
                        styles.tableCenterCell,
                        {
                            flexBasis: 540,
                            borderRight: 0,
                            justifyContent: "flex-start",
                        },
                    ]}
                >
                    <Text style={[styles.tableHeaderText, styles.pl8]}>
                        Summary Not Total Submitted
                    </Text>
                </View>
                <View
                    style={[
                        styles.tableCenterCell,
                        {
                            flexBasis: 80,
                            borderRight: 0,
                        },
                    ]}
                >
                    <Text style={styles.tableHeaderText}>{notSubmitted}</Text>
                </View>
                <View
                    style={[
                        styles.tableCenterCell,
                        {
                            flexBasis: 40,
                            borderRight: 0,
                        },
                    ]}
                ></View>
            </View>
        </View>
    );
}

function EmptyRows({ emptyRows = 0, dataLength }) {
    const rows = Array.from(
        { length: emptyRows },
        (_, i) => i + 1 + dataLength
    );
    return rows.map((row) => (
        <View style={styles.tableRow} key={row}>
            <View style={[styles.tableCenterCell, { flexBasis: 40 }]}>
                <Text style={styles.tableBodyText}>{row}</Text>
            </View>
            <View style={[styles.tableCenterCell, { flexBasis: 140 }]}></View>
            <View style={styles.tableCenterCell}></View>
            <View style={styles.tableCenterCell}></View>
            <View style={styles.tableCenterCell}></View>
            <View style={[styles.tableCenterCell, { flexBasis: 80 }]}></View>
            <View style={[styles.tableCenterCell, { flexBasis: 40 }]}></View>
        </View>
    ));
}

const dateLabel = (startDate, endDate) => {
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const startDateYear = start.getFullYear();
        const endDateYear = end.getFullYear();

        const isSameYear = startDateYear === endDateYear;

        if (isSameYear) {
            const isSameDays = isSameDay(start, end);
            const isSameMonths = isSameMonth(start, end);
            return isSameMonths
                ? isSameDays
                    ? format(end, "MMMM dd, yyyy")
                    : `${format(start, "MMMM dd")}-${format(end, "dd, yyyy")}`
                : `${format(start, "MMMM dd")} - ${format("MMMM dd, yyyy")}`;
        } else {
            return `${format(start, "MMMM dd, yyyy")}-${format(
                end,
                "MMMM dd, yyyy"
            )}`;
        }
    }
    return "";
};
