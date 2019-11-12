import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import MenuDropdown from './MenuDropdown';
library.add(faPlus);

type Props = {

}

export default function Menu(props: Props): React.ReactElement {
    const [isShowDropdown, setShowDropdown] = useState(false);

    return (
        <div className="flex absolute top-0 right-0 mr-2 mt-2">
            <div className="flex border border-light text-light p-2 cursor-pointer hover:border-alt hover:text-alt" onClick={(): void => setShowDropdown(!isShowDropdown)}>
                <div className="mr-2">
                    <FontAwesomeIcon icon="plus"/>
                </div>
                <span>
                    Add Node
                </span>
                <MenuDropdown show={isShowDropdown}/>
            </div>
        </div>
    )
}
