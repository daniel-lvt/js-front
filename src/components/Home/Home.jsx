import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper, Typography } from '@material-ui/core';
import { CardMedia } from '@mui/material';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paper: {
        padding: theme.spacing(2),
        marginTop: 50,
        textAlign: 'left',
        color: theme.palette.text.secondary,
    },
}));

const FullWidthGrid = () => {
    const classes = useStyles();

    return (
        <div className={classes.root} style={{
            maxWidth: '1200px',
            margin:'0 auto 0 auto'
        }}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                    <Paper className={classes.paper}>
                        <Typography variant="h5" color="textPrimary">Descripcion</Typography>
                        <CardMedia
                            component="img"
                            height="130"
                            width="100"
                            image="https://blog.logrocket.com/wp-content/uploads/2022/01/python-developers-guide-react.png"
                            alt="Logo de Python"
                            style={{ objectFit: 'cover', filter: 'blur(5px)', marginBottom: 10 }}
                        />
                        <Typography variant="body1" sx={{ mt: 5 }}>
                            La siguiente APP presenta un informe grafico de resultados del 2019 al 2023 de Accidentes de transito
                            reportados por la Policia Nacional de Colombia
                        </Typography>

                    </Paper>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Paper className={classes.paper}>
                        <Typography variant="h6" color="textPrimary">Genero</Typography>
                        <Typography variant="body1">
                            En esta opcion se presenta la informacion de los accidentes
                            organizada por genero a nivel nacional y departamental
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Paper className={classes.paper}>
                        <Typography variant="h6" color="textPrimary">Armas Medios</Typography>
                        <Typography variant="body1">
                            En esta opcion se presenta la informacion de los accidentes
                            organizada por Armas Medio a nivel nacional y departamental, tipo de
                            vehiculo vinculado al siniestro vial
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Paper className={classes.paper}>
                        <Typography variant="h6" color="textPrimary">Fallecidos</Typography>
                        <Typography variant="body1">
                            En esta opcion se presenta la informacion de los accidentes
                            organizada por numero de personas fallecidas a nivel nacional
                            y departamental
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Paper className={classes.paper}>
                        <Typography variant="h6" color="textPrimary">Grupo Etario</Typography>
                        <Typography variant="body1">
                            En esta opcion se presenta la informacion de los accidentes
                            en torno a grupo etario a nivel nacional y departamental
                        </Typography>
                    </Paper>
                </Grid>
                {/* <Grid item xs={12} sm={12}>
                    <Paper className={classes.paper}>
                        <Typography variant="h6" color="textPrimary">Componente 6</Typography>
                        <Typography variant="subtitle1">Descripción del componente 1</Typography>

                    </Paper>
                </Grid> */}
            </Grid>
        </div>
    );
};

export default FullWidthGrid;