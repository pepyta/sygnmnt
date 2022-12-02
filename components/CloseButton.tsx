import { Button, ButtonProps } from "@mui/material";

export type CloseButtonProps = ButtonProps;

const CloseButton = (props: CloseButtonProps) => (
    <Button {...props}>
        {props.children || "Close"}
    </Button>
);

export default CloseButton;