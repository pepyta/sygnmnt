import { List, ListProps } from "@mui/material";
import { ExtendedSubmissionType } from "@redux/slices/membership";
import SubmissionListItemButton from "./SubmissionListItemButton";

export type SubmissionListProps = ListProps & {
    submissions: ExtendedSubmissionType[];
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