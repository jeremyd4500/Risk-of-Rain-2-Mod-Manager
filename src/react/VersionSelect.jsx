import React from 'react';
import PropTypes from 'prop-types';

import '../styles/VersionSelect.css';

const VersionSelect = ({ onChange, selected, versions }) => {
    return (
        <select className='VersionSelect' value={selected} onChange={onChange}>
            {versions.map((version) => (
                <option key={`${version}/${Date.now()}`} value={version}>
                    {version}
                </option>
            ))}
        </select>
    );
};

VersionSelect.propTypes = {
    onChange: PropTypes.func.isRequired,
    selected: PropTypes.string.isRequired,
    versions: PropTypes.array.isRequired
};

export default VersionSelect;
