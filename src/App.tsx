import { Button, Stack } from '@mui/joy';
import './css/App.css';
import { PieChart } from '@mui/x-charts/PieChart';

import Add from '@mui/icons-material/Add';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TableSortAndSelection, { HeadCell } from './components/Tables';
import { useEffect, useState } from 'react';
import FadeModalDialogWithForm, { FormField } from './components/Modals';
import SnackbarColors from './components/Nofications';
import PaymentModalDialogWithForm from './components/PaymentModals';
import { HistoryModal } from './components/HistoryModal';

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
  }
];

interface StockData {
  _id: string;
  name: string;
  categories: string;
  quantity: number;
  prices: number;
  expiryDate: string;
}

function App() {
  const [quantity, setQuatity] = useState<number>(0);
  const [data, setData] = useState<StockData[]>([]);
  const [open1, setOpen1] = useState<boolean>(false);
  const [open2, setOpen2] = useState<boolean>(false);
  const [open3, setOpen3] = useState<boolean>(false);
  const [history, setHistory] = useState<any>([])
  const [open4, setOpen4] = useState<boolean>(false);
  const [open5, setOpen5] = useState<boolean>(false);
  const [nofications, setNofications] = useState<{ open: boolean; message: string }>({ open: false, message: '' });
  const [nameOptions, setNameOptions] = useState<{ inputValue: string; title: string }[]>([]);
  const [categoriesOptions, setCategoriesOptions] = useState<{ inputValue: string; title: string }[]>([]);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [name, setName] = useState<string>()
  const [formData, setFormData] = useState<StockData>({
    _id: '',
    name: '',
    categories: '',
    quantity: 0,
    prices: 0,
    expiryDate: ''
  })

  const [fields, setFields] = useState<FormField[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  // Fetch data and set autocomplete options
  const fetchHistory = (id: string[]) => {
    const historyDataArray: any[] = [];

    Promise.all(id.map(d =>
      fetch(`https://stockmanagers.onrender.com/api/history/get/${d}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((history) => {
          if (Array.isArray(history)) {
            history.forEach(record => {
              if (record && record.operation) {
                historyDataArray.push(record);
              } else {
                console.warn('Skipping record due to missing operation', record);
              }
            });
          } else {
            console.warn('Received data is not an array or missing operation field', history);
          }
        })
        .catch((err) => {
          console.error('Error fetching history:', err);
        })
    )).then(() => {
      console.log(historyDataArray)
      setHistory(historyDataArray);
    });
  };

  useEffect(() => {
    setData([])
    setNameOptions([])
    setCategoriesOptions([])
    setTimeout(() => {
      fetch('https://stockmanagers.onrender.com/api/stock/get')
        .then((res) => res.json() as Promise<StockData[]>)
        .then((data) => {
          if (data && (data as any).message !== "No stocks found") {
            setData(data);
            setNameOptions(data.map(x => ({ inputValue: x.name, title: x.name })) ?? [{ inputValue: "None", title: "None" }])
            setCategoriesOptions(data.map(x => ({ inputValue: x.categories, title: x.categories })) ?? [{ inputValue: "None", title: "None" }])
          } else {
            setNameOptions([{ inputValue: "None", title: "None" }])
            setCategoriesOptions([{ inputValue: "None", title: "None" }])
          }
        });
    }, 300)
  }, [nofications]);

  useEffect(() => {
    setFields([
      {
        name: 'Name',
        label: ' ',
        type: 'text',
        value: formData.name,
        onChange: (value) => updateFormData('name', value),
      },
      {
        name: 'Category',
        label: ' ',
        type: 'text',
        value: formData.categories,
        onChange: (value) => updateFormData('categories', value)
      },
      {
        name: 'Quantity',
        label: 'Enter product quantity.',
        type: 'number',
        value: formData.quantity.toString(),
        onChange: (value) => updateFormData('quantity', parseInt(value) || 0),
      },
      {
        name: 'Prices',
        label: 'Enter product price.',
        type: 'number',
        value: formData.prices.toString(),
        onChange: (value) => updateFormData('prices', parseFloat(value) || 0),
      },
      {
        name: 'Expiry Date',
        label: 'Select expiry date.',
        type: 'date',
        value: formData.expiryDate,
        onChange: (value) => updateFormData('expiryDate', value),
      }
    ]);
  }, [formData, nameOptions, categoriesOptions]);

  const updateFormData = (field: keyof StockData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    fetchHistory(selected)
  }, [open4])

  useEffect(() => {
    if (open1) {
      setFormData({ _id: '', name: '', categories: '', quantity: 0, prices: 0, expiryDate: '' });
    }
  }, [open1]);

  const handleDelete = (ids: string[]) => {
    ids.forEach(id => {
      console.log(id)
      fetch(`https://stockmanagers.onrender.com/api/stock/remove/${id}`, {
        method: 'DELETE',
        credentials: 'omit',
        headers: { 'Content-Type': 'application/json' },
      })
        .then((res) => res.json())
        .then(() => {
          setNofications({ open: true, message: 'Delete product successfully.' });
          setSelected([])
        });
    })
  }

  const handleAddSubmit = () => {
    fetch('https://stockmanagers.onrender.com/api/stock/add', {
      method: 'POST',
      body: JSON.stringify({ name: formData.name, categories: formData.categories, quantity: formData.quantity, prices: formData.prices, expiryDate: formData.expiryDate }),
      credentials: 'omit',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then(() => {
        setOpen1(false);
        setNofications({ open: true, message: 'Add product successfully.' });
        setSelected([])
      });
  };

  const handleAddQSubmit = (_id: string[]) => {
    // fetch(`https://stockmanagers.onrender.com/api/stock/get`)
    //   .then((res) => res.json())
    //   .then(() => {
    //     setOpe
    //   })
  };
  // Handle Edit Product
  const handleEditSubmit = () => {
    fetch(`https://stockmanagers.onrender.com/api/stock/edit/${formData._id}/Edit`, {
      method: 'PUT',
      body: JSON.stringify({ name: formData.name, categories: formData.categories, quantity: formData.quantity, prices: formData.prices, expiryDate: formData.expiryDate }),
      credentials: 'omit',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then(() => {
        setOpen2(false);
        setNofications({ open: true, message: 'Edit product successfully.' });
        setSelected([])
      });
  };

  const handleEdit = (id: string[]) => {
    const stockTarget = data.find((x) => x._id === id[0]);
    if (stockTarget) {
      setFormData(stockTarget);
      setOpen2(true);
    }
  };

  return (
    <div className='containers'>
      <Stack spacing={2} direction={'row'} useFlexGap sx={{ flexWrap: 'wrap' }}>
        <Button
          color='primary'
          variant='solid'
          startDecorator={<Add />}
          sx={{ boxShadow: 'sm' }}
          onClick={() => setOpen1(true)}
        >
          Add Product
        </Button>
        <Button
          color='success'
          variant='solid'
          startDecorator={<AccountBalanceWalletIcon />}
          sx={{ boxShadow: 'sm' }}
          onClick={() => {
            setQuatity(0)
            setOpen3(true)
          }}
        >
          Create Payment
        </Button>
        <TableSortAndSelection
          title={'Product'}
          headCells={ProductHeader}
          rows={data}
          onDelete={(id) => handleDelete(id)}
          onEdit={handleEdit}
          selected={selected}
          onSelected={async (id) => setSelected(id)}
          onHistory={async (id) => {
            fetchHistory(id)
            setName(data.find(x => x._id == id[0])?.name)
            setOpen4(true)
          }}
          onAddProduct={async (_id) => setOpen5(true)}
          isShowTool={true}
        />
      </Stack>
      <FadeModalDialogWithForm
        onClose={() => setOpen5(false)}
        open={open5}
        title='Add Quantity'
        fields={
          [
            {
              "type": "number",
              "name": "",
              "label": "Enter number.",
              "value": String(quantity),
              "onChange": (value) => {
                if (/^-?\d+\.?\d*$/.test(value)) {
                  setQuatity(parseInt(value))
                } else {
                  value.replace(/\d+\.?\d*$/, "")
                  if (value.length == 0) {
                    setQuatity(0)
                  } else {
                    setQuatity(parseInt(value))
                  }
                }
              }
            }
          ]
        }
        onSubmit={async (id) => handleAddQSubmit(id as any)}
      />

      <FadeModalDialogWithForm
        onClose={() => setOpen2(false)}
        open={open2}
        title='Edit Product'
        fields={fields}
        onSubmit={handleEditSubmit}
      />
      <HistoryModal
        history={history}
        selected={selected}
        title={`History | ${name}`}
        open={open4}
        onClose={() => {
          setOpen4(false)
          setNofications({ open: true, message: 'Recovery product successfully.' });
        }}
      />
      <SnackbarColors
        color='success'
        variant='solid'
        open={nofications.open}
        message={nofications.message}
        onClose={() => setNofications({ open: false, message: '' })}
      />
      <FadeModalDialogWithForm
        onClose={() => setOpen1(false)}
        open={open1}
        title='Add Product'
        fields={fields}
        onSubmit={handleAddSubmit}
      />
      <PaymentModalDialogWithForm
        selectedName={selectedName}
        onSelecedName={(name) => {
          setSelectedName(name)
        }}
        title='Create Payment'
        open={open3}
        onSubmit={(ev) => {
          const amount = parseInt(ev.quantityInput);
          const dataF = data.filter(x => x.name == ev.selectedName)

          getEx(amount, dataF).forEach(x => {
            fetch(`https://stockmanagers.onrender.com/api/stock/edit/${x._id}/Export`, {
              method: 'PUT',
              body: JSON.stringify({ name: x.name, categories: x.categories, quantity: x.quantity, prices: x.prices, expiryDate: x.expiryDate }),
              credentials: 'omit',
              headers: { 'Content-Type': 'application/json' },
            })
              .then((res) => res.json())
              .then(() => {
                setOpen3(false);
                setNofications({ open: true, message: 'Create payment successfully.' });
                setSelected([])
                setSelectedName(null)
              });
          })
        }}
        onClose={() => {
          setSelectedName(null)
          setOpen3(false)
        }}
        products={data}
        selected={selected}
        onSelected={(id) => setSelected(id)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      ></PaymentModalDialogWithForm>
      <>
        <PieChart
          series={[
            {
              data: [{ "color": '', "label": "tooltip", "value": 1, "id": "1" }],
              innerRadius: 30,
              outerRadius: 100,
              paddingAngle: 5,
              cornerRadius: 5,
              startAngle: -45,
              endAngle: 225,
              cx: 150,
              cy: 150,
            }
          ]}
        />
      </>
    </div>
  );
}

export default App;


const getEx = (quantityToRemove: number, data: StockData[]): StockData[] => {
  const updatedData = [...data];

  for (let i = 0; i < updatedData.length && quantityToRemove > 0; i++) {
    const product = updatedData[i];

    if (product.quantity >= quantityToRemove) {
      product.quantity -= quantityToRemove;
      quantityToRemove = 0;
    } else {
      quantityToRemove -= product.quantity;
      product.quantity = 0;
    }
  }

  return updatedData;
};
