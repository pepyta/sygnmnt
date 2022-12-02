import { Dialog, DialogActions, DialogProps, DialogTitle, List, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import * as Prisma from "@prisma/client";
import CloseButton from "./CloseButton";
import UserAvatar from "./UserAvatar";

type StudentType = Omit<Prisma.User, "password">;

export type SelectStudentDialogProps = DialogProps & {
    students: StudentType[];
    onSelect: (student: StudentType) => void;
};

const SelectStudentDialog = ({ students, onSelect, ...props }: SelectStudentDialogProps) => {
    return (
        <Dialog maxWidth={"sm"} fullWidth {...props}>
            <DialogTitle>
                Select a student
            </DialogTitle>
            <List>
                {students.map((student) => (
                    <ListItemButton
                        onClick={() => onSelect(student)}
                        key={`student-list-item-${student.id}`}
                    >
                        <ListItemAvatar>
                            <UserAvatar
                                user={student}
                            />
                        </ListItemAvatar>
                        <ListItemText
                            primary={student.username}
                        />
                    </ListItemButton>
                ))}
            </List>
            <DialogActions>
                <CloseButton
                    onClick={() => props.onClose({}, "backdropClick")}
                />
            </DialogActions>

        </Dialog>
    );
};

export default SelectStudentDialog;