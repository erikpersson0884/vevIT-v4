import { useAuthContext } from "../../contexts/authContext";
import { useState, useEffect } from "react";
import PopupWindow from "../popupWindow/PopupWindow";
import { useUsersContext } from "../../contexts/usersContext";
import './AuthPopup.css';


enum PopupType {
    LOGIN = 'login',
    REGISTER = 'register',
    PROFILE = 'profile',
    UPDATE = 'update',
}

const AuthPopup: React.FC = () => {
    const { login, logout, currentUser, showAuthPopup, setShowAuthPopup } = useAuthContext();
    const { createUser, updateUser } = useUsersContext();

    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ errorText, setErrorText ] = useState<string | null>(null);

    const [popupType, setPopupType] = useState<PopupType>(PopupType.LOGIN);

    useEffect(() => {
        if (currentUser) {
            setPopupType(PopupType.PROFILE);
        } else setPopupType(PopupType.LOGIN);
    }, [currentUser]);

    const handleLogin = async () => {
        const successfullLogin: boolean = await login(username, password);
        if (!successfullLogin) {
            setErrorText("Felaktigt användarnamn eller lösenord");
            return;
        }
        handleClose();
    }

    const handleCreation = async () => {
        const successfullCreation: boolean = await createUser(username, password);
        if (!successfullCreation) {
            setErrorText("Det gick inte att skapa användaren, försök igen senare");
            return;
        }
        handleClose();
    }

    
    const handleUpdate = async () => {
        if (!currentUser) return;
        if (currentUser.username == username && currentUser.password == password) {
            setErrorText('Inga ändringar gjorda');
            return;
        }

        const successfullUpdate = await updateUser(currentUser.id, username, password);
        if (!successfullUpdate) {
            setErrorText('Något gick fel, försök igen senare');
            return;
        }
        handleClose();
    };

    const handleClose = () => {
        setUsername('');
        setPassword('');
        setErrorText(null);
        setShowAuthPopup(false);
        if (currentUser) setPopupType(PopupType.PROFILE);
        else setPopupType(PopupType.LOGIN);
    };

    const handleLogout = () => {
        logout();
        handleClose();
    }

    const handleAccept = () => {
        if (popupType === PopupType.LOGIN) {
            handleLogin();
        } else if (popupType === PopupType.REGISTER) {
            handleCreation();
        } else if (popupType === PopupType.UPDATE) {
            handleUpdate();
        } else if (popupType === PopupType.PROFILE) {
            handleLogout();
        }
    }


    if (popupType === PopupType.PROFILE && currentUser) {
        return (
            <PopupWindow 
                isOpen={showAuthPopup}
                onClose={handleClose}
                onAccept={handleAccept}
                title="Konto"
                buttonText="Logga ut"
                className="auth-popup"
            >
                <p>{`Inloggad som ${currentUser.username}`}</p>
                {/* <p>Vill du uppdatera dina uppgifter?</p> */}
                <p className="link" onClick={() => setPopupType(PopupType.UPDATE)}>Uppdatera uppgifter</p>
            </PopupWindow>
        );
    }


    return (
        <PopupWindow 
            isOpen={showAuthPopup}
            onClose={handleClose}
            onAccept={handleAccept}
            title={
            popupType === PopupType.LOGIN
                ? "Logga in"
                : popupType === PopupType.REGISTER
                ? "Registrera"
                : popupType === PopupType.UPDATE
                ? "Uppdatera konto"
                : "Konto"
            }
            buttonText={
            popupType === PopupType.LOGIN
                ? "Logga in"
                : popupType === PopupType.REGISTER
                ? "Registrera"
                : popupType === PopupType.UPDATE
                ? "Uppdatera"
                : "Logga ut"
            }
            className="auth-popup"
        >
            <div>
                <label htmlFor="username">Användarnamn</label>
                <input
                type="text"
                name="username"
                placeholder="Användarnamn"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                />
            </div>
            <div>
                <label htmlFor="password">Lösenord</label>
                <input
                type="password"
                name="password"
                placeholder="Lösenord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
            </div>

            <p>
                {popupType === PopupType.LOGIN && "Har du inget konto? "}
                {popupType === PopupType.REGISTER && "Har du redan ett konto? "}
                <span
                    className="link"
                    onClick={() => {
                        if (popupType === PopupType.LOGIN) {
                            setPopupType(PopupType.REGISTER);
                        } else if (popupType === PopupType.REGISTER) {
                            setPopupType(PopupType.LOGIN);
                        }
                    }}
                    >
                    {popupType === PopupType.LOGIN
                        ? "Registrera"
                        : 
                        popupType === PopupType.REGISTER
                        ? "Logga in"
                        : ""
                    }
                </span>
            </p>

            {errorText && <p className="error-message">{errorText}</p>}
        </PopupWindow>
    );
}

export default AuthPopup;
