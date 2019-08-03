import React from 'react';
import PropTypes from 'prop-types';

import '../styles/SearchBar.css';

const SearchBar = ({ onChange }) => (
    <input className='SearchBar' type='text' placeholder='Search..' onChange={onChange} />
);

SearchBar.propTypes = {
    onChange: PropTypes.func.isRequired
};

export default SearchBar;
