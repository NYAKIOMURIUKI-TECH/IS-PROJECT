import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useSelector, useDispatch } from "react-redux";
import FlexBetween from "components/FlexBetween";
import { Typography, Box, Rating } from "@mui/material";
import { setBooking } from "state";

export default function ReviewAndPaymentDialog({
  bookingId,
  workerName,
  serviceName,
  price,
  status,
  jobId,
  paymentMethod
}) {
  const [open, setOpen] = React.useState(false);
  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState("");
  const [reviewSubmitted, setReviewSubmitted] = React.useState(false);
  const userId = useSelector((state) => state.user.id);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();

  const handleReviewSubmit = async () => {
    try {
      const response = await fetch(`/${userId}/review/${jobId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating,
          comment,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      const resp = await response.json();
      setReviewSubmitted(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handlePayment = async () => {
    try {
      const response = await fetch(`/make_payment/${bookingId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      const resp = await response.json();
      dispatch(setBooking(resp));
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (rating > 0 || comment) {
      await handleReviewSubmit();
    }
    await handlePayment();
    handleClose();
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        VIEW
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Complete Service Payment & Leave a Review</DialogTitle>
        <DialogContent>
          {status !== "completed" && (
            <Typography
              className="text-red-400"
              sx={{ fontSize: "12px", textAlign: "center" }}
            >
              * Wait for Job Completion to Initialize Payment
            </Typography>
          )}
          {paymentMethod === undefined && (
            <Typography
            className="text-red-400"
            sx={{ fontSize: "12px", textAlign: "center" }}
          >
            * Add a Payment method to complete payment
          </Typography>
          )}
          <FlexBetween gap="5rem" className="m-2 p-2">
            <Box>
              <Typography
                className="p-1 border-b-2"
                sx={{ fontSize: "1rem", color: "Highlight" }}
              >
                Service
              </Typography>
              <Typography className="pb-2" sx={{ fontSize: "1rem" }}>
                {serviceName}
              </Typography>
            </Box>
            <Box>
              <Typography
                className="p-1 border-b-2"
                sx={{ fontSize: "1rem", color: "Highlight" }}
              >
                Done By
              </Typography>
              <Typography className="pb-2" sx={{ fontSize: "1rem" }}
              >
                {workerName}
              </Typography>
            </Box>
          </FlexBetween>
          <Box fullWidth sx={{ justifyContent: "center", display: "flex" }}>
            <Typography
              className="p-1 border-b-2"
              sx={{ fontSize: "1rem", color: "Highlight" }}
            >
              Total Price:&nbsp;
            </Typography>
            <Typography className="pt-1" sx={{ fontSize: "1rem" }}>
              KSH. {price}
            </Typography>
          </Box>
          <Box
            fullWidth
            sx={{
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              className="p-1 border-b-2"
              sx={{ fontSize: "1rem", color: "Highlight" }}
            >
              Rating
            </Typography>
            <Rating
              defaultValue={0}
              name="simple-controlled"
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
              readOnly={status !== "completed" || !paymentMethod}
            />
          </Box>
          <TextField
            autoFocus
            margin="dense"
            id="comment"
            label="Comment"
            type="text"
            fullWidth
            variant="outlined"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={status !== "completed" || !paymentMethod}
          />
        </DialogContent>
        <DialogActions>
          <FlexBetween className="w-[100%] font-bold text-md">
            <Button sx={{ color: "red" }}>CANCEL BOOKING</Button>
            <Box>
              <Button sx={{ color: "green" }} onClick={handleClose}>
                Close
              </Button>
              <Button
                disabled={status !== "completed" || !paymentMethod}
                sx={{
                  color: "white",
                  fontSize: "1rem",
                  backgroundColor: "Highlight",
                  "&:hover": { opacity: "70%", backgroundColor: "Highlight" },
                  "&.Mui-disabled": {
                    color: "rgba(0, 0, 0, 0.26)",
                    borderColor: "rgba(0, 0, 0, 0.26)",
                    backgroundColor: "rgba(0, 0, 0, 0.12)",
                  },
                }}
                type="submit"
              >
                PAY
              </Button>
            </Box>
          </FlexBetween>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
