import { ListItemButton, ListItemButtonProps, ListItemText } from "@mui/material";
import { Submission } from "@prisma/client";
import { useMemo, useState } from "react";

export type SubmissionListItemButtonProps = ListItemButtonProps & {
    submission: Submission;
};

const SubmissionListItemButton = ({ submission, ...props }: SubmissionListItemButtonProps) => {
    const [isOpen, setOpen] = useState(false);
    
    const date = useMemo(
        () => {
            const d = new Date(submission.createdAt);
            return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
        },
        [submission.createdAt],
    );

    return (
        <ListItemButton {...props}>
            <ListItemText
                primary={`Submitted at ${date}`}
                secondary={submission.status}
            />
        </ListItemButton>  
    );
};

export default SubmissionListItemButton;