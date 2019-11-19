import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {

}

function DataGridToolbar(props: Props): React.ReactElement {
    return (
        <div className="flex p-2 items-start">
            <div className="form-btn danger">Remove (2)</div>
            <div className="flex justify-center flex-grow">
                <div className="flex flex-col">
                    <label className="form-label">Rows</label>
                    <input className="form-control form-control-sm text-center" type="number"/>
                </div>
                <div className="flex items-center px-2">
                    <FontAwesomeIcon icon="times"/>
                </div>
                <div className="flex flex-col">
                    <label className="form-label">Cols</label>
                    <input className="form-control form-control-sm text-center" type="number"/>
                </div>
            </div>
        </div>
    );
}

export default React.memo(DataGridToolbar);
