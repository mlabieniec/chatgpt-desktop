import { useEffect, useState } from 'react';

const useApi = () => {
  const host = process.env.REACT_APP_SERVER;
  const [call, setCall] = useState("")

  useEffect(() => {
    
    if (typeof call === 'object') {
        console.log(call);
    }

  }, [call]);

  return [call, setCall];
}

export default useApi;