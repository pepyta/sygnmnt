import { List, ListItem, ListItemText, ListProps } from "@mui/material";
import { ExtendedSubmissionType } from "@redux/slices/membership";
import SubmissionListItemButton from "./SubmissionListItemButton";

export type SubmissionListProps = ListProps & {
    dueDate: Date;
    hardDeadline: boolean;
    submissions: ExtendedSubmissionType[];
};

const SubmissionList = ({ dueDate, hardDeadline, submissions, ...props }: SubmissionListProps) => {
    return (
        <List {...props}>
            {submissions.length === 0 && (
                <ListItem>
                    <ListItemText
                        primary={"Could not find any submissions!"}
                    />
                </ListItem>
            )}
            {submissions.map((submission) => (
                <SubmissionListItemButton
                    dueDate={dueDate}
                    hardDeadline={hardDeadline}
                    key={`submission-list-${submission.id}`}
                    submission={submission}
                />
            ))}
        </List>
    );
};

export default SubmissionList;