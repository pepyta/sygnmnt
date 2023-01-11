import Invitation from "@lib/client/invitation";
import { LoadingButton } from "@mui/lab";
import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Grid, TextField, Typography } from "@mui/material";
import { Team } from "@prisma/client";
import { useSnackbar } from "notistack";
import { useState } from "react";

export type InviteUserDialogProps = DialogProps & {
    team: Team;
};

const InviteUserDialog = ({ team, ...props }: InviteUserDialogProps) => {
    const [username, setUsername] = useState("");
    const [isLoading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const handleClose = () => {
        if (isLoading) return;
        props.onClose({}, "backdropClick");
    };

    const invite = async () => {
        try {
            setLoading(true);

            const response = await Invitation.inviteUser(team.id, username);

            props.onClose({}, "backdropClick");
            setUsername("");
            enqueueSnackbar(response.message, {
                variant: response.success ? "success" : "error",
            });
        } catch (e) {
            enqueueSnackbar(e.message, {
                variant: "error",
            });
        } finally {
            setLoading(false);
        }
    };


    return (
        <Dialog {...props}>
            <DialogTitle>
                Invite a member to the team
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography gutterBottom>
                            Enter the username of the user that you want to invite to the {team.name} team!
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            disabled={isLoading}
                            label={"Username"}
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClose}
                    disabled={isLoading}
                >
                    Close
                </Button>
                <LoadingButton
                    loading={isLoading}
                    variant={"contained"}
                    disabled={isLoading || username.length === 0}
                    onClick={invite}
                >
                    Invite
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
};

export default InviteUserDialog;