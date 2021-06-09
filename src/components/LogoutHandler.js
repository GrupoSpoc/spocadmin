import React from 'react';
import { useEffect } from 'react';
import { clearJWT } from "../session/SessionUtil";


export const LogoutHandler = ({ history }) => {
    useEffect(
      () => {
        clearJWT()
        history.push("/login");
      },
      [history]
    );

    return <div />;
};