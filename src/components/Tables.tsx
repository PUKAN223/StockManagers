import * as React from 'react';
import Box from '@mui/joy/Box';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Checkbox from '@mui/joy/Checkbox';
import IconButton from '@mui/joy/IconButton';
import Link from '@mui/joy/Link';
import Tooltip from '@mui/joy/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import History from '@mui/icons-material/History'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Product from '@mui/icons-material/ProductionQuantityLimits';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Add from "@mui/icons-material/Add"
import { ArrowUpward, DeleteForever, Edit, MoreVert, Settings } from '@mui/icons-material';
import { Button, ButtonGroup, Divider, Dropdown, FormControl, FormLabel, Input, ListDivider, ListItemDecorator, Menu, MenuButton, MenuItem, Select, Stack, SvgIcon } from '@mui/joy';
import Option from "@mui/joy/Option"
import { styled } from '@mui/joy';

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

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator<T>(
    order: Order,
    orderBy: keyof T,
): (a: T, b: T) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
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
    const { onSelectAllClick, orderBy, numSelected, rowCount, onRequestSort, headCells } = props;
    const createSortHandler = (property: keyof T) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

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
                    const active = orderBy === headCell.id;
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
    const [imageBase64, setImageBase64] = React.useState('data:image/png;base64,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');
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

    const handleClick = (_event: React.MouseEvent<unknown>, name: string) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected: string[] = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }
        onSelected(newSelected);
    };

    const sortedRows = React.useMemo(() => {
        try {
            return ro.map((v, i) => ro[ro.length - i - 1])
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
