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


export default function BasicGrid({ ...args }) {
  const { departamentData = [], genderData = [], dataDB = [] } = args;

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

  const [departamentTable, setDepartamentTable] = useState([]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'departament') {
      // console.log('departamento es seleccionado')
      setDepartament(value)
      const [result] = idxDepartament.filter(({ idx }) => (idx === value));
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
      const [result] = (idxMunicipality || []).filter(({ idx }) => (idx === numbSearch));
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
    const dataResult = lodash.groupBy((dataFilter.length ? dataFilter : dataDB), 'GENERO')
    const departamentTable = lodash.groupBy((dataDB), 'DEPARTAMENTO');
    const out = Object.keys(departamentTable);
    const tableResult = (out || []).map(element => {
      const dataElement = lodash.groupBy(departamentTable[element], 'GENERO');
      const keys = Object.keys(dataElement)
      return {
        name: element,
        value: keys.map(x => ({ name: x, value: dataElement[x].length }))
      }
    })
    setDepartamentTable(tableResult)
    const arr = (genderData || []).map(key => dataResult[key]?.length)
    setData(arr)
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Div>Accidentes producidos por Genero</Div>
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
                labels: genderData,
                datasets: [
                  {
                    data,
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 206, 86, 0.2)',
                    ],
                    borderColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                    ],
                    borderWidth: 1,
                  },
                ]
              }}

                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: `Numero de accidentes Producidos por Genero ${dataFilter.length ? ` - ${nameDepartament}` : ''}`,
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
                      text: 'Numero de accidentes Producidos por Genero',
                    },
                  },
                }}
                data={{
                  labels: ['Genero'],
                  datasets: [
                    {
                      label: 'Masculino',
                      data: [data[0]] || [],
                      backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    },
                    {
                      label: 'Femenino',
                      data: [data[1]] || [],
                      backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    },
                    {
                      label: 'No Reportado',
                      data: [data[2]] || [],
                      backgroundColor: 'rgba(255, 206, 86, 1)',
                    },
                  ],
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
                <TableCell align="center">Masculino</TableCell>
                <TableCell align="center">Femenino</TableCell>
                <TableCell align="center">No Reportado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {'Numero de accidentes producidos por genero' +
                    ` ${nameDepartament ? `departamento de ${nameDepartament}` : ''}`}
                </TableCell>
                <TableCell align="center">{data[0]}</TableCell>
                <TableCell align="center">{data[1]}</TableCell>
                <TableCell align="center">{data[2] || 0}</TableCell>
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
                <TableCell align="center">Masculino</TableCell>
                <TableCell align="center">Femenino</TableCell>
                <TableCell align="center">No Reportado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                departamentTable.map(({ name, value }) => (
                  <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align="center">{name || ''}</TableCell>
                    <TableCell align="center">{value[0]?.value || 0}</TableCell>
                    <TableCell align="center">{value[1]?.value || 0}</TableCell>
                    <TableCell align="center">{value[2]?.value || 0}</TableCell>
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