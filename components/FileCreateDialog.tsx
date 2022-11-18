import { Button, Dialog, DialogActions, DialogContent, DialogProps, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";

export type FileCreateDialogProps = DialogProps & {
    onCreate: (name: string) => void;
};

const FileCreateDialog = ({ onCreate, ...props }: FileCreateDialogProps) => {
    const [name, setName] = useState("");

    const create = () => {
        onCreate(name);
        props.onClose({}, "backdropClick");
    };
    
    return (
        <Dialog maxWidth={"sm"} fullWidth {...props}>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant={"h6"}>
                            Create new file
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        Tip: You can create a folder for a file like this: foldername/filename.c. 
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label={"Filename"}
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.onClose({}, "backdropClick")}>
                    Close
                </Button>
                <Button variant={"contained"} onClick={create} disabled={name.length === 0}>
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FileCreateDialog;