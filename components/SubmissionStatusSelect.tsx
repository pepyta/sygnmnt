import { FormControl, InputLabel, MenuItem, Select, SelectProps } from "@mui/material";
import * as Prisma from "@prisma/client";

export type SubmissionStatusSelectProps = SelectProps<Prisma.SubmissionStatus>;

const SubmissionStatusSelect = (props: SubmissionStatusSelectProps) => (
    <FormControl fullWidth>
        <InputLabel id={"submission-status-select-label"}>
            Submission status
        </InputLabel>
        <Select label={"Submission status"} {...props}>
            <MenuItem value={"AWAITING_MANUAL_CHECK"}>
                Awaiting teacher verification
            </MenuItem>
            <MenuItem value={"PASSED"}>
                Passed
            </MenuItem>
            <MenuItem value={"FAILED"}>
                Failed
            </MenuItem>
        </Select>
    </FormControl>
);

export default SubmissionStatusSelect;