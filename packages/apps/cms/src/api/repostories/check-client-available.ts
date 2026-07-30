import { headers } from 'next/headers';

export const checkClientAvailable = async () => {
  const headersList = headers()
  let host = headersList.get('host') || ''
  
  var subdomain = host.split('.')[0];
  
  if(process.env.NODE_ENV == "development") subdomain = "hakim";
  

  const response = await fetch(`${process.env.NEXT_PUBLIC_MASTER}/Clients/GetBySubDomain?subdomain=${subdomain}`, {
    headers: {
      'Domain': subdomain,
    },
    cache: 'no-store',
  });

  if (response.status === 404) {
    return response;
  }

  const json = await response.json();
  return json;
}