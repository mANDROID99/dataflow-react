import React, { useEffect, useState } from "react";
import { DialogOpts, DialogsManager } from "./DialogsManager";
import Dialog from "./Dialog";

type Props = {
    dialogsManager: DialogsManager;
}

export default function DialogsContainer({ dialogsManager }: Props) {
    const [dialogs, setDialogs] = useState<DialogOpts[]>();

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
