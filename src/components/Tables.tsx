import * as React from 'react';
import Box from '@mui/joy/Box';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import IconButton from '@mui/joy/IconButton';
import Link from '@mui/joy/Link';
import History from '@mui/icons-material/History'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { DeleteForever, Edit, MoreVert } from '@mui/icons-material';
import { Dropdown, FormControl, FormLabel, ListItemDecorator, Menu, MenuButton, MenuItem, Select, Stack } from '@mui/joy';
import Option from "@mui/joy/Option"

interface Data {
    [key: string]: number | string;
}

export interface HeadCell<T extends Data> {
    disablePadding: boolean;
    id: keyof T;
    label: string;
    numeric: boolean;
}

interface TableProps<T extends Data> {
    rows: T[];
    headCells: HeadCell<T>[];
    title: string,
    onEdit: (id: string[]) => void;
    onDelete: (id: string[]) => void;
    selected: string[],
    onSelected: (id: string[]) => {}
    onHistory: (id: string[]) => {}
    onAddProduct: (id: string[]) => {}
    isShowTool: boolean
}

type Order = 'asc' | 'desc';

function labelDisplayedRows({
    from,
    to,
    count,
}: {
    from: number;
    to: number;
    count: number;
}) {
    return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`;
}



interface EnhancedTableProps<T extends Data> {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
    headCells: HeadCell<T>[];
    isShowTool: boolean
}

function EnhancedTableHead<T extends Data>(props: EnhancedTableProps<T>) {
    const { headCells } = props;

    return (
        <thead>
            <tr>
                <th>
                    {props.isShowTool ? (
                        <>
                            {/* <Checkbox
                                indeterminate={numSelected > 0 && numSelected < rowCount}
                                checked={rowCount > 0 && numSelected === rowCount}
                                onChange={onSelectAllClick}
                                sx={{ verticalAlign: 'sub' }}
                            /> */}
                        </>
                    ) : (
                        <></>
                    )}
                </th>
                {headCells.map((headCell) => {
                    return (
                        <th key={headCell.id as string}>
                            {headCell.label == "Expiry Date" ? (
                                <Link
                                    component="button"
                                    sx={{ paddingRight: 2 }}
                                >
                                    {headCell.label}
                                </Link>
                            ) : (
                                <Link
                                    component="button"
                                >
                                    {headCell.label}
                                </Link>
                            )}
                        </th>
                    );
                })}
            </tr>
        </thead>
    );
}

interface TableToolbarProps {
    selected: string[]
    numSelected: number;
    title: string,
    onEdit: (id: string[]) => void,
    onDelete: (id: string[]) => void
    onHistory: (id: string[]) => void
    onAddProduct: (id: string[]) => void
    isShowTool: boolean
}

function TableToolbar(props: TableToolbarProps) {
    const { numSelected } = props;
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                py: 1,
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                borderTopLeftRadius: 'var(--unstable_actionRadius)',
                borderTopRightRadius: 'var(--unstable_actionRadius)',
                bgcolor: numSelected > 0 ? 'background.level1' : undefined,
            }}
        >
            {numSelected > 0 ? (
                <Typography sx={{ flex: '1 1 100%' }} component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    level="body-lg"
                    sx={{ flex: '1 1 100%' }}
                    id="tableTitle"
                    component="div"
                >
                    {props.title}
                </Typography>
            )}
            {props.isShowTool ? (
                <>
                    {numSelected > 0 ? (
                        <Stack spacing={2} direction="row">
                            {/* <Tooltip title="Edit">
                                <>
                                    {numSelected === 1 ? (
                                        <IconButton
                                            size="sm"
                                            color="neutral"
                                            variant="solid"
                                            onClick={() => props.onAddProduct(props.selected)} // Pass selected product to edit
                                        >
                                            <Add />
                                        </IconButton>
                                    ) : (
                                        <IconButton size="sm" color="primary" variant="solid" disabled>
                                            <Add />
                                        </IconButton>
                                    )}
                                    {numSelected === 1 ? (
                                        <IconButton
                                            size="sm"
                                            color="primary"
                                            variant="solid"
                                            onClick={() => props.onEdit(props.selected)} // Pass selected product to edit
                                        >
                                            <Edit />
                                        </IconButton>
                                    ) : (
                                        <IconButton size="sm" color="primary" variant="solid" disabled>
                                            <Edit />
                                        </IconButton>
                                    )}
                                </>
                            </Tooltip>
                            <Tooltip title="Delete">
                                <IconButton
                                    size="sm"
                                    color="danger"
                                    variant="solid"
                                    onClick={() => props.onDelete(props.selected)}
                                //</Tooltip>onClick={handleDelete}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="History">
                                <IconButton
                                    size="sm"
                                    color="success"
                                    variant="solid"
                                    onClick={() => props.onHistory(props.selected)}
                                //</Tooltip>onClick={handleDelete}
                                >
                                    <History />
                                </IconButton>
                            </Tooltip> */}
                        </Stack>
                    ) : (
                        <Stack spacing={2} direction="row">
                            {/* <Tooltip title="Add">
                                <IconButton size="sm" color="danger" variant="solid" disabled>
                                    <Add />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                                <IconButton size="sm" color="primary" variant="solid" disabled>
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                                <IconButton
                                    size="sm"
                                    color="danger"
                                    variant="solid"
                                    //onClick={handleDelete} 
                                    disabled
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="History">
                                <IconButton
                                    size="sm"
                                    color="success"
                                    variant="solid"
                                    onClick={() => { }}
                                    disabled
                                //</Tooltip>onClick={handleDelete}
                                >
                                    <History />
                                </IconButton>
                            </Tooltip> */}
                        </Stack>
                    )}
                </>
            ) : (
                <>
                </>
            )}
        </Box>
    );
}
export default function TableSortAndSelection<T extends Data>({
    rows,
    headCells,
    title,
    onEdit,
    onDelete,
    onSelected,
    selected,
    onHistory,
    onAddProduct,
    isShowTool
}: TableProps<T>) {
    headCells[5] = ({ label: "Actions", id: 'actions', disablePadding: false, numeric: false })
    const [ro, setRo] = React.useState(rows)
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof T>(headCells[0].id);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    React.useEffect(() => {
        setRo(rows)
    })

    const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof T) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = ro.map((n) => n._id as string);
            onSelected(newSelected);
            return;
        }
        onSelected([]);
    };

    const sortedRows = React.useMemo(() => {
        try {
            return ro.map((_v, i) => ro[ro.length - i - 1])
        } catch (e) {
            return []
        }
    }, [order, orderBy, ro]);

    const handleChangePage = (newPage: number) => {
        const nRo = ro
        setRo([])
        setTimeout(() => {
            setRo(nRo)
        }, 10)
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (_event: any, newValue: number | null) => {
        setRowsPerPage(parseInt(newValue!.toString(), 10));
        setPage(0);
    };

    const getLabelDisplayedRowsTo = () => {
        if (ro.length === -1) {
            return (page + 1) * rowsPerPage;
        }
        return rowsPerPage === -1
            ? ro.length
            : Math.min(ro.length, (page + 1) * rowsPerPage);
    };

    return (
        <Sheet
            variant="outlined"
            sx={{ width: '100%', boxShadow: 'sm', borderRadius: 'sm' }}
        >
            <TableToolbar
                numSelected={selected.length}
                title={title}
                selected={selected}
                onDelete={onDelete}
                onEdit={onEdit}
                onHistory={onHistory}
                onAddProduct={onAddProduct}
                isShowTool={isShowTool}
            />
            <Table
                aria-labelledby="tableTitle"
                hoverRow
                sx={{
                    '--TableCell-headBackground': 'transparent',
                    '--TableCell-selectedBackground': (theme) =>
                        theme.vars.palette.success.softBg,
                    '& thead th:nth-child(1)': { width: '40px' },
                    '& thead th:nth-child(2)': { width: '20%' },
                    '& tr > *:nth-child(n+3)': { textAlign: 'center' },
                }}
            >
                <EnhancedTableHead
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy as string}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={ro.length}
                    headCells={headCells}
                    isShowTool={isShowTool}
                />
                <tbody>
                    {ro.length > 0 ? (
                        sortedRows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, _index) => {
                                const isItemSelected = selected.indexOf(row._id as string) !== -1;
                                return (
                                    <tr
                                        key={row.name as string}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        style={
                                            isItemSelected
                                                ? ({
                                                    '--TableCell-dataBackground':
                                                        'var(--TableCell-selectedBackground)',
                                                } as any)
                                                : {}
                                        }
                                    >
                                        <th scope="row">
                                            {isShowTool ? (
                                                // <Checkbox checked={isItemSelected} />
                                                // <IconButton>
                                                //     <label htmlFor="file-upload">
                                                //         <img
                                                //             src={imageBase64}
                                                //             alt="icon"
                                                //             style={{ width: '24px', height: '24px' }}
                                                //         />
                                                //     </label>
                                                //     <input
                                                //         id="file-upload"
                                                //         type="file"
                                                //         style={{ display: 'none' }}
                                                //         onChange={handleFileChange as any}
                                                //     />
                                                // </IconButton>
                                                // {imageBase64 && <img src={imageBase64} alt="Uploaded" style={{ marginTop: '20px' }} />}
                                                <></>
                                            ) : (
                                                <></>
                                            )}
                                        </th>
                                        {headCells.map((cell) => (
                                            <td key={cell.id as string}>
                                                {cell.id === "actions" ? (
                                                    <Dropdown>
                                                        <MenuButton
                                                            slots={{ root: IconButton }}
                                                            slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}
                                                        >
                                                            <MoreVert />
                                                        </MenuButton>
                                                        <Menu placement="bottom-end">
                                                            <MenuItem onClick={() => onEdit([row._id as string])}>
                                                                <ListItemDecorator>
                                                                    <Edit />
                                                                </ListItemDecorator>{' '}
                                                                Edit
                                                            </MenuItem>
                                                            <MenuItem variant="soft" color="danger" onClick={() => onDelete([row._id as string])}>
                                                                <ListItemDecorator sx={{ color: 'inherit' }}>
                                                                    <DeleteForever />
                                                                </ListItemDecorator>{' '}
                                                                Delete
                                                            </MenuItem>
                                                            <MenuItem onClick={() => onHistory([row._id as string])}>
                                                                <ListItemDecorator sx={{ color: 'inherit' }}>
                                                                    <History />
                                                                </ListItemDecorator>{' '}
                                                                History
                                                            </MenuItem>
                                                        </Menu>
                                                    </Dropdown>
                                                ) : (
                                                    row[cell.id]
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })
                    ) : (
                        <tr>
                            <td colSpan={headCells.length + 1} align="center">
                                <Typography>No data available</Typography>
                            </td>
                        </tr>
                    )}
                </tbody>
                {ro.length > 0 && (
                    <tfoot>
                        <tr>
                            <td colSpan={7}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        justifyContent: 'flex-end',
                                    }}
                                >
                                    <FormControl
                                        orientation="horizontal"
                                        size="sm"
                                    >
                                        <FormLabel>Rows per page:</FormLabel>
                                        <Select
                                            onChange={handleChangeRowsPerPage}
                                            value={rowsPerPage}
                                        >
                                            <Option value={5}>5</Option>
                                            <Option value={10}>10</Option>
                                            <Option value={25}>25</Option>
                                        </Select>
                                    </FormControl>
                                    <Typography
                                        sx={{
                                            textAlign: 'center',
                                            minWidth: 80,
                                        }}
                                    >
                                        {labelDisplayedRows({
                                            from:
                                                ro.length === 0
                                                    ? 0
                                                    : page * rowsPerPage + 1,
                                            to: getLabelDisplayedRowsTo(),
                                            count:
                                                ro.length === -1
                                                    ? -1
                                                    : ro.length,
                                        })}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <IconButton
                                            size="sm"
                                            color="neutral"
                                            variant="outlined"
                                            disabled={page === 0}
                                            onClick={() =>
                                                handleChangePage(page - 1)
                                            }
                                            sx={{
                                                bgcolor: 'background.surface',
                                            }}
                                        >
                                            <KeyboardArrowLeftIcon />
                                        </IconButton>
                                        <IconButton
                                            size="sm"
                                            color="neutral"
                                            variant="outlined"
                                            disabled={
                                                ro.length !== -1
                                                    ? page >=
                                                    Math.ceil(
                                                        ro.length /
                                                        rowsPerPage
                                                    ) -
                                                    1
                                                    : false
                                            }
                                            onClick={() =>
                                                handleChangePage(page + 1)
                                            }
                                            sx={{
                                                bgcolor: 'background.surface',
                                            }}
                                        >
                                            <KeyboardArrowRightIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </td>
                        </tr>
                    </tfoot>
                )}
            </Table>
        </Sheet>
    );
}
