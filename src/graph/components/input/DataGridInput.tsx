import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
library.add(faEdit);

import { GraphFieldInputProps } from "../../types/graphInputTypes";


export default function DataGridInput(props: GraphFieldInputProps): React.ReactElement {
    return (
        <button className="rounded bg-light px-2 py-1 hover:bg-primary hover:text-white">
            <span className="select-none">Edit</span>
            <FontAwesomeIcon className="ml-2" icon="edit"/>
        </button>
    );
}
