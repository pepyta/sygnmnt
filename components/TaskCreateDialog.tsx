import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Grid, TextField, Typography } from "@mui/material";
import { ProgrammingLanguage, Task as PrismaTask, Team } from "@prisma/client";
import { useSnackbar } from "notistack";
import { useState } from "react";
import ProgrammingLanugageSelect from "./ProgrammingLanugageSelect";
import Task from "@lib/client/task";
import { LoadingButton } from "@mui/lab";

export type TaskCreateDialogProps = DialogProps & {
    team: Team;
    onCreate: (task: PrismaTask) => void;
};

const TaskCreateDialog = ({ onCreate, team, ...props }: TaskCreateDialogProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [language, setLanguage] = useState<ProgrammingLanguage>("CPP");
    const [isLoading, setLoading] = useState(false);

    const { enqueueSnackbar } = useSnackbar();

    const create = async () => {
        try {
            setLoading(true);

            const { message, task } = await Task.create(team.id, name, description, language);
            onCreate(task);
            props.onClose({}, "backdropClick");
            enqueueSnackbar(message);
        } catch (e) {
            enqueueSnackbar(e.message, {
                variant: "error",
            });

            setLoading(false);
        }
    };

    return (
        <Dialog fullWidth maxWidth={"sm"} {...props}>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant={"h6"}>
                            Task creation
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            disabled={isLoading}
                            required
                            autoFocus
                            fullWidth
                            label={"Name"}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            disabled={isLoading}
                            required
                            fullWidth
                            multiline
                            minRows={3}
                            label={"Description"}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <ProgrammingLanugageSelect
                            disabled={isLoading}
                            required
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as ProgrammingLanguage)}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    disabled={isLoading}
                    onClick={() => props.onClose({}, "backdropClick")}
                >
                    Close
                </Button>
                <LoadingButton
                    loading={isLoading}
                    disabled={isLoading}
                    variant={"contained"}
                    onClick={create}
                >
                    Create
                </LoadingButton>
            </DialogActions>

        </Dialog>
    );
};

export default TaskCreateDialog;