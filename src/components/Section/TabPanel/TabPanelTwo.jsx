import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import { itemIndex } from '../../../utils/itemData';
import lodash from 'lodash';
import axios from 'axios';


const Div = styled('div')(({ theme }) => ({
    ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
}));

const colors = {
    0: 'rgba(255, 99, 132, 0.2)',
    1: 'rgba(54, 162, 235, 0.2)',
    2: 'rgba(255, 206, 86, 0.2)',
    3: 'rgba(60, 179, 113,0.2)',
    4: 'rgba(255, 165, 0, 0.2)',
    5: 'rgba(106, 90, 205, 0.2)',
}


export default function BasicGrid({ ...args }) {
    const { departamentData = [], vehicleData = [], dataDB = [] } = args;

    const [idxDepartament, setIdxDepartament] = useState({});
    const [idxMunicipality, setIdxMunicipality] = useState({});

    const [nameDepartament, setNameDepartament] = useState('');
    const [nameMunicipality, setNameMunicipality] = useState('')

    const [data, setData] = useState([]);
    const [isDepartament, setIsDepartament] = useState(true);

    const [departament, setDepartament] = useState(null)
    const [municipality, setMunicipality] = useState(null);


    const [dataFilter, setDataFilter] = useState([]);
    const [dataMunicipality, setDataMunicipality] = useState([]);

    const [dataBars, setDataBars] = useState([]);

    const [departamentTable, setDepartamentTable] = useState([]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'departament') {
            console.log('departamento es seleccionado')
            setDepartament(value)
            const [result] = idxDepartament.filter(({ idx }) => (idx === value))
            if (typeof (value) == 'string') {
                setMunicipality(null)
                setNameMunicipality('')
            }
            if (result) {
                const { name = '' } = result;
                if ((name || '')?.trim().length) {
                    setNameDepartament(name)
                }
            }
        }
        if (name === 'municipality') {
            setMunicipality(value)
            const numbSearch = value + 100;
            const [result] = (idxMunicipality || []).filter(({ idx }) => (idx === numbSearch))

            if (result) {
                const { name = '' } = result;
                if ((name || '').trim().length) {
                    // setNameMunicipality(name)
                    // setName(name)
                }
            }
        }
    };

    useEffect(() => {
        setIdxDepartament(itemIndex(departamentData));
        if (dataMunicipality) {
            setIdxMunicipality(itemIndex(dataMunicipality, true))
        }
    }, [departament, departamentData, dataMunicipality])


    useEffect(() => {
        if (typeof (departament) == 'string' || departament == null) {
            setIsDepartament(true)
            setDataFilter([])
            setNameDepartament('')
        } else {
            if (typeof (departament) == 'number') {
                setDataMunicipality([]);
                setIsDepartament(false)
                setMunicipality(null)
            }
        }
    }, [departament])



    useEffect(() => {
        let url = `http://localhost:5000/api/data`;
        if (nameDepartament?.trim()?.length && nameMunicipality?.trim().length) {
            url = `${url}?DEPARTAMENTO=${(nameDepartament || '').toUpperCase()}&MUNICIPIO=${(nameMunicipality).trim().toUpperCase()}`
            axios.get(url)
                .then(response => {
                    const { data: { data } } = response;
                    setDataFilter(data);
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            if (nameDepartament?.trim()?.length) {
                url = `${url}?DEPARTAMENTO=${(nameDepartament || '').toUpperCase()}`
            }

            axios.get(url)
                .then(response => {
                    const { data: { data } } = response;
                    setDataFilter(data);
                })
                .catch(error => {
                    console.log(error);
                });
        }
        console.log(url);
    }, [departament, nameDepartament, municipality, setNameDepartament, nameMunicipality]);


    useEffect(() => {
        if (!nameDepartament.length) {
            setMunicipality(null)
            setNameMunicipality('')
        }
    }, [nameDepartament])


    useEffect(() => {
        if (nameDepartament.length && dataFilter) {
            const municipalityResult = lodash.groupBy((dataFilter), 'MUNICIPIO');
            setDataMunicipality(Object.keys(municipalityResult || {}))
        }
    }, [nameDepartament, dataFilter, nameMunicipality])

    const onClickEvent = () => {
        const dataResult = lodash.groupBy((dataFilter.length ? dataFilter : dataDB), 'ARMAS MEDIOS')
        const dataObject = (vehicleData || []).map((key, idx) => ({
            prop: {
                label: key,
                data: [dataResult[key]?.length],
                background: colors[idx]
            },
            name: key,
            number: dataResult[key]?.length
        }));

        const departamentTable = lodash.groupBy((dataDB), 'DEPARTAMENTO');
        const out = Object.keys(departamentTable);
        const tableResult = (out || []).map(element => {
            const dataElement = lodash.groupBy(departamentTable[element], 'ARMAS MEDIOS');
            const keys = Object.keys(dataElement)
            const values = keys.map(x => ({ name: x, value: dataElement[x].length }));
            let obj = {};
            for (let i = 0; i < values.length; i++) {
              obj[values[i].name] = values[i].value;
            }
            return {
                name: element,
                value: values,
                obj
            }
        })
        setDepartamentTable(tableResult)

        setDataBars(dataObject);
        const arr = (vehicleData || []).map(key => dataResult[key]?.length)
        setData(arr)
    }

    console.log(departamentTable)

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Div>Armas Medio Accidentes</Div>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <FormControl sx={{
                        m: .5,
                        minWidth: '100%',
                    }} size="small">
                        <InputLabel id="demo-select-small-label">Departamento</InputLabel>
                        <Select
                            labelId="demo-select-small-label"
                            id="demo-select-small"
                            value={departament}
                            label="Departamento"
                            name='departament'
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {
                                departamentData.map((elx, id) => (
                                    <MenuItem
                                        value={id}
                                        key={`idy-${id}`}
                                    >
                                        {elx}
                                    </MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>

                    <FormControl sx={{ m: .5, minWidth: '100%' }} size="small">
                        <InputLabel id="demo-select-small-label">Municipio</InputLabel>
                        <Select
                            labelId="demo-select-small-label"
                            id="demo-select-small"
                            value={municipality}
                            label="Municipio"
                            onChange={handleChange}
                            name='municipality'
                            disabled={isDepartament}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {
                                dataMunicipality.map((elx, id) => (
                                    <MenuItem value={id} key={`idx-${id}`}>
                                        {elx}
                                    </MenuItem>

                                ))
                            }
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <Button
                        variant="outlined"
                        sx={{ mt: .8, minWidth: '100%' }}
                        onClick={onClickEvent}
                    >
                        Graficar
                    </Button>
                </Grid>
            </Grid>

            <Grid item xs={12}>
                <Grid container justifyContent="center" spacing={2}>
                    <Grid item>
                        <Paper
                            sx={{
                                mt: 5,
                                pb: 2,
                                height: '18rem',
                                width: '32rem',
                                px: 2,
                                backgroundColor: (theme) =>
                                    theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                                justifyContent: 'center',
                                alignContent: 'center',
                                alignItems: 'center',
                                display: 'flex'
                            }}
                        >
                            <Pie data={{
                                labels: (vehicleData),
                                datasets: [
                                    {
                                        data,
                                        backgroundColor: [
                                            'rgba(255, 99, 132, 0.2)',
                                            'rgba(54, 162, 235, 0.2)',
                                            'rgba(255, 206, 86, 0.2)',
                                            'rgba(60, 179, 113,0.2)',
                                            'rgba(255, 165, 0, 0.2)',
                                            'rgba(106, 90, 205, 0.2)',
                                        ],
                                        borderColor: [
                                            'rgba(255, 99, 132, 1)',
                                            'rgba(54, 162, 235, 1)',
                                            'rgba(255, 206, 86, 1)',
                                            'rgba(60, 179, 113,1)',
                                            'rgba(255, 165, 0, 1)',
                                            'rgba(106, 90, 205, 1)',
                                        ],
                                        borderWidth: 1,
                                    },
                                ]
                            }}

                                options={{
                                    plugins: {
                                        title: {
                                            display: true,
                                            text: `Numero Armas Medio accidentes ${nameDepartament.length > 0 ? ` - ${nameDepartament}` : ''}`,
                                        },
                                        legend: {
                                            position: 'bottom',
                                        },
                                    },
                                }} />
                        </Paper>
                    </Grid>
                    <Grid item>
                        <Paper
                            sx={{
                                mt: 5,
                                pb: 2,
                                height: '18rem',
                                width: '32rem',
                                px: 2,
                                backgroundColor: (theme) =>
                                    theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                                justifyContent: 'center',
                                alignContent: 'center',
                                alignItems: 'center',
                                display: 'flex'
                            }}
                        >
                            <Bar
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: 'top',
                                        },
                                        title: {
                                            display: true,
                                            text: 'Numero Armas Medio Accidentes ',
                                        },
                                    },
                                }}
                                data={{
                                    labels: ['ARMAS MEDIOS'],
                                    datasets: (dataBars || []).map(({ prop }) => ({ ...prop })),
                                }}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                <TableContainer component={Paper} sx={{ mt: 3, maxWidth: 1300 }}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Descripcion</TableCell>
                                {
                                    (dataBars || []).map(({ name }) => (
                                        <TableCell align="center">{name}</TableCell>
                                    ))
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {'Numero de accidentes producidos por armas medio' +
                                        ` ${nameDepartament ? nameDepartament : ''}`}
                                </TableCell>
                                {
                                    (dataBars || []).map(({ number }) => (
                                        <TableCell align="center">{number || 0}</TableCell>
                                    ))
                                }
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Div sx={{ mt: 2 }}>Listado a nivel Departamental</Div>
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                <TableContainer component={Paper} sx={{ mt: 3, maxWidth: 1300 }}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell align='center'>Departamento</TableCell>
                                <TableCell align='center'>MOTO</TableCell>
                                <TableCell align="center">NO REPORTADO</TableCell>
                                <TableCell align="center">SIN EMPLEO DE ARMAS</TableCell>
                                <TableCell align="center">VEHICULO</TableCell>
                                <TableCell align="center">BICICLETA</TableCell>
                                <TableCell align="center">TREN</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                departamentTable.map(({ name, value,obj }) => (
                                    <TableRow
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="center">{name || ''}</TableCell>
                                        <TableCell align="center">{obj['MOTO']|| 0}</TableCell>
                                        <TableCell align="center">{obj['NO REPORTADO']|| 0}</TableCell>
                                        <TableCell align="center">{obj['SIN EMPLEO DE ARMAS']|| 0}</TableCell>
                                        <TableCell align="center">{obj['VEHICULO'] || 0}</TableCell>
                                        <TableCell align="center">{obj['BICICLETA'] || 0}</TableCell>
                                        <TableCell align="center">{obj['TREN']|| 0}</TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>


        </Box>
    );
}