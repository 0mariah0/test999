import React from 'react';
import { useDispatch } from 'react-redux';
import { changeRoute } from '../../store/app/appActions';

const Link = ({ to, children, ...props }) => {
    const dispatch = useDispatch();

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(changeRoute(to));
    };
    return (
        <a onClick={handleClick} {...props}>
            {children}
        </a>
    );
};

export default Link;
