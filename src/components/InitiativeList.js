import React from 'react';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import { useState, useEffect } from 'react';
import restClient from '../rest/rest-client'
import { authenticated } from "../session/SessionUtil";


export const InitiativeList = ({ history }) =>   {
    const [state, setState] = useState({
        initiatives: []
    });

    // ---- START / PIDO INICIATIVAS AL BACKEND ----
    useEffect(() => {
        if (!authenticated()) {
            history.push("/login");
        }

        async function fetchData() {
            restClient.getAllPending(initiativeList => {
                initiativeList.forEach(addInitiative)
            })
        }
        fetchData();
    }, []);

    function addInitiative(i) {
        setState((prevState) => {
            const initiatives = [...prevState.initiatives];
            initiatives.push(i);
            return { ...prevState, initiatives };
        });
    }
    // ------ END / PIDO INICIATIVAS AL BACKEND ---- 

    return (
        <Container component="main" maxWidth="xs">

            { // Acá habría que renderizar por cada i (iniciativa)
                state.initiatives.map(i => <h1>{i.description}</h1>)
            }



            { /* LOGOUT BUTTON */ }
            <Button onClick={() => history.push('/logout')}>LOGOUT</Button> 
        </Container>
    );
}