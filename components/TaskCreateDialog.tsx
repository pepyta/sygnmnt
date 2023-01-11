import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Grid, Switch, TextField, Typography } from "@mui/material";
import { ProgrammingLanguage, Task as PrismaTask, Team } from "@prisma/client";
import { useSnackbar } from "notistack";
import { useState } from "react";
import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import ProgrammingLanugageSelect from "./ProgrammingLanugageSelect";
import Task from "@lib/client/task";
import { LoadingButton } from "@mui/lab";
import FolderForm from "./FolderForm";
import { RunnerFile } from "@lib/server/runner";
import dynamic from "next/dynamic";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

export type TaskCreateDialogProps = DialogProps & {
    team: Team;
};

const TaskCreateDialog = ({ team, ...props }: TaskCreateDialogProps) => {
    const [name, setName] = useState("");
    const [dueDate, setDueDate] = React.useState<Dayjs | null>(
        dayjs().second(0),
    );
    const [hardDeadline, setHardDeadline] = useState(false);
    const [description, setDescription] = useState("");
    const [language, setLanguage] = useState<ProgrammingLanguage>("CPP");
    const [isLoading, setLoading] = useState(false);
    const [page, setPage] = useState<"SUMMARY" | "FILES">("SUMMARY");
    const [files, setFiles] = useState<RunnerFile[]>([]);

    const { enqueueSnackbar } = useSnackbar();

    const create = async () => {
        try {
            setLoading(true);

            const { message } = await Task.create(team.id, name, dueDate.unix(), hardDeadline, description, language, files);
            props.onClose({}, "backdropClick");
            enqueueSnackbar(message);
            
            // reset dialog state
            setName("");
            setDueDate(dayjs().second(0));
            setPage("SUMMARY");
            setDescription("");
            setLanguage("CPP");
            setLoading(false);
            setFiles([]);
        } catch (e) {
            enqueueSnackbar(e.message, {
                variant: "error",
            });

            setLoading(false);
        }
    };

    if (page === "FILES") {
        return (
            <Dialog fullWidth maxWidth={"md"} {...props}>
                <DialogContent>
                    <FolderForm
                        onEdit={setFiles}
                        files={[
                            ...files,
                        ].map((file) => ({
                            ...file,
                            disabled: isLoading,
                        }))}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        disabled={isLoading}
                        onClick={() => setPage("SUMMARY")}
                    >
                        Back
                    </Button>
                    <LoadingButton
                        loading={isLoading}
                        disabled={isLoading || files.length === 0}
                        variant={"contained"}
                        onClick={create}
                    >
                        Create
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        );
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                        <Grid item xs={6}>
                            <DateTimePicker
                                disabled={isLoading}
                                autoFocus
                                label={"Deadline"}
                                value={dueDate}
                                onChange={setDueDate}
                                renderInput={(params) => <TextField {...params} required/>}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>
                                {hardDeadline ? "Hard" : "Soft"} deadline
                            </Typography>
                            <Switch
                                checked={hardDeadline}
                                onChange={() => {setHardDeadline(!hardDeadline);}}
                                inputProps={{ 'aria-label': 'controlled' }}
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
                        disabled={name.length === 0 || description.length === 0 || !dueDate || !dueDate.isValid()}
                        variant={"contained"}
                        onClick={() => setPage("FILES")}
                    >
                        Next
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
};

export default TaskCreateDialog;