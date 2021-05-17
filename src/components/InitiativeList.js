import React from 'react';
import Container from '@material-ui/core/Container';
import { useState, useEffect } from 'react';
import RestService from '../rest/initiative-rest'

export default function InitiativeList() {
    const [state, setState] = useState({
        initiatives: []
    });

    useEffect(() => {
        async function fetchData() {
        RestService.getAllPending(initiativeList => {
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

    return (
        <Container component="main" maxWidth="xs">
            { // Acá habría que renderizar por cada i (iniciativa)
                state.initiatives.map(i => <h1>{i.description}</h1>)
            }
        </Container>
    );
}