import React, { useState, useEffect, createContext } from 'react';
/*import { Navigate } from 'react-router-dom';*/


const UserContext = createContext({});

interface User {
    role: string;
}


function AuthorizeAdminView(props: { children: React.ReactNode }) {

    const [authorized, setAuthorized] = useState<boolean>(false);
    /*const [loading, setLoading] = useState<boolean>(true); // add a loading state*/
    let emptyuser: User = { role: "" };

    const [user, setUser] = useState(emptyuser);


    useEffect(() => {
        // Get the cookie value
      

        // define a fetch function that retries until status 200 or 401
        async function getAdmin(url: string, options: any) {
            try {
                // make the fetch request
                let response = await fetch(url, options);

                // check the status code
                if (response.status == 200) {
                    console.log("Authorized");
                    let j: any = await response.json();
                    console.log('User data:', j)
                    setUser({ role: j.role });
                    setAuthorized(true);
                    return response; // return the response
                } else if (response.status == 403) {
                    console.log("Unauthorized");
                    return response; // return the response
                } else {
                    // throw an error to trigger the catch block
                    throw new Error("" + response.status);
                }
            } catch (error) {
                // throw an error to trigger the catch block
                console.log("Error");
            }
        }

        // call the fetch function with retry logic
        getAdmin("/Account/pingauthadmin", {
            method: "GET",
        })
            .catch((error) => {
                // handle the final error
                console.log(error.message);
            })
            .finally(() => {
                /*setLoading(false); */ // set loading to false when the fetch is done
            });
    }, []);


        if (authorized) {
            return (
                <>
                    <UserContext.Provider value={user}>{props.children}</UserContext.Provider>
                </>
            );
        } else {
            return (
                <>
                </>
            )
        }
}

export function AuthorizedUser(props: { value: string}) {
    // Consume the username from the UserContext
    const user: any = React.useContext(UserContext);

    // Display the username in a h1 tag
    if (props.value == "role")
        return <>{user.role}</>;
    else
        return <></>
}

export default AuthorizeAdminView;
