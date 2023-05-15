import * as React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TabOne from './TabPanel/TabPanelOne';
import TabTwo from './TabPanel/TabPanelTwo';
import TabThree from './TabPanel/TabPanelThree'
import TabFour from './TabPanel/TabPanelFour';
import axios from 'axios';
import { useState, useEffect } from 'react';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function FullWidthTabs() {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [departament, setDepartaments] = useState([]);
  const [gender, setGender] = useState([]);
  const [data, setData] = useState([]);
  const [vehicle, setVehicle] = useState([]);
  const [amount, setAmount] = useState([]);
  const [ageGroup, setAgeGroup] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/group?filter=DEPARTAMENTO')
      .then(response => {
        const { data: { data } } = response;
        setDepartaments(data);
      })
      .catch(error => {
        console.log(error);
      });

    axios.get('http://localhost:5000/api/group?filter=GENERO')
      .then(response => {
        const { data: { data } } = response;
        setGender(data);
      })
      .catch(error => {
        console.log(error);
      });
    axios.get('http://localhost:5000/api/data')
      .then(response => {
        const { data: { data } } = response;
        setData(data);
      })
      .catch(error => {
        console.log(error);
      });

    axios.get('http://localhost:5000/api/group?filter=ARMAS MEDIOS')
      .then(response => {
        const { data: { data } } = response;
        setVehicle(data);
      })
      .catch(error => {
        console.log(error);
      });

    axios.get('http://localhost:5000/api/group?filter=CANTIDAD')
      .then(response => {
        const { data: { data } } = response;
        setAmount(data);
      })
      .catch(error => {
        console.log(error);
      });
    axios.get('http://localhost:5000/api/group?filter=GRUPO ETARÍO')
    .then(response => {
      const { data: { data } } = response;
      setAgeGroup(data);
    })
    .catch(error => {
      console.log(error);
    });
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', width: '100%' }}>
      <div
      >
        Electiva Datos en Python
      </div>
      <AppBar position="static">
        <Tabs
          sx={{ bgcolor: '#21839A' }}
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Descripcion" {...a11yProps(0)} />
          <Tab label="Genero" {...a11yProps(1)} />
          <Tab label="Armas Medios" {...a11yProps(2)} />
          <Tab label="Fallecidos" {...a11yProps(3)} />
          <Tab label="Item Three" {...a11yProps(4)} />
          <Tab label="Item Three" {...a11yProps(5)} />
          <Tab label="Item Three" {...a11yProps(6)} />

        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          Item Three
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <TabOne
            departamentData={departament}
            genderData={gender}
            dataDB={data}
          />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <TabTwo
            departamentData={departament}
            vehicleData={vehicle}
            dataDB={data}
          />
        </TabPanel>
        <TabPanel value={value} index={3} dir={theme.direction}>
          <TabThree
            departamentData={departament}
            amountData={amount}
            dataDB={data}
          />
        </TabPanel>
        <TabPanel value={value} index={4} dir={theme.direction}>
          <TabFour
            departamentData={departament}
            ageGroupData={ageGroup}
            dataDB={data}
          />
        </TabPanel>
        <TabPanel value={value} index={5} dir={theme.direction}>
          Item Five
        </TabPanel>
        <TabPanel value={value} index={6} dir={theme.direction}>
          Item Six
        </TabPanel>
      </SwipeableViews>
    </Box>
  );
}