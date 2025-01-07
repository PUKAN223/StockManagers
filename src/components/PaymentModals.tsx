import * as React from 'react';
import { Transition } from 'react-transition-group';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import Autocomplete from '@mui/joy/Autocomplete';
import { Input, Stack } from '@mui/joy';
import TableSortAndSelection, { HeadCell } from './Tables';

const ProductHeader: HeadCell<{ name: string; categories: string; quantity: number; prices: number; expiryDate: string }>[] = [
    {
        id: 'name',
        disablePadding: true,
        label: 'Name',
        numeric: false,
    },
    {
        id: 'categories',
        disablePadding: true,
        label: 'Categories',
        numeric: false,
    },
    {
        id: 'quantity',
        disablePadding: true,
        label: 'Quantity',
        numeric: true,
    },
    {
        id: 'prices',
        disablePadding: true,
        label: 'Prices(฿)',
        numeric: false,
    },
    {
        id: 'expiryDate',
        disablePadding: true,
        label: 'Expiry Date',
        numeric: false,
    },
];

interface Product {
    _id: string;
    name: string;
    categories: string;
    quantity: number;
    prices: number;
    expiryDate: string;
}

interface FadeModalDialogWithFormProps {
    title: string;
    onSubmit: (formData: { [key: string]: string }) => void;
    open: boolean;
    onClose: () => void;
    products: Product[];
    selected: string[];
    onSelected: (id: string[]) => void;
    onDelete: (id: string[]) => void;
    onEdit: (id: string[]) => void;
    selectedName: string | null,
    onSelecedName: (name: string | null) => void
}

const getMax = (min: number, max: number, value: number): number => {
    return Math.min(Math.max(value, min), max);
};


const PaymentModalDialogWithForm: React.FC<FadeModalDialogWithFormProps> = ({
    title,
    onSubmit,
    open,
    onClose,
    products,
    selected,
    onSelected,
    onDelete,
    onEdit,
    selectedName,
    onSelecedName
}) => {
    const [quantityInput, setQuantityInput] = React.useState<number>(0);
    const [updatedProducts, setUpdatedProducts] = React.useState<Product[]>([]); // Start with an empty array

    // Filter products by selected name
    const handleNameChange = (_event: any, value: string | null) => {
        onSelecedName(value);

        // Reset updatedProducts when product name changes
        if (value) {
            const selectedProduct = products.filter((product) => product.name === value);
            setUpdatedProducts([]);
            setTimeout(() => {
                setUpdatedProducts(selectedProduct);
            }, 300)
        }
    };

    // Handle quantity input change
    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = getMax(1, updatedProducts.reduce((total, product) => total + product.quantity, 0), parseInt(event.target.value));
        setQuantityInput(value);
    };

    // Submit form data
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const formData = {
            selectedName: selectedName ?? '',
            quantityInput: String(quantityInput)
        };
        onSubmit(formData);
        onClose();
    };

    // Get unique product names
    const productNames = [...new Set(products.map((product) => product.name))];

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
                            <DialogContent>
                                <form onSubmit={handleSubmit}>
                                    <Stack spacing={2} width={1000} padding={1}>
                                        <Autocomplete
                                            options={productNames}
                                            value={selectedName}
                                            onChange={handleNameChange}
                                        />

                                        {selectedName && updatedProducts.length > 0 && (
                                            <TableSortAndSelection
                                                title={selectedName}
                                                headCells={ProductHeader}
                                                rows={updatedProducts}
                                                onDelete={(id) => {
                                                    onClose();
                                                    onDelete(id);
                                                }}
                                                onEdit={(id) => {
                                                    onClose();
                                                    onEdit(id);
                                                }}
                                                selected={selected}
                                                onSelected={async (id) => onSelected(id)}
                                                isShowTool={false}
                                                onAddProduct={async (_id) => { }}
                                                onHistory={async () => { }}
                                            ></TableSortAndSelection>
                                        )}

                                        {selectedName && (
                                            <>
                                                <p>Quantity</p>
                                                <Input
                                                    type="number"
                                                    name='outNumber'
                                                    onChange={handleQuantityChange}
                                                    value={quantityInput}
                                                ></Input>
                                            </>
                                        )}
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

export default PaymentModalDialogWithForm;
