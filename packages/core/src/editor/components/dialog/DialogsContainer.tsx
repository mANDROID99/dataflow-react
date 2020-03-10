import React, { useContext, useEffect, useState } from "react";
import Dialog from "./Dialog";
import { DialogOpts, dialogsContext } from "./DialogsManager";

export default function DialogsContainer() {
    const [dialogs, setDialogs] = useState<DialogOpts[]>();
    const dialogsManager = useContext(dialogsContext);

    useEffect(() => {
        setDialogs(dialogsManager.getDialogs());
        return dialogsManager.subscribe(setDialogs);
    }, [dialogsManager]);

    return (
        <div className="ngraph-dialogs-container">
            {dialogs && dialogs.map(dialog => (
                <Dialog
                    key={dialog.id}
                    dialog={dialog}
                    onClear={dialogsManager.hideDialog.bind(dialogsManager)}
                />
            ))}
        </div>
    );
}
