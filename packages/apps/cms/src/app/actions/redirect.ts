import 'server-only';
import { redirect } from 'next/navigation';


const redirectTO = async (pathname : string) => {
    redirect(pathname);
};



export default redirectTO;

