import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function BackButton() {
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    };

  return (
    <>
    <Button variant="contained" color="secondary" sx={{ m: 2 }} onClick={() => handleNavigation('/admin-center')}>
        Go Back
    </Button>
    </>
  )
}

export default BackButton