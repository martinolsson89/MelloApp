import { useNavigate } from "react-router-dom";

function LogoutLink(props: { children: React.ReactNode }) {

    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        fetch("/Account/logout", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: ''

        })

            .then((data) => {
                // handle success or error from the server
                console.log(data);
                if (data.ok) {
                    navigate('/login');
                } else { }
            })
            .catch((error) => {
                console.error('Error:', error);
            })
    };

    return (
        <>
            <a href="#" onClick={handleSubmit}>{props.children}</a>
        </>
    );
}

export default LogoutLink;