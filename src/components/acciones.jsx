import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import './acction.css'
import { useNavigate } from 'react-router-dom';
import ApiMostraRestante from '../components/apiMostrarRestante';
import ModalEliminacion from '../components/modalEliminacion';
import Tooltip from '@mui/material/Tooltip';

//iconos
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';

const Acciones = (id) => {

    const navigate = useNavigate();

    //variables mostrar
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    //variables modal eliminar
    const [openModal, setOpenModal] = useState(false);
    const [datos, setDatos] = useState([]);

    useEffect(() => {
        // console.log("lo que llega primero:",id);
        if (id != null || id != undefined) {
            // console.log("segundo",id.id);
            if (id.id != undefined) {
                fetch(`http://127.0.0.1:5000/ambiente/one/${id.id.idTabla}`)
                    .then(response => response.json())
                    .then(data => {
                        setDatos(data);
                    })
                    .catch(error => console.error("Error al obtener los datos:", error));
            }
        }
    }, [id]);

    const reloadCurrentRoute = () => {
        navigate('/');
        setTimeout(() => {
            navigate('/gestionar-ambiente');
        }, 1);
    };

    const handleMostrar = () => {
        if (id != null || id != undefined) {
            // console.log("segundo",id.id);
            if (id.id != undefined) {
                fetch(`http://127.0.0.1:5000/ambiente/one/${id.id.idTabla}`)
                    .then(response => response.json())
                    .then(data => {
                        setDatos(data);
                    })
                    .catch(error => console.error("Error al obtener los datos:", error));
            }
        }
        handleOpen();
    };

    const handleEditar = () => {
        if(id.id != undefined){
            console.log('Editar', id.id.idTabla);
            navigate(`/editar-ambiente/${id.id.idTabla}`);
        }
    };

    const handleEliminar = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/ambiente/delete/${id.id.idTabla}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                console.log('Ambiente eliminado exitosamente');
            } else {
                const errorMessage = await response.text();
                console.error('Error al eliminar el ambiente:', errorMessage);
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);

    };

    const handleConfirmDelete = () => {
        console.log('Eliminacion confirmada');
        console.log('Eliminar', id.id.idTabla);
        handleEliminar();
        // window.location.reload();
        reloadCurrentRoute();
        handleCloseModal();
    };


    const handleConfiguraciones = () => {
        console.log('Setings', id.id.idTabla);
        navigate('/disponibilidad-ambiente');
    };

    return (
        <>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <Tooltip title="Mostrar" placement="top">
                    <RemoveRedEyeIcon color="primary" onClick={handleMostrar} />
                </Tooltip>
                <Tooltip title="Editar" placement="top">
                    <EditNoteIcon color="secondary" onClick={handleEditar} />
                </Tooltip>
                <Tooltip title="Eliminar" placement="top">
                    <DeleteIcon color="info" onClick={handleOpenModal} />
                </Tooltip>
                <Tooltip title="Configuraciones" placement="top">
                    <SettingsIcon color="warning" onClick={handleConfiguraciones} />
                </Tooltip>
                <ModalEliminacion
                    open={openModal}
                    handleClose={handleCloseModal}
                    handleDelete={handleConfirmDelete}
                />
            </div>
            <div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    sx={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '500px',
                        height: '500px',
                        background: '#fffff8',
                        border: '2px solid #000'
                    }}
                >
                    <div>
                        {datos != undefined ? (
                            <div className='estilo-cuadroText'>
                                <div className='estilo-boton'>
                                    <Button onClick={handleClose}>x</Button>
                                </div>
                                <h1 className='title'>Detalles de ambiente</h1>
                                <p>Nombre del Ambiente: {datos.nombre_amb}</p>
                                <p>Descripción: {datos.descripcion_amb}</p>
                                <p>Ubicación: {datos.ubicacion_amb}</p>
                                <p>Capacidad: {datos.capacidad_amb}</p>
                                {datos.cod_tipo_ambiente != undefined && datos.cod_estado_ambiente != undefined &&
                                    datos.cod_edificacion != undefined && datos.cod_facultad != undefined && datos.cod_piso != undefined ? (
                                    <ApiMostraRestante
                                        idTipo={datos.cod_tipo_ambiente.toString()}
                                        idEstado={datos.cod_estado_ambiente.toString()}
                                        idEdificacion={datos.cod_edificacion.toString()}
                                        idFacultad={datos.cod_facultad.toString()}
                                        idPiso={datos.cod_piso.toString()}
                                    />
                                ) : (
                                    <p>No se pueden mostrar los datos adicionales</p>
                                )}
                                {/* Otros campos del objeto */}
                            </div>
                        ) : (
                            <p>Cargando datos...</p>
                        )}
                    </div>


                </Modal>
            </div>
        </>
    );
};

export default Acciones;
