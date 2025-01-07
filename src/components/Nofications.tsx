import Stack from '@mui/joy/Stack';
import Snackbar, { SnackbarProps } from '@mui/joy/Snackbar';

interface SnackBars {
    message: string,
    open: boolean,
    variant: SnackbarProps['variant'],
    color: SnackbarProps['color'],
    onClose: () => void
}

export default function SnackbarColors(props: SnackBars) {
    const { open, message, onClose, variant, color } = props
    return (
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
            <Snackbar
                autoHideDuration={4000}
                open={open}
                variant={variant}
                color={color}
                anchorOrigin={{horizontal: "right", vertical: "top"}}
                onClose={(_event, reason) => {
                    if (reason === 'clickaway') {
                        return;
                    }
                    onClose()
                }}
            >
                {message}
            </Snackbar>
        </Stack>
    );
}