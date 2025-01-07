import * as React from 'react';
import { Transition } from 'react-transition-group';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import { Card, CardContent, Sheet, Stack, Table, Typography } from '@mui/joy';
interface HistoryProps {
    title: string
    open: boolean
    selected: string[]
    onClose: () => void
    history: any[]
}

export function HistoryModal(props: HistoryProps) {
    function reco(id: string, id1: string) {
        fetch(`https://stockmanagers.onrender.com/api/history/get/${id}`)
            .then((res) => {
                return res.json();
            })
            .then((history) => {
                const data = history.find((x: { _id: string; }) => x._id == id1).oldData as any 
                fetch(`https://stockmanagers.onrender.com/api/stock/edit/${data._id}/Edit`, {
                    method: 'PUT',
                    body: JSON.stringify({ name: data.name, categories: data.categories, quantity: data.quantity, prices: data.prices, expiryDate: data.expiryDate }),
                    credentials: 'omit',
                    headers: { 'Content-Type': 'application/json' },
                })
                    .then((res) => res.json())
                    .then(() => {
                        props.onClose()
                    });
            })
    }
    return (
        <Transition in={props.open} timeout={400}>
            {(state: string) => (
                <Modal
                    keepMounted
                    open={!['exited', 'exiting'].includes(state)}
                    onClose={() => props.onClose()}
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
                    sx={[
                        state === 'exited'
                            ? { visibility: 'hidden' }
                            : { visibility: 'visible' },
                    ]}
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
                        <DialogTitle>{props.title}</DialogTitle>
                        <DialogContent>
                            <br></br>
                            <Sheet
                                variant="solid"
                                color="primary"
                                invertedColors
                                sx={(theme) => ({
                                    pt: 1,
                                    borderRadius: 'sm',
                                    transition: '0.3s',
                                    background: `linear-gradient(45deg, ${theme.vars.palette.primary[500]}`,
                                    '& tr:last-child': {
                                        '& td:first-child': {
                                            borderBottomLeftRadius: '8px',
                                        },
                                        '& td:last-child': {
                                            borderBottomRightRadius: '8px',
                                        },
                                    },
                                })}
                            >
                                <Table stripe="odd" hoverRow>
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Operations</th>
                                            <th>Quantity</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {props.history.filter(x => x.operation !== "Edit").map((x) => (
                                            <>
                                                {x.operation == "Export" ? (
                                                    <tr key={x._id}>
                                                        <td>{x.timestamp}</td>
                                                        <td>{x.operation}</td>
                                                        <td>{x.newData.quantity - x.oldData.quantity}</td>
                                                        <td>
                                                            <Button onClick={() => reco(x.oldData._id, x._id)}>Recovery</Button>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    <tr key={x._id}>
                                                        <td>{x.timestamp}</td>
                                                        <td>{x.operation}</td>
                                                        <td>{x.data.quantity}</td>
                                                        <td>
                                                            <Button disabled>None</Button>
                                                        </td>
                                                    </tr>
                                                )}
                                            </>
                                        ))}
                                    </tbody>
                                </Table>
                            </Sheet>
                        </DialogContent>
                    </ModalDialog>
                </Modal>
            )
            }
        </Transition >
    )
}
