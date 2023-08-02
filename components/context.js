import React from 'react'
import app from "../firebaseConfig";
import { IconCheck, IconX } from "@tabler/icons-react";
import { UserContext, UserProvider } from './userContext';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
  
    useEffect(() => {
      app.auth().onAuthStateChanged(setUser);
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
      );
    };


/* Table Function */
export function Table(props) {
    const ctx = React.useContext(UserContext)
    let usersArray = Object.values(ctx.users);

    function classes() {
        const bg = props.tableColor ? ' table-' + props.tableColor : ' ';
        const striped = props.striped ? ' table-' + props.striped : ' ';
        return 'table' + bg + striped;
    }

   
}

/* BankForm Function */
export function BankForm(props, { chooseShowP }) {
    const [show, setShow] = React.useState(true);
    const [status, setStatus] = React.useState('');
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [deposit, setDeposit] = React.useState('');
    const [withdraw, setWithdraw] = React.useState('');
    const ctx = React.useContext(UserContext)

    /* Validate empty fields */
    function validate(field, label) {
        if (!field) {
            console.log('You must fill out your ' + label)
            /*setStatus('Error: ' + label);
            setTimeout(() => setStatus(''), 3000);*/
            props.chooseStatusP('You must fill out your ' + label);
            setTimeout(() => props.chooseStatusP(''), 3000);
            return false;
        }
        return true;
    }

    /* Validate email to be email@gmail.com format */
    function validateFormatEmail(fieldEmail) {
        //
        var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        if (fieldEmail.match(validRegex)) {
            console.log("Valid email address!");
            //document.form1.text1.focus();
            return true;
        } 
        else {
            console.log("Invalid email address!"+ fieldEmail)
            props.chooseStatusP('Invalid format of the email.');
            setTimeout(() => props.chooseStatusP(''), 5000);
            return false;
        }
    }

    /* Password can NOT be less than 8 characters */
    function validateLengthPwd(fieldPwd) {
        if (fieldPwd.length < 8) {
            // Error
            console.log('Password length Error: ' + fieldPwd)
            props.chooseStatusP('Your passsword must be at least 8 characters.');
            setTimeout(() => props.chooseStatusP(''), 5000);
            return false;
        }
        return true;
    }

    /* Check the email typed does NOT exist yet */
    function validateUniqueEmail(fieldEmail) {
        let usersArray = Object.values(ctx.users);
        console.log(usersArray)

        // Check if email typed exists
        for (let i in usersArray) {
            console.log("------")
            console.log(usersArray[i]['email']);
            if (fieldEmail === usersArray[i]['email']) {
                console.log("Coincidence with " + usersArray[i]['email'])
                props.chooseStatusP('Email already exists.');
                setTimeout(() => props.chooseStatusP(''), 5000);
                return true;
            }
            else {
                console.log("No match. Email is new.")
            }
        }
    }

    /* Handle Create Account Button */
    function handleCreate() {
        console.log("You typed: " + name, email, password);
        if (!validate(name, 'name')) return;
        if (!validate(email, 'email')) return;
        if (!validate(password, 'password')) return;
        if (validateUniqueEmail(email)) return;
        if (!validateLengthPwd(password)) return;
        if (!validateFormatEmail(email)) return;
        ctx.users.push({ name, email, password, balance: 100 })
        setShow(false)
        props.chooseShowP(false)

        /* Update 'current_user' with the new account created */
        let usersArray = Object.values(ctx.users);
        let current_user = ctx.current_user;
        let lastName = usersArray[usersArray.length - 1]['name']
        let lastBalance = usersArray[usersArray.length - 1]['balance']
        let lastEmail = usersArray[usersArray.length - 1]['email']
        console.log(usersArray[usersArray.length - 1]['email']);
        current_user.splice(0, 3, lastName, lastBalance, lastEmail);
    }

    /* Clear Create Account Form after Add new Account */
    function clearForm() {
        setName('');
        setEmail('');
        setPassword('');
        setShow(true)
        props.chooseShowP(true)
    }

    /* Validate Login fields with registered users (usersArray) */
    function validateLogin(fieldEmail, fieldPwd) {
        let usersArray = Object.values(ctx.users);
        console.log(usersArray)

        // Check if email and password typed exists
        for (let i in usersArray) {
            console.log("------")
            console.log(usersArray[i]['email']);
            console.log(usersArray[i]['password']);
            if (fieldEmail === usersArray[i]['email'] && fieldPwd === usersArray[i]['password']) {
                console.log("Coincidence with " + usersArray[i]['email'] + " and " + usersArray[i]['password'])
                props.chooseShowP(false)
                let current_user = ctx.current_user;
                current_user.splice(0, 3, usersArray[i]['name'], usersArray[i]['balance'], usersArray[i]['email']);
                return true
            }
            else {
                console.log("No match")
                props.chooseStatusP('No match. Try again.');
                setTimeout(() => props.chooseStatusP(''), 5000);
            }
        }
    }

    /* Handle Login Button */
    function handleLogin() {
        console.log("Login as " + email, password);
        if (!validate(email, 'email')) return;
        if (!validate(password, 'password')) return;
        if (!validateLogin(email, password)) return;

    }

    /* Update balance of the registered user that match with current_user */
    function updateUsers() {
        let users = ctx.users;
        let current_user = ctx.current_user;
        for (let i in users) {
            console.log(users[i]['email']);
            if (current_user[2] === users[i]['email']) {
                users[i]["balance"] = current_user[1]
                console.log("Updated users data")
                return true
            }
        }
    }

    /* Validate money to be a number */
    function validateBeNumber(money) {
        //console.log(typeof parseFloat(money))

        if (isNaN(money) === false) {
            console.log("Money is a number.");
            //document.form1.text1.focus();
            return true;
        } 
        else {
            console.log("Money is NOT a number! "+ money)
            props.chooseStatusP('Must be a number.');
            setTimeout(() => props.chooseStatusP(''), 5000);
            return false;
        }
    }

    
    /* Validate deposit to be a positive number, and greater than 0 */
    function validateNoNegative(money) {
        if (money == 0) {
            console.log("Money is 0!")
            props.chooseStatusP('Must be higher than 0.');
            setTimeout(() => props.chooseStatusP(''), 5000);
            return true;
        }
        else if (money <= -0.01) {
            console.log("Money is a negative number! "+ money)
            props.chooseStatusP('Must be a positive number.');
            setTimeout(() => props.chooseStatusP(''), 5000);
            return true;
        }
        else { //(deposit > 0)
            console.log("Money is a positive number.");
            //document.form1.text1.focus();
        } 
    }

    /* Handle Deposit Button (update current_user's Deposit ONLY) */
    function handleDeposit() {
        console.log("You typed " + deposit);
        if (!validate(deposit, 'deposit')) return;
        if (!validateBeNumber(deposit)) return;
        if (validateNoNegative(deposit)) return;
        let current_user = ctx.current_user;
        let newDeposit = current_user[1] + parseFloat(deposit);
        newDeposit = parseFloat(newDeposit.toFixed(2));
        current_user.splice(1, 1, newDeposit);
        console.log(current_user)
        updateUsers()
        props.chooseShowP(false)
    }

    /* Validate money to be NOT higher than actual balance */
    function validateNoExceedLimit(money) {
        let current_user = ctx.current_user;
        let actualBalance = current_user[1];
        //console.log(typeof parseFloat(money))

        if (parseFloat(money) < actualBalance || parseFloat(money) === actualBalance) {
            console.log("Money is NOT higher than balance.");
            //document.form1.text1.focus();
            return true;
        } 
        else {
            console.log("Money is higher than balance! "+ money)
            props.chooseStatusP(`Must be less than or equal to $${actualBalance}`);
            setTimeout(() => props.chooseStatusP(''), 6000);
            return false;
        }
    }

    /* Handle Withdraw Button (update current_user's Deposit ONLY) */
    function handleWithdraw() {
        console.log("You typed " + withdraw);
        if (!validate(withdraw, 'withdraw')) return;
        if (!validateBeNumber(withdraw)) return;
        if (validateNoNegative(withdraw)) return;
        if (!validateNoExceedLimit(withdraw)) return;
        let current_user = ctx.current_user;
        let newWithdraw = current_user[1] - parseFloat(withdraw)
        newWithdraw = parseFloat(newWithdraw.toFixed(2));
        current_user.splice(1, 1, newWithdraw);
        console.log(current_user)
        updateUsers()
        props.chooseShowP(false)
    }

    /* Clear Deposit Form after Add new Deposit */
    function clearFormD() {
        setDeposit('');
        setShow(true)
        props.chooseShowP(true)
    }

    /* Clear Withdraw Form after Add new Withdraw */
    function clearFormW() {
        setWithdraw('');
        setShow(true)
        props.chooseShowP(true)
    }

    return (
        <>
            {/* Error message */}
            {props.statusP && (<h5 id="createStatus" className="text-danger"><strong>{props.statusP}</strong></h5>)}
            {props.name && (
                <>
                    <label htmlFor={props.name}>Name</label>
                    <input type="input" className="form-control" id={props.name} placeholder="Enter your name" value={name} onChange={e => setName(e.currentTarget.value)} />
                    <br />
                </>
            )
            }
            {props.email && (
                <>
                    <label htmlFor={props.email}>Email</label>
                    <input type="email" className="form-control" id={props.email} placeholder="email@email.com" value={email} onChange={e => setEmail(e.currentTarget.value)} />
                    <br />
                </>
            )
            }
            {props.password && (
                <>
                    <label htmlFor={props.password}>Password</label>
                    <input type="password" className="form-control" id={props.password} placeholder="Enter password" value={password} onChange={e => setPassword(e.currentTarget.value)} />
                    <br />
                </>
            )
            }
            {/* Success message */}
            {props.message && (
                <>
                    <h5><strong>{props.message}</strong></h5>
                    <br />
                </>
            )
            }
            {/* Balance info on top of Withdraw & Deposit pages */}
            {props.balance && (
                <>
                    <p>Balance <strong>{props.balance}</strong></p>
                </>
            )
            }
            {props.deposit && (
                <>
                    <label htmlFor={props.deposit}>Deposit Amount</label>
                    <input type="input" className="form-control" id={props.deposit} placeholder="Deposit Amount" value={deposit} onChange={e => setDeposit(e.currentTarget.value)} />
                    <br />
                </>
            )
            }
            {props.withdraw && (
                <>
                    <label htmlFor={props.withdraw}>Withdraw Amount</label>
                    <input type="input" className="form-control" id={props.withdraw} placeholder="Withdraw Amount" value={withdraw} onChange={e => setWithdraw(e.currentTarget.value)} />
                    <br />
                </>
            )
            }
            {/* Create Account Button */}
            {props.buttonCreate && (
                <>
                    <button type="submit" disabled={!name && !email && !password} className="btn btn-secondary" onClick={handleCreate}>{props.buttonCreate}</button>
                </>
            )
            }
            {/* Add Account Button */}
            {props.buttonAdd && (
                <>
                    <button type="submit" className="btn btn-secondary" onClick={clearForm}>{props.buttonAdd}</button>
                </>
            )
            }
            {/* Login Button */}
            {props.buttonLogin && (
                <>
                    <button type="submit" disabled={!email && !password} className="btn btn-secondary" onClick={handleLogin}>{props.buttonLogin}</button>
                </>
            )
            }
            {/* Deposit Button */}
            {props.buttonDeposit && (
                <>
                    <button type="submit" disabled={!deposit} className="btn btn-secondary" onClick={handleDeposit}>{props.buttonDeposit}</button>
                </>
            )
            }
            {/* Add Deposit Button */}
            {props.buttonAddD && (
                <>
                    <button type="submit" className="btn btn-secondary" onClick={clearFormD}>{props.buttonAddD}</button>
                </>
            )
            }
            {/* Add Withdraw Button */}
            {props.buttonAddW && (
                <>
                    <button type="submit" className="btn btn-secondary" onClick={clearFormW}>{props.buttonAddW}</button>
                </>
            )
            }
            {/* Withdraw Button */}
            {props.buttonWithdraw && (
                <>
                    <button type="submit" disabled={!withdraw} className="btn btn-secondary" onClick={handleWithdraw}>{props.buttonWithdraw}</button>
                </>
            )
            }
        </>
    )


}