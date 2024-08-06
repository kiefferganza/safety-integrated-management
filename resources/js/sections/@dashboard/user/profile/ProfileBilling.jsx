import CustomPopover, { usePopover } from "@/Components/custom-popover";
import Iconify from "@/Components/iconify";
import PaymentSummary from "@/sections/@dashboard/payment/payment-summary";
import { Box, Grid, Stack, TextField, Typography } from "@mui/material";
import {
    Elements,
    PaymentElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSnackbar } from "notistack";
import { useState } from "react";
import * as yup from "yup";

const emailSchema = yup
    .string()
    .email("Invalid email format")
    .required("Email is required");

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
export default function ProfileBilling({ user, clientSecret }) {
    const name = (
        (user?.firstname || "") +
        " " +
        (user?.lastname || "")
    ).trim();

    const popover = usePopover();

    return (
        <>
            {/* <Typography variant="h3" align="center" sx={{ mb: 2 }}>
                {`Let's finish powering you up!`}
            </Typography>

            <Typography align="center" sx={{ color: "text.secondary", mb: 5 }}>
                Professional plan is right for you.
            </Typography> */}

            <Elements
                stripe={stripePromise}
                options={{
                    clientSecret: clientSecret,
                }}
            >
                <CheckoutForm nameUser={name} />
            </Elements>

            <CustomPopover
                open={popover.open}
                onClose={popover.onClose}
                arrow="bottom-center"
                sx={{
                    maxWidth: 200,
                    typography: "caption",
                    textAlign: "center",
                    borderRadius: 0.5,
                }}
            >
                <Typography variant="caption" px={1}>
                    Three-digit number on the back of your VISA card
                </Typography>
            </CustomPopover>
        </>
    );
}

function CheckoutForm({ nameUser }) {
    const stripe = useStripe();
    const elements = useElements();
    const [email, setEmail] = useState("");
    const [name, setName] = useState(nameUser);
    const { enqueueSnackbar } = useSnackbar();

    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        const isValidEmail = emailSchema.isValidSync(email);
        if (!stripe || !elements) return;
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                payment_method_data: {
                    billing_details: {
                        name,
                        email: isValidEmail ? email : null,
                    },
                },
            },
            redirect: "if_required",
        });
        if (error) {
            enqueueSnackbar(error.message || "Something went wrong!", {
                variant: "error",
            });
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            enqueueSnackbar(
                "Payment successful! Thank you for your purchase.",
                { variant: "success" }
            );
        }
        setIsProcessing(false);
        window.location.reload();
    };

    return (
        <form
            id="payment-form"
            onSubmit={handleSubmit}
            style={{ width: "100%" }}
        >
            <Grid
                container
                rowSpacing={{ xs: 5, md: 0 }}
                columnSpacing={{ xs: 0, md: 5 }}
            >
                <Grid item xs={12} md={8}>
                    <Box
                        sx={{
                            p: { md: 5 },
                            borderRadius: 2,
                            border: (theme) => ({
                                md: `dashed 1px ${theme.palette.divider}`,
                            }),
                        }}
                    >
                        <Typography variant="h6">Card Info</Typography>
                        <Stack spacing={2.5} mt={5}>
                            <TextField
                                label="Name"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                }}
                            />
                            <TextField
                                label="Email Address"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                                type="email"
                            />
                            <PaymentElement />
                            <Stack
                                direction="row"
                                alignItems="center"
                                sx={{
                                    typography: "caption",
                                    color: "text.disabled",
                                }}
                            >
                                <Iconify
                                    icon="carbon:locked"
                                    sx={{ mr: 0.5 }}
                                />
                                Your transaction is secured with SSL encryption
                            </Stack>
                        </Stack>
                    </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                    <PaymentSummary isProcessing={isProcessing} />
                </Grid>
            </Grid>
        </form>
    );
}
