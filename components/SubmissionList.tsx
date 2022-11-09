import { List, ListProps } from "@mui/material";
import { Submission } from "@prisma/client";
import SubmissionListItemButton from "./SubmissionListItemButton";

export type SubmissionListProps = ListProps & {
    submissions: Submission[];
};

const SubmissionList = ({ submissions, ...props }: SubmissionListProps) => {
    return (
        <List {...props}>
            {submissions.map((submission) => (
                <SubmissionListItemButton
                    key={`submission-list-${submission.id}`}
                    submission={submission}
                />
            ))}
        </List>
    );
};

export default SubmissionList;