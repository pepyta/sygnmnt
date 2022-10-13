import Team from "@lib/client/team";
import { AddRounded as AddIcon } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Fab, FabProps, TextField, Typography } from "@mui/material"
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useState } from "react";

export type TeamCreateButtonProps = FabProps;

const TeamCreateButton = (props: TeamCreateButtonProps) => {
    const [isOpen, setOpen] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();

    const handleClose = () => setOpen(false);
    const handleOpen = () => setOpen(true);

    const create = async () => {
        setLoading(true);
        try {
            const { team, message } = await Team.create(name);
            router.push(`/team/${team.id}`);
            enqueueSnackbar(message, {
                variant: "success",
            });
        } catch(e) {
            setLoading(false);
            enqueueSnackbar(e.message, {
                variant: "error",
            });
        }
    };

    return (
        <>
            <Fab
                variant={"extended"}
                onClick={handleOpen}
                {...props}
            >
                <AddIcon /> Create a new team
            </Fab>
            <Dialog
                open={isOpen}
                onClose={handleClose}
                maxWidth={"sm"}
                fullWidth
            >
                <DialogContent>
                    <Typography variant={"h5"} gutterBottom>
                        Create a new team
                    </Typography>
                    <TextField
                        fullWidth
                        autoFocus
                        onChange={(e) => setName(e.target.value)}
                        label={"Team name"}
                        disabled={isLoading}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        Close
                    </Button>
                    <LoadingButton
                        onClick={create}
                        variant={"contained"}
                        loading={isLoading}
                    >
                        Create
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TeamCreateButton;