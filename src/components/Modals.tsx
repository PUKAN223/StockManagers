import * as React from 'react';
import { Transition } from 'react-transition-group';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import { FormControl, FormLabel, Stack } from '@mui/joy';
import Input from "@mui/joy/Input";

export interface FormField {
    name: string;
    label: string;
    value?: string;
    onChange: (value: string) => void;
    type?: string;
    isAutoComplete?: boolean;
    options?: { inputValue: string, title: string }[];
}

interface FadeModalDialogWithFormProps {
    title: string;
    fields: FormField[];
    onSubmit: (formData: { [key: string]: string }) => void;
    open: boolean;
    onClose: () => void;
}

const FadeModalDialogWithForm: React.FC<FadeModalDialogWithFormProps> = ({
    title,
    fields,
    onSubmit,
    open,
    onClose,
}) => {
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const formData = fields.reduce((acc, field) => {
            if (field.value)
                acc[field.name] = field.value;
            return acc;
        }, {} as { [key: string]: string });
        onSubmit(formData);
        onClose();
    };

    return (
        <React.Fragment>
            <Transition in={open} timeout={400}>
                {(state: string) => (
                    <Modal
                        keepMounted
                        open={open}
                        onClose={onClose}
                        slotProps={{
                            backdrop: {
                                sx: {
                                    opacity: 0,
                                    backdropFilter: 'none',
                                    transition: `opacity 400ms, backdrop-filter 400ms`,
                                    ...{
                                        entering: { opacity: 1, backdropFilter: 'blur(8px)' },
                                        entered: { opacity: 1, backdropFilter: 'blur(8px)' },
                                    }[state],
                                },
                            },
                        }}
                        sx={[state === 'exited' ? { visibility: 'hidden' } : { visibility: 'visible' }]}
                    >
                        <ModalDialog
                            sx={{
                                opacity: 0,
                                transition: `opacity 300ms`,
                                ...{
                                    entering: { opacity: 1 },
                                    entered: { opacity: 1 },
                                }[state],
                            }}
                        >
                            <DialogTitle>{title}</DialogTitle>
                            <br />
                            <DialogContent>
                                <form onSubmit={handleSubmit}>
                                    <Stack spacing={2} direction={"row"} useFlexGap sx={{ flexWrap: 'wrap' }}>
                                        {fields.map((field) => (
                                            <FormControl key={field.name}>
                                                <FormLabel>{field.name}</FormLabel>
                                                <Input
                                                    autoFocus
                                                    required
                                                    type={field.type || 'text'}
                                                    placeholder={field.label}
                                                    value={field.value}
                                                    onChange={(value) => field.onChange(value.target.value)}
                                                />
                                            </FormControl>
                                        ))}
                                    </Stack>
                                    <DialogActions>
                                        <Button variant="outlined" color="neutral" type="submit">
                                            Submit
                                        </Button>
                                        <Button variant="outlined" color="neutral" onClick={onClose}>
                                            Cancel
                                        </Button>
                                    </DialogActions>
                                </form>
                            </DialogContent>
                        </ModalDialog>
                    </Modal>
                )}
            </Transition>
        </React.Fragment>
    );
};

export default FadeModalDialogWithForm;
